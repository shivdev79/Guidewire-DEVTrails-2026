from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime
import uvicorn
import logging

import models
import schemas
import config
from database import engine, get_db
from premium_engine import PremiumEngine

models.Base.metadata.create_all(bind=engine)

logger = logging.getLogger(__name__)
app = FastAPI(title="AEGIS: Zero-Trust Parametric Startup MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=schemas.WorkerResponse)
def register_worker(worker: schemas.WorkerCreate, db: Session = Depends(get_db)):
    db_worker = db.query(models.Worker).filter(models.Worker.phone == worker.phone).first()
    if db_worker:
        raise HTTPException(status_code=400, detail="Phone already registered")
    
    new_worker = models.Worker(**worker.dict(), r_score=100.0, wallet_balance=0.0)
    db.add(new_worker)
    db.commit()
    db.refresh(new_worker)
    return new_worker

@app.get("/worker/{worker_id}", response_model=schemas.WorkerResponse)
def get_worker(worker_id: int, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker

@app.post("/calculate-premium")
def calculate_premium(request: schemas.PremiumRequest, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == request.worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    coverage_map = {"Base": 3000.0, "Pro": 5000.0, "Elite": 8000.0}
    coverage_amount = coverage_map.get(request.tier, 3000.0)

    # Defer to Modular Engine
    return PremiumEngine.calculate_weekly_premium(worker, coverage_amount)

@app.post("/create-policy", response_model=schemas.PolicyResponse)
def create_policy(policy: schemas.PolicyCreate, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == policy.worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
        
    if not policy.accepted_terms:
        raise HTTPException(status_code=400, detail="Must explicitly accept strict T&C to activate policy.")
    
    # Store the legal consent timestamp
    worker.terms_accepted_at = datetime.datetime.utcnow()
    
    active_policy = db.query(models.Policy).filter(
        models.Policy.worker_id == policy.worker_id,
        models.Policy.status == "ACTIVE"
    ).first()
    
    if active_policy:
        raise HTTPException(status_code=400, detail="Worker already has an active policy")

    calc = PremiumEngine.calculate_weekly_premium(worker, 5000.0 if policy.tier == "Pro" else (8000.0 if policy.tier == "Elite" else 3000.0))
    premium_paid = calc["premium_amount"]
    coverage_amount = calc["coverage_amount"]
    wallet_credit = calc["breakdown"]["wallet_credit_used"]

    if wallet_credit > 0:
        worker.wallet_balance -= wallet_credit

    week_start = datetime.datetime.utcnow()
    week_end = week_start + datetime.timedelta(days=7)

    new_policy = models.Policy(
        worker_id=worker.id,
        tier=policy.tier,
        week_start=week_start,
        week_end=week_end,
        coverage_amount=coverage_amount,
        premium_paid=premium_paid,
        status="ACTIVE"
    )
    
    db.add(new_policy)
    # The 20% resilience wallet gamification 
    worker.wallet_balance += (premium_paid * 0.2)
    
    db.commit()
    db.refresh(new_policy)
    return new_policy

@app.post("/simulate-rebate/{worker_id}")
def simulate_rebate(worker_id: int, db: Session = Depends(get_db)):
    """Mocks the Predictive Risk Rebate (Mid-Week Yield) Pillar"""
    worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    rebate_amount = 30.0 # Random fixed mock rebate
    worker.wallet_balance += rebate_amount
    db.commit()
    return {"status": "success", "message": f"Mid-week risk evaporated. Issued ₹{rebate_amount} partial rebate.", "wallet_balance": worker.wallet_balance}

@app.post("/webhooks/national-disaster")
async def force_majeure_circuit_breaker(request: Request):
    """The enterprise webhook simulation for Black Swan events."""
    payload = await request.json()
    if payload.get("directive") == "FREEZE_ALL_PARAMETRIC_PAYOUTS":
        config.CIRCUIT_BREAKER_ACTIVE = True
        logger.critical(f"CIRCUIT BREAKER ENGAGED GLOBALLY! Event: {payload.get('event_type')}")
        return {"status": "SUCCESS", "message": "Circuit breaker is active. All platform claims are halted to protect reinsurer capital."}
    return {"status": "IGNORED"}

@app.post("/claim/manual")
def submit_manual_claim(claim_req: schemas.ManualClaimCreate, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == claim_req.worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
        
    claim = models.Claim(
        worker_id=worker.id,
        trigger_type="MANUAL_" + claim_req.reason,
        description=claim_req.description,
        status="PENDING_REVIEW",
        payout_amount=claim_req.amount,
        fraud_score=0.0
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    return {"status": "success", "claim_id": claim.id}

@app.get("/admin/ledger")
def get_admin_ledger(db: Session = Depends(get_db)):
    workers = db.query(models.Worker).all()
    policies = db.query(models.Policy).all()
    claims = db.query(models.Claim).order_by(models.Claim.id.desc()).all()
    
    total_liquidity = sum(p.coverage_amount for p in policies if p.status == "ACTIVE")
    total_paid = sum(c.payout_amount for c in claims if c.status == "APPROVED")
    
    return {
        "workers": workers,
        "policies": policies,
        "claims": claims,
        "metrics": {
            "total_liquidity_exposure": total_liquidity,
            "total_claims_paid": total_paid,
            "circuit_breaker_active": config.CIRCUIT_BREAKER_ACTIVE
        }
    }

@app.get("/worker/{worker_id}/dashboard")
def get_dashboard(worker_id: int, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
        
    policies = db.query(models.Policy).filter(models.Policy.worker_id == worker_id).order_by(models.Policy.id.desc()).all()
    claims = db.query(models.Claim).filter(models.Claim.worker_id == worker_id).order_by(models.Claim.id.desc()).all()
    
    active_policy = next((p for p in policies if p.status == "ACTIVE"), None)
    past_policies = [p for p in policies if p.status != "ACTIVE"]
    
    return {
        "worker": worker,
        "active_policy": active_policy,
        "past_policies": past_policies,
        "claims": claims,
        "system_status": {
            "circuit_breaker_active": config.CIRCUIT_BREAKER_ACTIVE
        }
    }

from scheduler import start_scheduler
@app.on_event("startup")
def startup_event():
    start_scheduler()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
