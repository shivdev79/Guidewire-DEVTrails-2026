# 📊 CLAIM PAYOUT CALCULATION - UPDATED LOGIC

## ✅ What Changed

**Old Logic (Incorrect)**:
```
Payout = Coverage Amount × 0.5
Example: ₹1500 coverage → ₹750 payout (always)
```

**New Logic (Correct - Weekly Premium Based)**:
```
Payout = Weekly_Premium × Trigger_Severity_Multiplier (capped at ₹500)
Example: 
  - Base tier (₹30/week) + Heavy Rain → ₹30 × 8 = ₹240
  - Pro tier (₹48/week) + Critical AQI → ₹48 × 13 = ₹624 → capped at ₹500
  - Elite tier (₹72/week) + Strike → ₹72 × 11 = ₹792 → capped at ₹500
```

---

## 💰 Pricing Structure

### Weekly Premium (What Customers Pay)
```
Base Tier:    ₹30/week   (adjusted by risk tier: ×0.9 to ×1.5)
Pro Tier:     ₹48/week   (adjusted by risk tier: ×0.9 to ×1.5)
Elite Tier:   ₹72/week   (adjusted by risk tier: ×0.9 to ×1.5)
```

**With Risk Adjustments**:
- Low Risk:    20% discount → ₹24-58/week
- Medium Risk: No change → ₹30-72/week
- High Risk:   30% increase → ₹39-94/week
- Critical:    50% increase → ₹45-108/week

---

## 🎯 Trigger Severity Multipliers

### Payouts Vary by Disruption Type

| Trigger Type | Multiplier | Example (Pro ₹48/week) |
|---|---|---|
| Heavy Rain (>50mm/hr) | 8x | ₹384 |
| Extreme Heat (>44°C) | 9x | ₹432 |
| **Critical AQI (>300)** | **13x** | **₹500 (capped)** |
| **Civic Strike/Curfew** | **11-12x** | **₹500 (capped)** |
| Platform Outage | 8x | ₹384 |
| Flood/Barometric Drop | 9x | ₹432 |

**Why Different Multipliers?**
- More severe disruptions = higher income loss = higher multiplier
- AQI & Civic Strike are most severe → 12-13x
- Rain & Platform issues are moderate → 8-9x

---

## 📈 Real Payout Scenarios

### Scenario 1: Base Tier Worker
- Weekly Premium: ₹30
- Triggers Heavy Rain

```
Calculation:
  Base Multiplier: 8x
  + Variance: ±0.5 to ±1.5
  = 7.5-9.5x
  = ₹225-285 payout
```

### Scenario 2: Pro Tier Worker  
- Weekly Premium: ₹48
- Triggers Critical AQI

```
Calculation:
  Base Multiplier: 13x
  + Variance: ±0.5 to ±1.5
  = 12.5-14.5x
  = ₹600-696 → CAPPED AT ₹500
```

### Scenario 3: Elite Tier Worker
- Weekly Premium: ₹72
- Triggers Civic Strike

```
Calculation:
  Base Multiplier: 11x
  + Variance: ±0.5 to ±1.5
  = 10.5-12.5x
  = ₹756-900 → CAPPED AT ₹500
```

---

## 🔧 Implementation Details

### Files Modified
1. **backend/scheduler.py** - Lines 64-95
   - Updated payout calculation logic
   - Added trigger severity multipliers
   - Added variance for realism
   - Added 500 rupee hard cap

2. **backend/mock_data_generator.py** - Lines 121-155
   - Updated mock claim generation
   - Uses same new calculation formula
   - Ensures test data realistic

### Key Code
```python
# Calculate payout based on WEEKLY PREMIUM × TRIGGER SEVERITY
if status == "APPROVED":
    trigger_multipliers = {
        "Heavy Rain (>50mm/hr)": 8,
        "Critical AQI (>300)": 13,
        "Civic Strike": 11,
        # ... etc
    }
    
    base_multiplier = trigger_multipliers.get(trigger_type, 8)
    multiplier = max(base_multiplier + random.uniform(-0.5, 1.5), 5)
    
    # Payout = weekly_premium × multiplier, capped at 500
    payout = min(weekly_premium * multiplier, 500)
    payout = round(payout / 50) * 50  # Round to nearest 50
```

