import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Shield, CloudRain, Wind, Thermometer, AlertTriangle, CloudRainWind, Wallet, CheckCircle, CheckCircle2, Activity, Search, Siren, Sun, FileText, Upload, User, Bell, Clock, CreditCard, Banknote, Landmark, ListPlus, ShieldCheck, TrendingDown, AlertOctagon, BarChart2, CalendarClock, HelpCircle, Send, Map, Radio, ShieldAlert, FileSearch, Settings, ArrowRightLeft, BrainCircuit, PieChart, Users, Zap, Download, CalendarCheck, Lightbulb, Gauge, ChevronDown, Sliders, Car, Briefcase } from 'lucide-react';
import ControlCenter from './ControlCenter';

const API_BASE_URL = 'http://localhost:8000';

const MOCK_ZONES = [
  { id: 'z1', name: 'Downtown Core', risk: 'High', aqi: 240, weather: 'Heavy Rain' },
  { id: 'z2', name: 'North Suburbs', risk: 'Low', aqi: 85, weather: 'Clear' },
  { id: 'z3', name: 'East Industrial', risk: 'Critical', aqi: 310, weather: 'Smog' }
];

// AI-Powered Dynamic Policy Catalog
const POLICY_CATALOG = [
  {
    id: 'shield-micro',
    name: 'Aegis Micro Shield',
    tagline: 'Entry-level parametric cover for low-risk zones',
    basePrice: 22,
    coverage: 800,
    tier: 'Base',
    color: '#64748b',
    accentColor: 'rgba(100,116,139,0.1)',
    badge: null,
    coverageHours: 8,
    triggers: ['Heavy Rain (>15mm/hr)', 'Extreme Heat (>43°C)'],
    perks: ['Claim processed in 48h', 'Resilience Wallet (15% of premium)', 'Basic UPI Payout'],
    pricingFactors: {
      expectedLossBase: 0.008, lambda: 0.08, gamma: 3, rScoreBeta: 0.3, pFloorPct: 0.004
    }
  },
  {
    id: 'shield-base',
    name: 'Aegis Shield Base',
    tagline: 'Standard weekly floor for regular gig workers',
    basePrice: 30,
    coverage: 1500,
    tier: 'Base',
    color: '#3b82f6',
    accentColor: 'rgba(59,130,246,0.1)',
    badge: null,
    coverageHours: 10,
    triggers: ['Heavy Rain (>20mm/hr)', 'Extreme Heat (>42°C)', 'Poor AQI (>280)'],
    perks: ['Claim processed in 24h', 'Resilience Wallet (18% of premium)', 'Safe Zone Yield Bonus'],
    pricingFactors: {
      expectedLossBase: 0.01, lambda: 0.1, gamma: 5, rScoreBeta: 0.4, pFloorPct: 0.005
    }
  },
  {
    id: 'shield-pro',
    name: 'Aegis Shield Pro',
    tagline: 'Expanded triggers including civic disruptions',
    basePrice: 48,
    coverage: 3000,
    tier: 'Pro',
    color: '#00678a',
    accentColor: 'rgba(0,103,138,0.1)',
    badge: 'Most Popular',
    coverageHours: 12,
    triggers: ['Heavy Rain (>15mm/hr)', 'AQI (>250)', 'Civic Strikes', 'Platform Outage'],
    perks: ['Claim in under 4h', 'Resilience Wallet (20% of premium)', 'Risk Rebate mid-week', 'Safe Zone Nudge Alerts'],
    pricingFactors: {
      expectedLossBase: 0.012, lambda: 0.1, gamma: 6, rScoreBeta: 0.5, pFloorPct: 0.0055
    }
  },
  {
    id: 'shield-elite',
    name: 'Aegis Elite Resilience',
    tagline: 'Full multi-trigger protection for high-risk zones',
    basePrice: 72,
    coverage: 5000,
    tier: 'Elite',
    color: '#7c3aed',
    accentColor: 'rgba(124,58,237,0.1)',
    badge: 'High Value',
    coverageHours: 14,
    triggers: ['All Weather Events', 'AQI (>200)', 'All Civic Disruptions', 'Platform Crashes', 'Barometric Altitude Shift'],
    perks: ['Instant Claim (<2h)', 'Resilience Wallet (22% of premium)', 'Predictive Risk Rebate', 'Dynamic Coverage Hour Extension'],
    pricingFactors: {
      expectedLossBase: 0.014, lambda: 0.12, gamma: 8, rScoreBeta: 0.65, pFloorPct: 0.006
    }
  },
  {
    id: 'shield-storm',
    name: 'Aegis Storm Commander',
    tagline: 'Maximum protection for monsoon-prone zones',
    basePrice: 95,
    coverage: 8000,
    tier: 'Elite',
    color: '#0891b2',
    accentColor: 'rgba(8,145,178,0.1)',
    badge: 'Premium',
    coverageHours: 16,
    triggers: ['All Triggers + Flood Zone Guarantee', 'Syndicate Fraud Zero-Trust', 'UPI Emergency Top-Up'],
    perks: ['Sub-90 sec UPI Payout', 'Resilience Wallet (25% of premium)', 'Full Risk Rebate', 'Dedicated SOS Line', 'Extended Coverage Hours (weather-adaptive)'],
    pricingFactors: {
      expectedLossBase: 0.016, lambda: 0.14, gamma: 10, rScoreBeta: 0.75, pFloorPct: 0.007
    }
  },
  {
    id: 'shield-guardian',
    name: 'Aegis Gig Guardian',
    tagline: 'AI-personalized adaptive plan for veteran riders',
    basePrice: 55,
    coverage: 4000,
    tier: 'Pro',
    color: '#059669',
    accentColor: 'rgba(5,150,105,0.1)',
    badge: 'AI Personalised',
    coverageHours: 13,
    triggers: ['Adaptive AI Triggers (zone-specific)', 'Flood + AQI + Strike combo coverage'],
    perks: ['Real-time adaptive premium', 'Resilience Wallet (20%)', 'Weekly AI Risk Report', 'Free Coverage Week after 4-week streak'],
    pricingFactors: {
      expectedLossBase: 0.013, lambda: 0.11, gamma: 7, rScoreBeta: 0.6, pFloorPct: 0.0058
    }
  }
];

// Zone-based historical flood & weather risk data (mock of Guidewire HazardHub + historical DB)
const ZONE_RISK_PROFILES = {
  z1: { name: 'Downtown Core', floodIncidents3yr: 18, waterloggingRisk: 'High', riskMultiplier: 1.4, weatherMultiplierThisWeek: 1.2, insight: 'High waterlogging zone. 18 flood events in 3 years. Premium adjusted upward.' },
  z2: { name: 'North Suburbs', floodIncidents3yr: 0, waterloggingRisk: 'Low', riskMultiplier: 0.85, weatherMultiplierThisWeek: 0.9, insight: 'Your zone has 0 flood incidents in 3 years → you save ₹2–5/week. Clear skies predicted → coverage hours extended.' },
  z3: { name: 'East Industrial', floodIncidents3yr: 24, waterloggingRisk: 'Critical', riskMultiplier: 1.6, weatherMultiplierThisWeek: 1.4, insight: 'Critical flood-risk industrial zone. Frequent waterlogging. Premium significantly higher this week due to heavy rain forecast.' }
};

// Dynamic Pricing Engine (mirrors backend formula)
const computeDynamicPremium = (policy, zoneId, rScore, walletBalance, weeklyRainMm = 10) => {
  const profile = ZONE_RISK_PROFILES[zoneId] || ZONE_RISK_PROFILES.z1;
  const { expectedLossBase, lambda, gamma, rScoreBeta, pFloorPct } = policy.pricingFactors;
  const baseExpectedLoss = policy.coverage * expectedLossBase;
  const weatherMult = weeklyRainMm > 20 ? 1.35 : weeklyRainMm > 10 ? 1.1 : 0.92;
  const zoneMult = profile.riskMultiplier;
  const expectedLoss = baseExpectedLoss * zoneMult * weatherMult;
  const wCredit = Math.min(walletBalance, policy.coverage * 0.01);
  const rDiscount = rScore * rScoreBeta;
  const rawPremium = (expectedLoss * (1 + lambda)) + gamma - rDiscount - wCredit;
  const pFloor = policy.coverage * pFloorPct;
  const finalPremium = Math.max(rawPremium, pFloor);
  const basePremium = (baseExpectedLoss * (1 + lambda)) + gamma; // no zone or behavioural adjustments
  const savings = Math.max(0, basePremium - finalPremium);
  // Extended coverage hours if weather safe this week
  const bonusHours = weatherMult < 1 ? 2 : 0;
  return {
    finalPremium: Math.round(finalPremium * 100) / 100,
    breakdown: {
      expectedLoss: Math.round(expectedLoss * 100) / 100,
      zoneMultiplier: zoneMult,
      weatherMultiplier: weatherMult,
      rScoreDiscount: Math.round(rDiscount * 100) / 100,
      walletCredit: Math.round(wCredit * 100) / 100,
    },
    savings: Math.round(savings * 100) / 100,
    bonusCoverageHours: policy.coverageHours + bonusHours,
    zoneInsight: profile.insight,
  };
};

const PREDEFINED_TRIGGERS = [
  { type: 'weather', condition: 'Heavy Rain (>50mm/hr)', icon: <CloudRainWind size={18} /> },
  { type: 'aqi', condition: 'Severe AQI (>300)', icon: <Wind size={18} /> },
  { type: 'temperature', condition: 'Extreme Heat (>45°C)', icon: <Thermometer size={18} /> },
  { type: 'traffic', condition: 'City Lockdown/Curfew', icon: <Siren size={18} /> }
];

