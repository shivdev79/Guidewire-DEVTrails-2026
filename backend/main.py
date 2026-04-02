from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime
import uvicorn
import asyncio
from typing import List

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AEGIS Phase 2 API")

# Setup CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    
    # Tier mapping
    coverage_map = {"Base": 3000, "Pro": 5000, "Elite": 8000}
    coverage_amount = coverage_map.get(request.tier, 3000)

    # Mock Open-Meteo logic: Use pincode to set a risk multiplier
    # Rule based: if pincode ends with '1' it's high risk
    risk_multiplier = 1.0
    if worker.pincode and worker.pincode.endswith('1'):
        risk_multiplier = 1.4
    
    # Formula: Pw = max([E(L) × (1 + λ)] + γ - (R_score × β) - W_credit, P_floor)
    base_risk = (coverage_amount * 0.01) # 1% expected loss
    expected_loss = base_risk * risk_multiplier

    systemic_risk_margin = 0.1 # lambda (10%)
    base_opex = 5 # gamma
    r_score_beta = 0.5 # beta (how much discount per r_score point)
    p_floor = coverage_amount * 0.005 # Absolute min premium 0.5%
    
    w_credit = min(worker.wallet_balance, 50) # Use up to 50 Rs from wallet
    
    premium = (expected_loss * (1 + systemic_risk_margin)) + base_opex - (worker.r_score * r_score_beta) - w_credit
    premium = max(premium, p_floor)
    
    return {
        "premium_amount": round(premium, 2),
        "coverage_amount": coverage_amount,
        "breakdown": {
            "expected_loss": round(expected_loss, 2),
            "r_score_discount": round(worker.r_score * r_score_beta, 2),
            "wallet_credit_used": round(w_credit, 2),
            "p_floor": round(p_floor, 2)
        }
    }

@app.post("/create-policy", response_model=schemas.PolicyResponse)
def create_policy(policy: schemas.PolicyCreate, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == policy.worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    # Check if active policy exists
    active_policy = db.query(models.Policy).filter(
        models.Policy.worker_id == policy.worker_id,
        models.Policy.status == "ACTIVE"
    ).first()
    
    if active_policy:
        raise HTTPException(status_code=400, detail="Worker already has an active policy")

    # calculate premium
    calc = calculate_premium(schemas.PremiumRequest(worker_id=worker.id, tier=policy.tier), db)
    premium_paid = calc["premium_amount"]
    coverage_amount = calc["coverage_amount"]
    wallet_credit = calc["breakdown"]["wallet_credit_used"]

    # Deduct wallet credit
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
    # Add to wallet (e.g. 20% of premium goes to wallet)
    worker.wallet_balance += (premium_paid * 0.2)
    
    db.commit()
    db.refresh(new_policy)
    
    return new_policy

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
        "claims": claims
    }

# Start Background Scheduler
from scheduler import start_scheduler
@app.on_event("startup")
def startup_event():
    start_scheduler()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
