#!/usr/bin/env python3
"""
Test the Dashboard API endpoint directly
Shows what the website will receive from the backend
"""
import sys
sys.path.insert(0, '/Users/marthanda/Downloads/Guidewire_Shivanshu/Guidewire-DEVTrails-2026/backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models
from fastapi import HTTPException
import json

# Setup database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
models.Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_dashboard(worker_id):
    """Simulates: GET /worker/{worker_id}/dashboard"""
    db = SessionLocal()
    
    try:
        worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
        if not worker:
            raise Exception(f"Worker not found")
        
        policies = db.query(models.Policy).filter(models.Policy.worker_id == worker_id).order_by(models.Policy.id.desc()).all()
        claims = db.query(models.Claim).filter(models.Claim.worker_id == worker_id).order_by(models.Claim.id.desc()).all()
        wallet_ledger = db.query(models.WalletLedger).filter(models.WalletLedger.worker_id == worker_id).order_by(models.WalletLedger.id.desc()).all()
        
        active_policy = next((p for p in policies if p.status == "ACTIVE"), None)
        past_policies = [p for p in policies if p.status != "ACTIVE"]
        
        response = {
            "worker": {
                "id": worker.id,
                "name": worker.name,
                "phone": worker.phone,
                "city": worker.city,
                "platform": worker.platform,
                "avg_weekly_earnings": worker.avg_weekly_earnings,
                "wallet_balance": worker.wallet_balance,
                "r_score": worker.r_score,
                "pincode": worker.pincode,
                "upi_id": worker.upi_id,
                "terms_accepted_at": worker.terms_accepted_at
            },
            "active_policy": {
                "id": active_policy.id,
                "worker_id": active_policy.worker_id,
                "tier": active_policy.tier,
                "week_start": active_policy.week_start.isoformat(),
                "week_end": active_policy.week_end.isoformat(),
                "coverage_amount": active_policy.coverage_amount,
                "premium_paid": active_policy.premium_paid,
                "status": active_policy.status
            } if active_policy else None,
            "past_policies": [
                {
                    "id": p.id,
                    "tier": p.tier,
                    "status": p.status,
                    "premium_paid": p.premium_paid
                } for p in past_policies
            ],
            "claims": [
                {
                    "id": c.id,
                    "worker_id": c.worker_id,
                    "trigger_type": c.trigger_type,
                    "description": c.description,
                    "status": c.status,
                    "payout_amount": c.payout_amount,
                    "created_at": c.created_at.isoformat(),
                    "fraud_score": c.fraud_score,
                    "rejection_reason": c.rejection_reason
                } for c in claims
            ],
            "wallet_ledger": [
                {
                    "id": w.id,
                    "worker_id": w.worker_id,
                    "amount": w.amount,
                    "description": w.description,
                    "txn_type": w.txn_type,
                    "created_at": w.created_at.isoformat()
                } for w in wallet_ledger
            ],
            "system_status": {
                "circuit_breaker_active": False,
                "demo_mode_active": False
            }
        }
        
        return response
        
    finally:
        db.close()

def test_multiple_workers():
    """Test dashboard for multiple workers"""
    print("\n" + "="*100)
    print("🧪 TESTING DASHBOARD API ENDPOINT")
    print("="*100 + "\n")
    
    db = SessionLocal()
    
    try:
        # Get 5 random workers with claims
        workers = db.query(models.Worker).limit(5).all()
        
        for worker in workers:
            print(f"\n{'='*100}")
            print(f"📱 GET /worker/{worker.id}/dashboard")
            print(f"{'='*100}\n")
            
            dashboard = get_dashboard(worker.id)
            
            # Print worker info
            w = dashboard["worker"]
            print(f"✅ WORKER:")
            print(f"   ID: {w['id']}")
            print(f"   Name: {w['name']}")
            print(f"   City: {w['city']}")
            print(f"   Earnings: ₹{w['avg_weekly_earnings']}/week")
            print(f"   Wallet: ₹{w['wallet_balance']:.2f}")
            
            # Print policy
            print(f"\n✅ ACTIVE POLICY:")
            if dashboard["active_policy"]:
                p = dashboard["active_policy"]
                print(f"   Tier: {p['tier']}")
                print(f"   Premium: ₹{p['premium_paid']}/week")
                print(f"   Coverage: ₹{p['coverage_amount']}")
                print(f"   Status: {p['status']}")
            else:
                print(f"   None")
            
            # Print claims
            claims = dashboard["claims"]
            print(f"\n✅ CLAIMS ({len(claims)} total):")
            
            approved = [c for c in claims if c['status'] == 'APPROVED']
            pending = [c for c in claims if c['status'] == 'PENDING']
            rejected = [c for c in claims if c['status'] == 'REJECTED']
            
            print(f"   APPROVED: {len(approved)}")
            print(f"   PENDING:  {len(pending)}")
            print(f"   REJECTED: {len(rejected)}")
            
            for claim in claims[:2]:  # Show first 2
                print(f"\n   [{claim['id']}] {claim['trigger_type']}")
                print(f"       Amount: ₹{claim['payout_amount']:.2f}")
                print(f"       Status: {claim['status']}")
                print(f"       Fraud Score: {claim['fraud_score']:.2f}")
            
            # Print transactions
            ledger = dashboard["wallet_ledger"]
            print(f"\n✅ WALLET TRANSACTIONS ({len(ledger)} total):")
            
            for txn in ledger[:3]:  # Show first 3
                txn_type = "📤" if txn['txn_type'] == 'DEBIT' else '📥'
                print(f"   {txn_type} ₹{txn['amount']:.2f} ({txn['description']})")
    
    finally:
        db.close()
    
    print(f"\n{'='*100}")
    print("✅ API TEST COMPLETE")
    print(f"{'='*100}\n")

if __name__ == "__main__":
    test_multiple_workers()
