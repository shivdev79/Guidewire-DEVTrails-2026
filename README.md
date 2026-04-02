# 🛡️ AEGIS: Zero-Trust Parametric Income Protection & Resilience Fintech

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![Phase](https://img.shields.io/badge/DEVTrails_2026-Phase_1-blue)](#)
[![Tech Stack](https://img.shields.io/badge/Stack-React_Native_%7C_FastAPI_%7C_Kafka-orange)](#)
[![Guidewire Integration](https://img.shields.io/badge/Guidewire-HazardHub_%7C_ClaimCenter-00A9E0)](#)

> **Mission Statement:** To architect a highly scalable, fraud-resistant "Income-as-a-Service" platform for India’s 15 million gig workers. Aura Guard provides a guaranteed weekly financial floor against environmental and social disruptions, utilizing multi-modal AI, zero-touch parametric claim automation, and behavioral micro-savings.

---

## 📑 Executive Summary
India's gig economy operates on razor-thin margins. When external disruptions (monsoons, extreme heat, civic strikes, or platform crashes) occur, workers lose a massive percentage of their weekly income. Traditional insurance fails here due to **Basis Risk** (paying out when no local loss occurred), **Adverse Selection** (fraud rings), and **The Sunk-Cost Fallacy** (workers cancelling policies because they feel cheated if the weather remains clear).

**Aura Guard** solves all three. We are not just building an insurance product; we are building a **High-Yield Resilience Asset**. By combining Guidewire's enterprise Cloud APIs with a hyper-local AI fraud engine and a gamified "Resilience Wallet," we mathematically align the worker's financial success with our platform's profitability.

<img width="975" height="759" alt="image" src="https://github.com/user-attachments/assets/224d9273-17a7-4829-96c4-a435597c1447" />

---

## 🚨 URGENT: Adversarial Defense & Anti-Spoofing Strategy
*In response to the Phase 1 Market Shift / Syndicate Threat Report.*

Parametric platforms are prime targets for coordinated fraud rings using advanced GPS-spoofing to simulate being trapped in "Red Alert" zones. Basic GPS verification is obsolete. Aura Guard treats the worker's smartphone as a multi-modal IoT sensor to deploy a **Zero-Trust Parametric Engine**.

### 1. The Differentiation: AI/ML Physics & Trajectory Validation
To differentiate between a genuinely stranded partner and a bad actor sitting at home, our **Hybrid CNN-Transformer Model** validates the *physics* of the claim:
* **The Physics Check (Micro-Movements):** A genuine rider stuck in a flood or gridlock makes micro-movements (shifting on the bike, walking). A spoofed phone running a fake-GPS script sits perfectly flat on a table. Our AI analyzes the native accelerometer/gyroscope for these 0-axis anomalies.
* **The Trajectory Check (Spatial CNN):** If a rider's GPS pings jump across the city in seconds exactly as a storm cell hits, the CNN flags the impossible spatial geometry as a "Teleportation Event."

### 2. The Data: Crushing Coordinated Fraud Rings
If syndicates organize via Telegram to drain the liquidity pool, GPS coordinates won't catch them. Our Temporal Transformer analyzes deeply embedded network and hardware telemetry:
* **BSSID & Cell Tower Clustering:** Are multiple "stranded" riders allegedly spread across a wide flooded zone all pinging the exact same Wi-Fi router MAC address (BSSID)? If network topology overlaps perfectly, it is a coordinated fraud farm.
* **Battery Thermal Signatures:** Phones running emulators and Fake-GPS apps indoors run hot. Riders trapped outside in a monsoon experience dropping battery temperatures. We cross-reference device thermals with ambient Open-Meteo data.
* **Barometric/Altitude Checks:** If a rider claims to be in a flooded underpass, but their device barometer registers an altitude matching a high-rise apartment, the claim is rejected.
* **Hardware Attestation:** Google Play Integrity API blocks claims originating from rooted devices or Android emulators.

### 3. The UX Balance: The Asynchronous Trust Protocol
We must never penalize an honest delivery partner who loses cell signal during a severe cyclone. If a claim is flagged strictly due to a network drop, we invoke the **Asynchronous Trust Protocol**:
* **Encrypted Local Caching:** During a network blackout, the React Native app caches the accelerometer and barometer data securely in local SQLite. 
* **Seamless Reconciliation:** When the rider reaches a Wi-Fi zone, the payload is uploaded. We ping the Gig Platform API via webhook to verify the specific sector's tower outage.
* **Empathetic UX:** We never show "Fraud Detected" to the user. The UI displays: *"Hold tight! Verifying network drop with your platform. Payout pending."*


![WhatsApp Image 2026-03-20 at 02 00 42](https://github.com/user-attachments/assets/b9102567-1845-4d53-acf5-7500905a7cf2)

---

## 💎 The Actuarial Engine: A "God-Level" Fintech Ecosystem

The biggest flaw in gig-worker insurance is psychological: workers hate paying for something they don't use. Aura Guard transforms the weekly premium from a *sunk cost* into a **wealth-building asset** using 4 behavioral pillars:

1. **The "Resilience Wallet" (Micro-Savings):** A portion of every premium funds the worker's personal "Resilience Wallet." If a worker maintains a claim-free streak, their accumulated wallet balance automatically pays for their next premium, unlocking a **"Free Coverage Week."**
2. **The Predictive "Risk Rebate":** If our AI overprices the weekly risk on Sunday (e.g., predicting a severe storm), but the storm misses the city by Wednesday, we issue an **instant partial rebate** directly back to the worker's UPI. 
3. **Dynamic "Income Floors":** Workers use a UI slider to select their desired "Protected Income Target" (Base, Pro, or Elite). The AI dynamically calculates the exact, risk-adjusted margin for their chosen tier.
4. **The "Safe-Zone Yield":** If the AI detects a localized flood forming, it sends a "Safe Zone Nudge". If the worker obeys and avoids the hazard, their `R_score` (Resilience Score) increases, yielding a direct discount on their next weekly premium.

![WhatsApp Image 2026-03-20 at 17 21 03](https://github.com/user-attachments/assets/c9b38200-a326-4f33-b970-297adf4236a0)


### 🧮 The Advanced Weekly Pricing Formula ($P_{w}$)
Pricing is recalculated dynamically every Sunday night:
> **`Pw = max( [E(L) * (1 + λ)] + γ - (R_score * β) - W_credit , P_floor )`**

* **$E(L)$**: Expected Loss (Calculated via **Guidewire HazardHub** base risk × LSTM 7-day forecast multiplier).
* **$\lambda$**: Systemic Risk Margin (Liquidity buffer for black-swan events).
* **$\gamma$**: Base OpEx (Fixed API/gateway processing fee).
* **$R_{score}$**: Safe-Zone Yield Discount (Behavioral safety modifier).
* **$W_{credit}$**: Resilience Wallet Credit (Absorbs premium cost for claim-free streaks).
* **$P_{floor}$**: Absolute Minimum Premium (Maintains legal contract/server costs).

---

## 🧠 Risk profiling using relevant AI/ML (The Core Engine)

The Intelligence & Decision Layer is the algorithmic heart of Aura Guard. It transforms raw, high-frequency telemetry into instantaneous, zero-touch financial decisions. By orchestrating five specialized engines—spanning deep learning, NLP, and deterministic rule-sets—this layer eliminates **Basis Risk** (paying for phantom losses) and neutralizes **Adversarial Fraud**, executing verified payouts in under 50 milliseconds.

### 🌩️ 1. Risk Prediction Engine (Proactive Mitigation)
Traditional insurance is reactive; Aura Guard is predictive. This engine forecasts environmental and infrastructural disruptions before they impact the gig worker, shifting the platform from a reactive safety net to a proactive risk manager.
* **Applied Models:** XGBoost Classifier & Isolation Forest.
* **Algorithmic Rationale:** XGBoost efficiently processes high-dimensional tabular data (Open-Meteo forecasts, `waqi.org` pollution trajectories, Google Traffic density) to predict the severity of a disruption. The Isolation Forest algorithm identifies statistical anomalies in historical climate baselines, ensuring alerts are not triggered for standard seasonal weather.
* **Business Execution (Safe-Zone Bounties):** If the model predicts a localized flash flood forming in 45 minutes, it pushes a "Safe Zone Nudge" to the rider. Relocating prevents the insurance claim entirely and rewards the worker with a higher `Resilience Score`.

### 💰 2. Premium Engine (Dynamic Actuarial Pricing)
The Premium Engine replaces the "black box" of traditional static underwriting with a highly transparent, dynamic pricing pipeline executed every Sunday at 23:59 IST.
* **Applied Model:** Long Short-Term Memory (LSTM) Networks.
* **Algorithmic Rationale:** LSTMs excel at time-series forecasting. Because gig worker earnings and micro-climate weather patterns are highly sequential, the LSTM analyzes the rider's 4-week moving average of earnings against the upcoming 7-day weather forecast to predict exact income volatility.
* **Business Execution:** Computes the Expected Loss $E(L)$ against **Guidewire HazardHub’s** base climate risk. This engine powers our "God-Level" Fintech features: automatically allocating 20% of the premium to the worker's *Resilience Wallet* and triggering mid-week *Risk Rebates* if predicted severe weather fails to materialize.

### 🚨 3. Zero-Trust Fraud Detection Engine (The Moat)
This is Aura Guard’s primary defense against adversarial syndicates and GPS-spoofing farms. It treats the smartphone as a multi-modal IoT sensor to evaluate the physical feasibility and network topology of every claim.
* **Applied Models:** Hybrid Spatial CNN & Temporal Transformer.
* **Algorithmic Rationale:** * **Spatial CNN (Physics Check):** Analyzes the 2D spatial trajectory and native accelerometer data. If a rider's GPS jumps 15km in 3 seconds, or registers 0-axis movement during an "active" ride, the CNN flags the impossible geometry as a "Teleportation Event."
  * **Temporal Transformer (Syndicate Check):** If 50 riders simultaneously trigger claims from identical Wi-Fi MAC addresses (BSSID) while battery thermals indicate indoor emulator usage, the Transformer's attention mechanism flags the coordinated fraud farm.
* **Hardware Attestation:** Cryptographically bypasses OS-level tampering by utilizing the **Google Play Integrity API** to block rooted devices.

### ⚙️ 4. Parametric Trigger Engine (Double-Lock Validation)
To comply strictly with the DEVTrails mandate of insuring *Loss of Income* (not merely weather events), the Trigger Engine operates on a deterministic **Double-Lock Validation** framework. A payout is never triggered unless both locks are opened.
* **Applied Models:** DistilBERT (NLP) & DBSCAN (Spatiotemporal Clustering).
* **Lock 1: The Objective Disruption (The "What"):** Monitors APIs for hard environmental thresholds (e.g., Rainfall > 20mm/hr). For unstructured social disruptions (unannounced civic strikes/curfews), a fine-tuned **DistilBERT NLP Classifier** parses local news and police tweets via Named Entity Recognition (NER), dynamically drawing a "Red Blockade Polygon" over the map.
* **Lock 2: Operational Impairment (Proof of Loss):** Proves the disruption actually stopped the worker from earning. **DBSCAN** clusters the real-time velocity of active riders in the red zone. If the cluster speed drops below 5 km/h (severe gridlock) while gig platform APIs report an 80% drop in active orders, Lock 2 opens.

### 🎯 5. Decision Engine (The Consensus Orchestrator)
The Decision Engine is the final, high-speed orchestration unit. It acts as the ultimate gatekeeper between the telemetry layer and the financial ledger.
* **Applied Logic:** Deterministic Ensemble Logic & Guidewire REST APIs.
* **Algorithmic Rationale:** Financial ledgers require 100% explainability. The orchestration layer eschews black-box ML guesses in favor of deterministic consensus. It evaluates the outputs: *Is Lock 1 Open? AND Is Lock 2 Open? AND is the Fraud Score > 0.98?*
* **Business Execution:** Once consensus is reached, the engine executes a secure server-to-server API call directly to **Guidewire ClaimCenter**. It generates a "Silent FNOL" (First Notice of Loss), updates the policy ledger, and triggers the Razorpay webhook for an instant, sub-90-second UPI payout to the rider.

<img width="975" height="532" alt="image" src="https://github.com/user-attachments/assets/3947f5cc-a517-4243-b4c1-1b2183d6fe68" />

Multi-Modal Data Fusion and Machine Learning Pipeline for Real-Time Risk Assessment and Automated Decisioning

![WhatsApp Image 2026-03-20 at 02 38 34](https://github.com/user-attachments/assets/e0148513-315b-443d-bb3c-05f2715157be)


## 👤 Target Persona & Edge-Case Workflows

**Persona:** Rajesh, 26. Q-Commerce Delivery Partner (Zepto/Swiggy Instamart) in Chennai, Tamil Nadu. Operates in hyper-local 2-3km radii.

* **Scenario A: The Basis Risk Trap (Claim Rejected).** Heavy rain hits Chennai South. Rajesh is in Chennai North (dry zone). Standard models pay out blindly. *Aura Guard's 2km-radius geofencing ensures our liquidity pool isn't drained on false regional triggers.*
* **Scenario B: Unplanned Civic Strike (Claim Approved).** An unannounced local strike blocks Rajesh from his dark store. The AI parses local police tweets (NLP), draws a geofenced "Red Polygon," verifies Rajesh is stuck at the boundary, and issues a zero-touch payout.
* **Scenario C: Platform Server Down (Claim Approved).** The weather is perfect, but Zepto's AWS servers crash for 3 hours. Aura Guard ingests the platform webhook. If telemetry confirms Rajesh is active and waiting on the road, we pay him for the lost shift. We insure the gig, not just the weather.

![WhatsApp Image 2026-03-20 at 02 15 53](https://github.com/user-attachments/assets/b0a16b06-03d3-430f-a5b6-7d244cffe184)

---

## 🕵️♂️ The Zero-Trust Fraud Detection Engine (The Moat)

Parametric insurance platforms are prime targets for coordinated fraud rings. Bad actors use advanced GPS-spoofing applications, Android emulators, and Telegram-coordinated "claim farms" to fake their locations and drain liquidity pools during weather alerts. 

Basic GPS coordinate verification is obsolete. Aura Guard treats the delivery partner's smartphone as a *Multi-Modal IoT Sensor*, processing physical and network telemetry through a dual-layered AI architecture in under 50 milliseconds.

### 1. Spatial CNN: The "Physics & Trajectory" Validator
To differentiate between a genuinely stranded partner and a bad actor spoofing their location, our Convolutional Neural Network (CNN) validates the physics of the claim:
* *The Teleportation Check:* If a rider's GPS pings jump 15km across the city in 3 seconds exactly as a storm cell hits, the CNN flags the impossible spatial geometry as a "Teleportation Event."
* *Micro-Movement Heuristics:* A genuine rider stuck in a flood or gridlock is still making micro-movements (shifting on the bike, walking). A spoofed phone running a fake-GPS script usually sits perfectly flat on a table. The AI analyzes the native accelerometer and gyroscope for these 0-axis anomalies.

### 2. Temporal Transformer: The "Syndicate Farm" Validator
If 500 riders form a syndicate to simulate a mass-stranding event, GPS tracking won't catch them. Our Temporal Transformer analyzes deeply embedded network context to catch coordinated attacks:
* *BSSID & Network Topology Clustering:* Are 50 "stranded" riders allegedly spread across a 5km flooded zone all pinging the exact same Wi-Fi router MAC address (BSSID)? If network topology overlaps perfectly, the Transformer flags a coordinated fraud farm.
* *Thermal Anomalies:* Phones running emulators and Fake-GPS apps indoors run hot. Riders trapped outside in a monsoon experience dropping battery temperatures. We cross-reference live device thermals with ambient Open-Meteo data.

### 3. Hardware Attestation & Ecosystem Integrity
We do not trust the OS layer. We go straight to the hardware:
* *Google Play Integrity API:* Cryptographic attestation instantly blocks claims originating from rooted devices, unlocked bootloaders, or Android emulators (e.g., BlueStacks).
* *Barometric/Altitude Checks:* If a rider claims to be in a flooded street-level underpass, but their device barometer registers an altitude matching a 10th-floor apartment, the claim is auto-rejected.

### 4. The UX Balance: The Asynchronous Trust Protocol
We must never penalize an honest Zepto rider who loses cell signal during a severe cyclone. If a claim is flagged strictly due to a network drop:
* *Encrypted Local Caching:* The React Native app caches the accelerometer and barometer data securely in local SQLite. 
* *Seamless Reconciliation:* When the rider reaches a Wi-Fi zone, the payload is uploaded. We ping the Gig Platform API via webhook to verify the specific sector's tower outage, maintaining trust and ensuring honest workers get paid.
## ⚙️ System Architecture & Integrations

AEGIS is built as a **native mobile app (React Native)** to access device telemetry and prevent fraud like GPS spoofing.

---

## 🧩 Enterprise Tech Stack & Architectural Justification

Aura Guard is not a monolithic application; it is a distributed, event-driven cloud topology. We selected this specific stack to guarantee **millisecond latency for AI inference**, **zero data loss during network crashes**, and **seamless integration with the Guidewire ecosystem**.

| Architectural Layer | Core Technology | Primary Function | Strategic Advantage (The "Why") |
| :--- | :--- | :--- | :--- |
| **Client Edge** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="20"/> **React Native + SQLite** | Mobile UI & Hardware Telemetry | Enables offline-first architecture. Encrypted SQLite powers the "Async Trust Protocol" caching sensor data when Jio/Airtel towers drop. |
| **Security & IAM** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/google/google-original.svg" width="20"/> **Play Integrity API** | Hardware Attestation | Cryptographically proves the device is not rooted or running an emulator, instantly destroying GPS spoofing farms at the edge. |
| **API Gateway** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg" width="20"/> **Python (FastAPI)** | High-Concurrency Microservices | Asynchronous REST endpoints capable of routing massive traffic spikes when 50,000 riders simultaneously ping the server during a storm. |
| **Event Mesh** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/apachekafka/apachekafka-original.svg" width="20"/> **Apache Kafka** | High-Throughput Stream | Decouples ingestion from processing. Buffers extreme API loads and utilizes Dead Letter Queues (DLQ) to ensure no claim is ever dropped. |
| **AI Inference** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/pytorch/pytorch-original.svg" width="20"/> **PyTorch / SageMaker** | Machine Learning Execution | Hosts the LSTM (Pricing) and CNN-Transformer (Fraud) models, executing complex multi-modal telemetry assessments in <50ms. |
| **Data Backbone** | <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg" width="20"/> **PostgreSQL** + <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg" width="20"/> **Redis** | Persistence & Caching | Postgres ensures strict ACID compliance for financial ledgers, while Redis provides sub-millisecond Geofence polygon lookups. |
| **Risk Intelligence** | <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/guidewire.svg" width="20"/> **Guidewire HazardHub** | Climate Base-lining | Native integration provides actuarial-grade, pincode-level risk profiles, feeding directly into our XGBoost premium calculation. |
| **Core Insurance** | <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/guidewire.svg" width="20"/> **Guidewire ClaimCenter**| Automated Adjudication | Acts as the immutable system of record. Executes the "Silent FNOL" instantly without requiring manual human adjusters. |
| **Settlement** | <img src="https://razorpay.com/assets/razorpay-logo.svg" width="25"/> **Razorpay UPI Route** | Instant Disbursements | Bypasses slow NEFT/IMPS channels, dropping verified claim payouts into the worker's bank account in under 90 seconds. |


## 📱 Optimized Onboarding (The Zero-Friction UX)

> *Fulfilling the DEVTrails requirement: Designing a seamless, zero-touch experience optimized specifically for the gig worker persona.*

Our target persona, User, works 12-hour shifts. He does not have the time, patience, or desktop access to fill out multi-page traditional insurance forms. If onboarding takes more than 2 minutes, the drop-off rate spikes. Aegis utilizes a **Zero-Typing, Mobile-First Onboarding Flow** designed for cognitive ease and rapid trust-building.

### 1. Zero-Typing Identity Sync (OAuth)
Instead of forcing the worker to manually type their details, upload PAN cards, and declare their income, Aura Guard uses **Gig Platform OAuth** (e.g., "Log in with Swiggy/Zepto").
* **Instant KYC:** Pulls verified name, phone number, and active VPA (UPI ID) directly from their gig employer's database.
* **Earnings Ingestion:** Silently ingests the last 4 weeks of delivery earnings to instantly establish their baseline income capacity for the LSTM Premium Engine. 

### 2. Silent Hardware Attestation (Background Security)
Security should not add UX friction. While User clicks "Next," the **Google Play Integrity API** runs a silent cryptographic check in the background. It verifies the device is not rooted and not running a GPS-spoofing emulator, establishing a trusted hardware baseline without asking the worker a single security question.

### 3. Vernacular & Voice-Assisted UI
Gig workers in Tier-1 and Tier-2 cities often prefer regional languages over English. The React Native frontend is built on a localization framework (i18n), defaulting to the device's native language (e.g., Tamil, Hindi). Core parametric concepts (like "Loss of Income Triggers") are explained using highly visual iconography and optional voice-over tooltips to ensure absolute financial transparency.

### 4. 1-Click UPI e-Mandate (Razorpay Route)
The final step avoids traditional credit card or net-banking setups. The app generates a dynamic UPI intent link. Rajesh enters his 6-digit UPI PIN via GPay/PhonePe to authorize a recurring weekly e-Mandate capped at his selected `P_floor` tier. 

**The Result:** User goes from downloading the app to being fully insured against localized weather and civic strikes in **under 90 seconds**, with less than 5 screen taps.

![WhatsApp Image 2026-03-20 at 02 26 58](https://github.com/user-attachments/assets/98fded8e-9009-473f-a915-16c81690fcb8)


### ⚡ Target Performance Metrics
* **Telemetry Ingestion Capacity:** 100,000+ events/sec (via Kafka).
* **Fraud Evaluation Latency:** < 50 milliseconds per claim.
* **End-to-End Payout Speed:** < 90 seconds from weather trigger to UPI credit.
* **Offline Resilience:** Capable of storing up to 48 hours of encrypted telemetry on-device during network blackouts.
## 📋 Policy Creation & Dynamic Weekly Pricing

> *Fulfilling the DEVTrails requirement: Policy creation with appropriate pricing structured strictly on a Weekly basis.*

Gig workers operate on weekly payout cycles. Annual or monthly insurance premiums create cash-flow friction and high drop-off rates. Aura Guard aligns perfectly with the gig economy by offering a **Dynamic Weekly Micro-Premium**, underwritten entirely by AI and gamified to eliminate the psychological friction of "paying for something you don't use."

### 1. The Policy Creation Workflow (Zero-Friction Onboarding)
We treat policy issuance as an invisible, background process that requires zero manual paperwork or human underwriting.

* **Step 1: Identity & Earnings Sync:** The worker connects their gig platform account (e.g., Zepto, Swiggy) via a secure OAuth integration. The system instantly ingests their historical earnings data to establish a verified baseline income capacity.
* **Step 2: Coverage Selection:** The Premium Engine calculates their personalized "Protected Weekly Target." During onboarding, the worker uses a UI slider to adjust their desired coverage tier (Base, Pro, or Elite) based on their financial goals.
* **Step 3: The Smart Mandate:** The worker approves a recurring UPI e-Mandate. 
* **Step 4: Active Shield (Weekly Renewal):** Every Sunday at 11:59 PM, the policy automatically renews. The AI recalculates the upcoming week's specific environmental risks and deducts the newly adjusted, dynamic premium for the next 7 days.

### 2. The LSTM Premium Engine: Advanced Weekly Pricing ($P_w$)
Our pricing is not a static flat fee. It is a highly dynamic actuarial formula calculated by a Time-Series Deep Learning model (LSTM) that assesses the 7-day environmental forecast alongside historical zone data.

**The Pricing Formula:**
> **`Pw = max( [E(L) * (1 + λ)] + γ - (R_score * β) - W_credit , P_floor )`**

* **$E(L)$ (Expected Loss):** The core statistical risk, calculated by combining the **Guidewire HazardHub** baseline risk score for the rider's specific pincode with the 7-day meteorological forecast multiplier (via Open-Meteo).
* **$\lambda$ (Systemic Risk Margin):** A liquidity buffer percentage to protect the platform's balance sheet against unmodeled, black-swan events.
* **$\gamma$ (Base OpEx):** A flat micro-fee to cover API queries and payment gateway processing.
* **$R_{score}$ (Safe-Zone Yield Discount):** A behavioral safety modifier that reduces the premium (detailed in Pillar 4 below).
* **$W_{credit}$ (Resilience Wallet Credit):** A credit mechanism that can absorb the premium cost entirely if the worker hits a claim-free streak.
* **$P_{floor}$ (Absolute Minimum Premium):** A base floor to maintain the legal contract and cover active server costs, ensuring our unit economics always remain positive.

### 3. The Behavioral Fintech Pillars (Solving the Sunk-Cost Fallacy)
To guarantee high user retention, we transform the weekly premium from a *sunk cost* into a *wealth-building asset* using four behavioral pillars:

1. **The "Resilience Wallet" (Micro-Savings):** A designated portion of every weekly premium does not go to our gross revenue; it funds the worker's personal "Resilience Wallet." If the worker maintains a consecutive claim-free streak, their accumulated wallet balance automatically pays for their next premium, unlocking a **"Free Coverage Week."**
2. **The Predictive "Risk Rebate":** If our AI overprices the weekly risk on Sunday (e.g., forecasting a severe cyclone), but the storm changes path and misses the city by Wednesday, we issue an **instant partial rebate** directly back to the worker's UPI. We only charge them for the risk they actually face.
3. **Dynamic "Income Floors":** Workers are not locked into a rigid policy. They can dynamically scale their coverage tier up or down every Sunday based on the hours they expect to work that week.
4. **The "Safe-Zone Yield":** If the AI detects a localized flood forming, it sends a "Safe Zone Nudge" advising the worker to move to higher ground. If the worker obeys and avoids the hazard, their `$R_{score}$` increases, yielding a direct, mathematically calculated discount on their next weekly premium. We literally pay them to help us avoid paying claims.

## ⚡ Parametric Claim Triggering (Strictly Loss of Income)

> Fulfilling the core DEVTrails mandate: We computationally insure lost time and lost earnings. We do not insure vehicles, health, or accidents.

Aura Guard ensures that payouts are only triggered when an external disruption directly causes a *measurable loss of earning capacity. To eliminate Basis Risk (paying out when no actual operational loss occurred), our Decision Engine requires a *"Double-Lock" Validation** before initiating a claim. Every trigger evaluates a specific event using targeted APIs and specialized Machine Learning techniques.

### Trigger Lock 1: The Objective Disruption (The "What")
The system continuously monitors data streams to classify macro-events that halt gig operations.

#### A. Meteorological Shocks (Floods & Heatwaves)
* *What Happens:* Sudden micro-climate events (e.g., flash floods, extreme heat) make a specific 2km delivery radius impassable or physically unsafe.
* *APIs Used:* Open-Meteo API (High-resolution precipitation/grid data) and IMD API (Heat Index).
* *ML Technique [Isolation Forest]:* We do not rely solely on static thresholds (e.g., >20mm rain). We use an *Isolation Forest (Anomaly Detection)* algorithm trained on 5 years of historical weather data per pincode. The ML evaluates if the current weather spike is a true statistical anomaly for that specific geohash and season, preventing premature payouts during normal monsoon baselines.

#### B. Environmental Hazards (Severe Pollution)
* *What Happens:* Smog or toxic air quality reaches hazardous levels, dropping platform demand and forcing riders offline.
* *API Used:* waqi.org (World Air Quality Index API).
* *ML Technique [XGBoost Classifier]:* We deploy a *Gradient Boosting algorithm (XGBoost)* to predict the sustained duration of the AQI spike. It analyzes wind patterns and historical decay rates to differentiate between a momentary 5-minute sensor glitch and a sustained 4-hour toxic event, only locking the trigger if the disruption is predicted to outlast a standard gig shift.

#### C. Socio-Civic Blockades (Strikes & Curfews)
* *What Happens:* An unannounced political protest, taxi strike, or sudden police curfew blocks access to dark stores or delivery zones.
* *APIs Used:* Twitter Developer API, Gov/Police RSS feeds, and Local News Aggregators.
* *ML Technique [NLP - DistilBERT]:* Unstructured text streams are passed through a fine-tuned *DistilBERT (Named Entity Recognition & Intent Classification) model. The NLP engine extracts the *Intent ("barricade", "riot", "curfew") and the Location Entities ("Mount Road", "Sector 4"). The ML then dynamically renders a GeoJSON "Red Polygon" over the affected map coordinates in real-time.

#### D. Platform Outages (Server Crashes)
* *What Happens:* The weather is perfect, but the gig platform (Zepto/Swiggy) experiences a critical AWS server crash, preventing the active rider from receiving orders.
* *APIs Used:* Direct Gig Platform Webhooks (simulated) and Downdetector Enterprise API.
* *ML Technique [Bayesian Changepoint Detection]:* The algorithm monitors the time-series data of incoming orders and API response latencies. It uses *Bayesian inference* to detect sudden, unnatural shifts in the probability distribution of order flow, confidently distinguishing a true systemic platform crash from a localized 4G network drop.

![WhatsApp Image 2026-03-20 at 02 40 08 (1)](https://github.com/user-attachments/assets/c2294e2e-529d-43c5-a32a-949215fa1d31)


### Trigger Lock 2: Operational Income Impact (The "Proof of Loss")
A disruption alone (Lock 1) does not trigger a payout. We must prove the event physically prevented the worker from earning. The system validates *Activity + Impairment*.

* *What Happens:* The system verifies the rider was logged in and attempting to work, but their delivery velocity collapsed due to the Lock 1 disruption.
* *APIs Used:* Google Maps Distance Matrix API (to measure zone gridlock) and Aura Guard Native Sensor SDK (to measure actual device speed).
* *ML Technique [DBSCAN Spatiotemporal Clustering]:* The system uses *Density-Based Spatial Clustering of Applications with Noise (DBSCAN)* to group the real-time velocity of multiple active riders within the affected geofence. If the ML detects that the cluster's median speed has dropped below 5 km/h (severe gridlock) while active platform orders have dropped by 80%, we have mathematical proof of operational impairment.

*The Execution:* When Lock 1 (The Event) + Lock 2 (The Impairment) align, and our Fraud Engine clears the device telemetry, the income loss is computationally verified. A silent *Guidewire ClaimCenter FNOL* is generated automatically.

<img width="2030" height="176" alt="image" src="https://github.com/user-attachments/assets/87409865-58cc-4f63-924b-2ab6a2a012b8" />

## 💸 Payout Processing via Appropriate Channels  

> Fulfilling the DEVTrails requirement for seamless, instant financial settlement  
---
### 1. Guidewire ClaimCenter Orchestration  

Once the Decision Engine validates the Double-Trigger (Disruption + No Fraud), a secure server-to-server REST API call is made to **Guidewire ClaimCenter**.  

- Instantly generates a **First Notice of Loss (FNOL)**  
- Acts as the **immutable system of record**  
- Automatically adjudicates claims based on parametric policy  

---

### 2. Instant UPI Payout (Razorpay Sandbox)  

Gig workers operate in a real-time cash economy. AEGIS bypasses NEFT/IMPS delays using **Razorpay Route / UPI Sandbox**.  

- Guidewire triggers a **webhook → FastAPI backend → worker’s VPA (UPI ID)**  
- Worker receives notification:  
  > *"Disruption verified. Earnings credited to your UPI."*

---

### 3. Financial Resilience (Dead Letter Queue)  

If UPI or banking systems fail:  

- Events are published to **Apache Kafka**  
- Failed payments (503/timeout) go to **DLQ**  
- Retry worker uses **Exponential Backoff (2s → 4s → 8s)**  

Risk Prediction → Premium Calculation → Trigger Validation → Fraud Detection → Decision Engine → Instant Payout

Ensuring reliable, automated payout completion without manual intervention.


![WhatsApp Image 2026-03-20 at 02 34 44](https://github.com/user-attachments/assets/6b993ace-317f-41a5-aaba-27bc712420dd)

![WhatsApp Image 2026-03-19 at 23 33 14](https://github.com/user-attachments/assets/53a04558-bb44-460c-8186-25d2259bae49)

---


### 🔗 Project Links (For Reviewers)
* **[📺 2-Minute Strategy & Pitch Video](https://www.youtube.com/watch?v=teL_AS9BGgY)**
* **[PPT LINK](https://www.youtube.com/watch?v=teL_AS9BGgY](https://www.canva.com/design/DAHEdSkrVYY/cw8FBjAtS4CohCYyjQghxA/edit?utm_content=DAHEdSkrVYY&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)**

---
*Disclaimer: Aura Guard complies with all DEVTrails constraints. Coverage is strictly limited to "Loss of Income" due to external socio-environmental factors. No coverage is provided for health, life, accidents, or vehicular damage.*

## Phase 2 Execution Plan
Phase 2 needs 4 working features in code. Here's what to actually build, keeping it demo-ready within the deadline.

1. **Registration Process**
Build a simple onboarding flow (React Native or React Web) that collects:
- Worker name, phone, UPI ID
- Platform (Zomato/Swiggy/Zepto etc.)
- City & operating zone (pincode/geohash)
- Average weekly earnings (for coverage tier selection)

On the backend (FastAPI), save this to a DB (SQLite is fine for hackathon) and generate a worker_id. This is also where you compute the initial R_score = 100 and create an empty Resilience Wallet.

2. **Insurance Policy Management**
After registration, auto-generate a weekly policy:
- Show the worker their Base / Pro / Elite tier options
- Display the dynamically calculated weekly premium (see #3)
- On confirmation, write a policy record to DB with: policy_id, worker_id, week_start, week_end, coverage_amount, premium_paid, status: ACTIVE

A simple policy dashboard screen should show current active policy, past policies, and wallet balance.

3. **Dynamic Premium Calculation (the AI piece)**
This is the core Phase 2 requirement. Implement your formula:
`Pw = max([E(L) × (1 + λ)] + γ - (R_score × β) - W_credit, P_floor)`
For the hackathon, mock E(L) using Open-Meteo's free API — call it with the worker's pincode, get 7-day precipitation and temperature forecast, and map it to a risk multiplier. You don't need a real LSTM yet; a rule-based lookup table (e.g., rain > 20mm → risk_multiplier = 1.4) works perfectly for Phase 2 and is honest about what it does.
FastAPI endpoint: POST `/calculate-premium` takes worker_id → returns premium_amount + breakdown.

4. **Claims Management (Zero-Touch)**
Build 3–4 automated parametric triggers. These are background jobs (run every 15 mins via a cron or APScheduler in FastAPI) that:
| Trigger | API to call | Threshold |
|---|---|---|
| Heavy rain | Open-Meteo (free) | precipitation > 15mm/hr |
| Extreme heat | Open-Meteo | temperature > 42°C |
| Poor AQI | waqi.org (free tier) | AQI > 300 |
| Platform outage | Mock a webhook | Downdetector mock |

When a trigger fires for a worker's active zone:
- Auto-create a claim record (claim_id, worker_id, trigger_type, status: PENDING)
- Run your fraud checks (even basic ones — check if multiple workers in same pincode, check claim frequency)
- If fraud score is low → mark status: APPROVED → mock a Razorpay payout call
- Push a notification to the worker's UI: "Disruption verified. ₹X credited to your UPI."

The worker-facing claims screen shows claim history, status, and payout amount.
