from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from datetime import datetime
import httpx
import logging

from database import engine, SessionLocal
import models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

WEATHER_API = "https://api.open-meteo.com/v1/forecast"
AQI_API = "https://api.waqi.info/feed/here/"

def check_parametric_triggers():
    logger.info(f"[{datetime.utcnow()}] Running parametric trigger checks...")
    db = SessionLocal()
    
    # 1. Get all active policies
    active_policies = db.query(models.Policy).filter(models.Policy.status == "ACTIVE").all()
    
    for policy in active_policies:
        worker = db.query(models.Worker).filter(models.Worker.id == policy.worker_id).first()
        if not worker:
            continue
            
        # Try to run triggers. If any trigger fires, break to avoid multiple claims for same week.
        # But wait, could process all. For safety let's only trigger once per check cycle.
        claim_triggered = False

        # --- TRIGGER 1: Heavy Rain (Mock) ---
        # Ideal: use worker's pincode geocoding -> latitude/longitude, then call Open-Meteo
        # Mock logic based on pincode length or specific pattern for demo
        try:
            # We mock the response because calling Open-Meteo without exact lat/long for Indian pincodes is tricky.
            # Real impl would geocode. Here we use an API call for a hardcoded India coord to show integration.
            resp = httpx.get(f"{WEATHER_API}?latitude=28.6139&longitude=77.2090&current_weather=true", timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                # Mock threshold logic: For demo, just say if pincode 'rain' or ends in '2' it rained
                if worker.pincode.endswith('2'):
                    logger.info(f"Heavy Rain trigger fired for Worker {worker.id}")
                    create_claim(db, worker.id, "Heavy Rain", "Precipitation > 15mm/hr", policy)
                    claim_triggered = True
        except Exception as e:
            logger.error(f"Error checking weather: {e}")

        if claim_triggered: continue

        # --- TRIGGER 2: Poor AQI (Mock) ---
        # Mock logic based on pincode
        if worker.pincode.endswith('3'):
            logger.info(f"Poor AQI trigger fired for Worker {worker.id}")
            create_claim(db, worker.id, "Poor AQI", "AQI > 300 detected", policy)
            claim_triggered = True

    db.close()

def create_claim(db: Session, worker_id: int, trigger_type: str, description: str, policy: models.Policy):
    # Check if a claim already exists for this trigger & policy week
    existing_claim = db.query(models.Claim).filter(
        models.Claim.worker_id == worker_id,
        models.Claim.status.in_(["PENDING", "APPROVED"])
    ).first()
    
    if existing_claim:
        return

    # simple fraud score logic
    # check frequency of claims for this worker
    past_claims = db.query(models.Claim).filter(models.Claim.worker_id == worker_id).count()
    fraud_score = 0.9 if past_claims > 2 else 0.1 # high score = bad
    
    status = "APPROVED" if fraud_score < 0.8 else "PENDING"
    
    claim = models.Claim(
        worker_id=worker_id,
        trigger_type=trigger_type,
        description=description,
        status=status,
        payout_amount=policy.coverage_amount * 0.5 # 50% of coverage for a single event
    )
    db.add(claim)
    
    if status == "APPROVED":
        logger.info(f"Mock Razorpay Payout: ₹{claim.payout_amount} to worker {worker_id}")
    
    db.commit()

def start_scheduler():
    scheduler = BackgroundScheduler()
    # For demo purposes, check every minute. Normally this would be 15 mins.
    scheduler.add_job(check_parametric_triggers, 'interval', minutes=1)
    scheduler.start()
    logger.info("Background scheduler started.")
