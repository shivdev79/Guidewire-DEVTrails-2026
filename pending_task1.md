# AEGIS: Strategy & Pending Execution Tasks (Guidewire Investor Readiness)

*This document summarizes the strategic pivot to transform the platform into an enterprise-grade insurtech product capable of passing Guidewire’s risk management criteria.*

## 1. Zero-Trust Security & Fraud Engine (Backend)
*Target: Eliminate Moral Hazard & Parametric Exploitation*
- [x] **Hardware Attestation Check**: Implement a mock verification layer to instantly block requests originating from rooted devices or Android Emulators taking advantage of the service.
- [x] **Physics & Trajectory Constraints**: Simulate an accelerometer/gyroscope movement validation to identify and block traditional "fake-GPS" applications.
- [x] **Network Syndicate Validation**: Mock a BSSID mapping check to catch coordinated fraud farms pinging the API from a single network router.

## 2. Macro-Event "Circuit Breaker" (Backend)
*Target: Prevent Balance Sheet Collapse during Correlated Events*
- [x] **Force Majeure Switch**: Build a global `global_event_active` state mechanism within the backend API routing layer.
- [x] **Automated Freeze Logic**: Block all automated trigger payouts when a pandemic, war, or national emergency is active.
- [x] **Investor Audit Trailing**: Return a clean JSON rejection state (`"Status: Rejected - Force Majeure/Macro-Event Exclusion"`) and store it securely to demonstrate to capital backers that extreme tail-risk is mitigated.

## 3. T&C and Legal Consent Modal (Frontend)
*Target: Guarantee Compliance and Platform Authority*
- [x] **Zero-Friction UI Modal**: Implement a clean checkbox dialog inside `src/App.jsx` immediately before policy activation.
- [x] **Define Explicit UI Clauses**:
  - **Telemetry Approval**: Gain legal consent to utilize background sensors.
  - **Force Majeure Restriction**: Acknowledge that payouts are strictly for localized micro-climate disruptions, suspended during national shocks.
  - **Anti-Fraud Penalty**: Highlight immediate forfeiture of the "Resilience Wallet" if spoofing or syndicate farming is detected.
  - **Income-Only Scope**: Clear disclaimer that AEGIS covers lost gig shifts, not medical/vehicular accidents.
- [x] **Enforce Logic**: Block policy creation API calls if the user selects "Decline/Do Not Agree".

## 4. Legally Auditable Ledger (Database)
*Target: Create an immutable record for Guidewire ClaimCenter*
- [x] Update user/policy table schema to save a `terms_accepted_at` timestamp.
- [x] Update ledger logs to explicitly append the `fraud_score` against every FNOL payout.
