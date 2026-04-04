# Admin Portal Implementation Plan - Phase 2 Complete

## Overview
Complete implementation of parametric insurance admin portal with all KPIs, analytics, and controls per specifications.

---

## BACKEND ENDPOINTS TO CREATE

### 1. Premium & Actuarial Engine (`/admin/premium-analytics`)
```
GET /admin/premium-analytics
Returns:
- Weekly premium statistics
- Loss ratio tracking (track if > 85%)
- Expected loss vs actual loss
- Premium pool by city and peril
- Pricing formula breakdown
- Stress testing scenarios
```

### 2. Risk Pool Management (`/admin/risk-pools`)
```
GET /admin/risk-pools
Returns:
- Risk pools separated by city and peril type (Rain/AQI/Heat)
- Active workers per pool
- Historical claims frequency per pool
- Recommended trigger thresholds based on 5-15yr historical data
- Pool liquidity status

GET /admin/risk-pools/{city}/{peril}/triggers
Returns:
- Current trigger thresholds
- Historical activation frequency
- Recommended adjustments
```

### 3. Claims Analytics (`/admin/claims-analytics`)
```
GET /admin/claims-analytics
Returns:
- Claims by status (PENDING, APPROVED, REJECTED)
- Average claim processing time
- Fraud detection results
- Rejection reasons breakdown
- Payout distribution over time
- Network blackout clusters (3-4 simultaneous connections)

GET /admin/claims/{claim_id}/audit-trail
Returns:
- Full claim lifecycle (trigger → fraud check → payout)
- Fraud score breakdown (CNN physics check, Transformer network check)
```

### 4. Fraud Detection Dashboard (`/admin/fraud-intelligence`)
```
GET /admin/fraud-intelligence
Returns:
- Spatial anomalies detected (teleportation events)
- Temporal anomalies (same BSSID, battery thermal)
- Coordinated fraud rings detected
- Hardware attestation failures
- Network topology overlaps
```

### 5. Trigger Engine Configuration (`/admin/trigger-config`)
```
GET /admin/trigger-config
Returns:
- All active triggers per city
- Trigger activation counts (daily/weekly)
- False positive rates
- Trigger calibration recommendations

POST /admin/trigger-config/{trigger_id}/adjust
Body:
- New threshold value
- City/peril type
- Effective date
```

### 6. Liquidity Pool Dashboard (`/admin/liquidity`)
```
GET /admin/liquidity
Returns:
- Current pool balance by city/peril
- Total premiums collected (weekly)
- Total payouts distributed
- Loss ratio calculation
- Runway forecast (days of payouts at current burn rate)
- Fail-safe status (halt enrollments if loss ratio > 85%)
```

### 7. Worker Onboarding & Warranties (`/admin/workers`)
```
GET /admin/workers
Returns:
- Total registered workers
- Coverage status (active/inactive)
- Activity warranty compliance (min 7 active delivery days)
- Resilience score distribution
- Platform distribution

GET /admin/workers/{worker_id}/warranty-check
Returns:
- Activity warranty status
- Days until policy eligible
- Moral hazard risk score
```

### 8. Geofence & Tiered Recovery (`/admin/geofence`)
```
GET /admin/geofence/{city}
Returns:
- Geofence mapping
- Recovery tier classification (Tier 1-4)
- Expected recovery times per tier
- Payout tier adjustments

GET /admin/geofence/{city}/{geohash}/cluster-analysis
Returns:
- Workers in cluster
- Network connectivity status
- Temperature anomalies
- Velocity clustering (DBSCAN results)
```

### 9. Network Blackout Detection (`/admin/network-blackouts`)
```
GET /admin/network-blackouts
Returns:
- Active blackout zones
- Affected worker clusters
- Duration of outage
- Payout processing override status
```

### 10. System Health & KPIs (`/admin/system-health`)
```
GET /admin/system-health
Returns:
- P99 decision latency
- API uptime percentage
- Database connection status
- Kafka consumer lag
- AI model inference times (CNN, Transformer, LSTM)
- Queue depths for pending claims
```

---

## FRONTEND ADMIN PORTAL ENHANCEMENTS

### Tab 1: Overview
- Active KPIs: Riders, Risk Level, Claims, Payouts, Fraud %, Decision Time
- Real-time map with risk zones
- Event stream terminal
- Claims vs Time chart

