from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from database import engine, SessionLocal
import models
import config
from trigger_engine import TriggerEngine
from fraud_engine import FraudEngine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_parametric_triggers():
    logger.info(f"[{datetime.utcnow()}] Executing Phase 2 Parametric Trigger Checks...")
    
    # --- CIRCUIT BREAKER GUARDRAIL ---
    if config.CIRCUIT_BREAKER_ACTIVE:
        logger.warning("🚨 [CIRCUIT BREAKER] Macro-Event Active! Global Payouts Frozen.")
        return # Short circuits the entire background process
        
    db = SessionLocal()
    
    # 1. Get all active policies
    active_policies = db.query(models.Policy).filter(models.Policy.status == "ACTIVE").all()
    
    for policy in active_policies:
        worker = db.query(models.Worker).filter(models.Worker.id == policy.worker_id).first()
        if not worker:
            continue
            
        # Check if already has a claim for this policy
        existing_claim = db.query(models.Claim).filter(
            models.Claim.worker_id == worker.id,
            models.Claim.status.in_(["PENDING", "APPROVED", "REJECTED"]) 
            # Note: real systems wouldn't allow infinite claims per policy
        ).first()

        if existing_claim:
            continue
            
        # 2. Trigger Engine (Double-Lock Validation)
        triggered, trigger_type, description = TriggerEngine.evaluate_double_lock(worker)
        
        if not triggered:
            continue
            
        logger.info(f"Double-Lock Hit! {trigger_type} for Worker {worker.id}")
        
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
        
        if status == "APPROVED":
            logger.info(f"🚀 [Guidewire FNOL & Razorpay] Disbursed ₹{payout} to worker {worker.id}")
        else:
            logger.error(f"🛑 [Fraud Engine] Blocked Payout! Reason: {rej_reason}")
            
    db.commit()
    db.close()

def start_scheduler():
    scheduler = BackgroundScheduler()
    # Check every minute for hackathon demo
    scheduler.add_job(check_parametric_triggers, 'interval', minutes=1)
    scheduler.start()
    logger.info("Background scheduler started.")
