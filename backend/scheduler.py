from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
import asyncio
import logging

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
            payout = policy.coverage_amount * 0.5 if status == "APPROVED" else 0.0
            
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
