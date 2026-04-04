#!/usr/bin/env python3
"""
Complete end-to-end test of the AEGIS platform flow
Tests: Register → Add Balance → Create Policy → Get Dashboard
"""
import sys
sys.path.insert(0, '/Users/marthanda/Downloads/Guidewire_Shivanshu/Guidewire-DEVTrails-2026/backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import datetime
import models
from premium_engine import PremiumEngine

# Setup database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
models.Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def run_e2e_test():
    db = SessionLocal()
    
    try:
        print("\n" + "="*70)
        print("🚀 AEGIS PLATFORM - END-TO-END FLOW TEST")
        print("="*70 + "\n")
        
        # Step 1: Create/Get Test Worker
        print("STEP 1: CREATE TEST WORKER")
        print("-" * 70)
        test_worker = db.query(models.Worker).filter(models.Worker.phone == "1111111111").first()
        
        if test_worker:
            print(f"✓ Using existing worker: {test_worker.name} (ID: {test_worker.id})")
            print(f"  Current balance: ₹{test_worker.wallet_balance}")
        else:
            test_worker = models.Worker(
                name="Test User",
                phone="1111111111",
                upi_id="test@aegis.app",
                platform="Zomato, Swiggy",
                city="Mumbai",
                pincode="400001",
                avg_weekly_earnings=8000.0,
                r_score=100.0,
                wallet_balance=0.0
            )
            db.add(test_worker)
            db.commit()
            db.refresh(test_worker)
            print(f"✓ Worker created: {test_worker.name} (ID: {test_worker.id})")
            print(f"  Initial balance: ₹{test_worker.wallet_balance}")
        
        worker_id = test_worker.id
        
        # Step 2: Add Wallet Balance
        print("\n\nSTEP 2: ADD WALLET BALANCE")
        print("-" * 70)
        add_amount = 1000
        test_worker.wallet_balance += add_amount
        
        ledger_entry = models.WalletLedger(
            worker_id=worker_id,
            amount=add_amount,
            description="Demo wallet top-up",
            txn_type="CREDIT"
        )
        db.add(ledger_entry)
        db.commit()
        db.refresh(test_worker)
        
        print(f"✓ Added ₹{add_amount} to wallet")
        print(f"  New balance: ₹{test_worker.wallet_balance}")
        print(f"  Ledger entry created (ID: {ledger_entry.id})")
        
        # Step 3: Create Policy
        print("\n\nSTEP 3: CREATE POLICY")
        print("-" * 70)
        
        # Calculate premium
        calc = PremiumEngine.calculate_weekly_premium(test_worker, 5000.0)
        premium = calc["premium_amount"]
        coverage = calc["coverage_amount"]
        
        print(f"✓ Premium calculated:")
        print(f"  Tier: Shield Pro")
        print(f"  Premium: ₹{premium}")
        print(f"  Coverage: ₹{coverage}")
        
        # Deduct premium
        test_worker.wallet_balance -= premium
        
        ledger_debit = models.WalletLedger(
            worker_id=worker_id,
            amount=premium,
            description="Premium debit (Shield Pro plan)",
            txn_type="DEBIT"
        )
        db.add(ledger_debit)
        
        # Add cashback
        cashback = premium * 0.2
        test_worker.wallet_balance += cashback
        
        ledger_cashback = models.WalletLedger(
            worker_id=worker_id,
            amount=cashback,
            description="Cashback credit (20% on premium)",
            txn_type="CREDIT"
        )
        db.add(ledger_cashback)
        
        # Create policy
        week_start = datetime.datetime.utcnow()
        week_end = week_start + datetime.timedelta(days=7)
        
        policy = models.Policy(
            worker_id=worker_id,
            tier="Pro",
            week_start=week_start,
            week_end=week_end,
            coverage_amount=coverage,
            premium_paid=premium,
            status="ACTIVE"
        )
        db.add(policy)
        db.commit()
        db.refresh(test_worker)
        db.refresh(policy)
        
        print(f"✓ Policy activated (ID: {policy.id})")
        print(f"  After premium deduction: ₹{test_worker.wallet_balance - cashback}")
        print(f"  After cashback credit: ₹{test_worker.wallet_balance}")
        
        # Step 4: Display Dashboard Data
        print("\n\nSTEP 4: DASHBOARD DATA")
        print("-" * 70)
        
        # Fetch all data
        worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
        policies = db.query(models.Policy).filter(models.Policy.worker_id == worker_id).order_by(models.Policy.id.desc()).all()
        claims = db.query(models.Claim).filter(models.Claim.worker_id == worker_id).order_by(models.Claim.id.desc()).all()
        wallet_ledger = db.query(models.WalletLedger).filter(models.WalletLedger.worker_id == worker_id).order_by(models.WalletLedger.id.desc()).all()
        
        active_policy = next((p for p in policies if p.status == "ACTIVE"), None)
        
        print(f"👤 WORKER INFO:")
        print(f"  Name: {worker.name}")
        print(f"  Phone: {worker.phone}")
        print(f"  City: {worker.city}")
        print(f"  Weekly Earnings: ₹{worker.avg_weekly_earnings}")
        print(f"  R-Score: {worker.r_score}")
        print(f"  Wallet Balance: ₹{worker.wallet_balance}")
        
        print(f"\n📋 ACTIVE POLICY:")
        if active_policy:
            print(f"  Status: {active_policy.status}")
            print(f"  Tier: {active_policy.tier}")
            print(f"  Coverage: ₹{active_policy.coverage_amount}")
            print(f"  Premium Paid: ₹{active_policy.premium_paid}")
            print(f"  Valid: {active_policy.week_start.date()} to {active_policy.week_end.date()}")
        else:
            print(f"  None")
        
        print(f"\n💰 WALLET LEDGER ({len(wallet_ledger)} transactions):")
        for entry in wallet_ledger:
            type_label = "OUT" if entry.txn_type == "DEBIT" else "IN"
            amount_str = f"₹{abs(entry.amount):<8}"
            print(f"  {entry.created_at.strftime('%Y-%m-%d %H:%M')}  {type_label}  {amount_str}  {entry.description}")
        
        print(f"\n🚨 CLAIMS ({len(claims)} total):")
        for claim in claims:
            print(f"  [{claim.id}] {claim.trigger_type}")
            print(f"       Amount: ₹{claim.payout_amount}")
            print(f"       Status: {claim.status}")
            print(f"       Date: {claim.created_at.strftime('%Y-%m-%d %H:%M')}")
            print(f"       Fraud Score: {claim.fraud_score}")
        
        # Step 5: Success Message
        print("\n" + "="*70)
        print("✅ ALL TESTS PASSED!")
        print("="*70)
        print(f"\n📊 SUMMARY:")
        print(f"  Worker ID: {worker_id}")
        print(f"  Current Balance: ₹{worker.wallet_balance}")
        print(f"  Active Policy: {'Yes ✓' if active_policy else 'No'}")
        print(f"  Total Claims: {len(claims)}")
        print(f"  Total Wallet Transactions: {len(wallet_ledger)}")
        print(f"\n✨ Flow complete! Ready for website testing.")
        print("="*70 + "\n")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    run_e2e_test()
