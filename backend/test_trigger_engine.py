#!/usr/bin/env python3
"""
Test the new trigger engine endpoint
Triggers events that create claims for all affected workers
"""
import sys
sys.path.insert(0, '/Users/marthanda/Downloads/Guidewire_Shivanshu/Guidewire-DEVTrails-2026/backend')

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models
import datetime
import json

# Setup database
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
models.Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def trigger_event_simulation(location, trigger_type, description):
    """
    Simulate the trigger event endpoint
    This is what happens when admin clicks trigger in console
    """
    db = SessionLocal()
    
    try:
        print(f"\n{'='*100}")
        print(f"🎯 TRIGGERING EVENT: {trigger_type} in {location}")
        print(f"{'='*100}\n")
        
        # Find all workers with active policies in this location
        workers_in_location = db.query(models.Worker).filter(
            models.Worker.city == location
        ).all()
        
        print(f"📍 Location: {location}")
        print(f"👥 Total workers in location: {len(workers_in_location)}")
        
        affected_workers = []
        created_claims = []
        total_payout = 0
        
        for worker in workers_in_location:
            active_policy = db.query(models.Policy).filter(
                models.Policy.worker_id == worker.id,
                models.Policy.status == "ACTIVE"
            ).first()
            
            if not active_policy:
                continue
            
            affected_workers.append({
                "id": worker.id,
                "name": worker.name,
                "earnings": worker.avg_weekly_earnings
            })
            
            # Calculate payout
            import random
            payout = worker.avg_weekly_earnings * random.uniform(0.3, 0.8)
            payout = round(payout, 2)
            
            # Create claim
            claim = models.Claim(
                worker_id=worker.id,
                trigger_type=trigger_type,
                description=f"{description} - Automatic parametric payout",
                status="APPROVED",
                payout_amount=payout,
                fraud_score=round(random.uniform(0.01, 0.25), 2)
            )
            
            db.add(claim)
            db.flush()
            
            # Update wallet
            old_balance = worker.wallet_balance
            worker.wallet_balance += payout
            
            # Add ledger
            ledger = models.WalletLedger(
                worker_id=worker.id,
                amount=payout,
                description=f"Parametric claim - {trigger_type}",
                txn_type="CREDIT"
            )
            db.add(ledger)
            
            created_claims.append({
                "claim_id": claim.id,
                "worker_id": worker.id,
                "name": worker.name,
                "earnings": worker.avg_weekly_earnings,
                "payout": payout,
                "old_balance": round(old_balance, 2),
                "new_balance": round(worker.wallet_balance, 2)
            })
            
            total_payout += payout
        
        db.commit()
        
        print(f"🎯 EVENT TRIGGERED!")
        print(f"{'='*100}\n")
        print(f"✅ Workers Affected: {len(affected_workers)}")
        print(f"💰 Total Payout: ₹{total_payout:,.2f}")
        print(f"📊 Average per worker: ₹{total_payout/len(affected_workers):,.2f}" if affected_workers else "")
        print(f"📋 Claims Created: {len(created_claims)}\n")
        
        # Show sample affected workers
        print(f"FIRST 10 AFFECTED WORKERS:")
        print(f"{'ID':<6} {'Name':<20} {'Earnings':<12} {'Payout':<12} {'New Balance':<15}")
        print("─" * 100)
        
        for claim in created_claims[:10]:
            print(f"{claim['worker_id']:<6} {claim['name']:<20} ₹{claim['earnings']:<11,.0f} ₹{claim['payout']:<11,.2f} ₹{claim['new_balance']:<14,.2f}")
        
        if len(created_claims) > 10:
            print(f"... and {len(created_claims) - 10} more workers\n")
        
        # Show statistics
        print(f"\n{'='*100}")
        print(f"📈 STATISTICS")
        print(f"{'='*100}\n")
        
        payouts = [c['payout'] for c in created_claims]
        print(f"  Total Claims Created: {len(created_claims)}")
        print(f"  Total Payout Amount: ₹{total_payout:,.2f}")
        print(f"  Min Payout: ₹{min(payouts):,.2f}")
        print(f"  Max Payout: ₹{max(payouts):,.2f}")
        print(f"  Avg Payout: ₹{sum(payouts)/len(payouts):,.2f}")
        
        # Show distribution
        print(f"\n  PAYOUT DISTRIBUTION:")
        ranges = [(0, 2000), (2000, 4000), (4000, 6000), (6000, 8000), (8000, 10000), (10000, 15000)]
        for low, high in ranges:
            count = sum(1 for p in payouts if low <= p < high)
            if count > 0:
                print(f"    ₹{low:,} - ₹{high:,}: {count} workers")
        
        # Show balance updates
        print(f"\n  WALLET BALANCE UPDATES:")
        total_balance_increase = sum(c['new_balance'] - c['old_balance'] for c in created_claims)
        print(f"    Total Balance Increase: ₹{total_balance_increase:,.2f}")
        print(f"    Workers' Wallets Updated: {len(created_claims)}")
        
        print(f"\n{'='*100}\n")
        
        return {
            "status": "SUCCESS",
            "workers_affected": len(affected_workers),
            "claims_created": len(created_claims),
            "total_payout": round(total_payout, 2)
        }
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

