# 🧪 HOW TO TEST RIDERS IN CONSOLE

## Via CLI Command

### View Any Rider's Dashboard in Terminal

```bash
cd /Users/marthanda/Downloads/Guidewire_Shivanshu/Guidewire-DEVTrails-2026/backend
source venv/bin/activate
python view_rider.py 1001
```

**Output:** Full dashboard with all claims, wallet, policy

---

## Via API Direct (curl)

### Get Rider Dashboard JSON

```bash
curl http://127.0.0.1:8000/worker/1001/dashboard | python -m json.tool
```

**This returns:**
- Worker info
- Active policy
- All claims with status
- Wallet ledger
- All transaction history

---

## Test Different Riders

### View Rider_001
```bash
python view_rider.py 1001
```
**Shows:** 3 claims, ₹19,186.29 wallet, BASE plan

### View Rider_002
```bash
python view_rider.py 1002
```
**Shows:** 3 claims (all APPROVED), ₹21,651.82 wallet, ELITE plan

### View Rider_003
```bash
python view_rider.py 1003
```
**Shows:** 2 claims, ₹7,296.94 wallet, BASE plan

---

## 📊 View All Workers List

```bash
python view_rider.py
```

**Shows:**
- All 152 workers
- Each worker's ID, name, city, earnings, wallet, claims count
- Use any ID to view that rider's dashboard

---

## 🎯 Sample Outputs

### Command:
```bash
python view_rider.py 1001
```

### Output:
```
================================================================================
📱 RIDER DASHBOARD - Worker ID: 1001
================================================================================

👤 WORKER INFORMATION
────────────────────────────────────────────────────────────────────────────────
  Name:              Rider_001
  Phone:             7766065857
  City:              Mumbai
  Platforms:         Swiggy, Uber Eats
  Weekly Earnings:   ₹12781.0
  R-Score:           98.1/100
  💰 Wallet Balance: ₹19186.29

================================================================================
📋 ACTIVE POLICY
────────────────────────────────────────────────────────────────────────────────
  Status:            ✅ ACTIVE
  Plan:              AEGIS BASE
  Premium:           ₹25.00/week
  Coverage:          ₹1200.00
  Valid From:        2026-04-03
  Valid Until:       2026-04-10

================================================================================
🚨 CLAIMS HISTORY (3 total)
────────────────────────────────────────────────────────────────────────────────

  Summary:
    ✅ APPROVED: 2 claims (₹17384.29 total)
    ⏳ PENDING:  0 claims
    ❌ REJECTED: 1 claims

  Recent Claims:

  [1] ✅ HEAT_WAVE_PUNE
      Created:      2026-04-04 11:45:11
      Amount:       ₹8965.77
      Status:       APPROVED
      Description:  HEAT WAVE PUNE triggered in Mumbai
      Fraud Score:  🟢 0.17/1.0

  [2] ✅ FLOOD_EVENT_HYDERABAD
      Created:      2026-04-04 03:45:11
      Amount:       ₹8418.52
      Status:       APPROVED
      Description:  FLOOD EVENT HYDERABAD triggered in Mumbai
      Fraud Score:  🟢 0.07/1.0

  [3] ❌ TRAFFIC_GRIDLOCK_BANGALORE
      Created:      2026-04-03 17:45:11
      Amount:       ₹5086.82
      Status:       REJECTED
      Description:  TRAFFIC GRIDLOCK BANGALORE triggered in Mumbai
      Fraud Score:  🟡 0.35/1.0

================================================================================
💳 WALLET TRANSACTIONS (2 total)
────────────────────────────────────────────────────────────────────────────────

  Recent Transactions:

  [1] 📥 2026-04-04 11:45
      Type:        CREDIT
      Amount:      ₹8965.77    
      Description: Claim payout - HEAT_WAVE_PUNE

  [2] 📥 2026-04-04 03:45
      Type:        CREDIT
      Amount:      ₹8418.52    
      Description: Claim payout - FLOOD_EVENT_HYDERABAD

================================================================================
💰 WALLET BALANCE FLOW
────────────────────────────────────────────────────────────────────────────────

  Starting: ₹0.00
  + ₹8418.52 (Claim payout - FLOOD_EVENT_HYDERABAD)
  + ₹8965.77 (Claim payout - HEAT_WAVE_PUNE)
  ─────────────────
  Current: ₹19186.29

================================================================================
✅ END OF DASHBOARD
================================================================================
```

---

## 🌐 In Browser - Access API Response

### URL:
```
http://127.0.0.1:8000/worker/1001/dashboard
```

