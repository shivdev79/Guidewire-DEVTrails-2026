#!/usr/bin/env python3
"""
View Rider Dashboard - Shows what a rider sees in their console
Displays worker info, active policy, claims history, and wallet transactions
"""
import sys
sys.path.insert(0, '/Users/marthanda/Downloads/Guidewire_Shivanshu/Guidewire-DEVTrails-2026/backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models
from datetime import datetime

# Setup database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
models.Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def view_rider_dashboard(worker_id):
    db = SessionLocal()
    
    try:
        print("\n" + "="*80)
        print(f"📱 RIDER DASHBOARD - Worker ID: {worker_id}")
        print("="*80 + "\n")
        
        # Get worker
        worker = db.query(models.Worker).filter(models.Worker.id == worker_id).first()
        if not worker:
            print(f"❌ Worker not found (ID: {worker_id})")
            return
        
        # Get policy
        active_policy = db.query(models.Policy).filter(
            models.Policy.worker_id == worker_id,
            models.Policy.status == "ACTIVE"
        ).first()
        
        # Get claims
        claims = db.query(models.Claim).filter(
            models.Claim.worker_id == worker_id
        ).order_by(models.Claim.created_at.desc()).all()
        
        # Get wallet ledger
        wallet_ledger = db.query(models.WalletLedger).filter(
            models.WalletLedger.worker_id == worker_id
        ).order_by(models.WalletLedger.created_at.desc()).all()
        
        # Display
        print(f"👤 WORKER INFORMATION")
        print("─" * 80)
        print(f"  Name:              {worker.name}")
        print(f"  Phone:             {worker.phone}")
        print(f"  City:              {worker.city}")
        print(f"  Platforms:         {worker.platform}")
        print(f"  Weekly Earnings:   ₹{worker.avg_weekly_earnings}")
        print(f"  R-Score:           {worker.r_score:.1f}/100")
        print(f"  💰 Wallet Balance: ₹{worker.wallet_balance:.2f}")
        
        print(f"\n" + "="*80)
        print(f"📋 ACTIVE POLICY")
        print("─" * 80)
        if active_policy:
            print(f"  Status:            ✅ ACTIVE")
            print(f"  Plan:              AEGIS {active_policy.tier.upper()}")
            print(f"  Premium:           ₹{active_policy.premium_paid:.2f}/week")
            print(f"  Coverage:          ₹{active_policy.coverage_amount:.2f}")
            print(f"  Valid From:        {active_policy.week_start.strftime('%Y-%m-%d')}")
            print(f"  Valid Until:       {active_policy.week_end.strftime('%Y-%m-%d')}")
        else:
            print(f"  Status:            ❌ NO ACTIVE POLICY")
        
        print(f"\n" + "="*80)
        print(f"🚨 CLAIMS HISTORY ({len(claims)} total)")
        print("─" * 80)
        
        if claims:
            # Summary stats
            approved = [c for c in claims if c.status == "APPROVED"]
            pending = [c for c in claims if c.status == "PENDING"]
            rejected = [c for c in claims if c.status == "REJECTED"]
            
            total_approved_amount = sum(c.payout_amount for c in approved)
            
            print(f"\n  Summary:")
            print(f"    ✅ APPROVED: {len(approved)} claims (₹{total_approved_amount:.2f} total)")
            print(f"    ⏳ PENDING:  {len(pending)} claims")
            print(f"    ❌ REJECTED: {len(rejected)} claims")
            
            print(f"\n  Recent Claims:")
            for idx, claim in enumerate(claims[:5], 1):  # Show top 5
                status_icon = "✅" if claim.status == "APPROVED" else ("⏳" if claim.status == "PENDING" else "❌")
                fraud_badge = "🔴" if claim.fraud_score > 0.5 else ("🟡" if claim.fraud_score > 0.25 else "🟢")
                
                print(f"\n  [{idx}] {status_icon} {claim.trigger_type}")
                print(f"      Created:      {claim.created_at.strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"      Amount:       ₹{claim.payout_amount:.2f}")
                print(f"      Status:       {claim.status}")
                print(f"      Description:  {claim.description}")
                print(f"      Fraud Score:  {fraud_badge} {claim.fraud_score:.2f}/1.0")
                if claim.rejection_reason:
                    print(f"      Reason:       {claim.rejection_reason}")
        else:
            print(f"  No claims yet")
        
        print(f"\n" + "="*80)
        print(f"💳 WALLET TRANSACTIONS ({len(wallet_ledger)} total)")
        print("─" * 80)
        
        if wallet_ledger:
            print(f"\n  Recent Transactions:")
            for idx, txn in enumerate(wallet_ledger[:8], 1):  # Show top 8
                txn_type = "📤" if txn.txn_type == "DEBIT" else "📥"
                amount_str = f"₹{txn.amount:.2f}".ljust(12)
                
                print(f"\n  [{idx}] {txn_type} {txn.created_at.strftime('%Y-%m-%d %H:%M')}")
                print(f"      Type:        {txn.txn_type}")
                print(f"      Amount:      {amount_str}")
                print(f"      Description: {txn.description}")
        else:
            print(f"  No transactions yet")
        
        # Calculate running balance
        print(f"\n" + "="*80)
        print(f"💰 WALLET BALANCE FLOW")
        print("─" * 80)
        
        if wallet_ledger:
            balance = 0
            print(f"\n  Starting: ₹0.00")
            for txn in reversed(wallet_ledger[-5:]):  # Show last 5
                if txn.txn_type == "CREDIT":
                    balance += txn.amount
                    print(f"  + ₹{txn.amount:.2f} ({txn.description})")
                else:
                    balance -= txn.amount
                    print(f"  - ₹{txn.amount:.2f} ({txn.description})")
            
            print(f"  ─────────────────")
            print(f"  Current: ₹{worker.wallet_balance:.2f}")
        else:
            print(f"  Initial Balance: ₹{worker.wallet_balance:.2f}")
        
        print(f"\n" + "="*80)
        print("✅ END OF DASHBOARD")
        print("="*80 + "\n")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

def list_all_workers():
    db = SessionLocal()
    
    try:
        print("\n" + "="*80)
        print("📊 ALL WORKERS IN SYSTEM")
        print("="*80 + "\n")
        
        workers = db.query(models.Worker).all()
        
        print(f"Total Workers: {len(workers)}\n")
        print(f"{'ID':<6} {'Name':<20} {'City':<12} {'Earnings':<12} {'Wallet':<12} {'Claims':<8}")
        print("─" * 80)
        
        for worker in workers[:100]:  # Show first 100
            claims = db.query(models.Claim).filter(
                models.Claim.worker_id == worker.id
            ).count()
            
            print(f"{worker.id:<6} {worker.name:<20} {worker.city:<12} ₹{worker.avg_weekly_earnings:<11.0f} ₹{worker.wallet_balance:<11.2f} {claims:<8}")
        
        if len(workers) > 100:
            print(f"... and {len(workers) - 100} more workers")
        
        print("\n" + "="*80 + "\n")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        try:
            worker_id = int(sys.argv[1])
            view_rider_dashboard(worker_id)
        except ValueError:
            print("Invalid worker ID. Usage: python view_rider.py <worker_id>")
    else:
        # Show all workers
        list_all_workers()
        
        # Show dashboard for a random worker
        db = SessionLocal()
        workers = db.query(models.Worker).all()
        db.close()
        
        if workers:
            print("\n" + "="*80)
            print("📱 SAMPLE DASHBOARD (Random Worker)")
            print("="*80)
            import random
            random_worker = random.choice(workers)
            view_rider_dashboard(random_worker.id)