def show_admin_view():
    """Show what the admin console will display"""
    db = SessionLocal()
    
    try:
        print(f"\n{'='*100}")
        print(f"👨‍💼 ADMIN CONSOLE - AVAILABLE TRIGGERS")
        print(f"{'='*100}\n")
        
        # Get available locations and workers
        cities = db.query(models.Worker.city).distinct().all()
        city_list = [c[0] for c in cities]
        
        print(f"📍 AVAILABLE LOCATIONS:\n")
        for city in sorted(city_list):
            workers = db.query(models.Worker).filter(models.Worker.city == city).all()
            active_policies = [w for w in workers if db.query(models.Policy).filter(
                models.Policy.worker_id == w.id,
                models.Policy.status == "ACTIVE"
            ).first()]
            
            print(f"  {city}:")
            print(f"    Total Workers: {len(workers)}")
            print(f"    Active Policies: {len(active_policies)}")
        
        print(f"\n🎯 AVAILABLE TRIGGER TYPES:\n")
        triggers = [
            "HEAVY_RAIN_MUMBAI",
            "EXTREME_HEAT_BANGALORE",
            "CIVIC_STRIKE_DELHI",
            "HEAT_WAVE_PUNE",
            "FLOOD_EVENT_HYDERABAD",
            "SMOG_EVENT_DELHI",
            "PLATFORM_OUTAGE_ZOMATO",
            "TRAFFIC_GRIDLOCK_BANGALORE"
        ]
        
        for trigger in triggers:
            print(f"  • {trigger}")
        
        print(f"\n{'='*100}\n")
        
    finally:
        db.close()

if __name__ == "__main__":
    # Show what admin can do
    show_admin_view()
    
    # Simulate triggers
    results = []
    
    # Trigger 1: Heavy Rain in Mumbai
    result1 = trigger_event_simulation(
        location="Mumbai",
        trigger_type="HEAVY_RAIN_MUMBAI",
        description="🌧️ Heavy rainfall >15mm/hour detected"
    )
    results.append(result1)
    
    # Trigger 2: Heat in Bangalore
    result2 = trigger_event_simulation(
        location="Bangalore",
        trigger_type="EXTREME_HEAT_BANGALORE",
        description="🔥 Extreme heat >42°C detected"
    )
    results.append(result2)
    
    # Trigger 3: Civic Strike in Delhi
    result3 = trigger_event_simulation(
        location="Delhi",
        trigger_type="CIVIC_STRIKE_DELHI",
        description="🚨 Civic strike/curfew declared"
    )
    results.append(result3)
    
    # Summary
    print(f"\n{'='*100}")
    print(f"📊 SUMMARY OF ALL TRIGGERS")
    print(f"{'='*100}\n")
    
    total_affected = sum(r['workers_affected'] for r in results)
    total_claims = sum(r['claims_created'] for r in results)
    total_payout = sum(r['total_payout'] for r in results)
    
    print(f"  Total Events Triggered: {len(results)}")
    print(f"  Total Workers Affected: {total_affected}")
    print(f"  Total Claims Created: {total_claims}")
    print(f"  Total Payout: ₹{total_payout:,.2f}")
    
    print(f"\n{'='*100}\n")