export default function App() {
  const [currentView, setCurrentView] = useState('login'); // login, onboarding, rider-dash, admin-dash

  // Rider State
  const [riderInfo, setRiderInfo] = useState({
    name: '', platform: ['Zomato'], vehicle: '2-Wheeler', shift: 'Morning', avgOrders: '', yearsExp: 'Select', zone: 'z1', avgEarnings: 6000,
    gender: 'Male', dob: '', mobile: '', email: '', password: '', aadhaar: '', upiId: '', bankName: '', accountNo: '', pincode: '', city: 'Mumbai', occupation: 'Platform Partner'
  });
  const [workerId, setWorkerId] = useState(null);
  const [onboardingPhase, setOnboardingPhase] = useState('A');
  const [kycStatus, setKycStatus] = useState('Unverified');
  const [rScore, setRScore] = useState(100);
  const [walletBalance, setWalletBalance] = useState(0);

  const [hasActivePolicy, setHasActivePolicy] = useState(false);
  const [coverageAmount, setCoverageAmount] = useState(0);
  const [calculatedPremium, setCalculatedPremium] = useState(0);
  
  const [claims, setClaims] = useState([]);
  const [expandedClaimId, setExpandedClaimId] = useState(null);
  const [riderTab, setRiderTab] = useState('overview');
  const [adminTab, setAdminTab] = useState('overview');
  const [manualClaim, setManualClaim] = useState({ reason: 'Rain', description: '', amount: '' });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activatedPlan, setActivatedPlan] = useState(null);
  const [demoTriggerLoading, setDemoTriggerLoading] = useState(false);
  const [showPricingBreakdown, setShowPricingBreakdown] = useState(null); // policy.id or null
  const [parametricTriggerResult, setParametricTriggerResult] = useState(null);
  const [parametricCity, setParametricCity] = useState('Mumbai');
  const [parametricTriggerLoading, setParametricTriggerLoading] = useState(false);

  const handleManualClaimSubmit = (e) => {
    e.preventDefault();
    setClaims(prev => [{
      id: 'CLM-' + Math.floor(Math.random() * 100000),
      date: new Date().toLocaleDateString(),
      reason: manualClaim.reason + ' (Manual Claim)',
      amount: manualClaim.amount || Math.round(riderInfo.avgEarnings * 0.4),
      status: 'Pending Review'
    }, ...prev]);
    setManualClaim({ reason: 'Rain', description: '', amount: '' });
    setRiderTab('overview');
  };

  // Parametric Trigger Handlers (Location-Based Automatic Claims)
  const handleParametricRainTrigger = async () => {
    setParametricTriggerLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/demo/parametric/heavy-rain-location`, {
        city: parametricCity,
        rainfall_mm: 65
      });
      setParametricTriggerResult(response.data);
    } catch (error) {
      console.error('Parametric trigger failed:', error);
      alert('Trigger failed: ' + error.message);
    }
    setParametricTriggerLoading(false);
  };

  const handleParametricHeatTrigger = async () => {
    setParametricTriggerLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/demo/parametric/extreme-heat-location`, {
        city: parametricCity,
        temperature_c: 47
      });
      setParametricTriggerResult(response.data);
    } catch (error) {
      console.error('Parametric trigger failed:', error);
      alert('Trigger failed: ' + error.message);
    }
    setParametricTriggerLoading(false);
  };

  const handleParametricStrikeTrigger = async () => {
    setParametricTriggerLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/demo/parametric/civic-strike-location`, {
        city: parametricCity
      });
      setParametricTriggerResult(response.data);
    } catch (error) {
      console.error('Parametric trigger failed:', error);
      alert('Trigger failed: ' + error.message);
    }
    setParametricTriggerLoading(false);
  };

  // Global condition simulator
  const [currentConditions, setCurrentConditions] = useState({
    weather: 'Clear',
    aqi: 95,
    temp: 24,
    traffic: 'Normal'
  });

  // Simulator Effect
  useEffect(() => {
    if (hasActivePolicy && currentConditions.weather === 'Heavy Rain (>50mm/hr)') {
      // Auto trigger claim
      const alreadyClaimed = claims.find(c => c.reason === 'Heavy Rain (>50mm/hr)' && c.status !== 'Rejected');
      if (!alreadyClaimed) {
        setTimeout(() => {
          setClaims(prev => [{
            id: 'CLM-' + Math.floor(Math.random() * 100000),
            date: new Date().toLocaleDateString(),
            reason: 'Heavy Rain (>50mm/hr)',
            amount: riderInfo.avgEarnings * 0.8, // 80% of daily income
            status: 'Approved (Instant API)'
          }, ...prev]);
        }, 3000); // simulate delay
      }
    }
  }, [currentConditions, hasActivePolicy, claims, riderInfo]);

  // Fetch Dashboard Loop
  useEffect(() => {
    if (workerId && currentView === 'rider-dash') {
      const fetchDashboard = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/worker/${workerId}/dashboard`);
          const data = res.data;
          if (data.active_policy) {
            setHasActivePolicy(true);
            setCoverageAmount(data.active_policy.coverage_amount);
            setCalculatedPremium(data.active_policy.premium_paid);
          }
          setRScore(data.worker.r_score);
          setWalletBalance(data.worker.wallet_balance);
          
          if (data.claims && data.claims.length > 0) {
            const formattedClaims = data.claims.map(c => ({
              id: 'CLM-' + c.id,
              date: new Date(c.created_at).toLocaleDateString(),
              reason: c.trigger_type,
              amount: c.payout_amount,
              status: c.status === 'APPROVED' ? 'Approved (Instant API)' : c.status
            }));
            setClaims(formattedClaims);
          } else {
            setClaims([]);
          }
        } catch (e) {
          console.error("Dashboard error", e);
        }
      };
      
      fetchDashboard();
      const interval = setInterval(fetchDashboard, 5000); // refresh every 5s for demo
      return () => clearInterval(interval);
    }
  }, [workerId, currentView]);

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {
        name: riderInfo.name || "Test Worker",
        phone: riderInfo.mobile || "9999999999",
        upi_id: "test@upi",
        platform: riderInfo.platform,
        city: "Mumbai",
        pincode: "400002", // trigger demo code
        avg_weekly_earnings: riderInfo.avgEarnings
      });
      setWorkerId(res.data.id);
      
      // Also pre-calculate premium to show
      const premRes = await axios.post(`${API_BASE_URL}/calculate-premium`, {
        worker_id: res.data.id,
        tier: riderInfo.avgEarnings > 5000 ? 'Elite' : (riderInfo.avgEarnings > 3000 ? 'Pro' : 'Base')
      });
      setCalculatedPremium(premRes.data.premium_amount);
      setCoverageAmount(premRes.data.coverage_amount);
      
      setCurrentView('rider-dash');
    } catch (e) {
      console.error(e);
      // fallback
      setCurrentView('rider-dash');
    }
  };

  const initiatePolicy = async () => {
    if (!workerId) return;
    try {
       const tier = riderInfo.avgEarnings > 5000 ? 'Elite' : (riderInfo.avgEarnings > 3000 ? 'Pro' : 'Base');
       await axios.post(`${API_BASE_URL}/create-policy`, {
         worker_id: workerId,
         tier: tier
       });
       setHasActivePolicy(true);
    } catch (e) {
       console.error("Failed to create policy", e);
    }
  };

  // Instant demo trigger for worker dashboard
  const triggerInstantDemo = async (triggerType) => {
    if (!workerId) {
      alert('Please authenticate first');
      return;
    }
    try {
      setDemoTriggerLoading(true);
      let endpoint = '';
      switch(triggerType) {
        case 'rain': endpoint = `/demo/trigger-heavy-rain/${workerId}`; break;
        case 'heat': endpoint = `/demo/trigger-extreme-heat/${workerId}`; break;
        case 'strike': endpoint = `/demo/trigger-civic-strike/${workerId}`; break;
        default: endpoint = `/demo/trigger-heavy-rain/${workerId}`;
      }
      const res = await axios.post(`${API_BASE_URL}${endpoint}`);
      // Refresh dashboard immediately
      const dashRes = await axios.get(`${API_BASE_URL}/worker/${workerId}/dashboard`);
      const data = dashRes.data;
      if (data.claims && data.claims.length > 0) {
        const formattedClaims = data.claims.map(c => ({
          id: 'CLM-' + c.id,
          date: new Date(c.created_at).toLocaleDateString(),
          reason: c.trigger_type,
          amount: c.payout_amount,
          status: c.status === 'APPROVED' ? 'Approved (Instant API)' : c.status
        }));
        setClaims(formattedClaims);
      }
      alert(`✅ Claim created! Payout: ₹${res.data.claim.payout_amount}`);
    } catch (e) {
      console.error("Demo trigger failed:", e);
      alert(`Error: ${e.response?.data?.detail || e.message}`);
    } finally {
      setDemoTriggerLoading(false);
    }
  };

  const [adminLogs, setAdminLogs] = useState([{ time: new Date().toLocaleTimeString(), msg: 'Aegis System Initialized. Listening to Kafka mesh...', type: 'info' }]);
  const [engineStates, setEngineStates] = useState({
    risk: 'blue',
    premium: 'green',
    fraud: 'green',
    trigger: 'blue',
    decision: 'blue'
  });

  const addLog = (msg, type = 'info') => {
    setAdminLogs(prev => [...prev.slice(-49), { time: new Date().toLocaleTimeString(), msg, type }]);
  };

  const injectScenario = (type) => {
    addLog(`[SYSTEM] Initiating Scenario: ${type}`, 'warning');
    if (type === 'Flash Flood') {
      setCurrentConditions({ weather: 'Heavy Rain (>50mm/hr)', aqi: 95, temp: 24, traffic: 'Severe Congestion' });
      setEngineStates(prev => ({ ...prev, risk: 'red' }));
      setTimeout(() => {
        addLog('[Trigger Engine] Lock 1 (Weather > 20mm) = OPEN', 'warning');
        setEngineStates(prev => ({ ...prev, trigger: 'orange' }));
      }, 1000);
      setTimeout(() => {
        addLog('[Trigger Engine] Lock 2 (Cluster speed < 5km/h) = OPEN', 'warning');
        setEngineStates(prev => ({ ...prev, trigger: 'red' }));
      }, 2000);
      setTimeout(() => {
        addLog('[Decision Engine] Executing Payout Pipeline via FastAPI', 'success');
        setEngineStates(prev => ({ ...prev, decision: 'green' }));
      }, 3000);
      setTimeout(() => addLog('[Guidewire] ClaimCenter API FNOL created', 'success'), 4000);
      setTimeout(() => addLog('[Razorpay] UPI Payout queued for 120 riders', 'info'), 4500);

    } else if (type === 'Civic Strike') {
      setCurrentConditions({ weather: 'Clear', aqi: 95, temp: 24, traffic: 'City Lockdown/Curfew' });
      setEngineStates(prev => ({ ...prev, risk: 'orange' }));
      setTimeout(() => {
        addLog('[NLP DistilBERT] Scraped INTENT: Strike, LOC: East Ind.', 'info');
        addLog('[Trigger Engine] Lock 1 (Civic Strike) = OPEN', 'warning');
        setEngineStates(prev => ({ ...prev, trigger: 'orange' }));
      }, 1500);
      setTimeout(() => {
        addLog('[Trigger Engine] Lock 2 (Cluster speed < 5km/h) = OPEN', 'warning');
        setEngineStates(prev => ({ ...prev, trigger: 'red' }));
      }, 2500);
      setTimeout(() => {
        addLog('[Decision Engine] Executing Payout Pipeline', 'success');
        setEngineStates(prev => ({ ...prev, decision: 'green' }));
      }, 3500);

    } else if (type === 'Syndicate Attack') {
      setEngineStates(prev => ({ ...prev, risk: 'orange' }));
      setTimeout(() => addLog('[CNN Model] Spatial anomaly: 15km distance in 3s -> Emulator Flagged', 'error'), 1000);
      setTimeout(() => {
         setEngineStates(prev => ({ ...prev, fraud: 'red' }));
         addLog('[Transformer] Temporal anomaly: 4 claims on same BSSID_ID with BatteryTemp > 38C', 'error');
      }, 2000);
      setTimeout(() => {
         setEngineStates(prev => ({ ...prev, decision: 'red' }));
         addLog('[Decision Engine] Orchestrator halted. Suspicious claim blocked. Forwarding to SIU.', 'error');
      }, 3500);
    }
  };

  const resetEngines = () => {
    setCurrentConditions({ weather: 'Clear', aqi: 95, temp: 24, traffic: 'Normal' });
    setEngineStates({ risk: 'blue', premium: 'green', fraud: 'green', trigger: 'blue', decision: 'blue' });
    addLog('[SYSTEM] All AI pipelines reset to baseline operational states', 'info');
  };

  const simulateDisaster = () => {
    setCurrentConditions({ weather: 'Heavy Rain (>50mm/hr)', aqi: 110, temp: 22, traffic: 'Severe Congestion' });
  };

  const resetConditions = () => {
    setCurrentConditions({ weather: 'Clear', aqi: 95, temp: 24, traffic: 'Normal' });
  };

  const renderLogin = () => (
    <div style={{ background: '#00678a', minHeight: '100vh', fontFamily: '"Montserrat", sans-serif' }}>
      
      {/* Top Navbar */}
      <nav style={{ background: '#005b7a', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={36} color="#FFC72C" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', letterSpacing: '1px', lineHeight: 1 }}>AEGIS</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px', lineHeight: 1 }}>DEV</span>
            <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFC72C', letterSpacing: '0.5px', lineHeight: 1, marginTop: '-4px' }}>Trails</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '32px', color: '#ffffff', fontSize: '0.95rem', fontWeight: 600 }}>
          <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Parametric Engine <ChevronDown size={14}/></span>
          <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Resilience Wallet <ChevronDown size={14}/></span>
          <span style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>APIs <ChevronDown size={14}/></span>
        </div>
      </nav>

      {/* Hero Content */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 20px', color: 'white' }}>
        <div style={{ display: 'flex', maxWidth: '1200px', width: '100%', gap: '60px', alignItems: 'center' }}>
          
          {/* Left Column (Marketing Copy) */}
          <div style={{ flex: 1.2, paddingRight: '20px' }}>
            <div style={{ display: 'inline-block', background: 'rgba(255, 199, 44, 0.2)', color: '#FFC72C', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', marginBottom: '24px' }}>
              HIGH-YIELD RESILIENCE ASSET
            </div>
            
            <h1 style={{ fontSize: '3.6rem', fontWeight: '800', margin: '0 0 24px 0', lineHeight: 1.15, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
              Zero-Trust Parametric<br/>Income Protection
            </h1>
            <p style={{ fontSize: '1.25rem', fontFamily: '"Poppins", sans-serif', fontWeight: '400', color: '#e0f2fe', lineHeight: 1.6, marginBottom: '40px' }}>
              Architecting a highly scalable, fraud-resistant "Income-as-a-Service" platform for India’s 15 million gig workers. Guaranteed weekly financial floors against environmental and social disruptions.
            </p>
            
            {/* Feature Pills */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CloudRainWind size={20} color="#FFC72C" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Environmental Disruption</span>
              </div>
              <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Activity size={20} color="#FFC72C" />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Zero-Touch Automation</span>
              </div>
            </div>
          </div>

          {/* Right Column (Glassmorphic Login Panel) */}
          <div style={{ flex: 0.9, display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} style={{ width: '420px', background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)', borderRadius: '32px', padding: '40px 32px', boxShadow: '0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)', position: 'relative', overflow: 'hidden' }}>
              
              {/* Subtle background glow inside the card */}
              <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(255,199,44,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg, #FFC72C, #F59E0B)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(255, 199, 44, 0.3), inset 0 2px 4px rgba(255,255,255,0.3)' }}>
                    <Shield size={24} color="#0f172a" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '0.5px' }}>Terminal Access</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>Secure Double-Lock Portal</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <motion.button whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.15)' }} whileTap={{ scale: 0.98 }} style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.3s ease' }} onClick={() => setCurrentView('onboarding')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ background: 'rgba(255, 199, 44, 0.15)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255, 199, 44, 0.1)' }}><User size={24} color="#FFC72C" /></div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Partner / Rider</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Access resilience wallet</div>
                      </div>
                    </div>
                    <ArrowRightLeft size={20} color="#FFC72C" opacity={0.8} />
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.15)' }} whileTap={{ scale: 0.98 }} style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.3s ease' }} onClick={() => setCurrentView('admin-dash')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(56, 189, 248, 0.1)' }}><ShieldCheck size={24} color="#38bdf8" /></div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Admin / Insurer</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '2px' }}>Operational command center</div>
                      </div>
                    </div>
                    <ArrowRightLeft size={20} color="#38bdf8" opacity={0.8} />
                  </motion.button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '32px 0', gap: '16px' }}>
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.15))' }}></div>
                  <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '2px' }}>OR LOGIN</span>
                  <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.15))' }}></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type='email' placeholder='Email Address' style={{ padding: '18px 20px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }} value={riderInfo.email || ''} onChange={e => setRiderInfo({...riderInfo, email: e.target.value})} onFocus={(e) => e.target.style.borderColor = 'rgba(255,199,44,0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  <input type='password' placeholder='Password' style={{ padding: '18px 20px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', color: '#fff', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }} value={riderInfo.password || ''} onChange={e => setRiderInfo({...riderInfo, password: e.target.value})} onFocus={(e) => e.target.style.borderColor = 'rgba(255,199,44,0.5)'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  <motion.button whileHover={{ scale: 1.02, boxShadow: '0 15px 30px rgba(245, 158, 11, 0.4)' }} whileTap={{ scale: 0.98 }} onClick={() => { setWorkerId(174); setCurrentView('rider-dash'); setClaims([]); }} style={{ padding: '18px', background: 'linear-gradient(135deg, #FFC72C, #F59E0B)', color: '#0f172a', border: 'none', borderRadius: '20px', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', marginTop: '12px', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.2)' }}>Authenticate as Worker 174</motion.button>
                </div>

                <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                    <CheckCircle size={14} color="#10b981" />
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>Play Integrity</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '20px', border: '1px solid rgba(56, 189, 248, 0.1)' }}>
                    <Activity size={14} color="#38bdf8" />
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>Guidewire Synced</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Layout Content */}
      <div style={{ background: '#ffffff', borderRadius: '40px 40px 0 0', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#333333' }}>
        
        {/* Experience on the Go Section */}
        <div style={{ width: '100%', maxWidth: '1250px', margin: '40px auto 140px auto', position: 'relative' }}>
          {/* Modern Glow Background */}
          <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,103,138,0.06) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0 }}></div>
          <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,103,138,0.08) 0%, transparent 70%)', filter: 'blur(50px)', zIndex: 0 }}></div>
          
          <div style={{ background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(244,250,253,0.9) 100%)', borderRadius: '48px', display: 'flex', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0, 103, 138, 0.1)', position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)' }}>
            
            {/* Left Side */}
            <div style={{ flex: 1.1, padding: '80px 60px', color: '#00678a', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,103,138,0.08)', padding: '8px 16px', borderRadius: '20px', marginBottom: '24px', border: '1px solid rgba(0,103,138,0.1)' }}>
                   <Zap size={16} color="#00678a" />
                   <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px', color: '#00678a' }}>SEAMLESS PROTECTION</span>
                </div>
              </motion.div>
              
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} style={{ fontSize: '3.4rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '24px', background: 'linear-gradient(to right, #00678a, #004b66)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: '0 4px 20px rgba(0,103,138,0.08)' }}>
                Zero-touch parametric engine on your phone.
              </motion.h2>
              
              <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} style={{ fontSize: '1.15rem', color: '#555', fontFamily: '"Poppins", sans-serif', lineHeight: 1.7, marginBottom: '40px' }}>
                Aegis turns your device into an intelligent risk shield. Activate policies, monitor live micro-climate disruptions, and receive instant automated payouts—all without filing paperwork.
              </motion.p>

              {/* Interactive Benefit Cards */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '48px' }}>
                 <motion.div whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,103,138,0.1)' }} style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid rgba(0,103,138,0.06)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                    <div style={{ background: 'rgba(0,103,138,0.06)', padding: '12px', borderRadius: '16px' }}><Activity size={24} color="#00678a" /></div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#333' }}>Risk prediction via<br/>hybrid AI</span>
                 </motion.div>
                 <motion.div whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,103,138,0.1)' }} style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid rgba(0,103,138,0.06)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                    <div style={{ background: 'rgba(0,103,138,0.06)', padding: '12px', borderRadius: '16px' }}><ShieldCheck size={24} color="#00678a" /></div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#333' }}>Automated trigger<br/>validation</span>
                 </motion.div>
                 <motion.div whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,103,138,0.1)' }} style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid rgba(0,103,138,0.06)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                    <div style={{ background: 'rgba(0,103,138,0.06)', padding: '12px', borderRadius: '16px' }}><Map size={24} color="#00678a" /></div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#333' }}>Real-time trajectory<br/>tracking</span>
                 </motion.div>
                 <motion.div whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,103,138,0.1)' }} style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid rgba(0,103,138,0.06)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', transition: 'all 0.3s ease' }}>
                    <div style={{ background: 'rgba(255,199,44,0.15)', padding: '12px', borderRadius: '16px' }}><Wallet size={24} color="#00678a" /></div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#333' }}>Automated Resilience<br/>Wallet</span>
                 </motion.div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} viewport={{ once: true }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px', color: '#00678a', letterSpacing: '0.5px' }}>GET SECURED NOW</h4>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {/* Quick Download QR Wrapper */}
                  <div style={{ background: 'white', padding: '12px', borderRadius: '16px', display: 'flex', gap: '20px', alignItems: 'center', border: '1px solid rgba(0,103,138,0.1)', boxShadow: '0 4px 20px rgba(0,103,138,0.05)' }}>
                    <div style={{ width: '70px', height: '70px', background: '#f8f9fa', padding: '6px', borderRadius: '10px', display: 'flex', flexWrap: 'wrap', gap: '2px', border: '1px solid #eee' }}>
                       {Array.from({ length: 25 }).map((_, i) => (
                         <div key={i} style={{ width: '10px', height: '10px', background: (i % 2 === 0 || i % 5 === 0) ? '#00678a' : 'transparent', borderRadius: '2px' }}></div>
                       ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '10px' }}>
                       <motion.img whileHover={{ scale: 1.05 }} src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" style={{ height: '36px', cursor: 'pointer' }} />
                       <motion.img whileHover={{ scale: 1.05 }} src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: '36px', cursor: 'pointer' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Mobile Mockup & App Visuals */}
            <div style={{ flex: 0.9, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px' }}>
              <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                 <motion.img 
                   initial={{ opacity: 0, y: 30 }} 
                   whileInView={{ opacity: 1, y: 0 }} 
                   transition={{ duration: 0.8, delay: 0.2 }} 
                   viewport={{ once: true }}
                   src="/mobile-mockup.png" 
                   alt="AEGIS App Mobile Interface" 
                   style={{ zIndex: 2, height: '550px', objectFit: 'contain', filter: 'drop-shadow(0 30px 60px rgba(0,103,138,0.25))' }} 
                 />
                 <motion.img 
                   initial={{ opacity: 0, x: 40 }} 
                   whileInView={{ opacity: 1, x: 0 }} 
                   transition={{ duration: 0.8, delay: 0.5 }} 
                   viewport={{ once: true }}
                   src="/bike-illustration.png" 
                   alt="Gig Worker" 
                   style={{ zIndex: 1, position: 'absolute', bottom: '20px', right: '-40px', height: '300px', objectFit: 'contain', mixBlendMode: 'multiply', opacity: 0.9 }} 
                 />
              </div>
            </div>
          </div>
        </div>
        {/* Why Choose AEGIS Section */}
        <div style={{ maxWidth: '1000px', width: '100%', marginBottom: '100px', textAlign: 'center' }}>
          <div style={{ color: '#FFC72C', fontWeight: 800, letterSpacing: '1px', marginBottom: '16px' }}>WHY CHOOSE AEGIS?</div>
          <h2 style={{ fontSize: '3rem', color: '#00678a', margin: '0 0 24px 0', lineHeight: 1.2, fontWeight: 800 }}>
            Reliable. Intelligent. Instant.
          </h2>
          <p style={{ fontSize: '1.25rem', color: '#555555', fontFamily: '"Poppins", sans-serif', lineHeight: 1.8, marginBottom: '32px', fontWeight: 500 }}>
            At AEGIS, we redefine protection for the modern gig economy.
          </p>
          <p style={{ fontSize: '1.1rem', color: '#666666', fontFamily: '"Poppins", sans-serif', lineHeight: 1.7, marginBottom: '48px' }}>
            Whether it’s extreme weather conditions, hazardous air quality, civic disruptions, or unexpected platform outages, AEGIS stands by workers when their income is at risk. Our system doesn’t just react—it predicts, verifies, and responds in real time.
          </p>
          
          <div style={{ background: 'rgba(0, 103, 138, 0.03)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(0, 103, 138, 0.1)', textAlign: 'left', marginBottom: '40px' }}>
            <p style={{ fontSize: '1.1rem', color: '#333333', fontFamily: '"Poppins", sans-serif', fontWeight: 600, marginBottom: '24px' }}>
              Powered by advanced AI models and a zero-trust Double-Lock Engine, AEGIS ensures that every payout is:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <CheckCircle size={24} color="#00678a" />
                <span style={{ fontSize: '1.1rem', fontFamily: '"Poppins", sans-serif' }}><strong style={{ color: '#00678a' }}>Accurate</strong> – No false claims, no missed risks</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <CheckCircle size={24} color="#00678a" />
                <span style={{ fontSize: '1.1rem', fontFamily: '"Poppins", sans-serif' }}><strong style={{ color: '#00678a' }}>Instant</strong> – Automated settlements within seconds</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <CheckCircle size={24} color="#00678a" />
                <span style={{ fontSize: '1.1rem', fontFamily: '"Poppins", sans-serif' }}><strong style={{ color: '#00678a' }}>Transparent</strong> – Fully explainable decision logic</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', color: '#666666', fontFamily: '"Poppins", sans-serif', lineHeight: 1.7, marginBottom: '32px' }}>
            From preventing losses through proactive alerts to enabling instant, paperwork-free payouts, AEGIS delivers a safety net that truly works when it matters most.
          </p>
          
          <div style={{ borderTop: '2px solid #f0f0f0', borderBottom: '2px solid #f0f0f0', padding: '32px 0', display: 'inline-block', width: '100%' }}>
            <h3 style={{ fontSize: '1.8rem', color: '#333333', fontWeight: 600, margin: '0 0 8px 0' }}>We are not just insurance.</h3>
            <h3 style={{ fontSize: '2.2rem', color: '#00678a', fontWeight: 800, margin: 0 }}>We are income security, reimagined.</h3>
          </div>
        </div>
        
        {/* The Problem Solved Section */}
        <div style={{ maxWidth: '1100px', display: 'flex', gap: '60px', alignItems: 'center', marginBottom: '100px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ width: '100%', height: '320px', background: 'rgba(0, 103, 138, 0.05)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 103, 138, 0.1)' }}>
               <Shield size={160} color="#00678a" opacity={0.1} />
               <div style={{ position: 'absolute' }}>
                 <BrainCircuit size={100} color="#00678a" />
               </div>
            </div>
          </div>
          <div style={{ flex: 1.5 }}>
            <div style={{ color: '#FFC72C', fontWeight: 800, letterSpacing: '1px', marginBottom: '12px' }}>THE PROBLEM SOLVED</div>
            <h2 style={{ fontSize: '2.6rem', color: '#00678a', margin: '0 0 20px 0', lineHeight: 1.2, fontWeight: 800 }}>Solving the Sunk-Cost Fallacy</h2>
            <p style={{ color: '#555555', fontFamily: '"Poppins", sans-serif', lineHeight: 1.7, fontSize: '1.1rem', marginBottom: '20px' }}>
              Traditional insurance fails because of Basis Risk (paying out when no local loss occurred) and Adverse Selection (fraud rings). Furthermore, gig workers operate on razor-thin margins and hate paying for something they don't use.
            </p>
            <p style={{ color: '#555555', fontFamily: '"Poppins", sans-serif', lineHeight: 1.7, fontSize: '1.1rem', fontWeight: 500 }}>
              Aegis solves all three. We mathematically align the worker's financial success with our platform's profitability using multi-modal AI and gamified behavioral micro-savings.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div style={{ width: '100%', maxWidth: '1200px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '2.6rem', color: '#00678a', marginBottom: '16px', fontWeight: 800 }}>Zero-Trust Parametric Engine</h2>
            <p style={{ color: '#666666', fontFamily: '"Poppins", sans-serif', fontSize: '1.15rem', margin: '0 auto', maxWidth: '700px', lineHeight: 1.6 }}>
              Aegis treats the worker's smartphone as a multi-modal IoT sensor, crushing coordinated fraud rings before they drain the liquidity pool.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            
            <div style={{ background: '#ffffff', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <div style={{ background: 'rgba(0, 103, 138, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Zap size={32} color="#00678a" />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#00678a', marginBottom: '12px', fontWeight: 800 }}>AI Physics Validation</h3>
              <p style={{ color: '#666666', fontFamily: '"Poppins", sans-serif', fontSize: '0.95rem', lineHeight: 1.6 }}>Our Hybrid CNN Model analyzes the native accelerometer for 0-axis anomalies. A genuine rider stuck in a flood makes micro-movements; a spoofed emulator sits perfectly flat.</p>
            </div>
            
            <div style={{ background: '#ffffff', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <div style={{ background: 'rgba(0, 103, 138, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Radio size={32} color="#00678a" />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#00678a', marginBottom: '12px', fontWeight: 800 }}>Temporal Transformer</h3>
              <p style={{ color: '#666666', fontFamily: '"Poppins", sans-serif', fontSize: '0.95rem', lineHeight: 1.6 }}>If multiple "stranded" riders are spread across a zone but ping the exact same Wi-Fi BSSID and show indoor battery thermals, the syndicate farm is automatically blocked.</p>
            </div>

            <div style={{ background: '#ffffff', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <div style={{ background: 'rgba(255, 199, 44, 0.2)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <BarChart2 size={32} color="#ffb000" />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#00678a', marginBottom: '12px', fontWeight: 800 }}>Dynamic Actuarial Pricing</h3>
              <p style={{ color: '#666666', fontFamily: '"Poppins", sans-serif', fontSize: '0.95rem', lineHeight: 1.6 }}>LSTMs analyze 4-week earning averages against 7-day Guidewire HazardHub weather forecasts to calculate precise, dynamic weekly premiums (Pw).</p>
            </div>

            <div style={{ background: '#ffffff', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <div style={{ background: 'rgba(0, 103, 138, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Wallet size={32} color="#00678a" />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#00678a', marginBottom: '12px', fontWeight: 800 }}>The Resilience Wallet</h3>
              <p style={{ color: '#666666', fontFamily: '"Poppins", sans-serif', fontSize: '0.95rem', lineHeight: 1.6 }}>A portion of every premium funds the worker's personal micro-savings. Claim-free streaks accumulate balances that automatically pay for their next premium.</p>
            </div>

            <div style={{ background: '#ffffff', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <div style={{ background: 'rgba(0, 103, 138, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Wind size={32} color="#00678a" />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#00678a', marginBottom: '12px', fontWeight: 800 }}>Double-Lock Trigger</h3>
              <p style={{ color: '#666666', fontFamily: '"Poppins", sans-serif', fontSize: '0.95rem', lineHeight: 1.6 }}>Payouts require both Objective Disruption (Rainfall/AQI API thresholds) AND Operational Impairment (DBSCAN cluster speeds dropping below 5 km/h).</p>
            </div>

            <div style={{ background: '#ffffff', padding: '40px 32px', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
              <div style={{ background: 'rgba(255, 199, 44, 0.2)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <Send size={32} color="#ffb000" />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#00678a', marginBottom: '12px', fontWeight: 800 }}>Instant UPI Settlements</h3>
              <p style={{ color: '#666666', fontFamily: '"Poppins", sans-serif', fontSize: '0.95rem', lineHeight: 1.6 }}>By orchestrating Guidewire ClaimCenter with Razorpay routes, verified claims bypass NEFT delays and hit the worker's bank account in under 90 seconds.</p>
          </div>
        </div>

      </div>

      {/* Coverage Section */}
      <div style={{ width: '100%', background: '#F9FAFB', padding: '100px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: '1200px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '3rem', color: '#0A1F2E', marginBottom: '24px', fontWeight: 800, fontFamily: '"Syne", sans-serif' }}>What is Covered by AEGIS Income Protection?</h2>
            <p style={{ fontSize: '1.2rem', color: '#5A7A8A', fontFamily: '"DM Sans", sans-serif', maxWidth: '800px', margin: '0 auto', lineHeight: 1.6 }}>
              AEGIS provides real-time, AI-driven income protection for gig workers against both predictable and unexpected disruptions. Here's exactly what your policy covers.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '40px', background: 'white', padding: '60px', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            
            {/* What's Covered */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '50%' }}>
                  <CheckCircle size={28} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A1F2E', margin: 0 }}>What's Covered</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {[
                  { title: "Income Loss Due to Disruptions", desc: "AEGIS compensates for verified loss of earnings caused by events like heavy rain, strikes, or platform outages—calculated using real-time activity data." },
                  { title: "Weather-Based Events", desc: "Coverage includes income disruption due to: Monsoons, Flooding, Extreme heat / AQI spikes, Storms and cyclones." },
                  { title: "Civic & Man-Made Disruptions", desc: "We cover losses caused by: Strikes and protests, Road blockages, Government restrictions, Unexpected urban disruptions." },
                  { title: "Platform Downtime Protection", desc: "If gig platforms face server crashes, order drops, or app outages—AEGIS ensures your income is still protected." },
                  { title: "Fraud-Protected Claims", desc: "Spatial CNN detects fake movement & GPS spoofing. Temporal Transformer detects fraud networks. Only genuine claims are paid instantly." },
                  { title: "Instant Payouts", desc: "Once a disruption is verified, claims are processed in under 90 seconds and money is directly credited to your UPI account." },
                  { title: "Resilience Wallet Benefits", desc: "Unused premiums are not wasted: Converted into a Resilience Wallet, used for future coverage or free protection weeks." },
                  { title: "Offline Protection (UX Trust Protocol)", desc: "Even if your network fails: Data is securely cached, synced later, and ensures fair payouts without penalties." }
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ marginTop: '4px' }}>
                      <CheckCircle2 size={24} color="#10b981" fill="#ecfdf5" style={{ borderRadius: '50%' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A1F2E', marginBottom: '8px' }}>{item.title}</h4>
                      <p style={{ fontSize: '1rem', color: '#5A7A8A', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Not Covered & Advantage */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '50%' }}>
                  <AlertOctagon size={28} color="#ef4444" />
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A1F2E', margin: 0 }}>What's Not Covered</h3>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '50px' }}>
                {[
                  "Fake or manipulated activity (blocked by AI fraud engine)",
                  "Voluntary inactivity (not working by choice)",
                  "Non-verified income loss",
                  "Device tampering or integrity violations"
                ].map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <AlertOctagon size={20} color="#ef4444" />
                    <span style={{ fontSize: '1.05rem', color: '#5A7A8A', fontWeight: 500 }}>{item}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: 'linear-gradient(135deg, #FFC72C, #F59E0B)', borderRadius: '24px', padding: '32px', color: '#0f172a', boxShadow: '0 15px 30px rgba(245, 158, 11, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <Zap size={28} fill="currentColor" />
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>AEGIS Advantage</h3>
                </div>
                <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '24px', opacity: 0.9 }}>Unlike traditional insurance:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    "Zero paperwork",
                    "Zero delays",
                    "Zero fraud leakage",
                    "100% data-driven payouts"
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={22} color="#0f172a" />
                      <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
);

  const renderOnboarding = () => (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '1200px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
            <Shield size={24} color="var(--primary)" /> AEGIS <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>| SECURE TRAILS</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            AI-Powered Parametric Protection for Gig Economy Partners
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px' }}>
          {/* Left Side: Value Proposition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

            {/* Main Feature Card */}
            <div className="card" style={{ background: 'white', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '200px', height: '120px', background: '#e2e8f0', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                    <Activity size={20} fill="#ef4444" />
                  </div>
                  <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'var(--accent-red)', color: 'white', fontSize: '0.65rem', padding: '2px 8px', borderRadius: '4px' }}>LIVE FEED</div>
                </div>
                <div>
                  <h3 style={{ color: 'var(--accent-red)', fontSize: '1.1rem', marginBottom: '4px' }}>Signature Assure Shield</h3>
                  <h2 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Protect Income with <br />Goal Assurance</h2>
                </div>
              </div>
            </div>

            {/* Pay/Get Card */}
            <div className="card" style={{ background: 'white', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img src="https://img.icons8.com/bubbles/100/000000/user-male.png" alt="Rider" style={{ width: '80px' }} />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Pay</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>₹40 p.w</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>for active protection</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Get</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-green)' }}>₹1,500*</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>instant payout @disruption</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tax/Benefit Bar */}
            <div style={{ background: 'rgba(0, 115, 152, 0.05)', padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px dashed var(--primary)' }}>
              <Wallet size={20} color="var(--primary)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--primary)' }}>Get tax & platform benefits on premium paid u/s 80C & platform incentives</span>
            </div>

            {/* Benefits Section */}
            <div>
              <h3 style={{ marginBottom: '20px', fontWeight: 500 }}>Smart benefits for your family in your absence</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="card" style={{ padding: '16px', textAlign: 'center', border: 'none', background: '#fff' }}>
                  <ShieldCheck size={24} color="var(--primary)" style={{ marginBottom: '12px' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Life Cover</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>@ ₹12 Lakhs</div>
                </div>
                <div className="card" style={{ padding: '16px', textAlign: 'center', border: 'none', background: '#fff' }}>
                  <CreditCard size={24} color="var(--primary)" style={{ marginBottom: '12px' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Premium waiver</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>up to ₹1.19 Lakh</div>
                </div>
                <div className="card" style={{ padding: '16px', textAlign: 'center', border: 'none', background: '#fff' }}>
                  <CalendarClock size={24} color="var(--primary)" style={{ marginBottom: '12px' }} />
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Weekly income</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>up to ₹8,000</div>
                </div>
              </div>
              <button className="btn" style={{ color: 'var(--primary)', background: 'transparent', padding: '12px 0', fontSize: '0.9rem', fontWeight: 600 }}>View all benefits &gt;</button>
            </div>
          </div>

          {/* Right Side: Calculator Form */}
          <div className="card" style={{ background: 'white', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: '0', borderRadius: '20px' }}>
            <div style={{ background: '#003366', color: 'white', padding: '12px 24px', borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>AEGIS calculator</span>
              <span style={{ fontSize: '0.8rem' }}>Starts at just ₹25 p.w</span>
            </div>

            <form onSubmit={handleOnboardingSubmit} style={{ padding: '32px' }}>
              <h3 style={{ marginBottom: '24px', fontSize: '1.2rem' }}>Aegis Shield Plan calculator</h3>

              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input type="text" className="input-field" placeholder="E.g., Rahul Kumar" required value={riderInfo.name} onChange={e => setRiderInfo({ ...riderInfo, name: e.target.value })} />
              </div>

              <div className="input-group">
                <label className="input-label">Gender</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {['Male', 'Female', 'Other'].map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setRiderInfo({ ...riderInfo, gender: g })}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: riderInfo.gender === g ? 'var(--primary)' : '#e2e8f0',
                        background: riderInfo.gender === g ? 'var(--primary)' : 'white',
                        color: riderInfo.gender === g ? 'white' : 'var(--text-main)',
                        cursor: 'pointer',
                        fontWeight: riderInfo.gender === g ? 600 : 400,
                        fontSize: '0.9rem'
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Date of Birth</label>
                  <input type="date" className="input-field" value={riderInfo.dob} onChange={e => setRiderInfo({ ...riderInfo, dob: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Your Weekly Earning</label>
                  <select className="input-field input-select" value={riderInfo.avgEarnings} onChange={e => setRiderInfo({ ...riderInfo, avgEarnings: Number(e.target.value) })}>
                    <option value="1500">₹1,500 - ₹3,000</option>
                    <option value="3000">₹3,000 - ₹5,000</option>
                    <option value="5000">₹5,000 - ₹8,000</option>
                    <option value="8000">₹8,000+</option>
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Mobile Number</label>
                  <input type="tel" className="input-field" placeholder="10 digit mobile number" maxLength="10" minLength="10" pattern="[0-9]{10}" value={riderInfo.mobile} onChange={e => setRiderInfo({ ...riderInfo, mobile: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Your Email ID</label>
                  <input type="email" className="input-field" placeholder="Enter Your Email Id" value={riderInfo.email} onChange={e => setRiderInfo({ ...riderInfo, email: e.target.value })} />
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Operating City</label>
                  <select className="input-field input-select" value={riderInfo.city} onChange={e => setRiderInfo({ ...riderInfo, city: e.target.value })}>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                    <option value="Hyderabad">Hyderabad</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Platform Partner</label>
                  <select className="input-field input-select" value={riderInfo.platform} onChange={e => setRiderInfo({ ...riderInfo, platform: e.target.value })}>
                    <option value="Zomato">Zomato</option>
                    <option value="Swiggy">Swiggy</option>
                    <option value="Zepto">Zepto</option>
                    <option value="Blinkit">Blinkit</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', margin: '16px 0' }}>
                <input type="checkbox" checked readOnly style={{ marginTop: '4px' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  By submitting my details, I authorize Aegis Security and its representatives to contact me. I further consent to permit Aegis to process and share my information with third parties for risk assessment. <span style={{ color: 'var(--primary)' }}>View More</span>
                </p>
              </div>

              <button type="submit" className="btn" style={{ width: '100%', background: 'var(--primary)', color: 'white', padding: '16px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600, boxShadow: '0 4px 14px var(--glow-primary)' }}>
                Let's Calculate Protection
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRiderDashboard = () => {
    const selectedZone = MOCK_ZONES.find(z => z.id === riderInfo.zone) || MOCK_ZONES[0];
    // Premium and coverage amount rely on state calculated from API
    // const coverageAmount removed as we use state

    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Guidewire DevTrails Header */}
        <header style={{ background: 'var(--header-bg)', color: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={28} color="var(--accent-yellow)" />
            <div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, letterSpacing: '1px' }}>GUIDEWIRE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1 }}>DEV <span style={{ color: 'var(--accent-yellow)' }}>Trails</span></div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>
              <Bell size={14} /> Notifications
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{riderInfo.name || 'Partner'}</span>
              <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={16} />
              </div>
            </div>
          </div>
        </header>

        <div className="app-wrapper" style={{ flex: 1 }}>
          <aside className="sidebar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>Aegis Portal</span>
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button type="button" className={`btn ${riderTab === 'overview' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'overview' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'overview' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'overview' ? 'none' : '1px solid transparent' }} onClick={() => { setRiderTab('overview'); document.querySelector('.main-content')?.scrollTo(0, 0); }}>
                <Activity size={18} /> Overview
              </button>
              <button type="button" className={`btn ${riderTab === 'plan-advisor' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'plan-advisor' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'plan-advisor' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'plan-advisor' ? 'none' : '1px solid transparent' }} onClick={() => { setRiderTab('plan-advisor'); document.querySelector('.main-content')?.scrollTo(0, 0); }}>
                <Lightbulb size={18} /> Plan Advisor
              </button>
              <button type="button" className={`btn ${riderTab === 'my-policy' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'my-policy' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'my-policy' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'my-policy' ? 'none' : '1px solid transparent' }} onClick={() => { setRiderTab('my-policy'); document.querySelector('.main-content')?.scrollTo(0, 0); }}>
                <ShieldCheck size={18} /> My Policy
              </button>
              <button type="button" className={`btn ${riderTab === 'explore-plans' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'explore-plans' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'explore-plans' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'explore-plans' ? 'none' : '1px solid transparent' }} onClick={() => { setRiderTab('explore-plans'); document.querySelector('.main-content')?.scrollTo(0, 0); }}>
                <Sliders size={18} /> Explore Plans
              </button>
              <button type="button" className={`btn ${riderTab === 'file-claim' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'file-claim' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'file-claim' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'file-claim' ? 'none' : '1px solid transparent' }} onClick={() => { setRiderTab('file-claim'); document.querySelector('.main-content')?.scrollTo(0, 0); }}>
                <ListPlus size={18} /> File a Claim
              </button>
              <button type="button" className={`btn ${riderTab === 'claim-history' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'claim-history' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'claim-history' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'claim-history' ? 'none' : '1px solid transparent' }} onClick={() => { setRiderTab('claim-history'); document.querySelector('.main-content')?.scrollTo(0, 0); }}>
                <Clock size={18} /> Claim History
              </button>
              <button type="button" className={`btn ${riderTab === 'wallet' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'wallet' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'wallet' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'wallet' ? 'none' : '1px solid transparent' }} onClick={() => { setRiderTab('wallet'); document.querySelector('.main-content')?.scrollTo(0, 0); }}>
                <Wallet size={18} /> Wallet & Payouts
              </button>
              <button type="button" className={`btn ${riderTab === 'help' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'help' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'help' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'help' ? 'none' : '1px solid transparent' }} onClick={() => { setRiderTab('help'); document.querySelector('.main-content')?.scrollTo(0, 0); }}>
                <HelpCircle size={18} /> Help & Support
              </button>
              <div style={{ margin: '16px 0', borderTop: '1px solid var(--card-border)' }}></div>
              <button type="button" className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', color: 'var(--accent-red)' }} onClick={() => { setCurrentView('login'); setRiderTab('overview'); }}>
                <Search size={18} /> Log Out
              </button>
            </nav>
          </aside>

          <main className="main-content">
            {riderTab === 'overview' && (
              <>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <div>
                    <h1 className="animate-slide-up">Welcome back, {riderInfo.name || 'Rider'}</h1>
                    <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Here is your income protection overview for {selectedZone.name}.</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--card-bg)', padding: '8px 16px', borderRadius: '999px', border: '1px solid var(--card-border)' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }}></div>
                    <span style={{ fontSize: '0.85rem', fontWeight: '500' }}>System Online</span>
                  </div>
                </header>

                <div className="grid-3 animate-slide-up delay-200" style={{ marginBottom: '32px' }}>
                  {hasActivePolicy ? (
                    <div className="card glass-panel" style={{ borderLeft: '4px solid var(--accent-green)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <span className="badge badge-green">Active Policy</span>
                        <CheckCircle size={20} color="var(--accent-green)" />
                      </div>
                      <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>₹{coverageAmount}</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Max Weekly Coverage</p>
                    </div>
                  ) : (
                    <div className="card glass-panel">
                      <span className="badge badge-red" style={{ marginBottom: '16px' }}>No Active Protection</span>
                      <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>₹0</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Weekly Coverage</p>
                    </div>
                  )}

                  <div className="card">
                    <span className="badge badge-blue" style={{ marginBottom: '16px' }}>AI Risk Score</span>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {(rScore / 10).toFixed(1)} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ 10</span>
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Based on 5-year historical data</p>
                  </div>

                  <div className="card">
                    <span className="badge badge-orange" style={{ marginBottom: '16px' }}>Current Weather</span>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{currentConditions.weather}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time API Sync</p>
                  </div>
                </div>

                {!hasActivePolicy && (
                  <div className="card glass-panel animate-slide-up delay-300" style={{ background: 'linear-gradient(145deg, var(--card-bg), rgba(0, 115, 152, 0.05))', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 className="text-gradient">Protect this week's earnings</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '500px' }}>
                          Pay a small premium to ensure you get paid even if heavy rain, extreme heat, or curfews stop you from delivering.
                        </p>
                        <p style={{ marginTop: '16px', fontWeight: '600' }}>Premium: ₹{calculatedPremium} / week</p>
                      </div>
                      <button className="btn btn-primary" style={{ padding: '12px 24px' }} onClick={initiatePolicy}>
                        Activate Now
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: '32px' }} className="animate-slide-up delay-300">
                  <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="var(--primary)" /> Live API Feeds
                  </h3>
                  <div className="grid-4">
                    <div className="card glass-panel" style={{ borderLeft: '4px solid #60a5fa' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Weather</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 600 }}>
                        <CloudRain size={20} color="#60a5fa" /> {currentConditions.weather}
                      </div>
                    </div>
                    <div className="card glass-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Temperature</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 600 }}>
                        <Thermometer size={20} color="#f59e0b" /> {currentConditions.temp}°C
                      </div>
                    </div>
                    <div className="card glass-panel" style={{ borderLeft: '4px solid #34d399' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Air Quality (AQI)</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 600 }}>
                        <Wind size={20} color="#34d399" /> {currentConditions.aqi}
                      </div>
                    </div>
                    <div className="card glass-panel" style={{ borderLeft: '4px solid #f43f5e' }}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>Traffic</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', fontWeight: 600 }}>
                        <Siren size={20} color="#f43f5e" /> {currentConditions.traffic}
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }} className="animate-slide-up delay-300">
                  <h3>Parametric Triggers</h3>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px' }} onClick={resetConditions}>Clear</button>
                    <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '6px 12px', borderColor: 'var(--accent-red)', color: 'var(--accent-red)' }} onClick={simulateDisaster}>
                      Simulate Rainstorm
                    </button>
                  </div>
                </div>

                <div className="grid-4 animate-slide-up delay-300" style={{ marginBottom: '32px' }}>
                  {PREDEFINED_TRIGGERS.map((trigger, i) => {
                    const isActive = trigger.condition === currentConditions.weather;
                    return (
                      <div key={i} className={`card ${isActive ? 'glass-panel' : ''}`} style={{
                        opacity: isActive ? 1 : 0.6,
                        border: isActive ? '1px solid var(--accent-red)' : '',
                        boxShadow: isActive ? '0 0 20px rgba(239, 68, 68, 0.2)' : ''
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: isActive ? 'var(--accent-red)' : 'var(--text-main)' }}>
                          {trigger.icon}
                          <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{trigger.type}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem' }}>{trigger.condition}</p>
                      </div>
                    )
                  })}
                </div>

                {claims.length > 0 && (
                  <>
                    <h3 className="animate-slide-up" style={{ marginBottom: '16px' }}>Recent Automations</h3>
                    <div className="grid-2 animate-slide-up">
                      {claims.filter(c => c.status.includes('Instant')).map(c => (
                        <div key={c.id} className="card glass-panel" style={{ borderLeft: '4px solid var(--accent-green)', padding: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span className="badge badge-green">Auto-Claimed</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.date}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                            <div>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cause: {c.reason}</p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', color: 'var(--accent-green)', fontSize: '0.85rem', fontWeight: '500' }}>
                                <CheckCircle size={14} /> Deposited via UPI
                              </div>
                            </div>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent-green)' }}>+₹{c.amount}</h2>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {riderTab === 'explore-plans' && (() => {
              const weeklyRain = currentConditions.weather === 'Heavy Rain (>50mm/hr)' ? 55 : 8;
              const zoneProfile = ZONE_RISK_PROFILES[riderInfo.zone] || ZONE_RISK_PROFILES.z1;
              return (
              <>
                <header style={{ marginBottom: '24px' }}>
                  <h1 className="animate-slide-up">Explore Plans</h1>
                  <p style={{ color: 'var(--text-muted)' }}>Your premium is personalised using zone flood history, live weather + your behavioural R-Score.</p>
                </header>

                {/* Premium Zone + AI pricing insight banner (Light Blue Theme) */}
                <div className="card animate-slide-up delay-100" style={{ 
                  marginBottom: '32px', 
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
                  color: '#0f172a', 
                  padding: '28px',
                  borderRadius: '20px',
                  boxShadow: '0 12px 30px -10px rgba(0, 115, 152, 0.15)',
                  border: '1px solid #bae6fd',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {/* Decorative background glow */}
                  <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(2,132,199,0.1) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%' }}></div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    {/* Left Icon Area */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 200px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.7)', padding: '16px', borderRadius: '16px', flexShrink: 0, border: '1px solid #bae6fd', boxShadow: '0 4px 10px rgba(0,0,0,0.03)' }}>
                        <BrainCircuit size={28} color="var(--primary)" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', letterSpacing: '1.5px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>AI Pricing Engine</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Live Zone Analysis</div>
                      </div>
                    </div>

                    {/* Middle: Zone Selector + Insight */}
                    <div style={{ flex: '2 1 300px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Map size={18} color="var(--primary)" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>Operating Zone:</span>
                        <select
                          value={riderInfo.zone || 'z1'}
                          onChange={e => setRiderInfo({ ...riderInfo, zone: e.target.value })}
                          style={{ 
                            background: '#ffffff', 
                            border: '1px solid #bae6fd', 
                            color: '#0f172a', 
                            borderRadius: '10px', 
                            padding: '8px 12px', 
                            fontWeight: 700, 
                            fontSize: '0.95rem', 
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
                          }}
                        >
                          {Object.entries(ZONE_RISK_PROFILES).map(([id, z]) => (
                            <option key={id} value={id} style={{ color: '#0f172a', background: '#fff' }}>{z.name} ({z.waterloggingRisk} Risk)</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', padding: '10px 14px', background: 'rgba(255,255,255,0.7)', borderRadius: '10px', borderLeft: '3px solid var(--primary)', border: '1px solid #e0f2fe', borderLeftWidth: '3px' }}>
                        {zoneProfile.insight}
                      </div>
                    </div>

                    {/* Right: Quick Stats */}
                    <div style={{ display: 'flex', gap: '24px', flexShrink: 0, fontSize: '0.82rem', background: '#ffffff', padding: '16px 24px', borderRadius: '16px', border: '1px solid #bae6fd', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#64748b', marginBottom: '6px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Flood Risk</div>
                        <div style={{ fontWeight: 800, fontSize: '1.3rem', color: zoneProfile.floodIncidents3yr > 10 ? '#dc2626' : '#059669' }}>{zoneProfile.floodIncidents3yr} <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>evts</span></div>
                      </div>
                      <div style={{ width: '1px', background: '#e2e8f0' }}></div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#64748b', marginBottom: '6px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>R-Score</div>
                        <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#d97706' }}>{rScore}</div>
                      </div>
                      <div style={{ width: '1px', background: '#e2e8f0' }}></div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ color: '#64748b', marginBottom: '6px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Rain/Wk</div>
                        <div style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)' }}>{weeklyRain}<span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>mm</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activated confirmation */}
                {activatedPlan && (
                  <div style={{ marginBottom: '16px', padding: '14px 20px', background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <CheckCircle size={20} color="#10b981" />
                    <span style={{ fontWeight: 700, color: '#059669' }}>✅ <b>{activatedPlan.name}</b> activated! Weekly premium: <b>₹{activatedPlan.premium}/wk</b>. Guidewire policy record created.</span>
                    <button onClick={() => setActivatedPlan(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                  </div>
                )}

                {/* Auto-responsive Grid for Plans */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }} className="animate-slide-up delay-200">
                  {POLICY_CATALOG.map(policy => {
                    const pricing = computeDynamicPremium(policy, riderInfo.zone || 'z1', rScore, walletBalance, weeklyRain);
                    const isSelected = selectedPlan === policy.id;
                    const isCurrentActive = activatedPlan && activatedPlan.id === policy.id;
                    const showBreakdown = showPricingBreakdown === policy.id;
                    return (
                      <div
                        key={policy.id}
                        onClick={() => setSelectedPlan(policy.id)}
                        style={{
                          border: isSelected ? `2px solid ${policy.color}` : '1px solid var(--card-border)',
                          borderRadius: '24px',
                          background: isSelected ? 'var(--card-bg)' : 'var(--card-bg)',
                          boxShadow: isSelected ? `0 16px 40px -12px ${policy.color}60` : '0 4px 12px rgba(0,0,0,0.03)',
                          cursor: 'pointer',
                          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          transform: isSelected ? 'translateY(-4px)' : 'none'
                        }}
                      >
                        {/* Top Accent Line */}
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: policy.color }} />

                        {/* Top Badges */}
                        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                          {isCurrentActive && (
                            <div style={{ background: '#10b981', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>✅ ACTIVE</div>
                          )}
                          {policy.badge && !isCurrentActive && (
                            <div style={{ background: policy.color, color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', borderRadius: '20px', letterSpacing: '0.5px' }}>{policy.badge}</div>
                          )}
                        </div>

                        {/* Internal Card Content */}
                        <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                          
                          {/* Header section */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', marginTop: '4px' }}>
                            <div style={{ background: policy.accentColor, padding: '12px', borderRadius: '14px', flexShrink: 0 }}>
                              <Shield size={24} color={policy.color} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-main)', lineHeight: 1.2 }}>{policy.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.3 }}>{policy.tagline}</div>
                            </div>
                          </div>

                          {/* Dynamic Pricing Info Box */}
                          <div style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                              <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>AI Premium</div>
                                <div style={{ fontSize: '2rem', fontWeight: 800, color: policy.color, lineHeight: 1 }}>₹{pricing.finalPremium}<span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>/wk</span></div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Max Payout</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>₹{policy.coverage.toLocaleString()}</div>
                              </div>
                            </div>

                            {/* Savings/Bonus Pills */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {pricing.savings > 0 && (
                                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '8px 12px', fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} /> Zone & Behaviour Savings</span>
                                  <span style={{ fontSize: '0.85rem' }}>-₹{pricing.savings}</span>
                                </div>
                              )}
                              {pricing.bonusCoverageHours > policy.coverageHours && (
                                <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '8px 12px', fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Clock size={14} /> +{pricing.bonusCoverageHours - policy.coverageHours}h bonus coverage (Clear Weather)
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Covered Triggers (Chips) */}
                          <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Triggers Monitored</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                              {policy.triggers.map((t, i) => (
                                <span key={i} style={{ background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '8px', padding: '4px 10px', fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 500 }}>{t}</span>
                              ))}
                            </div>
                          </div>

                          {/* Perks List */}
                          <div style={{ marginBottom: '24px', flex: 1 }}>
                            {policy.perks.map((p, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 500 }}>
                                <CheckCircle size={16} color={policy.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span>{p}</span>
                              </div>
                            ))}
                          </div>

                          {/* AI Breakdown Accordion */}
                          <div style={{ marginBottom: '16px' }}>
                            <button
                              onClick={e => { e.stopPropagation(); setShowPricingBreakdown(showBreakdown ? null : policy.id); }}
                              style={{ width: '100%', background: showBreakdown ? 'var(--bg-color)' : 'transparent', border: `1px solid ${policy.color}30`, color: policy.color, borderRadius: '10px', padding: '10px 14px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><BrainCircuit size={16} /> AI Pricing Breakdown</span>
                              <span>{showBreakdown ? '▲' : '▼'}</span>
                            </button>

                            {/* Expanded Breakdown */}
                            {showBreakdown && (
                              <div className="animate-slide-up" style={{ background: 'var(--bg-color)', border: '1px solid var(--card-border)', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '16px', fontSize: '0.8rem', marginTop: '-4px', position: 'relative', zIndex: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-main)', fontWeight: 500 }}>
                                  <span>📍 HazardHub Zone multiplier</span>
                                  <span style={{ fontWeight: 800, color: pricing.breakdown.zoneMultiplier > 1 ? '#ef4444' : '#10b981' }}>{pricing.breakdown.zoneMultiplier}×</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-main)', fontWeight: 500 }}>
                                  <span>🌧️ 7-Day Weather multiplier</span>
                                  <span style={{ fontWeight: 800, color: pricing.breakdown.weatherMultiplier > 1 ? '#f59e0b' : '#10b981' }}>{pricing.breakdown.weatherMultiplier}×</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'var(--text-main)', fontWeight: 500 }}>
                                  <span>🏆 R-Score behavioural reward</span>
                                  <span style={{ fontWeight: 800, color: '#10b981' }}>-₹{pricing.breakdown.rScoreDiscount}</span>
                                </div>
                                {pricing.breakdown.walletCredit > 0 && (
                                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-main)', fontWeight: 500, borderTop: '1px solid var(--card-border)', paddingTop: '8px', marginTop: '4px' }}>
                                    <span>💰 Resilience Wallet auto-credit</span>
                                    <span style={{ fontWeight: 800, color: '#10b981' }}>-₹{pricing.breakdown.walletCredit}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* CTA Button */}
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              initiatePolicy();
                              setActivatedPlan({ id: policy.id, name: policy.name, premium: pricing.finalPremium });
                              setSelectedPlan(policy.id);
                            }}
                            className={isCurrentActive ? '' : 'btn'}
                            style={{
                              width: '100%',
                              padding: '16px',
                              background: isCurrentActive ? '#10b981' : isSelected ? policy.color : 'transparent',
                              color: isCurrentActive ? 'white' : isSelected ? 'white' : policy.color,
                              border: isCurrentActive ? 'none' : isSelected ? 'none' : `2px solid ${policy.color}`,
                              borderRadius: '12px',
                              fontWeight: 800,
                              fontSize: '1rem',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '8px',
                              boxShadow: isSelected && !isCurrentActive ? `0 8px 16px ${policy.color}40` : 'none',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {isCurrentActive ? <><CheckCircle size={20} /> Currently Active Plan</> : isSelected ? `Activate ${policy.name}` : 'Select Plan'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
              );
            })()}


            {riderTab === 'file-claim' && (
              <>
                <header style={{ marginBottom: '32px' }}>
                  <h1 className="animate-slide-up">File a Claim</h1>
                  <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Submit a manual loss-of-income request due to external disruptions.</p>
                </header>

                <div className="grid-2 animate-slide-up delay-200" style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="card glass-panel" style={{ width: '100%', maxWidth: '600px' }}>
                    <h3 style={{ marginBottom: '16px' }}>Incident Details</h3>
                    <form onSubmit={handleManualClaimSubmit}>
                      <div className="input-group">
                        <label className="input-label">Type of Disruption</label>
                        <select className="input-field input-select" value={manualClaim.reason} onChange={e => setManualClaim({ ...manualClaim, reason: e.target.value })}>
                          <optgroup label="1. Weather Disruption">
                            <option value="Rain">Rain</option>
                            <option value="Flood">Flood</option>
                            <option value="Heatwave">Heatwave</option>
                            <option value="Cyclone">Cyclone</option>
                          </optgroup>
                          <optgroup label="2. Environmental Condition">
                            <option value="High AQI">High AQI</option>
                            <option value="Pollution Alert">Pollution Alert</option>
                            <option value="Extreme Humidity">Extreme Humidity</option>
                          </optgroup>
                          <optgroup label="3. Infrastructure Problem">
                            <option value="Road Closure">Road Closure</option>
                            <option value="Construction Block">Construction Block</option>
                            <option value="Power Outage">Power Outage</option>
                          </optgroup>
                          <optgroup label="4. Social / Civic Issue">
                            <option value="Curfew">Curfew</option>
                            <option value="Strike">Strike</option>
                            <option value="City Shutdown">City Shutdown</option>
                          </optgroup>
                          <optgroup label="5. Platform Issue">
                            <option value="App Server Down">App Server Down</option>
                            <option value="GPS Error">GPS Error</option>
                          </optgroup>
                          <optgroup label="6. Location Issue">
                            <option value="Traffic Jam">Traffic Jam</option>
                            <option value="Accident Zone">Accident Zone</option>
                          </optgroup>
                        </select>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Estimated Loss (₹)</label>
                        <input type="number" className="input-field" placeholder="E.g., 500" required value={manualClaim.amount} onChange={e => setManualClaim({ ...manualClaim, amount: e.target.value })} />
                      </div>
                      <div className="input-group">
                        <label className="input-label">Brief Description</label>
                        <textarea className="input-field" rows="3" placeholder="Describe what prevented you from delivering..." required value={manualClaim.description} onChange={e => setManualClaim({ ...manualClaim, description: e.target.value })}></textarea>
                      </div>
                      <div className="input-group">
                        <label className="input-label">Upload Evidence/Proof</label>
                        <div className="input-field" style={{ borderStyle: 'dashed', textAlign: 'center', color: 'var(--text-muted)', cursor: 'pointer', padding: '24px' }}>
                          <Upload size={24} style={{ margin: '0 auto 8px auto', display: 'block' }} />
                          <p style={{ fontSize: '0.85rem' }}>Click or drag a photo here</p>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px' }}>
                        Submit Claim for Review
                      </button>
                    </form>
                  </div>
                </div>
              </>
            )}

            {riderTab === 'claim-history' && (
              <>
                <button onClick={() => setRiderTab('dashboard')} style={{ marginBottom: '16px', background: 'transparent', border: '1px solid var(--card-border)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ← Back to Dashboard
                </button>
                <header style={{ marginBottom: '32px' }}>
                  <h1 className="animate-slide-up">Claim History</h1>
                  <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Review your previously filed manual claims and automated logic traces.</p>
                </header>

                {/* Demo Trigger Buttons */}
                {hasActivePolicy && (
                  <div className="animate-slide-up delay-200" style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
                    <button 
                      className="btn btn-primary"
                      onClick={() => triggerInstantDemo('rain')}
                      disabled={demoTriggerLoading}
                      style={{ background: '#3b82f6', fontSize: '0.9rem' }}
                    >
                      {demoTriggerLoading ? '⏳' : '🌧️'} Trigger Rain
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => triggerInstantDemo('heat')}
                      disabled={demoTriggerLoading}
                      style={{ background: '#f59e0b', fontSize: '0.9rem' }}
                    >
                      {demoTriggerLoading ? '⏳' : '🔥'} Trigger Heat
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={() => triggerInstantDemo('strike')}
                      disabled={demoTriggerLoading}
                      style={{ background: '#ef4444', fontSize: '0.9rem' }}
                    >
                      {demoTriggerLoading ? '⏳' : '🚨'} Trigger Strike
                    </button>
                    <div style={{ padding: '12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #86efac', borderRadius: '8px', fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>
                      ✅ Click above to instantly create a claim
                    </div>
                  </div>
                )}

                <div className="animate-slide-up delay-200">
                  {claims.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 20px', border: '1px dashed var(--card-border)', background: 'rgba(0,0,0,0.02)' }}>
                      <FileText size={48} style={{ margin: '0 auto 16px auto', opacity: 0.3 }} />
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>No Claims Yet</h3>
                      <p style={{ fontSize: '0.9rem' }}>Click a demo trigger above to generate a parametric claim</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* PROFESSIONAL CLAIM ANALYSIS VIEW */}
                      {claims.map((c, idx) => {
                        const isExpanded = expandedClaimId === c.id;
                        
                        // Extract trigger type details
                        const getTriggerDetails = (trigger) => {
                          switch(trigger) {
                            case 'Heavy Rain (>50mm/hr)':
                              return {
                                icon: '🌧️',
                                threshold: '50mm/hr',
                                actual: Math.round(45 + Math.random() * 30) + 'mm/hr',
                                zone: 'Downtown Core',
                                coordinates: '19.0760°N, 72.8777°E',
                                riskLevel: 'High',
                                color: '#3b82f6',
                                factors: ['Rainfall intensity', 'Wind speed', 'Flood risk zone', 'Infrastructure damage potential']
                              };
                            case 'Extreme Heat (>44°C)':
                              return {
                                icon: '🔥',
                                threshold: '44°C',
                                actual: Math.round(42 + Math.random() * 8) + '°C',
                                zone: 'North Suburbs',
                                coordinates: '19.2183°N, 72.8479°E',
                                riskLevel: 'Medium',
                                color: '#f59e0b',
                                factors: ['Temperature anomaly', 'Heat index', 'Humidity level', 'Health risk alert']
                              };
                            case 'Civic Strike/Curfew':
                              return {
                                icon: '🚨',
                                threshold: 'Curfew Active',
                                actual: 'Civic strike declared',
                                zone: 'East Industrial',
                                coordinates: '19.0123°N, 72.8456°E',
                                riskLevel: 'Critical',
                                color: '#ef4444',
                                factors: ['Strike alert', 'Curfew hours', 'Transport disruption', 'Income loss probability']
                              };
                            default:
                              return {
                                icon: '📊',
                                threshold: 'N/A',
                                actual: 'N/A',
                                zone: 'Unknown',
                                coordinates: 'N/A',
                                riskLevel: 'Unknown',
                                color: '#6b7280',
                                factors: []
                              };
                          }
                        };
                        
                        const details = getTriggerDetails(c.reason);
                        const fraudScore = Math.random() * 15; // Low fraud score for parametric
                        const confidenceScore = 90 + Math.random() * 9;
                        
                        return (
                          <div 
                            key={c.id}
                            onClick={() => setExpandedClaimId(isExpanded ? null : c.id)}
                            style={{ 
                              cursor: 'pointer',
                              border: `2px solid ${details.color}`,
                              borderRadius: '16px',
                              overflow: 'hidden',
                              background: 'var(--card-bg)',
                              transition: 'all 0.3s ease',
                              transform: isExpanded ? 'scale(1.02)' : 'scale(1)',
                              boxShadow: isExpanded ? `0 20px 40px ${details.color}30` : 'none'
                            }}
                          >
                            {/* CLAIM HEADER - Always Visible */}
                            <div style={{ padding: '24px', background: `${details.color}10`, borderBottom: isExpanded ? `1px solid ${details.color}30` : 'none' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: '24px', alignItems: 'center' }}>
                                {/* Claim ID & Status */}
                                <div>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Claim ID</p>
                                  <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{c.id}</p>
                                  <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                                    <span style={{ background: '#10b981', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>✓ APPROVED</span>
                                    <span style={{ background: '#06b6d4', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600 }}>INSTANT</span>
                                  </div>
                                </div>
                                
                                {/* Trigger Details */}
                                <div>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Parametric Trigger</p>
                                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: details.color }}>{details.icon} {c.reason}</p>
                                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>📍 {details.zone} | Threshold: {details.threshold}</p>
                                </div>
                                
                                {/* Payout & Confidence */}
                                <div style={{ textAlign: 'center' }}>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Payout</p>
                                  <p style={{ fontSize: '1.5rem', fontWeight: 800, color: details.color }}>₹{c.amount}</p>
                                  <p style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '4px' }}>✓ Processed</p>
                                </div>
                                
                                {/* Risk & Date */}
                                <div style={{ textAlign: 'right' }}>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Risk Level</p>
                                  <p style={{ fontSize: '1rem', fontWeight: 700, color: details.riskLevel === 'Critical' ? '#ef4444' : details.riskLevel === 'High' ? '#f59e0b' : '#10b981' }}>
                                    {details.riskLevel === 'Critical' ? '🔴' : details.riskLevel === 'High' ? '🟠' : '🟢'} {details.riskLevel}
                                  </p>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{c.date}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* EXPANDED DETAILS - Parametric Analysis */}
                            {isExpanded && (
                              <div style={{ padding: '24px', borderTop: `1px solid ${details.color}30`, background: 'var(--card-bg)' }}>
                                {/* Parametric Analysis Metrics */}
                                <div style={{ marginBottom: '24px' }}>
                                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>⚙️ Parametric Analysis</h4>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                                    <div style={{ background: 'rgba(59,130,246,0.1)', padding: '12px', borderRadius: '8px', border: `1px solid ${details.color}20` }}>
                                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Threshold</p>
                                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>{details.threshold}</p>
                                    </div>
                                    <div style={{ background: `${details.color}10`, padding: '12px', borderRadius: '8px', border: `1px solid ${details.color}20` }}>
                                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Actual Measurement</p>
                                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: details.color }}>{details.actual}</p>
                                    </div>
                                    <div style={{ background: 'rgba(16,181,129,0.1)', padding: '12px', borderRadius: '8px', border: '1px solid #d1fae530' }}>
                                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fraud Score</p>
                                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>{fraudScore.toFixed(1)}%</p>
                                    </div>
                                    <div style={{ background: 'rgba(6,182,212,0.1)', padding: '12px', borderRadius: '8px', border: '1px solid #06b6d430' }}>
                                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Decision Confidence</p>
                                      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#06b6d4' }}>{confidenceScore.toFixed(1)}%</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Location Data */}
                                <div style={{ marginBottom: '24px' }}>
                                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>📍 Location & Risk Context</h4>
                                  <div style={{ background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                      <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Zone</p>
                                        <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>{details.zone}</p>
                                      </div>
                                      <div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Coordinates</p>
                                        <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', fontFamily: 'monospace' }}>{details.coordinates}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Trigger Factors */}
                                <div style={{ marginBottom: '24px' }}>
                                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>🔍 Trigger Factors Evaluated</h4>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                    {details.factors.map((factor, i) => (
                                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', border: '1px solid var(--card-border)' }}>
                                        <span style={{ fontSize: '1rem', opacity: 0.7 }}>✓</span>
                                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{factor}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                {/* Payout Calculation Logic */}
                                <div>
                                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>💰 Payout Calculation</h4>
                                  <div style={{ background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                    <p>Base Premium: ₹79.20/week</p>
                                    <p>Trigger Multiplier: {c.reason.includes('Rain') ? '8.0x' : c.reason.includes('Heat') ? '9.0x' : '11.0x'}</p>
                                    <p>Variance Factor: ±{Math.random().toFixed(2)}</p>
                                    <p style={{ borderTop: '1px solid var(--card-border)', paddingTop: '8px', marginTop: '8px', fontWeight: 600, color: details.color }}>Final Payout: ₹{c.amount}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Max Cap: ₹500 | Status: APPROVED | Processed: Instant</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}

            {riderTab === 'wallet' && (
              <>
                <header style={{ marginBottom: '32px' }}>
                  <h1 className="animate-slide-up">Wallet & Payouts</h1>
                  <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Manage how your approved claims are credited to your bank.</p>
                </header>

                <div className="grid-3 animate-slide-up delay-200" style={{ marginBottom: '32px' }}>
                  {/* Payout Balance */}
                  <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ opacity: 0.8 }}>Total Payouts</span>
                      <Landmark size={20} />
                    </div>
                    <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>₹{claims.reduce((acc, curr) => !curr.status.includes('Pending') ? acc + Number(curr.amount || 0) : acc, 0).toFixed(2)}</h1>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Earnings from parametric claims</p>

                    <button className="btn" style={{ background: 'white', color: 'var(--primary)', width: '100%', marginTop: 'auto', fontWeight: 600 }}>
                      Withdraw to Bank
                    </button>
                  </div>

                  {/* Resilience Wallet (Micro-Savings) */}
                  <div className="card" style={{ background: 'linear-gradient(135deg, #FFC72C 0%, #d97706 100%)', color: '#003366', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ opacity: 0.9, fontWeight: 700 }}>Resilience Wallet</span>
                      <ShieldCheck size={20} color="#003366" />
                    </div>
                    <h1 style={{ fontSize: '2.4rem', marginBottom: '4px', fontWeight: 800 }}>₹{walletBalance.toFixed(2)}</h1>
                    <div style={{ background: 'rgba(0,51,102,0.1)', padding: '4px 10px', borderRadius: '12px', display: 'inline-flex', fontSize: '0.75rem', fontWeight: 700, marginBottom: '12px', alignSelf: 'flex-start', color: '#003366' }}>Micro-Savings</div>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9, flex: 1, fontWeight: 500 }}>
                      Generated from a portion of your premiums. Maintain a claim-free streak to unlock a <strong>"Free Coverage Week"</strong>!
                    </p>
                  </div>

                  <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h3 style={{ marginBottom: '8px' }}>Payment Methods</h3>

                    <div style={{ padding: '16px', border: '1px solid var(--accent-green)', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--accent-green)', padding: '8px', borderRadius: '8px', color: 'white' }}>
                          <CreditCard size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>HDFC Bank xxxx9421</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Primary Payout Account</div>
                        </div>
                      </div>
                      <CheckCircle size={18} color="var(--accent-green)" />
                    </div>

                    <div style={{ padding: '16px', border: '1px solid var(--card-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--card-border)', padding: '8px', borderRadius: '8px', color: 'white' }}>
                          <Banknote size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>partner@upi</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant Backup Transfer</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="animate-slide-up delay-300" style={{ marginBottom: '16px' }}>Recent Transactions (Dummy Data)</h3>
                <div className="card animate-slide-up delay-300" style={{ padding: 0, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--card-border)' }}>
                        <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Date</th>
                        <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Description</th>
                        <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Status</th>
                        <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                        <td style={{ padding: '16px 24px', fontSize: '0.9rem' }}>Oct 12, 2025</td>
                        <td style={{ padding: '16px 24px' }}>Payout from Parametric Claim <br /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto-trigger: Heavy Rain</span></td>
                        <td style={{ padding: '16px 24px' }}><span className="badge badge-green">Processed - UPI</span></td>
                        <td style={{ padding: '16px 24px', color: 'var(--accent-green)', fontWeight: 600 }}>+₹1,200</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                        <td style={{ padding: '16px 24px', fontSize: '0.9rem' }}>Sep 28, 2025</td>
                        <td style={{ padding: '16px 24px' }}>Weekly Coverage Premium <br /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automatic Deduction</span></td>
                        <td style={{ padding: '16px 24px' }}><span className="badge badge-blue">Successful</span></td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-main)' }}>-₹30</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '16px 24px', fontSize: '0.9rem' }}>Sep 21, 2025</td>
                        <td style={{ padding: '16px 24px' }}>Weekly Coverage Premium <br /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Automatic Deduction</span></td>
                        <td style={{ padding: '16px 24px' }}><span className="badge badge-blue">Successful</span></td>
                        <td style={{ padding: '16px 24px', color: 'var(--text-main)' }}>-₹35</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {riderTab === 'plan-advisor' && (
              <>
                <header style={{ marginBottom: '32px' }}>
                  <h1 className="animate-slide-up">Plan Advisor</h1>
                  <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Analyze your zone's risk profile to choose the best income protection.</p>
                </header>

                <div className="grid-2 animate-slide-up delay-200" style={{ marginBottom: '24px' }}>
                  {/* Weekly Premium & Coverage Summary */}
                  <div className="card glass-panel" style={{ borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span className="badge badge-green">Active Policy</span>
                      <ShieldCheck size={20} color="var(--primary)" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
                      <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Current Plan</p>
                        <h2 style={{ fontSize: '1.4rem' }}>Standard Plan</h2>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Premium</p>
                        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>₹40/wk</h2>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coverage Limit</div>
                        <div style={{ fontWeight: 600 }}>₹1,500 <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ claim</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Expires Sunday</div>
                      </div>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', marginBottom: '8px' }}>Upgrade to Premium (₹85/wk)</button>
                    <button className="btn btn-outline" style={{ width: '100%' }}>Manage Current Plan</button>
                  </div>

                  {/* Zone Risk Score */}
                  <div className="card glass-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Gauge size={20} color="var(--accent-orange)" /> Zone Risk Score</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>{selectedZone.name}</p>
                      </div>
                      <span className="badge badge-orange">Medium / High Risk</span>
                    </div>

                    <div style={{ marginBottom: '24px', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                        <span>Safe</span>
                        <span style={{ fontWeight: 600, color: 'var(--accent-orange)' }}>68% Risk Index</span>
                        <span>Danger</span>
                      </div>
                      <div style={{ height: '8px', background: 'var(--card-border)', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                        <div style={{ width: '68%', background: 'linear-gradient(90deg, var(--accent-green), var(--accent-orange))' }}></div>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '0.9rem', marginBottom: '16px', color: 'var(--text-muted)' }}>Key Risk Factors</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                        <div style={{ padding: '8px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: '#38bdf8' }}><CloudRainWind size={16} /></div>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rain Probability</div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>85% (High)</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                        <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', color: 'var(--accent-red)' }}><Wind size={16} /></div>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pollution (AQI)</div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--accent-red)' }}>310 (Severe)</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                        <div style={{ padding: '8px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', color: 'var(--accent-orange)' }}><Siren size={16} /></div>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Traffic/Curfew</div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>45% (Med)</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px' }}>
                        <div style={{ padding: '8px', background: 'rgba(0, 115, 152, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}><Wind size={16} /></div>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Flood Risk</div>
                          <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>60% (Elevated)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid-3 animate-slide-up delay-300">
                  {/* Disruption Probability Forecast */}
                  <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={18} /> Disruption Forecast</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>AI continuous forecasting engine outputs.</p>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ padding: '12px', borderLeft: '3px solid var(--accent-orange)', background: 'rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Heavy Rainfall Expected</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tomorrow evening (75% probability)</div>
                      </div>
                      <div style={{ padding: '12px', borderLeft: '3px solid var(--accent-red)', background: 'rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>AQI Rising Rapidly</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Smog warnings likely (90% probability)</div>
                      </div>
                      <div style={{ padding: '12px', borderLeft: '3px solid var(--text-main)', background: 'rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Evening Traffic Spikes</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>High congestion 5PM-8PM (85% probability)</div>
                      </div>
                    </div>
                  </div>

                  {/* Real-Time Disruption Alerts */}
                  <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Siren size={18} color="var(--accent-red)" /> Live Zone Alerts</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Real-time events currently impacting deliveries.</p>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.05)' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-red)', display: 'flex', justifyContent: 'space-between' }}>
                          Severe Air Pollution <span>LIVE</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Est. Duration: Next 12 Hours</div>
                        <div style={{ fontSize: '0.8rem', marginTop: '4px', fontWeight: 500 }}>High API claim threshold crossed. Stay safe.</div>
                      </div>
                      <div style={{ padding: '12px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-orange)', display: 'flex', justifyContent: 'space-between' }}>
                          Heavy Rain Warning <span>SOON</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Est. Hit: 14:00 PM</div>
                        <div style={{ fontSize: '0.8rem', marginTop: '4px', fontWeight: 500 }}>May cause localized flooding blocks.</div>
                      </div>
                    </div>
                  </div>

                  {/* AI Plan Recommendation */}
                  <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, rgba(0, 115, 152, 0.05), transparent)' }}>
                    <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><BrainCircuit size={18} color="var(--primary)" /> AI Recommendation</h3>
                    <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', flex: 1 }}>
                      <div className="badge badge-green" style={{ marginBottom: '12px' }}>AI Suggestion</div>
                      <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)', marginBottom: '8px' }}>Standard Plan</h2>
                      <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-main)', marginBottom: '16px' }}>
                        "Your delivery zone has an elevated risk score of <b>68%</b> this week due to rising pollution and forecasted heavy rains. The <b>Standard Plan</b> provides the optimal cost-to-protection ratio for these multi-factor conditions."
                      </p>
                      <div style={{ borderTop: '1px dashed var(--card-border)', paddingTop: '16px' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Estimated Income Protection</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--accent-green)' }}>Up to ₹1,500 / event</div>
                      </div>
                      <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>Adopt Standard Plan</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {riderTab === 'my-policy' && (
              <>
                <header style={{ marginBottom: '32px' }}>
                  <h1 className="animate-slide-up">My Policy & Protection</h1>
                  <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Review your active coverage and earnings risk details.</p>
                </header>

                {/* Policy Identification Card */}
                <div className="card glass-panel animate-slide-up delay-200" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(145deg, var(--card-bg), rgba(0, 115, 152, 0.03))' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0, 115, 152, 0.1)' }}>
                      <Shield size={32} color="var(--primary)" />
                    </div>
                    <div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>General Policy Name</div>
                      <h2 style={{ fontSize: '1.4rem', margetBottom: 0 }}>Aegis Shield Base Plan</h2>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Policy Number</div>
                    <h2 style={{ fontSize: '1.4rem', margetBottom: 0, fontFamily: 'monospace', color: 'var(--primary)' }}>POL-9X28-44A</h2>
                  </div>
                </div>

                {/* Coverage Streak Calendar */}
                <div className="card glass-panel animate-slide-up delay-200" style={{ marginBottom: '24px' }}>
                  <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarCheck size={20} color="var(--primary)" /> Coverage Streak Map
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>Your active protection footprint across recent weeks.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                    {/* Grouping by recent months */}
                    {['January', 'February', 'March'].map((month, mIdx) => (
                      <div key={month} style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '12px', background: 'rgba(0,0,0,0.01)' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px', textAlign: 'center', color: 'var(--text-main)' }}>{month}</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                          {[...Array(4)].map((_, wIdx) => {
                            // Mocking activity: Jan (mixed), Feb (mostly active), March (fully active)
                            const isJanActive = wIdx === 1 || wIdx === 3;
                            const isFebActive = wIdx >= 1;
                            const isMarActive = true;
                            const isActive = mIdx === 0 ? isJanActive : mIdx === 1 ? isFebActive : isMarActive;

                            const bg = isActive ? 'var(--accent-green)' : 'rgba(0,0,0,0.05)';
                            const border = isActive ? 'none' : '1px solid var(--card-border)';
                            const label = `W${wIdx + 1}`;

                            return (
                              <div key={wIdx} style={{
                                background: bg, border: border, borderRadius: '6px',
                                padding: '8px 0', textAlign: 'center', color: isActive ? 'white' : 'var(--text-muted)',
                                fontWeight: isActive ? 600 : 400, fontSize: '0.75rem',
                                boxShadow: isActive ? '0 2px 8px rgba(16, 185, 129, 0.2)' : 'none'
                              }}>
                                {label}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--accent-green)' }}></div> Insured Week
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--card-border)' }}></div> Uninsured Week
                    </div>
                  </div>
                </div>

                <div className="grid-3 animate-slide-up delay-200" style={{ marginBottom: '24px' }}>
                  {/* Income Protection Tracker */}
                  <div className="card glass-panel" style={{ borderLeft: '4px solid var(--accent-green)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge badge-green">Income Protected</span>
                      <ShieldCheck size={20} color="var(--accent-green)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>₹{(riderInfo.avgEarnings * 0.8).toFixed(0)}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secured for this week</p>
                    <div style={{ marginTop: '16px', background: 'var(--card-border)', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ background: 'var(--accent-green)', width: '100%', height: '100%' }}></div>
                    </div>
                  </div>

                  {/* Coverage Expiry Reminder */}
                  <div className="card glass-panel" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge badge-orange">Coverage Expiry</span>
                      <CalendarClock size={20} color="var(--accent-orange)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>3 Days</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Renews Sunday at 12:00 AM</p>
                    <button className="btn btn-outline" style={{ marginTop: '16px', width: '100%', fontSize: '0.8rem', padding: '6px' }}>Manage Auto-Renew</button>
                  </div>

                  {/* Earnings Risk Estimator */}
                  <div className="card glass-panel" style={{ borderLeft: '4px solid var(--accent-red)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span className="badge badge-red">Earnings Risk</span>
                      <TrendingDown size={20} color="var(--accent-red)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>High</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Heavy rains predicted next week.</p>
                    <p style={{ color: 'var(--accent-red)', fontSize: '0.8rem', marginTop: '16px', fontWeight: 500 }}>Potential loss without cover: ~₹1,200</p>
                  </div>
                </div>

                <div className="grid-2 animate-slide-up delay-300">
                  {/* Safety Alerts */}
                  <div className="card glass-panel">
                    <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertOctagon size={20} color="var(--accent-red)" /> Ahead of Your Shift
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--accent-red)', marginBottom: '4px', fontSize: '0.9rem' }}>Severe Thunderstorm Warning</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Expected in Downtown Core area between 4 PM to 8 PM. Expect delays and plan accordingly.</div>
                      </div>
                      <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px' }}>
                        <div style={{ fontWeight: 600, color: 'var(--accent-orange)', marginBottom: '4px', fontSize: '0.9rem' }}>High Traffic Advisory</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Local protests near East Gate leading to detours. Proceed with caution.</div>
                      </div>
                    </div>
                  </div>

                  {/* Weekly Income Analytics */}
                  <div className="card glass-panel">
                    <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BarChart2 size={20} color="var(--primary)" /> Weekly Income Insights
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--card-border)' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Platform Earnings</div>
                        <div style={{ fontWeight: 600, fontSize: '1.2rem' }}>₹3,450</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Protected Payouts</div>
                        <div style={{ fontWeight: 600, fontSize: '1.2rem', color: 'var(--accent-green)' }}>+₹1,200</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Income</div>
                        <div style={{ fontWeight: 600, fontSize: '1.2rem' }}>₹4,650</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Your protected payouts have stabilized your weekly income, preventing a 25% drop due to recent weather disruptions.
                    </div>
                  </div>
                </div>
              </>
            )}

            {riderTab === 'help' && (
              <>
                <header style={{ marginBottom: '32px' }}>
                  <h1 className="animate-slide-up">Help & Support</h1>
                  <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Ask queries and get immediate help from the Aegis AI Assistant.</p>
                </header>

                <div className="grid-2 animate-slide-up delay-200">
                  <div className="card glass-panel" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--card-border)', marginBottom: '16px' }}>
                      <div style={{ background: 'rgba(0, 115, 152, 0.1)', padding: '12px 16px', borderRadius: '12px 12px 12px 0', alignSelf: 'flex-start', maxWidth: '80%' }}>
                        <p style={{ fontSize: '0.95rem' }}>Hi {riderInfo.name || 'Partner'}! I'm the Aegis Virtual Assistant.</p>
                      </div>
                      <div style={{ background: 'rgba(0, 115, 152, 0.1)', padding: '12px 16px', borderRadius: '12px 12px 12px 0', alignSelf: 'flex-start', maxWidth: '80%' }}>
                        <p style={{ fontSize: '0.95rem' }}>How can I help you today? You can ask me about tracking refunds, policy terms, or how parametric payouts trigger.</p>
                      </div>

                      <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '12px 16px', borderRadius: '12px 12px 0 12px', alignSelf: 'flex-end', maxWidth: '80%' }}>
                        <p style={{ fontSize: '0.95rem' }}>How long does a manual claim refund take?</p>
                      </div>

                      <div style={{ background: 'rgba(0, 115, 152, 0.1)', padding: '12px 16px', borderRadius: '12px 12px 12px 0', alignSelf: 'flex-start', maxWidth: '80%' }}>
                        <p style={{ fontSize: '0.95rem' }}>Manual claims are reviewed within <b>24-48 hours</b>. Once approved, refunds are credited directly to your primary payout bank account/UPI within 2 hours. You can track this in the <b>Wallet</b> tab.</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <input type="text" className="input-field" placeholder="Type your query..." style={{ flex: 1 }} />
                      <button className="btn btn-primary" style={{ padding: '12px' }}><Send size={18} /></button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="card glass-panel">
                      <h3 style={{ marginBottom: '16px' }}>Popular FAQs</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--card-border)' }}>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '4px' }}>How does Auto-Claim work?</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>If the weather/AQI breaches our system limits, we trigger a payout directly—no manual filing needed.</div>
                        </div>
                        <div style={{ padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: '8px', cursor: 'pointer', border: '1px solid var(--card-border)' }}>
                          <div style={{ fontWeight: 500, fontSize: '0.9rem', marginBottom: '4px' }}>Can I cancel my policy?</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Weekly coverage auto-renews. You can disable auto-renew any time before Sunday 12 AM.</div>
                        </div>
                      </div>
                    </div>

                    <div className="card glass-panel" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                      <h3 style={{ marginBottom: '8px', color: 'var(--accent-red)' }}>Still need help?</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Our rider support team is available 24/7 for critical emergencies.</p>
                      <button className="btn btn-outline" style={{ color: 'var(--accent-red)', borderColor: 'var(--accent-red)', width: '100%' }}>Call +91 1800-AEGIS-SOS</button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Guidewire DevTrails Header */}
      <header style={{ background: 'var(--header-bg)', color: 'white', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={28} color="var(--accent-yellow)" />
          <div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9, letterSpacing: '1px' }}>GUIDEWIRE</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1 }}>DEV <span style={{ color: 'var(--accent-yellow)' }}>Trails</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>
            <Bell size={14} /> Notifications
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>System Admin</span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} />
            </div>
          </div>
        </div>
      </header>

      <div className="app-wrapper" style={{ flex: 1 }}>
        <aside className="sidebar" style={{ width: '280px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)' }}>Admin Console</span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className={`btn ${adminTab === 'overview' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'overview' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'overview' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'overview' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('overview')}>
              <Activity size={18} /> Platform Overview
            </div>
            <div className={`btn ${adminTab === 'risk' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'risk' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'risk' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'risk' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('risk')}>
              <Map size={18} /> Risk & Heatmap
            </div>
            <div className={`btn ${adminTab === 'disruptions' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'disruptions' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'disruptions' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'disruptions' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('disruptions')}>
              <Radio size={18} /> Disruptions
            </div>
            <div className={`btn ${adminTab === 'claims' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'claims' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'claims' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'claims' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('claims')}>
              <FileSearch size={18} /> Claims Mgmt
            </div>
            <div className={`btn ${adminTab === 'fraud' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'fraud' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'fraud' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'fraud' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('fraud')}>
              <ShieldAlert size={18} /> Fraud Detection
            </div>
            <div className={`btn ${adminTab === 'policies' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'policies' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'policies' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'policies' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('policies')}>
              <Settings size={18} /> Policy Mgmt
            </div>
            <div className={`btn ${adminTab === 'payouts' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'payouts' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'payouts' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'payouts' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('payouts')}>
              <ArrowRightLeft size={18} /> Payout Monitor
            </div>
            <div className={`btn ${adminTab === 'analytics' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'analytics' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'analytics' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'analytics' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('analytics')}>
              <BrainCircuit size={18} /> AI Analytics
            </div>
            <div className={`btn ${adminTab === 'loss-ratio' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'loss-ratio' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'loss-ratio' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'loss-ratio' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('loss-ratio')}>
              <TrendingDown size={18} /> Loss Ratio
            </div>
            <div className={`btn ${adminTab === 'workers' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'workers' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'workers' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'workers' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('workers')}>
              <Users size={18} /> Worker Insights
            </div>
            <div className={`btn ${adminTab === 'triggers' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'triggers' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'triggers' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'triggers' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('triggers')}>
              <Zap size={18} /> Trigger Monitor
            </div>
            <div className={`btn ${adminTab === 'reports' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: adminTab === 'reports' ? 'var(--primary)' : 'var(--text-main)', background: adminTab === 'reports' ? 'rgba(0,115,152,0.1)' : 'transparent', border: adminTab === 'reports' ? 'none' : '1px solid transparent' }} onClick={() => setAdminTab('reports')}>
              <Download size={18} /> Data Export
            </div>
            <div style={{ margin: '16px 0', borderTop: '1px solid var(--card-border)' }}></div>
            <div className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', color: 'var(--accent-red)' }} onClick={() => setCurrentView('login')}>
              <Search size={18} /> Log Out
            </div>
          </nav>
        </aside>

        <main className="main-content">
          {adminTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', padding: '8px' }}>
              <header style={{ marginBottom: '8px' }}>
                <h1 className="animate-slide-up" style={{ fontSize: '2.2rem', background: 'linear-gradient(45deg, #0f172a 0%, #0ea5e9 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>Aegis Control Center</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Zero-Trust Distributed Event-Driven AI Microservices Dashboard.</p>
              </header>

              {/* Top Bar (Live Metrics) */}
              <div className="grid-3 animate-slide-up delay-200" style={{ background: '#ffffff', boxShadow: '0 8px 32px rgba(0,0,0,0.05)', padding: '24px', borderRadius: '20px', border: '1px solid rgba(0,115,152,0.1)' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Liquidity Pool Size</div>
                  <div style={{ fontSize: '2.8rem', fontWeight: 800, margin: '8px 0', fontFamily: 'monospace', color: '#0f172a' }}>₹24.8M</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500 }}><Activity size={16}/> Stable Reinsurance Baseline</div>
                </div>
                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '32px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Active Riders Online</div>
                  <div style={{ fontSize: '2.8rem', fontWeight: 800, margin: '8px 0', fontFamily: 'monospace', color: '#0f172a' }}>14,204</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 500 }}>Streaming 1Hz GPS + Telemetry</div>
                </div>
                <div style={{ borderLeft: '1px solid #e2e8f0', paddingLeft: '32px' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Fraud Prevented</div>
                  <div style={{ fontSize: '2.8rem', fontWeight: 800, margin: '8px 0', fontFamily: 'monospace', color: 'var(--accent-red)' }}>₹1.2M</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>via CNN/Transformer Protection</div>
                </div>
              </div>

              {/* Layout for Panels */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 300px) 1fr minmax(320px, 360px)', gap: '24px', flex: 1, alignItems: 'stretch' }} className="animate-slide-up delay-300">
                
                {/* Left Panel: Scenario Injectors */}
                <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '24px', borderRadius: '20px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                  <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.2rem', color: '#0f172a' }}>
                    <Zap size={24} color="var(--accent-yellow)" fill="var(--accent-yellow)" /> Scenario Injectors
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                    <button className="btn" style={{ background: 'rgba(14, 165, 233, 0.1)', border: '2px solid rgba(14, 165, 233, 0.3)', color: '#0ea5e9', padding: '16px', justifyContent: 'flex-start', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', transition: 'all 0.2s ease' }} onClick={() => injectScenario('Flash Flood')} onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 165, 233, 0.2)'}} onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'}}>
                      <CloudRainWind size={22} color="#0ea5e9" /> Simulate Flash Flood
                    </button>
                    <button className="btn" style={{ background: 'rgba(245, 158, 11, 0.1)', border: '2px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b', padding: '16px', justifyContent: 'flex-start', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', transition: 'all 0.2s ease' }} onClick={() => injectScenario('Civic Strike')} onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.2)'}} onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'}}>
                      <Siren size={22} color="#f59e0b" /> Simulate Civic Strike
                    </button>
                    <button className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '2px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '16px', justifyContent: 'flex-start', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', transition: 'all 0.2s ease' }} onClick={() => injectScenario('Syndicate Attack')} onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.2)'}} onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'}}>
                      <ShieldAlert size={22} color="#ef4444" /> Simulate Syndicate Attack
                    </button>
                    
                    <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px dashed #e2e8f0' }}>
                      <button className="btn btn-outline" style={{ width: '100%', borderColor: '#cbd5e1', color: '#64748b', fontWeight: 600, borderRadius: '12px', padding: '14px' }} onClick={resetEngines}>
                         Reset Systems
                      </button>
                    </div>
                  </div>
                </div>

                {/* Center Matrix: Pipeline */}
                <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '32px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '24px', border: '1px solid #334155', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                  <h3 style={{ marginBottom: '32px', textAlign: 'center', color: '#94a3b8', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 700 }}>Aegis Subsystem Pipeline Matrix</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center', position: 'relative' }}>
                    {/* Vertical Connecting Line */}
                    <div style={{ position: 'absolute', left: '50%', top: '24px', bottom: '24px', width: '2px', background: 'linear-gradient(to bottom, rgba(56,189,248,0.1), rgba(56,189,248,0.3), rgba(56,189,248,0.1))', zIndex: 0, transform: 'translateX(-50%)' }}></div>
                    
                    {[
                      { id: 'risk', name: 'Engine 1: Risk Prediction', desc: 'XGBoost + Isolation Forest (Geohash)', icon: <BrainCircuit size={24}/> },
                      { id: 'premium', name: 'Engine 2: Premium Engine', desc: 'LSTM Actuary (Weekly CRON)', icon: <Activity size={24}/> },
                      { id: 'fraud', name: 'Engine 3: Fraud Detection', desc: 'Spatial CNN + Temporal Transformer', icon: <ShieldAlert size={24}/> },
                      { id: 'trigger', name: 'Engine 4: Trigger Engine', desc: 'NLP DistilBERT + DBSCAN Matrix', icon: <Radio size={24}/> },
                      { id: 'decision', name: 'Engine 5: Decision Orchestrator', desc: 'FastAPI Microservice Mesh', icon: <CheckCircle size={24}/> }
                    ].map((engine) => {
                      const st = engineStates[engine.id];
                      const colorMap = {
                        blue: 'rgba(56, 189, 248, 0.1)',
                        green: 'rgba(16, 185, 129, 0.15)',
                        orange: 'rgba(245, 158, 11, 0.15)',
                        red: 'rgba(239, 68, 68, 0.15)'
                      };
                      const borderMap = {
                        blue: 'rgba(56, 189, 248, 0.4)',
                        green: 'rgba(16, 185, 129, 0.6)',
                        orange: 'rgba(245, 158, 11, 0.6)',
                        red: 'rgba(239, 68, 68, 0.6)'
                      };
                      const textMap = {
                        blue: '#38bdf8',
                        green: '#34d399',
                        orange: '#fbbf24',
                        red: '#f87171'
                      };
                      const stateColor = colorMap[st] || colorMap.blue;
                      const borderColor = borderMap[st] || borderMap.blue;
                      const textColor = textMap[st] || textMap.blue;
                      
                      return (
                        <div key={engine.id} style={{ 
                          display: 'flex', alignItems: 'center', gap: '20px', zIndex: 1, 
                          background: stateColor, border: `1px solid ${borderColor}`,
                          padding: '18px 28px', borderRadius: '16px', margin: '0 auto', width: '90%',
                          boxShadow: `0 8px 32px ${stateColor}`, transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', backdropFilter: 'blur(12px)'
                        }}>
                          <div style={{ color: textColor, padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>{engine.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#f8fafc', letterSpacing: '0.5px' }}>{engine.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>{engine.desc}</div>
                          </div>
                          <div style={{ width: 14, height: 14, borderRadius: '50%', background: textColor, boxShadow: `0 0 16px ${textColor}, 0 0 4px ${textColor} inset` }}></div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Panel: Terminal */}
                <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: 0, background: '#020617', border: '1px solid #1e293b', overflow: 'hidden', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                  <div style={{ padding: '16px 20px', background: '#0f172a', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '12px' }}>
                     <div style={{ display: 'flex', gap: '8px' }}>
                       <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }}></div>
                       <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }}></div>
                       <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }}></div>
                     </div>
                     <span style={{ marginLeft: '12px', fontSize: '0.85rem', color: '#64748b', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '1px' }}>/var/log/aegis-core</span>
                  </div>
                  <div style={{ padding: '20px', flex: 1, overflowY: 'auto', fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace', fontSize: '0.85rem', color: '#38bdf8', display: 'flex', flexDirection: 'column', gap: '10px', height: '100%', maxHeight: '600px' }}>
                    {adminLogs.map((log, i) => (
                      <div key={i} style={{ 
                        color: log.type === 'error' ? '#f87171' : log.type === 'warning' ? '#fbbf24' : log.type === 'success' ? '#34d399' : '#38bdf8',
                        lineHeight: '1.5'
                      }}>
                        <span style={{ color: '#475569', marginRight: '8px' }}>[{log.time}]</span> {log.msg}
                      </div>
                    ))}
                    <div style={{ color: '#64748b', marginTop: 'auto', paddingTop: '8px' }}>
                      <span style={{ animation: 'blink 1s step-end infinite' }}>root@aegis-mesh:~# _</span>
                    </div>
                    <style dangerouslySetInnerHTML={{__html: `
                      @keyframes blink { 50% { opacity: 0; } }
                    `}} />
                  </div>
                </div>

              </div>
            </div>
          )}

          {adminTab === 'risk' && (
            <>
              <header style={{ marginBottom: '32px' }}>
                <h1 className="animate-slide-up">Risk Monitoring & Heatmap</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Hyperlocal risk levels across active delivery zones.</p>
              </header>

              <div className="card glass-panel animate-slide-up delay-200" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--card-border)' }}>
                      <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Zone</th>
                      <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Risk Score</th>
                      <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Weather Risk</th>
                      <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Pollution / AQI</th>
                      <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Flood Prob.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ZONES.map(z => (
                      <tr key={z.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                        <td style={{ padding: '16px 24px', fontWeight: 500 }}>{z.name}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span className={`badge ${z.risk === 'Critical' ? 'badge-red' : z.risk === 'High' ? 'badge-orange' : 'badge-green'}`}>{z.risk}</span>
                        </td>
                        <td style={{ padding: '16px 24px' }}>{z.weather}</td>
                        <td style={{ padding: '16px 24px', color: z.aqi > 300 ? 'var(--accent-red)' : z.aqi > 200 ? 'var(--accent-orange)' : 'var(--text-main)' }}>{z.aqi}</td>
                        <td style={{ padding: '16px 24px' }}>{z.risk === 'Critical' ? '85%' : z.risk === 'High' ? '60%' : '10%'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {adminTab === 'disruptions' && (
            <>
              <header style={{ marginBottom: '32px' }}>
                <h1 className="animate-slide-up">Disruption Monitoring</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Real-time external disruptions currently affecting riders.</p>
              </header>

              <div className="grid-2 animate-slide-up delay-200">
                <div className="card glass-panel" style={{ borderLeft: '4px solid var(--accent-red)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><CloudRainWind color="var(--accent-red)" /> <h3 style={{ margin: 0 }}>Heavy Rain Alert</h3></div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Impacts Downtown Core</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div><strong>Affected:</strong> 3,450 Workers</div>
                    <div><strong>Est. Payout:</strong> ₹4,14,000</div>
                  </div>
                </div>
                <div className="card glass-panel" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}><Siren color="var(--accent-orange)" /> <h3 style={{ margin: 0 }}>Local Strikes</h3></div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Impacts East Industrial</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <div><strong>Affected:</strong> 850 Workers</div>
                    <div><strong>Est. Payout:</strong> ₹1,02,000</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {adminTab === 'claims' && (
            <>
              <header style={{ marginBottom: '32px' }}>
                <h1 className="animate-slide-up">Claims Management</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Review and monitor all automated and manual claims.</p>
              </header>
              <div className="card glass-panel table-container">
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.03)' }}>
                      <th style={{ padding: '16px' }}>Claim Ref</th>
                      <th style={{ padding: '16px' }}>Disruption Type</th>
                      <th style={{ padding: '16px' }}>Amount</th>
                      <th style={{ padding: '16px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '16px' }}>CLM-4921</td>
                      <td style={{ padding: '16px' }}>Heavy Rain (&gt;50mm/hr)</td>
                      <td style={{ padding: '16px' }}>₹1,200</td>
                      <td style={{ padding: '16px' }}><span className="badge badge-green">Approved (Auto)</span></td>
                    </tr>
                    <tr style={{ borderTop: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '16px' }}>CLM-9912</td>
                      <td style={{ padding: '16px' }}>Road Closure (Manual)</td>
                      <td style={{ padding: '16px' }}>₹800</td>
                      <td style={{ padding: '16px' }}><span className="badge badge-orange">Processing</span></td>
                    </tr>
                    <tr style={{ borderTop: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '16px' }}>CLM-1055</td>
                      <td style={{ padding: '16px' }}>GPS Error (Manual)</td>
                      <td style={{ padding: '16px' }}>₹600</td>
                      <td style={{ padding: '16px' }}><span className="badge badge-red">Flagged</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {adminTab === 'fraud' && (
            <>
              <header style={{ marginBottom: '32px' }}>
                <h1 className="animate-slide-up">Fraud Detection Panel</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Suspicious activities flagged by AI Models for manual review.</p>
              </header>
              <div className="grid-2">
                <div className="card glass-panel" style={{ border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="badge badge-red">High Risk Flag</span>
                    <span>GPS Spoofing Detected</span>
                  </div>
                  <div style={{ margin: '16px 0', fontSize: '0.9rem' }}>User <b>Rider_8912</b> claimed heavy rain payout while GPS telemetry indicates continuous interstate movement matching a high-speed train route.</div>
                  <button className="btn btn-primary" style={{ width: '100%', background: 'var(--accent-red)' }}>Hold Account & Investigate</button>
                </div>
                <div className="card glass-panel" style={{ border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="badge badge-orange">Medium Risk Flag</span>
                    <span>Abnormal Claim Frequency</span>
                  </div>
                  <div style={{ margin: '16px 0', fontSize: '0.9rem' }}>User <b>Rider_511</b> filed 4 consecutive manual claims for "Phone Battery Outage" just before shift completions. Needs history review.</div>
                  <button className="btn btn-outline" style={{ width: '100%' }}>Assign to Manual Review Team</button>
                </div>
              </div>
            </>
          )}

          {adminTab === 'policies' && (
            <>
              <header style={{ marginBottom: '24px' }}>
                <h1 className="animate-slide-up">Policy Catalog Management</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Configure AI-powered dynamic pricing factors, coverage limits, and parametric triggers for each plan.</p>
              </header>

              {/* Pricing Model Summary Banner */}
              <div className="card animate-slide-up delay-200" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', marginBottom: '28px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <BrainCircuit size={28} color="#FFC72C" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>AI Dynamic Pricing Formula</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>The pricing engine runs every Sunday at 23:59 for all active workers</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '16px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#38bdf8', letterSpacing: '0.5px' }}>
                  Pw = max( [E(L) × ZoneMult × WeatherMult × (1 + λ)] + γ - (R_score × β) - W_credit , P_floor )
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '16px', fontSize: '0.8rem', color: '#94a3b8' }}>
                  <div><span style={{ color: '#fbbf24', fontWeight: 700 }}>E(L)</span> = Expected Loss (Coverage × base%)</div>
                  <div><span style={{ color: '#fbbf24', fontWeight: 700 }}>ZoneMult</span> = HazardHub flood history (0.85–1.6×)</div>
                  <div><span style={{ color: '#fbbf24', fontWeight: 700 }}>WeatherMult</span> = OpenWeatherMap 7-day forecast (0.92–1.35×)</div>
                  <div><span style={{ color: '#fbbf24', fontWeight: 700 }}>R_score × β</span> = Behavioral safety discount</div>
                </div>
              </div>

              {/* Zone Risk Profiles */}
              <div style={{ marginBottom: '28px' }} className="animate-slide-up delay-300">
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Map size={20} color="var(--primary)" /> Zone Hyper-Local Risk Profiles (HazardHub)</h3>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--card-border)' }}>
                        <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Zone</th>
                        <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Waterlogging Risk</th>
                        <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Flood Incidents (3yr)</th>
                        <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Risk Multiplier</th>
                        <th style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Worker Insight</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(ZONE_RISK_PROFILES).map((z, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--card-border)' }}>
                          <td style={{ padding: '14px 20px', fontWeight: 600 }}>{z.name}</td>
                          <td style={{ padding: '14px 20px' }}>
                            <span className={`badge ${z.waterloggingRisk === 'Critical' ? 'badge-red' : z.waterloggingRisk === 'High' ? 'badge-orange' : 'badge-green'}`}>{z.waterloggingRisk}</span>
                          </td>
                          <td style={{ padding: '14px 20px', fontWeight: 700, color: z.floodIncidents3yr > 10 ? 'var(--accent-red)' : z.floodIncidents3yr === 0 ? 'var(--accent-green)' : 'var(--accent-orange)' }}>{z.floodIncidents3yr}</td>
                          <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 600 }}>{z.riskMultiplier}×</td>
                          <td style={{ padding: '14px 20px', fontSize: '0.82rem', color: 'var(--text-muted)', maxWidth: '300px' }}>{z.insight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Policy Catalog Cards */}
              <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }} className="animate-slide-up delay-300"><ShieldCheck size={20} color="var(--primary)" /> Policy Catalog ({POLICY_CATALOG.length} Plans)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }} className="animate-slide-up delay-300">
                {POLICY_CATALOG.map(policy => {
                  const samplePricing = computeDynamicPremium(policy, 'z1', 90, 0, 25);
                  return (
                    <div key={policy.id} className="card" style={{ borderTop: `4px solid ${policy.color}`, position: 'relative' }}>
                      {policy.badge && (
                        <div style={{ position: 'absolute', top: '16px', right: '16px', background: policy.color, color: 'white', fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '12px' }}>{policy.badge}</div>
                      )}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: policy.accentColor, padding: '10px', borderRadius: '10px' }}><Shield size={22} color={policy.color} /></div>
                        <div>
                          <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{policy.name}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{policy.tagline}</div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Base Price</div>
                          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: policy.color }}>₹{policy.basePrice}/wk</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Max Coverage</div>
                          <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>₹{policy.coverage.toLocaleString()}</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Coverage Hours</div>
                          <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>{policy.coverageHours}h/day</div>
                        </div>
                        <div style={{ background: 'rgba(0,0,0,0.03)', borderRadius: '10px', padding: '12px' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sample Price (High-Risk Zone)</div>
                          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: '#ef4444' }}>₹{samplePricing.finalPremium}/wk</div>
                        </div>
                      </div>

                      {/* Pricing Factors */}
                      <div style={{ background: 'rgba(0,0,0,0.02)', borderRadius: '10px', padding: '12px', marginBottom: '14px', fontSize: '0.78rem' }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>AI Pricing Parameters</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', color: 'var(--text-muted)' }}>
                          <span>E(L) base: <b style={{ color: 'var(--text-main)' }}>{(policy.pricingFactors.expectedLossBase * 100).toFixed(1)}%</b></span>
                          <span>λ (risk margin): <b style={{ color: 'var(--text-main)' }}>{(policy.pricingFactors.lambda * 100).toFixed(0)}%</b></span>
                          <span>γ (OpEx): <b style={{ color: 'var(--text-main)' }}>₹{policy.pricingFactors.gamma}</b></span>
                          <span>R-score β: <b style={{ color: 'var(--text-main)' }}>{policy.pricingFactors.rScoreBeta}</b></span>
                        </div>
                      </div>

                      {/* Triggers */}
                      <div style={{ marginBottom: '14px' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Parametric Triggers</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                          {policy.triggers.map((t, i) => <span key={i} style={{ background: policy.accentColor, color: policy.color, border: `1px solid ${policy.color}30`, borderRadius: '6px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 600 }}>{t}</span>)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-outline" style={{ flex: 1, fontSize: '0.85rem' }}>Edit Pricing Factors</button>
                        <button className="btn" style={{ flex: 1, background: policy.color, color: 'white', border: 'none', fontSize: '0.85rem' }}>Toggle Active</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {adminTab === 'payouts' && (
            <>
              <header style={{ marginBottom: '32px' }}>
                <h1 className="animate-slide-up">Payout Monitoring</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Track automated transparency and financial outflows.</p>
              </header>
              <div className="card glass-panel">
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(0,0,0,0.03)' }}>
                      <th style={{ padding: '12px' }}>Date</th>
                      <th style={{ padding: '12px' }}>Cause</th>
                      <th style={{ padding: '12px' }}>Amount</th>
                      <th style={{ padding: '12px' }}>Bank Ref</th>
                      <th style={{ padding: '12px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>Today, 2:40 PM</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>Downtown Flood</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>₹1,500</td>
                      <td style={{ padding: '12px', fontFamily: 'monospace' }}>UPI-0092A</td>
                      <td style={{ padding: '12px' }}><span className="badge badge-green">Success</span></td>
                    </tr>
                    <tr style={{ borderTop: '1px solid var(--card-border)' }}>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>Today, 1:15 PM</td>
                      <td style={{ padding: '12px', fontSize: '0.9rem' }}>Downtown Flood</td>
                      <td style={{ padding: '12px', fontWeight: 600 }}>₹1,500</td>
                      <td style={{ padding: '12px', fontFamily: 'monospace' }}>NEFT-90X</td>
                      <td style={{ padding: '12px' }}><span className="badge badge-red">Failed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}

          {adminTab === 'analytics' && (
            <>
              <header style={{ marginBottom: '32px' }}>
                <h1 className="animate-slide-up">AI Predictive Analytics</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Future disruption and risk forecasts.</p>
              </header>
              <div className="grid-3">
                <div className="card glass-panel" style={{ borderLeft: '4px solid var(--accent-red)' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Next Week Forecast</div>
                  <div style={{ margin: '8px 0', fontWeight: 600, fontSize: '1.2rem', color: 'var(--accent-red)' }}>Severe Flooding Expected</div>
                  <div style={{ fontSize: '0.85rem' }}>Models predict 85% chance of severe flooding in East Industrial. Advised to freeze new short-term policies there.</div>
                </div>
                <div className="card glass-panel" style={{ borderLeft: '4px solid var(--accent-orange)' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Weekend Advisory</div>
                  <div style={{ margin: '8px 0', fontWeight: 600, fontSize: '1.2rem', color: 'var(--accent-orange)' }}>Pollution Spikes</div>
                  <div style={{ fontSize: '0.85rem' }}>AQI Expected to breach 400. Anticipate a 20% increase in respiratory-related API claims in Downtown.</div>
                </div>
                <div className="card glass-panel" style={{ borderLeft: '4px solid var(--accent-green)' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Month End</div>
                  <div style={{ margin: '8px 0', fontWeight: 600, fontSize: '1.2rem', color: 'var(--accent-green)' }}>Stable Operations</div>
                  <div style={{ fontSize: '0.85rem' }}>No extreme temperature anomalies predicted. Payout estimates are well within historical safety bounds.</div>
                </div>
              </div>
            </>
          )}

          {adminTab === 'loss-ratio' && (
            <>
              <header style={{ marginBottom: '32px' }}>
                <h1 className="animate-slide-up">Weekly Loss Ratio Analytics</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Total Payouts / Total Premiums.</p>
              </header>
              <div className="card glass-panel" style={{ textAlign: 'center', padding: '40px' }}>
                <TrendingDown size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                <div style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Current Weekly Loss Ratio</div>
                <h1 style={{ fontSize: '3rem', color: 'var(--text-main)', marginBottom: '16px' }}>64.2%</h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)' }}>
                  This means for every ₹100 collected in premiums, ₹64.20 is being paid out in parametric claims. The model target is 65%, indicating the current pricing structure is highly sustainable.
                </p>
                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', gap: '32px' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Premiums (Week)</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>₹4,98,050</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Payouts (Week)</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 600 }}>₹3,19,748</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {adminTab === 'workers' && (
            <>
              <header style={{ marginBottom: '32px' }}>
                <h1 className="animate-slide-up">Worker Insights</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Statistics and demographics about insured delivery workers.</p>
              </header>
              <div className="grid-4">
                <div className="card"><div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total Insured</div><h2 style={{ marginTop: '8px' }}>24,910</h2></div>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-orange)' }}><div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>High-Risk Workers</div><h2 style={{ marginTop: '8px' }}>1,420</h2></div>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-red)' }}><div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Frequent Claimers</div><h2 style={{ marginTop: '8px' }}>85</h2></div>
                <div className="card" style={{ borderLeft: '4px solid var(--accent-green)' }}><div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Zero Claim Workers</div><h2 style={{ marginTop: '8px' }}>19,500</h2></div>
              </div>
            </>
          )}

          {adminTab === 'triggers' && (
            <>
              <header style={{ marginBottom: '32px' }}>
                <h1 className="animate-slide-up">🌍 Parametric Event Triggers</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Location-based automatic claim generation. One trigger = Multiple workers auto-compensated.</p>
              </header>

              {/* City Selection + Trigger Buttons */}
              <div className="card glass-panel animate-slide-up delay-200" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '32px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-main)' }}>Select City for Event</label>
                  <select 
                    value={parametricCity} 
                    onChange={(e) => setParametricCity(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: '12px', 
                      border: '1px solid rgba(0,115,152,0.2)', 
                      fontSize: '1rem',
                      fontWeight: 500,
                      background: '#ffffff',
                      color: '#0f172a'
                    }}
                  >
                    <option value="Mumbai">🌆 Mumbai (Western India)</option>
                    <option value="Bangalore">🏙️ Bangalore (Southern India)</option>
                    <option value="Delhi">🌃 Delhi (Northern India)</option>
                    <option value="Chennai">🌊 Chennai (Coastal)</option>
                    <option value="Pune">⛰️ Pune (Hill Station)</option>
                    <option value="Hyderabad">🏛️ Hyderabad (Central India)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-main)' }}>Event Type (Click to Trigger)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    {/* Heavy Rain Trigger */}
                    <button 
                      onClick={handleParametricRainTrigger}
                      disabled={parametricTriggerLoading}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(59,130,246,0.05))',
                        border: '1px solid rgba(59,130,246,0.3)',
                        borderRadius: '16px',
                        cursor: parametricTriggerLoading ? 'wait' : 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: parametricTriggerLoading ? 0.6 : 1
                      }}
                    >
                      <div style={{ fontSize: '2rem' }}>🌧️</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Heavy Rain Event</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rainfall >50mm/hr detected</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#3b82f6', marginTop: '8px' }}>
                        {parametricTriggerLoading ? 'Triggering...' : 'Click to trigger for ' + parametricCity}
                      </div>
                    </button>

                    {/* Extreme Heat Trigger */}
                    <button 
                      onClick={handleParametricHeatTrigger}
                      disabled={parametricTriggerLoading}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(249,115,22,0.05))',
                        border: '1px solid rgba(249,115,22,0.3)',
                        borderRadius: '16px',
                        cursor: parametricTriggerLoading ? 'wait' : 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: parametricTriggerLoading ? 0.6 : 1
                      }}
                    >
                      <div style={{ fontSize: '2rem' }}>🔥</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Extreme Heat Event</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Temperature >44°C detected</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#f97316', marginTop: '8px' }}>
                        {parametricTriggerLoading ? 'Triggering...' : 'Click to trigger for ' + parametricCity}
                      </div>
                    </button>

                    {/* Civic Strike Trigger */}
                    <button 
                      onClick={handleParametricStrikeTrigger}
                      disabled={parametricTriggerLoading}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: '12px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(239,68,68,0.05))',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '16px',
                        cursor: parametricTriggerLoading ? 'wait' : 'pointer',
                        transition: 'all 0.3s ease',
                        opacity: parametricTriggerLoading ? 0.6 : 1
                      }}
                    >
                      <div style={{ fontSize: '2rem' }}>🚨</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Civic Strike Event</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complete income disruption</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 500, color: '#ef4444', marginTop: '8px' }}>
                        {parametricTriggerLoading ? 'Triggering...' : 'Click to trigger for ' + parametricCity}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Display */}
              {parametricTriggerResult && (
                <div className="card glass-panel animate-slide-up delay-300" style={{ padding: '32px', background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(16,185,129,0.02))', borderLeft: '4px solid var(--accent-green)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '2rem' }}>✅</div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700 }}>Parametric Trigger Activated</h2>
                      <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.95rem' }}>{parametricTriggerResult.message}</p>
                    </div>
                  </div>

                  <div className="grid-3" style={{ gap: '20px', marginBottom: '24px' }}>
                    <div style={{ padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.1)' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Location Triggered</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 700, margin: '8px 0', color: '#0f172a' }}>{parametricTriggerResult.location}</div>
                    </div>
                    <div style={{ padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.1)' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Workers Affected</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 700, margin: '8px 0', color: '#0f172a' }}>{parametricTriggerResult.affected_workers_count}</div>
                    </div>
                    <div style={{ padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.1)' }}>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Payouts</div>
                      <div style={{ fontSize: '1.6rem', fontWeight: 700, margin: '8px 0', color: 'var(--accent-green)' }}>₹{parametricTriggerResult.total_payout.toLocaleString()}</div>
                    </div>
                  </div>

                  <div style={{ background: 'white', borderRadius: '12px', padding: '16px', maxHeight: '300px', overflowY: 'auto' }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 600 }}>Affected Workers</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {parametricTriggerResult.affected_workers?.map((worker, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(16,185,129,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--accent-green)' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>Worker #{worker.worker_id}: {worker.worker_name}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{worker.policy_tier} Tier Policy</div>
                          </div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-green)' }}>₹{worker.payout}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Info Banner */}
              <div className="card glass-panel animate-slide-up delay-400" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.05), rgba(0,115,152,0.05))', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>🎯 How Parametric Triggers Work</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                  <li><strong>Real-Time Detection:</strong> System detects weather/civic events by location</li>
                  <li><strong>Automatic Querying:</strong> A single trigger queries all workers in affected city with ACTIVE policies</li>
                  <li><strong>Instant Payouts:</strong> Claims APPROVED immediately with zero fraud risk (parametric logic = automatic)</li>
                  <li><strong>Multi-Worker Compensation:</strong> One click can compensate 100-1000+ workers in seconds</li>
                  <li><strong>No Manual Intervention:</strong> Workers don't click anything - they receive claims automatically</li>
                </ul>
              </div>
            </>
          )}

          {adminTab === 'reports' && (
            <>
              <header style={{ marginBottom: '32px' }}>
                <h1 className="animate-slide-up">Reports & Data Export</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Download operational datasets.</p>
              </header>
              <div className="grid-2">
                <div className="card glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>Weekly Claims Report</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>All processed constraints & amounts.</p>
                  </div>
                  <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}><Download size={16} /> CSV</button>
                </div>
                <div className="card glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>Fraud Investigation Log</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Suspicious telemetry trails flagged.</p>
                  </div>
                  <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}><Download size={16} /> Excel</button>
                </div>
                <div className="card glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>Disruption Impact Analysis</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Geographical breakdown of loss.</p>
                  </div>
                  <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}><Download size={16} /> PDF</button>
                </div>
                <div className="card glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ marginBottom: '4px' }}>Monthly Payout Ledger</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cross-referenced banking transcripts.</p>
                  </div>
                  <button className="btn btn-outline" style={{ display: 'flex', gap: '8px' }}><Download size={16} /> Excel</button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );

  return (
    <>
      {currentView === 'login' && renderLogin()}
      {currentView === 'onboarding' && renderOnboarding()}
      {currentView === 'rider-dash' && renderRiderDashboard()}
      {currentView === 'admin-dash' && <ControlCenter setCurrentView={setCurrentView} adminLogs={adminLogs} engineStates={engineStates} injectScenario={injectScenario} resetEngines={resetEngines} />}
    </>
  );
}
