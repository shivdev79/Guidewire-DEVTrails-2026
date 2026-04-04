from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
import asyncio
import logging
import random

from database import engine, SessionLocal
import models
import config
from trigger_engine import TriggerEngine
from fraud_engine import FraudEngine
from weather_service import PaymentService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_parametric_triggers():
    """Background job: Check all active policies for trigger events"""
    logger.info(f"[{datetime.utcnow()}] Executing Parametric Trigger Checks...")
    
    # --- CIRCUIT BREAKER GUARDRAIL ---
    if config.CIRCUIT_BREAKER_ACTIVE:
        logger.warning("🚨 [CIRCUIT BREAKER] Macro-Event Active! Global Payouts Frozen.")
        return
        
    db = SessionLocal()
    
    try:
        # 1. Get all active policies
        active_policies = db.query(models.Policy).filter(models.Policy.status == "ACTIVE").all()
        logger.info(f"Checking {len(active_policies)} active policies...")
        
        for policy in active_policies:
            worker = db.query(models.Worker).filter(models.Worker.id == policy.worker_id).first()
            if not worker:
                continue
                
            # Check if already has a claim this cycle
            existing_claim = db.query(models.Claim).filter(
                models.Claim.worker_id == worker.id,
                models.Claim.status.in_(["PENDING", "APPROVED", "REJECTED"]) 
            ).first()

            if existing_claim:
                logger.debug(f"Worker {worker.id} already has active claim this cycle. Skipping.")
                continue
                
            # 2. Trigger Engine (Double-Lock Validation) - Async call
            try:
                triggered, trigger_type, description = asyncio.run(
                    TriggerEngine.evaluate_double_lock(worker)
                )
            except Exception as e:
                logger.error(f"Trigger engine error for worker {worker.id}: {e}")
                continue
            
            if not triggered:
                continue
                
            logger.warning(f"⚠️  TRIGGER HIT! {trigger_type} for Worker {worker.id}")
            
            # 3. Fraud Engine (Zero-Trust Validation)
            past_claims_count = db.query(models.Claim).filter(models.Claim.worker_id == worker.id).count()
            fraud_score, rej_reason = FraudEngine.run_zero_trust_checks(worker, past_claims_count)
            
            status = "REJECTED" if fraud_score >= 0.8 else "APPROVED"
            
            # Calculate payout based on WEEKLY PREMIUM × TRIGGER SEVERITY MULTIPLIER
            # Customer pays 20-72 per week (actually 30/48/72 for Base/Pro/Elite tiers)
            # When trigger occurs, claim = weekly_premium × severity_multiplier, capped at 500
            if status == "APPROVED":
                # Severity multiplier based on trigger type
                # Different events have different economic impact multipliers
                trigger_multipliers = {
                    "Heavy Rain (>50mm/hr)": 8,                    # 8-10x = ₹240-720
                    "Heavy Rain (65.5mm rain, 28.0°C)": 9,
                    "Extreme Heat (>44°C)": 8,                     # 8-10x = ₹240-720
                    "Extreme Heat (44°C+)": 9,
                    "Critical AQI (>300)": 12,                     # 12-15x = ₹360-1080 (HIGHEST)
                    "Critical AQI Spike (>300)": 13,
                    "Civic Strike/Curfew": 12,                     # 10-14x = ₹300-1008 (severe)
                    "Civic Strike": 11,
                    "Platform Outage": 8,                          # 8-10x = ₹240-720
                    "Flood (Barometric Drop)": 9,
                }
                
                # Get base multiplier for this trigger type, add randomness
                base_multiplier = trigger_multipliers.get(trigger_type, 8)
                variance = random.uniform(-0.5, 1.5)  # Add variance
                multiplier = max(base_multiplier + variance, 5)  # Min 5x
                
                # Weekly premium paid by customer (from policy record)
                # This is the base price they agreed to (20-72 range for different tiers)
                weekly_premium = policy.premium_paid if policy.premium_paid > 0 else 35
                
                # Calculate payout: weekly_premium × multiplier, hard capped at 500
                payout = min(weekly_premium * multiplier, 500)
                
                # Round to nearest 50 for realistic payout values
                payout = round(payout / 50) * 50
            else:
                payout = 0.0
            
            # 4. Create Immutable Claim Ledger Entry
            claim = models.Claim(
                worker_id=worker.id,
                trigger_type=trigger_type,
                description=description,
                status=status,
                payout_amount=payout,
                fraud_score=fraud_score,
                rejection_reason=rej_reason
            )
            db.add(claim)
            db.flush()  # Flush to get claim ID
            
            if status == "APPROVED":
                logger.info(f"✅ APPROVED: Claim {claim.id}. Payout ₹{payout} for worker {worker.id}")
                
                # 5. Process Payout (Async - mock UPI)
                try:
                    payout_result = asyncio.run(
                        PaymentService.process_payout(
                            worker_id=worker.id,
                            amount=payout,
                            upi_id=worker.upi_id,
                            use_mock=True,  # Use mock for demo
                            instant_demo=True  # Instant completion
                        )
                    )
                    logger.info(f"💸 Payout processed: {payout_result}")
                except Exception as e:
                    logger.error(f"Payout error: {e}")
            else:
                logger.error(f"❌ REJECTED: Claim {claim.id}. Reason: {rej_reason}")
            
        db.commit()
        logger.info("✓ Trigger check cycle complete")
        
    except Exception as e:
        logger.error(f"Scheduler error: {e}", exc_info=True)
        db.rollback()
    finally:
        db.close()


def start_scheduler():
    scheduler = BackgroundScheduler()
    # Check every 1 minute for hackathon demo (production would be 5-15 mins)
    scheduler.add_job(check_parametric_triggers, 'interval', minutes=1)
    scheduler.start()
    logger.info("✓ Background scheduler started. Running every 1 minute.")