---

## 📊 System-Wide Impact

### Before (Old Logic)
```
50 claims with ₹1500 coverage
→ Each payout: ₹750
→ Total: ₹37,500

System becomes unsustainable quickly
```

### After (New Logic)
```
50 claims with ₹30-72 weekly premium
→ Payouts: ₹240-500 each
→ Average: ~₹350
→ Total: ~₹17,500

System sustainable, better risk management
```

---

## ✅ Validation

### Test Injecting Heavy Rain Scenario
```bash
# Before fix: All payouts = 50% of coverage (₹750+ each)
# After fix: Payouts scale with weekly premium (₹240-400 range)

curl -X POST http://localhost:8000/demo/activate-scenario \
  -H "Content-Type: application/json" \
  -d '{"scenario": "HEAVY_RAIN"}'

# Wait 90 seconds, then check:
sqlite3 backend/aegis.db "
  SELECT 
    COUNT(*) as claims_count,
    ROUND(AVG(payout_amount), 0) as avg_payout,
    MIN(payout_amount) as min_payout,
    MAX(payout_amount) as max_payout
  FROM claims 
  WHERE trigger_type LIKE '%Rain%' 
    AND created_at > datetime('now', '-2 minutes');
"

# Expected output:
# claims_count | avg_payout | min_payout | max_payout
# 395          | 312        | 200        | 500
```

---

## 💡 Why This Makes Sense

### For Customers
- Pay small weekly premiums (₹30-72)
- Get 8-13x coverage when disaster strikes
- Maximum payout keeps premiums affordable

### For Business
- Premiums stay low (attract customers)
- Payouts capped at ₹500 (control costs)
- Risk-adjusted pricing (high-risk zones pay more)

### For Investors
- Transparent pricing model
- Sustainable economics
- Demonstrable claim calculation logic

---

## 🎯 Next Steps

### Testing
1. ✅ Syntax verified (py_compile passed)
2. ⏳ Test with demo injection (Heavy Rain scenario)
3. ⏳ Verify payouts in Tab 3 (Claims & Payouts)
4. ⏳ Check loss ratio recalculation in Tab 5

### Expected Results After Heavy Rain Injection
```
Tab 3 (Claims):
  ✅ 395 new claims created
  ✅ Payouts: ₹200-500 range (not ₹750+ like before)
  ✅ Average payout: ~₹300-350

Tab 5 (Premium):
  ✅ Loss ratio recalculated with new payouts
  ✅ More sustainable than before

Tab 7 (Triggers):
  ✅ Rain activation count: +8 to +15
```

---

## 🔍 How to Verify This Is Working

### Check Database Query
```bash
sqlite3 backend/aegis.db "
  SELECT 
    trigger_type,
    COUNT(*) as count,
    ROUND(AVG(payout_amount), 2) as avg_payout,
    MAX(payout_amount) as max_payout,
    MIN(payout_amount) as min_payout
  FROM claims
  WHERE trigger_type IS NOT NULL
  GROUP BY trigger_type
  ORDER BY avg_payout DESC;
"

# Output should show:
# trigger_type | count | avg_payout | max_payout | min_payout
# Critical AQI |   12  |  468.75    |    500     |    450
# Civic Strike |   18  |  440.00    |    500     |    400
# Heavy Rain   |   24  |  312.50    |    450     |    250
```

### Check Claims in Admin Console
1. Go to Tab 3 (Claims & Payouts)
2. Scroll the claims table
3. Look at `payout_amount` column
4. Should see range ₹200-500 (not all ₹750)

---

## 📋 Summary

| Aspect | Before | After |
|--------|--------|-------|
| **Calculation** | 50% of coverage | Weekly premium × multiplier |
| **Typical payout** | ₹750 | ₹300-400 |
| **Max payout** | ₹2,500 | ₹500 |
| **Variety** | All same (1500 coverage) | Varies by premium tier |
| **Sustainability** | Poor | Excellent |
| **Logic** | Doesn't reflect actual premium | Matches real business model |

---

**Status**: ✅ Implemented and ready for testing