### Tab 2: Risk Intelligence (ENHANCED)
- Geographic risk mapping by city/peril
- Geohash risk scoring
- Isolation Forest anomalies
- Safe zone redirection suggestions
- Cluster velocity analysis (DBSCAN)

### Tab 3: Claims & Payouts (ENHANCED)
- Claim lifecycle visualization
- Fraud check results per claim
- Payout execution audit trail
- Network blackout detection
- Tiered recovery time adjustments by geography

### Tab 4: Fraud Intelligence (ENHANCED)
- Spatial CNN results (teleportation events)
- Temporal Transformer results (BSSID clusters)
- Battery thermal analysis
- Barometric altitude checks
- Hardware attestation blocklist

### Tab 5: Premium & Actuarial (KEY)
**Most critical for Phase 2:**
- Premium formula breakdown: E(L) × (1+λ) + γ - R_score×β - W_credit
- Expected Loss visualization (by pool)
- Loss Ratio tracking (red alert if > 85%)
- Weekly premium statistics by tier/city
- Stress test scenarios (14-day monsoon, multi-city impact)
- Pricing calibration recommendations

### Tab 6: User Behavior
- R_score distribution
- Wallet balance trends
- Activity warranty compliance rate
- Moral hazard risk indicators

### Tab 7: Trigger Engine (ENHANCED)
- All trigger thresholds by city/peril
- Activation frequency heatmap
- False positive analysis
- Trigger calibration interface
- Recommended threshold adjustments

### Tab 8: AI Model Monitoring
- CNN physics validation accuracy
- Transformer attention patterns
- LSTM revenue forecasting vs actual
- Model inference latency
- Retraining schedules

### Tab 9: System Health
- P99 latency graph
- Uptime percentage donut chart
- Database/Kafka status
- AI inference times
- Queue depths

### Tab 10: Financial Control (KEY)
**Most critical for Phase 2:**
- Liquidity pool status by city/peril
- Current balance vs minimum threshold
- Fail-safe triggers (stop enrollments if loss ratio > 85%)
- Cash flow projections
- Reserve adequacy

### Tab 11: Security & Device
- Device attestation blocks
- Rooted device detections
- Emulator usage flags
- GPS spoofing detections

### Tab 12: Event Stream
- Real-time Kafka event visualization
- Filtered by severity/type
- Searchable event log

### Tab 13: Decision Engine
- Explainable AI decision trees
- Lock 1 & Lock 2 validation status
- Payout approval/rejection reasons
- Manual override audit trail

---

## IMPLEMENTATION PRIORITY

### Phase 2a (Critical):
1. Premium & Actuarial tab with loss ratio monitoring
2. Financial Control with liquidity pool status
3. Claims Analytics with fraud detection results
4. Trigger Engine configuration interface

### Phase 2b (Important):
5. Risk Pool management by city/peril
6. Network blackout detection and override
7. Worker warranty compliance tracking
8. Geofence & tiered recovery pricing

### Phase 2c (Nice-to-have):
9. AI model monitoring dashboard
10. Event stream visualization
11. System health metrics

---

## DATABASE QUERIES NEEDED

All admin endpoints will require:
- Aggregation of claims by city/peril
- Time-series data (daily/weekly aggregations)
- Geospatial clustering (DBSCAN pre-computed)
- Fraud score distributions
- Premium calculations by worker tier/city

---

## SUCCESS CRITERIA FOR JUDGES

✅ Executable admin portal with real data
✅ Loss ratio tracking and fail-safe mechanism
✅ Risk pool separation by city/peril
✅ Fraud detection visualization
✅ Liquidity monitoring with runway forecast
✅ Trigger threshold management interface
✅ Full claims audit trail (trigger → fraud check → payout)
✅ Network blackout cluster detection
✅ Tiered payout adjustments visualized
✅ Stress testing scenario results

---

## Configuration for Judges

All admin endpoints will serve demo data:
- Multiple cities (Delhi, Mumbai, Bangalore)
- Multiple perils (Rain, AQI, Heat, Strike)
- Historical data spanning 7+ days of simulations
- Fraud examples (spatial anomalies, BSSID matches, thermal signatures)