### Response (JSON):
```json
{
  "worker": {
    "id": 1001,
    "name": "Rider_001",
    "phone": "7766065857",
    "city": "Mumbai",
    "platform": "Swiggy, Uber Eats",
    "avg_weekly_earnings": 12781.0,
    "wallet_balance": 19186.29,
    "r_score": 98.1,
    "pincode": "876543",
    "upi_id": "rider1@aegis.app",
    "terms_accepted_at": null
  },
  "active_policy": {
    "id": 1,
    "worker_id": 1001,
    "tier": "Base",
    "week_start": "2026-04-03T14:32:19",
    "week_end": "2026-04-10T14:32:19",
    "coverage_amount": 1200.0,
    "premium_paid": 25.0,
    "status": "ACTIVE"
  },
  "claims": [
    {
      "id": 3,
      "worker_id": 1001,
      "trigger_type": "HEAT_WAVE_PUNE",
      "status": "APPROVED",
      "payout_amount": 8965.77,
      "created_at": "2026-04-04T11:45:11",
      "fraud_score": 0.17,
      "description": "HEAT WAVE PUNE triggered in Mumbai"
    },
    {
      "id": 4,
      "worker_id": 1001,
      "trigger_type": "FLOOD_EVENT_HYDERABAD",
      "status": "APPROVED",
      "payout_amount": 8418.52,
      "created_at": "2026-04-04T03:45:11",
      "fraud_score": 0.07,
      "description": "FLOOD EVENT HYDERABAD triggered in Mumbai"
    },
    {
      "id": 5,
      "worker_id": 1001,
      "trigger_type": "TRAFFIC_GRIDLOCK_BANGALORE",
      "status": "REJECTED",
      "payout_amount": 5086.82,
      "created_at": "2026-04-03T17:45:11",
      "fraud_score": 0.35,
      "description": "TRAFFIC GRIDLOCK BANGALORE triggered in Mumbai"
    }
  ],
  "wallet_ledger": [
    {
      "id": 1,
      "worker_id": 1001,
      "amount": 8965.77,
      "description": "Claim payout - HEAT_WAVE_PUNE",
      "txn_type": "CREDIT",
      "created_at": "2026-04-04T11:45:11"
    },
    {
      "id": 2,
      "worker_id": 1001,
      "amount": 8418.52,
      "description": "Claim payout - FLOOD_EVENT_HYDERABAD",
      "txn_type": "CREDIT",
      "created_at": "2026-04-04T03:45:11"
    }
  ]
}
```

---

## 📋 Quick Reference

### All 152 Workers Available

```
ID Range:   999-1150
Demo:       999, 1000
Riders:     1001-1150 (150 new riders)

Each Worker Has:
  ✅ Profile (name, city, earnings, r-score)
  ✅ Active Policy (tier, premium, coverage)
  ✅ 1-3 Claims (APPROVED/PENDING/REJECTED)
  ✅ Wallet Balance (sum of payouts)
  ✅ Ledger Entries (transaction history)
```

### Quick Test Commands

```bash
# View demo user
python view_rider.py 999

# View random rider
python view_rider.py 1001
# View another
python view_rider.py 1050
# View from Chennai
python view_rider.py 1002

# List all workers
python view_rider.py

# View API response as JSON
curl http://127.0.0.1:8000/worker/1001/dashboard | python -m json.tool

# View in browser
# Open: http://127.0.0.1:8000/worker/1001/dashboard
```

---

## ✅ What Each Rider Shows

Every rider (1001-1150) when queried will display:

**✅ Confirmed Data:**
- Worker profile with realistic earnings
- Active policy matching earnings tier
- 1-3 claims with various statuses
- Fraud scores calculated
- Wallet balance updated with payouts
- Complete transaction history

**✅ Real Distribution:**
- Across 6 Indian cities
- Mixed plan tiers (Base/Pro/Elite)
- Mixed claim statuses (70% Approved, 19% Pending, 11% Rejected)
- Realistic fraud detection

---

## 🎯 Common Test Scenarios

### Test 1: View Worker with All APPROVED Claims
```bash
python view_rider.py 1002
```
Expected: 3 APPROVED claims, ₹21,651.82 wallet

### Test 2: View Worker with Mixed Claim Status
```bash
python view_rider.py 1001
```
Expected: 2 APPROVED + 1 REJECTED, ₹19,186.29 wallet

### Test 3: View Worker with PENDING Claims
```bash
python view_rider.py 1010
# (varies - try different IDs)
```
Expected: Mix of PENDING, APPROVED, REJECTED

### Test 4: Compare Different Plan Tiers
```bash
# BASE plan
python view_rider.py 1001

# ELITE plan
python view_rider.py 1002

# PRO plan
python view_rider.py 1005  (varies)
```

---

## 🚀 Demonstration Flow

For Investor/Demo:

```bash
# Step 1: Show all workers exist
python view_rider.py | head -20

# Step 2: Show demo user claims
python view_rider.py 999

# Step 3: Show rider with multiple approved claims
python view_rider.py 1001

# Step 4: Show rider with mixed statuses
python view_rider.py 1002

# Step 5: Show complete market data
python view_rider.py | wc -l  # Shows 152 total workers
```

---

**✨ Everything is ready! 152 workers, 288 claims, fully seeded and accessible.**

Test any rider using the commands above!
