#!/usr/bin/env python3
"""
Test script: Verify worker claim history instant triggers are working
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_workflow():
    print("\n" + "="*70)
    print("🧪 TESTING WORKER CLAIM HISTORY INSTANT TRIGGERS")
    print("="*70)
    
    worker_id = 1
    
    # Step 1: Create policy
    print(f"\n1️⃣  Creating Pro policy for worker {worker_id}...")
    policy_resp = requests.post(
        f"{BASE_URL}/create-policy",
        json={
            "worker_id": worker_id,
            "tier": "Pro",
            "accepted_terms": True
        }
    )
    
    if policy_resp.status_code != 200:
        print(f"   ❌ Policy creation FAILED: {policy_resp.text}")
        return False
    else:
        policy_data = policy_resp.json()
        print(f"   ✅ Policy created! Premium: ₹{policy_data.get('premium_paid', 'N/A')}")
    
    # Step 2: Get dashboard BEFORE triggers
    print(f"\n2️⃣  Loading worker dashboard BEFORE triggers...")
    dash_resp_before = requests.get(f"{BASE_URL}/worker/{worker_id}/dashboard")
    if dash_resp_before.status_code == 200:
        dashboard_before = dash_resp_before.json()
        claims_before = dashboard_before.get('claims', [])
        print(f"   Claims before trigger: {len(claims_before)}")
        for c in claims_before:
            print(f"     - {c.get('trigger_type')}: ₹{c.get('payout_amount')}")
    
    # Step 3: Trigger Heavy Rain
    print(f"\n3️⃣  Triggering Heavy Rain demo endpoint...")
    rain_resp = requests.post(f"{BASE_URL}/demo/trigger-heavy-rain/{worker_id}")
    
    if rain_resp.status_code != 200:
        print(f"   ❌ Rain trigger FAILED: {rain_resp.text}")
        return False
    else:
        rain_data = rain_resp.json()
        payout = rain_data.get('claim', {}).get('payout_amount', 'N/A')
        print(f"   ✅ Heavy Rain claim created! Payout: ₹{payout}")
        print(f"   Response: {json.dumps(rain_data, indent=2)}")
    
    # Step 4: Get dashboard AFTER trigger
    print(f"\n4️⃣  Loading worker dashboard AFTER trigger...")
    time.sleep(0.5)  # Small delay for DB commit
    dash_resp_after = requests.get(f"{BASE_URL}/worker/{worker_id}/dashboard")
    if dash_resp_after.status_code == 200:
        dashboard_after = dash_resp_after.json()
        claims_after = dashboard_after.get('claims', [])
        print(f"   Claims after trigger: {len(claims_after)}")
        for c in claims_after:
            status = c.get('status', 'N/A')
            trigger = c.get('trigger_type', 'N/A')
            payout = c.get('payout_amount', 'N/A')
            print(f"     - {trigger}: ₹{payout} [{status}]")
        
        # Verify new claim appeared
        if len(claims_after) > len(claims_before):
            print(f"   ✅ NEW CLAIM DETECTED! ({len(claims_after) - len(claims_before)} new claim(s))")
        else:
            print(f"   ⚠️  No new claims in dashboard")
    
    # Step 5: Trigger Extreme Heat
    print(f"\n5️⃣  Triggering Extreme Heat demo endpoint...")
    heat_resp = requests.post(f"{BASE_URL}/demo/trigger-extreme-heat/{worker_id}")
    
    if heat_resp.status_code != 200:
        print(f"   ❌ Heat trigger FAILED: {heat_resp.text}")
    else:
        heat_data = heat_resp.json()
        payout = heat_data.get('claim', {}).get('payout_amount', 'N/A')
        print(f"   ✅ Extreme Heat claim created! Payout: ₹{payout}")
    
    # Step 6: Trigger Civic Strike  
    print(f"\n6️⃣  Triggering Civic Strike demo endpoint...")
    strike_resp = requests.post(f"{BASE_URL}/demo/trigger-civic-strike/{worker_id}")
    
    if strike_resp.status_code != 200:
        print(f"   ❌ Strike trigger FAILED: {strike_resp.text}")
    else:
        strike_data = strike_resp.json()
        payout = strike_data.get('claim', {}).get('payout_amount', 'N/A')
        print(f"   ✅ Civic Strike claim created! Payout: ₹{payout}")
    
    # Step 7: Final dashboard
    print(f"\n7️⃣  Final worker dashboard...")
    time.sleep(0.5)
    dash_resp_final = requests.get(f"{BASE_URL}/worker/{worker_id}/dashboard")
    if dash_resp_final.status_code == 200:
        dashboard_final = dash_resp_final.json()
        claims_final = dashboard_final.get('claims', [])
        print(f"   📊 FINAL CLAIMS: {len(claims_final)}")
        for c in claims_final[:10]:  # Show up to 10
            status = c.get('status', 'N/A')
            trigger = c.get('trigger_type', 'N/A')
            payout = c.get('payout_amount', 'N/A')
            created = c.get('created_at', 'N/A')
            print(f"     #{c.get('id')}: {trigger} | ₹{payout} | {status}")
    
    print("\n" + "="*70)
    print("✅ TEST COMPLETE!")
    print("="*70)
    print("\n🎯 NEXT STEPS:")
    print("   1. Open browser: http://localhost:5174")
    print("   2. Click 'Authenticate' (Worker ID 1)")
    print("   3. Go to 'Claim History' tab")
    print("   4. Should see the 3 claims we just created")
    print("   5. Click 'Trigger Rain/Heat/Strike' buttons")
    print("   6. Verify new claims appear instantly")
    print()

if __name__ == "__main__":
    test_workflow()
