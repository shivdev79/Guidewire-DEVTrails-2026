from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import desc
import datetime
from datetime import datetime, timedelta
import uvicorn
import logging

import models
import schemas
import config
from database import engine, get_db
from premium_engine import PremiumEngine
from demo_mode import DemoModeController, DemoScenario
from scheduler import start_scheduler
import traceback

models.Base.metadata.create_all(bind=engine)

logger = logging.getLogger(__name__)
app = FastAPI(title="AEGIS: Zero-Trust Parametric Startup MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== AI CHAT ENDPOINT ====================

@app.post("/ai-chat", response_model=schemas.AIChatResponse)
def ai_chat(body: schemas.AIChatRequest):
    msg = body.message.lower()
    ctx = body.context or {}
    name = ctx.get("rider_name", "Partner")
    has_policy = ctx.get("has_policy", False)
    plan = ctx.get("plan_name", "No Active Plan")
    balance = ctx.get("wallet_balance", 0)

    # Simple keyword-based AI logic
    if "hello" in msg or "hi" in msg:
        resp = f"Hello {name}! I'm the Aegis Virtual Assistant. How can I help you with your income protection today?"
    elif "payout" in msg or "claim" in msg or "money" in msg:
        if has_policy:
            resp = f"I see you're covered under the **{plan}**. Payouts are triggered automatically when weather or traffic data breaches your plan's thresholds. You can track all approved amounts in your **Wallet** tab."
        else:
            resp = "You don't have an active policy currently. Payouts only trigger when you have an active Shield plan. Check out the **Explore Plans** tab to get started!"
    elif "refund" in msg:
        resp = "Manual claim refunds are processed within 24-48 hours once our AI validates the disruption event. Approved funds are instantly credited to your Aegis Wallet."
    elif "wallet" in msg or "balance" in msg:
        resp = f"Your current Aegis Wallet balance is **₹{balance}**. You can use this for plan purchases or withdraw it to your bank account via UPI."
    elif "upgrade" in msg:
        resp = "You can upgrade your coverage anytime from the **Explore Plans** tab. Upgrading to a higher tier like Elite provides lower rain thresholds and higher payout limits!"
    elif "thank" in msg:
        resp = f"You're very welcome, {name}! Is there anything else you need help with?"
    else:
        resp = "That's a great question! As an Aegis Assistant, I can help you with policy details, automatic claim triggers, or wallet payouts. Could you please specify which part of the Aegis platform you're asking about?"

    return {"response": resp}

# ==================== WORKER ENDPOINTS ====================

@app.post("/register", response_model=schemas.WorkerResponse)
def register_worker(worker: schemas.WorkerCreate, db: Session = Depends(get_db)):
    db_worker = db.query(models.Worker).filter(models.Worker.phone == worker.phone).first()
    if db_worker:
        return db_worker
    
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


def _wallet_topup_description(payment_method: str) -> str:
    m = (payment_method or "UPI").strip().upper()
    labels = {
        "UPI": "Wallet top-up (UPI)",
        "NETBANKING": "Wallet top-up (NetBanking)",
        "CARD": "Wallet top-up (Debit / Credit Card)",
        "OTHER": "Wallet top-up",
    }
    return labels.get(m, labels["OTHER"])


@app.post("/worker/{worker_id}/wallet/top-up")
def wallet_top_up(worker_id: int, body: schemas.WalletTopUpRequest, db: Session = Depends(get_db)):
    if body.amount <= 0 or body.amount > 1_000_000:
        raise HTTPException(status_code=400, detail="Invalid amount")
    method = (body.payment_method or "UPI").strip().upper()
    if method not in ("UPI", "NETBANKING", "CARD", "OTHER"):
        raise HTTPException(status_code=400, detail="Invalid payment_method")
    worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    worker.wallet_balance = (worker.wallet_balance or 0.0) + float(body.amount)
    entry = models.WalletLedger(
        worker_id=worker_id,
        amount=float(body.amount),
        description=_wallet_topup_description(method),
        txn_type="CREDIT",
    )
    db.add(entry)
    db.commit()
    db.refresh(worker)
    db.refresh(entry)
    return {
        "wallet_balance": worker.wallet_balance,
        "transaction": {
            "id": entry.id,
            "amount": entry.amount,
            "description": entry.description,
            "txn_type": entry.txn_type,
            "created_at": entry.created_at.isoformat() if entry.created_at else None,
        },
    }


# ==================== PREMIUM ENDPOINTS ====================

@app.post("/calculate-premium")
def calculate_premium(request: schemas.PremiumRequest, db: Session = Depends(get_db)):
    worker = db.query(models.Worker).filter(models.Worker.id == request.worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    coverage_map = {"Base": 3000.0, "Pro": 5000.0, "Elite": 8000.0}
    coverage_amount = coverage_map.get(request.tier, 3000.0)

    return PremiumEngine.calculate_weekly_premium(worker, coverage_amount)

# ==================== POLICY ENDPOINTS ====================

@app.post("/create-policy", response_model=schemas.PolicyResponse)
def create_policy(policy: schemas.PolicyCreate, db: Session = Depends(get_db)):
    try:
        worker = db.query(models.Worker).filter(models.Worker.id == policy.worker_id).first()
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
            
        if not policy.accepted_terms:
            raise HTTPException(status_code=400, detail="Must explicitly accept strict T&C to activate policy.")
        
        worker.terms_accepted_at = datetime.utcnow()
        
        active_policy = db.query(models.Policy).filter(
            models.Policy.worker_id == policy.worker_id,
            models.Policy.status == "ACTIVE"
        ).first()
        
        if active_policy:
            if active_policy.tier == policy.tier:
                return active_policy
            else:
                # Upgrade or switch plan: Cancel the old one. Overrides allow switching but user pays full price.
                active_policy.status = "CANCELED_UPGRADED"
                db.add(active_policy)

        calc = PremiumEngine.calculate_weekly_premium(worker, 5000.0 if policy.tier == "Pro" else (8000.0 if policy.tier == "Elite" else 3000.0))
        total_cost = calc["premium_amount"] + calc["breakdown"]["wallet_credit_used"]
        coverage_amount = calc["coverage_amount"]
        
        if worker.wallet_balance < total_cost:
            raise HTTPException(status_code=400, detail=f"Insufficient wallet balance (₹{worker.wallet_balance}) for this plan (₹{total_cost}). Please top up first.")
        
        worker.wallet_balance -= total_cost
        db.add(
            models.WalletLedger(
                worker_id=worker.id,
                amount=total_cost,
                description=f"Plan purchase: {policy.tier} coverage",
                txn_type="DEBIT",
            )
        )
        
        premium_paid = total_cost

        week_start = datetime.utcnow()
        week_end = week_start + timedelta(days=7)

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
        worker.wallet_balance += (premium_paid * 0.2)
        
        db.commit()
        db.refresh(new_policy)
        return new_policy
    except HTTPException as e:
        # Re-raise explicit HTTP exceptions
        raise e
    except Exception as e:
        # Raise unexpected errors as 500
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/simulate-rebate/{worker_id}")
def simulate_rebate(worker_id: int, db: Session = Depends(get_db)):
    """Mocks the Predictive Risk Rebate (Mid-Week Yield) Pillar"""
    worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    
    rebate_amount = 30.0
    worker.wallet_balance += rebate_amount
    db.commit()
    return {"status": "success", "message": f"Mid-week risk evaporated. Issued ₹{rebate_amount} partial rebate.", "wallet_balance": worker.wallet_balance}

# ==================== CLAIMS ENDPOINTS ====================

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

# ==================== ADMIN ENDPOINTS ====================

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
            "circuit_breaker_active": config.CIRCUIT_BREAKER_ACTIVE,
            "demo_mode_active": DemoModeController.get_active_scenario() is not None
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

    ledger_rows = (
        db.query(models.WalletLedger)
        .filter(models.WalletLedger.worker_id == worker_id)
        .order_by(desc(models.WalletLedger.created_at))
        .limit(100)
        .all()
    )

    return {
        "worker": worker,
        "active_policy": active_policy,
        "past_policies": past_policies,
        "claims": claims,
        "wallet_ledger": [
            {
                "id": row.id,
                "amount": row.amount,
                "description": row.description,
                "txn_type": row.txn_type,
                "created_at": row.created_at.isoformat() if row.created_at else None,
            }
            for row in ledger_rows
        ],
        "system_status": {
            "circuit_breaker_active": config.CIRCUIT_BREAKER_ACTIVE,
            "demo_mode_active": DemoModeController.get_active_scenario() is not None
        }
    }

# ==================== CIRCUIT BREAKER ENDPOINTS ====================

@app.post("/webhooks/national-disaster")
async def force_majeure_circuit_breaker(request: Request):
    """Emergency webhook for black-swan events"""
    payload = await request.json()
    if payload.get("directive") == "FREEZE_ALL_PARAMETRIC_PAYOUTS":
        config.CIRCUIT_BREAKER_ACTIVE = True
        logger.critical(f"CIRCUIT BREAKER ENGAGED! Event: {payload.get('event_type')}")
        return {"status": "SUCCESS", "message": "Circuit breaker is active. All platform claims are halted."}
    elif payload.get("directive") == "UNFREEZE_ALL_PARAMETRIC_PAYOUTS":
        config.CIRCUIT_BREAKER_ACTIVE = False
        logger.warning(f"CIRCUIT BREAKER LIFTED! Event: {payload.get('event_type')}")
        return {"status": "SUCCESS", "message": "Circuit breaker lifted. Normal operations have resumed."}
    return {"status": "IGNORED"}

# ==================== DEMO MODE ENDPOINTS (FOR LIVE DEMONSTRATIONS) ====================

@app.post("/demo/activate-scenario")
def activate_demo_scenario(scenario_request: dict):
    """
    Activate a demo scenario for live demonstration
    
    Example: {"scenario": "heavy_rain"}
    Options: heavy_rain, extreme_heat, critical_aqi, civic_strike, platform_crash, clear_weather
    
    Once activated, all workers will trigger this disruption on the next scheduler run.
    """
    scenario_name = scenario_request.get("scenario", "").upper()
    
    try:
        scenario = DemoScenario[scenario_name]
        result = DemoModeController.activate_scenario(scenario)
        return result
    except KeyError:
        return {
            "status": "ERROR",
            "message": f"Invalid scenario. Options: {[s.value for s in DemoScenario]}",
            "error": f"Unknown scenario: {scenario_name}"
        }

@app.post("/demo/deactivate")
def deactivate_demo():
    """Deactivate demo mode and return to normal operation"""
    return DemoModeController.deactivate_scenario()

@app.get("/demo/status")
def get_demo_status():
    """Get current demo mode status"""
    return DemoModeController.get_demo_status()

@app.get("/demo/scenarios")
def list_demo_scenarios():
    """List all available demo scenarios"""
    return {
        "available_scenarios": [
            {
                "name": scenario.value,
                "description": {
                    "heavy_rain": "🌧️ Heavy Rain: Workers report zero delivery capacity due to 65mm+ rainfall",
                    "extreme_heat": "🔥 Extreme Heat: Temperature exceeds 44°C. Outdoor work hazardous.",
                    "critical_aqi": "💨 Critical AQI: Air pollution spike to 350+ AQI. Deliveries halted.",
                    "civic_strike": "🚨 Civic Strike: Unannounced market closure. Workers stuck.",
                    "platform_crash": "💻 Platform API Down: Gig platform servers crash. No orders.",
                    "clear_weather": "✅ Clear: Normal conditions. No disruptions."
                }.get(scenario.value, "Unknown")
            }
            for scenario in DemoScenario
        ],
        "usage": "POST /demo/activate-scenario with {\"scenario\": \"heavy_rain\"}"
    }

# ==================== STARTUP & SHUTDOWN ====================

# ==================== INSTANT DEMO TRIGGERS (For Live Demonstrations) ====================

@app.post("/demo/trigger-heavy-rain/{worker_id}")
def demo_trigger_heavy_rain(worker_id: int, db: Session = Depends(get_db)):
    """
    INSTANT: Inject a heavy rain claim for demo.
    Perfect for showing claim auto-approval immediately.
    """
    try:
        worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        policy = db.query(models.Policy).filter(
            models.Policy.worker_id == worker_id,
            models.Policy.status == "ACTIVE"
        ).first()
        
        if not policy:
            raise HTTPException(status_code=400, detail="No active policy. Create policy first.")
        
        # Create instant APPROVED claim
        claim = models.Claim(
            worker_id=worker_id,
            trigger_type="DEMO_HEAVY_RAIN",
            description="🌧️ [DEMO] Heavy rainfall detected (65mm/hr forecast) - Deliveries halted - Income loss verified",
            status="APPROVED",
            payout_amount=policy.coverage_amount * 0.5,
            fraud_score=0.05,
            created_at=datetime.utcnow()
        )
        
        db.add(claim)
        db.commit()
        db.refresh(claim)
        
        logger.info(f"⚡ DEMO: Heavy Rain claim #{claim.id} APPROVED instantly for worker {worker_id}")
        
        return {
            "status": "SUCCESS",
            "message": "🌧️ Heavy Rain Disruption - Instant Claim Approved!",
            "claim": {
                "id": claim.id,
                "trigger_type": claim.trigger_type,
                "status": claim.status,
                "payout_amount": claim.payout_amount,
                "fraud_score": claim.fraud_score
            },
            "worker_notification": f"✅ Disruption verified. ₹{claim.payout_amount} will be credited to your UPI shortly.",
            "payout_status": "QUEUED_FOR_RAZORPAY_UPI_TRANSFER"
        }
    
    except Exception as e:
        logger.error(f"Demo trigger failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/demo/trigger-extreme-heat/{worker_id}")
def demo_trigger_extreme_heat(worker_id: int, db: Session = Depends(get_db)):
    """INSTANT: Inject extreme heat claim for demo"""
    try:
        worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        policy = db.query(models.Policy).filter(
            models.Policy.worker_id == worker_id,
            models.Policy.status == "ACTIVE"
        ).first()
        
        if not policy:
            raise HTTPException(status_code=400, detail="No active policy")
        
        claim = models.Claim(
            worker_id=worker_id,
            trigger_type="DEMO_EXTREME_HEAT",
            description="🔥 [DEMO] Extreme temperature alert (44.5°C) - Outdoor work unsafe - Income protection triggered",
            status="APPROVED",
            payout_amount=policy.coverage_amount * 0.4,
            fraud_score=0.03,
            created_at=datetime.utcnow()
        )
        
        db.add(claim)
        db.commit()
        db.refresh(claim)
        
        logger.info(f"⚡ DEMO: Extreme Heat claim #{claim.id} APPROVED for worker {worker_id}")
        
        return {
            "status": "SUCCESS",
            "message": "🔥 Extreme Heat Disruption - Claim Auto-Approved!",
            "claim": {
                "id": claim.id,
                "trigger_type": claim.trigger_type,
                "status": claim.status,
                "payout_amount": claim.payout_amount,
                "fraud_score": claim.fraud_score
            },
            "worker_notification": f"✅ Heat hazard verified. ₹{claim.payout_amount} instant payout initiated.",
            "payout_status": "RAZORPAY_UPI_INITIATED"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/demo/trigger-civic-strike/{worker_id}")
def demo_trigger_civic_strike(worker_id: int, db: Session = Depends(get_db)):
    """INSTANT: Inject civic strike claim for demo"""
    try:
        worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        policy = db.query(models.Policy).filter(
            models.Policy.worker_id == worker_id,
            models.Policy.status == "ACTIVE"
        ).first()
        
        if not policy:
            raise HTTPException(status_code=400, detail="No active policy")
        
        claim = models.Claim(
            worker_id=worker_id,
            trigger_type="DEMO_CIVIC_STRIKE",
            description="🚨 [DEMO] Unannounced civic strike detected (Movement restricted) - Pickup zone inaccessible - Zero orders",
            status="APPROVED",
            payout_amount=policy.coverage_amount * 0.6,
            fraud_score=0.08,
            created_at=datetime.utcnow()
        )
        
        db.add(claim)
        db.commit()
        db.refresh(claim)
        
        logger.info(f"⚡ DEMO: Civic Strike claim #{claim.id} APPROVED for worker {worker_id}")
        
        return {
            "status": "SUCCESS",
            "message": "🚨 Civic Strike Detected - Income Loss Compensation Approved!",
            "claim": {
                "id": claim.id,
                "trigger_type": claim.trigger_type,
                "status": claim.status,
                "payout_amount": claim.payout_amount,
                "fraud_score": claim.fraud_score
            },
            "worker_notification": f"✅ Curfew/Strike verified. ₹{claim.payout_amount} compensation approved.",
            "payout_status": "RAZORPAY_TRANSFER_IN_PROGRESS"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/demo/trigger-fraud-rejection/{worker_id}")
def demo_trigger_fraud_rejection(worker_id: int, db: Session = Depends(get_db)):
    """INSTANT: Show fraud detection in action - REJECTING a bad claim"""
    try:
        worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        policy = db.query(models.Policy).filter(
            models.Policy.worker_id == worker_id,
            models.Policy.status == "ACTIVE"
        ).first()
        
        if not policy:
            raise HTTPException(status_code=400, detail="No active policy")
        
        # Create REJECTED claim to show fraud detection works
        claim = models.Claim(
            worker_id=worker_id,
            trigger_type="DEMO_FRAUD_TEST",
            description="🛡️ [DEMO] Fraudulent claim blocked - GPS spoofing detected (Teleportation event: 15km in 3s)",
            status="REJECTED",
            payout_amount=0.0,
            fraud_score=0.98,  # Very high fraud score
            rejection_reason="GPS Spoofing: Device showed impossible movement pattern. Claim blocked by Zero-Trust Fraud Engine.",
            created_at=datetime.utcnow()
        )
        
        db.add(claim)
        db.commit()
        db.refresh(claim)
        
        logger.warning(f"🛡️ DEMO: Fraud test claim #{claim.id} REJECTED with score 0.98 for worker {worker_id}")
        
        return {
            "status": "SUCCESS",
            "message": "🛡️ Fraud Detection Demo - Malicious Claim BLOCKED!",
            "claim": {
                "id": claim.id,
                "trigger_type": claim.trigger_type,
                "status": claim.status,
                "payout_amount": claim.payout_amount,
                "fraud_score": claim.fraud_score,
                "rejection_reason": claim.rejection_reason
            },
            "fraud_analysis": {
                "anomaly_detected": "Spatial CNN: Teleportation event",
                "confidence": "98%",
                "action": "CLAIM BLOCKED",
                "worker_notification": "⚠️ Your claim was rejected. Device telemetry showed impossible GPS coordinates. Please contact support if this is an error."
            },
            "security_verdict": "ZERO_TRUST_VALIDATION_FAILED"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/demo/simulate-upi-payout/{claim_id}")
def demo_upi_payout(claim_id: int, db: Session = Depends(get_db)):
    """INSTANT: Simulate UPI payout to worker's account"""
    try:
        claim = db.query(models.Claim).filter(models.Claim.id == claim_id).first()
        if not claim:
            raise HTTPException(status_code=404, detail="Claim not found")
        
        if claim.status != "APPROVED":
            raise HTTPException(status_code=400, detail="Only approved claims can be paid")
        
        worker = db.query(models.Worker).filter(models.Worker.id == claim.worker_id).first()
        
        # Mock Razorpay response
        payout_response = {
            "status": "SUCCESS",
            "message": "💰 UPI Payout Processed Successfully!",
            "payout_details": {
                "amount": claim.payout_amount,
                "recipient": worker.upi_id,
                "worker_name": worker.name,
                "claim_id": claim_id,
                "timestamp": datetime.utcnow().isoformat(),
                "reference_id": f"AEGIS_PAY_{claim_id}_{worker.id}",
                "gateway": "Razorpay (Mock)",
                "status": "COMPLETED",
                "estimated_delivery": "5 seconds"
            },
            "worker_sms": f"✅ ₹{claim.payout_amount} transferred to your UPI {worker.upi_id}. Claim #{claim_id}. AEGIS",
            "worker_app_notification": f"Your income protection payout of ₹{claim.payout_amount} has been credited!",
            "time_to_payout_seconds": 47  # Demonstrates sub-90 second target
        }
        
        logger.info(f"💰 DEMO: UPI Payout ₹{claim.payout_amount} to {worker.upi_id} (Claim #{claim_id})")
        
        return payout_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/demo/quick-test/{worker_id}")
def demo_quick_test(worker_id: int, db: Session = Depends(get_db)):
    """
    Quick test: Register → Policy → Instant Trigger → Show Claim
    Perfect for 30-second demo to judges
    """
    try:
        worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
        if not worker:
            raise HTTPException(status_code=404, detail="Worker not found")
        
        policy = db.query(models.Policy).filter(
            models.Policy.worker_id == worker_id,
            models.Policy.status == "ACTIVE"
        ).first()
        
        claims = db.query(models.Claim).filter(
            models.Claim.worker_id == worker_id
        ).order_by(models.Claim.id.desc()).limit(5).all()
        
        return {
            "status": "DEMO_READY",
            "timestamp": datetime.utcnow().isoformat(),
            "quick_demo_steps": [
                "1. ✅ Worker registered" if worker else "1. ❌ Worker not found",
                "2. ✅ Policy active" if policy else "2. ⏳ Create policy first",
                "3. ⚡ Click demo trigger button to inject disruption",
                "4. 🎯 Claim auto-generates and approves instantly",
                "5. 💰 Payout simulates to worker's UPI"
            ],
            "worker_info": {
                "id": worker.id,
                "name": worker.name,
                "earnings": worker.avg_weekly_earnings,
                "r_score": worker.r_score,
                "wallet_balance": worker.wallet_balance,
                "platform": worker.platform,
                "city": worker.city,
                "pincode": worker.pincode
            },
            "policy_info": {
                "active": policy is not None,
                "coverage_amount": policy.coverage_amount if policy else None,
                "premium": policy.premium_paid if policy else None,
                "status": policy.status if policy else None
            },
            "recent_claims": [
                {
                    "id": c.id,
                    "type": c.trigger_type,
                    "status": c.status,
                    "amount": c.payout_amount,
                    "fraud_score": c.fraud_score
                }
                for c in claims
            ]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==================== STARTUP & SHUTDOWN ====================

@app.on_event("startup")
def startup_event():
    start_scheduler()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
