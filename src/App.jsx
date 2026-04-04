import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, CloudRain, Wind, Thermometer, AlertTriangle, CloudRainWind, Wallet, CheckCircle, CheckCircle2, Activity, Search, Siren, Sun, FileText, Upload, User, Bell, Clock, CreditCard, Banknote, Landmark, ListPlus, ShieldCheck, TrendingDown, AlertOctagon, BarChart2, CalendarClock, HelpCircle, Send, Map, Radio, ShieldAlert, FileSearch, Settings, ArrowRightLeft, BrainCircuit, PieChart, Users, Zap, Download, CalendarCheck, Lightbulb, Gauge, ChevronDown, Sliders, Car, Briefcase, Loader2, X, PlusCircle, Smartphone, Building2, ShoppingBag, Lock } from 'lucide-react';
import RegistrationFlow from './RegistrationFlow';
import PlanSelection from './PlanSelection';
import ControlCenter from './ControlCenter';
import Testimonials from './Testimonials';
import InfoSection from './InfoSection';
import Chatbot from './Chatbot';

/** Use 127.0.0.1 on Windows to avoid occasional localhost / IPv6 resolution issues */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8000`;

/** Must match backend wallet_top_up validation */
const WALLET_ADD_PAYMENT_METHODS = [
  { id: 'UPI', label: 'UPI', sub: 'GPay, PhonePe, Paytm…', icon: Smartphone },
  { id: 'NETBANKING', label: 'NetBanking', sub: 'All major banks', icon: Building2 },
  { id: 'CARD', label: 'Debit / Credit Card', sub: 'Visa, Mastercard, RuPay', icon: CreditCard },
  { id: 'OTHER', label: 'Other', sub: 'Wallets, EMI, etc.', icon: Banknote },
];

const formatINRDate = (isoOrDate) => {
  try {
    const d = typeof isoOrDate === 'string' ? new Date(isoOrDate) : isoOrDate;
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
};

function isClaimPendingStatus(status) {
  if (status == null) return false;
  return String(status).toLowerCase().includes('pending');
}

function isClaimPaidOutStatus(status) {
  if (status == null) return false;
  const s = String(status).toLowerCase();
  if (s.includes('pending') || s.includes('reject')) return false;
  return s.includes('approv') || s.includes('instant');
}

/** API expects integer worker ids in paths and bodies. Rejects legacy bugs like "W-742". */
function parseWorkerId(id) {
  if (id == null || id === '') return null;
  if (typeof id === 'number' && Number.isInteger(id) && id >= 1) return id;
  const s = String(id).trim();
  if (/^\d+$/.test(s)) {
    const w = parseInt(s, 10);
    return w >= 1 ? w : null;
  }
  return null;
}

function mergeWalletTransactionsFromDashboard(walletLedger, claims) {
  const rows = [];
  for (const e of walletLedger || []) {
    rows.push({
      sortKey: e.created_at ? new Date(e.created_at).getTime() : 0,
      id: `L-${e.id}`,
      date: formatINRDate(e.created_at),
      desc: e.description,
      type: e.txn_type === 'DEBIT' ? 'Debit' : 'Credit',
      amount: Math.abs(Number(e.amount || 0)),
    });
  }
  for (const c of claims || []) {
    if (String(c.status || '').toUpperCase() !== 'APPROVED') continue;
    rows.push({
      sortKey: c.created_at ? new Date(c.created_at).getTime() : 0,
      id: `CLM-${c.id}`,
      date: formatINRDate(c.created_at),
      desc: `Parametric payout — ${c.trigger_type || 'Claim'}`,
      type: 'Credit',
      amount: Math.abs(Number(c.payout_amount || 0)),
    });
  }
  rows.sort((a, b) => b.sortKey - a.sortKey);
  return rows.map(({ sortKey, ...rest }) => rest);
}

const MOCK_ZONES = [
  { id: 'z1', name: 'Downtown Core', risk: 'High', aqi: 240, weather: 'Heavy Rain' },
  { id: 'z2', name: 'North Suburbs', risk: 'Low', aqi: 85, weather: 'Clear' },
  { id: 'z3', name: 'East Industrial', risk: 'Critical', aqi: 310, weather: 'Smog' }
];

// AI-Powered Dynamic Policy Catalog
const POLICY_CATALOG = [
  {
    id: 'aegis-micro-lite',
    name: 'Aegis Micro Lite',
    tagline: 'Entry-level for ultra low-risk riders',
    basePrice: 20,
    coverage: 800,
    tier: 'Base',
    color: '#94a3b8',
    accentColor: 'rgba(148,163,184,0.1)',
    badge: null,
    coverageHours: 8,
    triggers: ['Heavy Rain (>20mm/hr)'],
    perks: ['Claim Time: 48h', 'Wallet: 10%', 'Basic UPI payout', 'Minimal fraud checks'],
    pricingFactors: { expectedLossBase: 0.008, lambda: 0.08, gamma: 2, rScoreBeta: 0.2, pFloorPct: 0.005 }
  },
  {
    id: 'aegis-micro-shield',
    name: 'Aegis Micro Shield',
    tagline: 'Low-risk zones with slight AI optimization',
    basePrice: 22,
    coverage: 900,
    tier: 'Base',
    color: '#64748b',
    accentColor: 'rgba(100,116,139,0.1)',
    badge: null,
    coverageHours: 8,
    triggers: ['Rain (>18mm/hr)', 'Heat (>43°C)'],
    perks: ['Wallet: 12%', 'Zone-based savings'],
    pricingFactors: { expectedLossBase: 0.009, lambda: 0.09, gamma: 3, rScoreBeta: 0.25, pFloorPct: 0.005 }
  },
  {
    id: 'aegis-smart-base',
    name: 'Aegis Smart Base',
    tagline: 'Balanced entry plan (mass adoption)',
    basePrice: 25,
    coverage: 1200,
    tier: 'Base',
    color: '#3b82f6',
    accentColor: 'rgba(59,130,246,0.1)',
    badge: null,
    coverageHours: 10,
    triggers: ['Rain (>18mm/hr)', 'Heat (>42°C)', 'AQI (>300)'],
    perks: ['Claim: 36h', 'Wallet: 15%'],
    pricingFactors: { expectedLossBase: 0.009, lambda: 0.09, gamma: 4, rScoreBeta: 0.3, pFloorPct: 0.005 }
  },
  {
    id: 'aegis-shield-base',
    name: 'Aegis Shield Base',
    tagline: 'Standard worker protection',
    basePrice: 28,
    coverage: 1500,
    tier: 'Base',
    color: '#2563eb',
    accentColor: 'rgba(37,99,235,0.1)',
    badge: null,
    coverageHours: 10,
    triggers: ['Rain (>20mm/hr)', 'Heat (>42°C)', 'AQI (>280)'],
    perks: ['Claim: 24h', 'Wallet: 18%', 'Bonus: Safe zone yield'],
    pricingFactors: { expectedLossBase: 0.01, lambda: 0.1, gamma: 4, rScoreBeta: 0.35, pFloorPct: 0.005 }
  },
  {
    id: 'aegis-smart-protect',
    name: 'Aegis Smart Protect',
    tagline: 'AI-enhanced mid-tier plan',
    basePrice: 30,
    coverage: 1800,
    tier: 'Pro',
    color: '#0ea5e9',
    accentColor: 'rgba(14,165,233,0.1)',
    badge: null,
    coverageHours: 11,
    triggers: ['Rain (>18mm/hr)', 'AQI (>270)', 'Heat (>41°C)'],
    perks: ['Wallet: 18%', 'Risk alerts'],
    pricingFactors: { expectedLossBase: 0.011, lambda: 0.1, gamma: 5, rScoreBeta: 0.4, pFloorPct: 0.005 }
  },
  {
    id: 'aegis-shield-pro',
    name: 'Aegis Shield Pro',
    tagline: '⭐ Most Popular Tier',
    basePrice: 34,
    coverage: 2500,
    tier: 'Pro',
    color: '#00678a',
    accentColor: 'rgba(0,103,138,0.1)',
    badge: 'Most Popular',
    coverageHours: 12,
    triggers: ['Rain (>15mm/hr)', 'AQI (>250)', 'Civic Strikes', 'Platform Outage'],
    perks: ['Claim: <12h', 'Wallet: 20%', 'Mid-week rebate', 'Safe zone alerts'],
    pricingFactors: { expectedLossBase: 0.012, lambda: 0.1, gamma: 6, rScoreBeta: 0.5, pFloorPct: 0.0055 }
  },
  {
    id: 'aegis-urban-defender',
    name: 'Aegis Urban Defender',
    tagline: 'Designed for city riders (traffic + pollution heavy)',
    basePrice: 37,
    coverage: 2800,
    tier: 'Pro',
    color: '#4f46e5',
    accentColor: 'rgba(79,70,229,0.1)',
    badge: null,
    coverageHours: 13,
    triggers: ['AQI (>240)', 'Rain (>15mm/hr)', 'Traffic gridlock AI trigger'],
    perks: ['Claim: <10h', 'Wallet: 20%'],
    pricingFactors: { expectedLossBase: 0.012, lambda: 0.11, gamma: 6, rScoreBeta: 0.5, pFloorPct: 0.0055 }
  },
  {
    id: 'aegis-elite-core',
    name: 'Aegis Elite Core',
    tagline: 'High-risk adaptive protection',
    basePrice: 40,
    coverage: 3200,
    tier: 'Elite',
    color: '#8b5cf6',
    accentColor: 'rgba(139,92,246,0.1)',
    badge: null,
    coverageHours: 14,
    triggers: ['All weather events', 'AQI (>220)', 'Civic disruptions'],
    perks: ['Claim: <6h', 'Wallet: 22%', 'Predictive rebates'],
    pricingFactors: { expectedLossBase: 0.013, lambda: 0.12, gamma: 7, rScoreBeta: 0.6, pFloorPct: 0.0055 }
  },
  {
    id: 'aegis-elite-resilience',
    name: 'Aegis Elite Resilience',
    tagline: 'Advanced multi-trigger protection',
    basePrice: 45,
    coverage: 3800,
    tier: 'Elite',
    color: '#7c3aed',
    accentColor: 'rgba(124,58,237,0.1)',
    badge: null,
    coverageHours: 15,
    triggers: ['All weather + AQI (>200)', 'Platform crash', 'Strike zones'],
    perks: ['Claim: <4h', 'Wallet: 23%', 'Dynamic coverage hours'],
    pricingFactors: { expectedLossBase: 0.014, lambda: 0.12, gamma: 8, rScoreBeta: 0.65, pFloorPct: 0.006 }
  },
  {
    id: 'aegis-storm-commander',
    name: 'Aegis Storm Commander',
    tagline: '🔥 Top Tier (Monsoon + High Risk Zones)',
    basePrice: 50,
    coverage: 5000,
    tier: 'Elite',
    color: '#0891b2',
    accentColor: 'rgba(8,145,178,0.1)',
    badge: 'Premium',
    coverageHours: 16,
    triggers: ['Flood guarantee', 'All disruptions', 'Barometric pressure shifts'],
    perks: ['Claim: <2h', 'Wallet: 25%', 'Instant payout priority', 'Emergency UPI top-up', 'SOS support'],
    pricingFactors: { expectedLossBase: 0.016, lambda: 0.14, gamma: 10, rScoreBeta: 0.75, pFloorPct: 0.007 }
  }
];

// Zone-based historical flood & weather risk data (mock of Guidewire HazardHub + historical DB)
const ZONE_RISK_PROFILES = {
  z1: { name: 'Downtown Core', floodIncidents3yr: 18, waterloggingRisk: 'High', riskMultiplier: 1.4, weatherMultiplierThisWeek: 1.2, insight: 'High waterlogging zone. 18 flood events in 3 years. Premium adjusted upward.' },
  z2: { name: 'North Suburbs', floodIncidents3yr: 0, waterloggingRisk: 'Low', riskMultiplier: 0.85, weatherMultiplierThisWeek: 0.9, insight: 'Your zone has 0 flood incidents in 3 years → you save ₹2–5/week. Clear skies predicted → coverage hours extended.' },
  z3: { name: 'East Industrial', floodIncidents3yr: 24, waterloggingRisk: 'Critical', riskMultiplier: 1.6, weatherMultiplierThisWeek: 1.4, insight: 'Critical flood-risk industrial zone. Frequent waterlogging. Premium significantly higher this week due to heavy rain forecast.' }
};

// Dynamic Pricing Engine (mirrors backend: wallet can pay premium down to floor)
const computeDynamicPremium = (policy, zoneId, rScore, walletBalance, weeklyRainMm = 10) => {
  const profile = ZONE_RISK_PROFILES[zoneId] || ZONE_RISK_PROFILES.z1;
  
  const weatherMult = weeklyRainMm > 20 ? 1.35 : weeklyRainMm > 10 ? 1.1 : 0.92;
  const zoneMult = profile.riskMultiplier;
  
  const basePremium = policy.basePrice;
  // Dynamic adjustments (zone & weather) applied gently to the base price
  const expectedPremium = basePremium * (1 + ((zoneMult * weatherMult) - 1) * 0.4); 
  
  // Max 15% discount for perfect R-Score of 100
  const rScoreDiscountPct = Math.max(0, (rScore - 50) / 50) * 0.15;
  const rDiscount = expectedPremium * rScoreDiscountPct;
  
  let premiumBeforeWallet = expectedPremium - rDiscount;
  
  // Wallet can at most pay for 40% of the premium
  const pFloor = basePremium * 0.6; 
  const wCreditCap = Math.max(0, premiumBeforeWallet - pFloor);
  const wCredit = Math.min(Number(walletBalance) || 0, wCreditCap);
  
  let finalPremium = premiumBeforeWallet - wCredit;
  finalPremium = Math.max(finalPremium, pFloor);
  
  const savings = Math.max(0, basePremium - finalPremium);
  const bonusHours = weatherMult < 1 ? 2 : 0;
  
  return {
    finalPremium: Math.round(finalPremium * 10) / 10,
    breakdown: {
      expectedLoss: Math.round(expectedPremium * 10) / 10,
      zoneMultiplier: zoneMult,
      weatherMultiplier: weatherMult,
      rScoreDiscount: Math.round(rDiscount * 10) / 10,
      walletCredit: Math.round(wCredit * 10) / 10,
    },
    savings: Math.round(savings * 10) / 10,
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

const stringifyPlatform = (platform) => {
  if (Array.isArray(platform)) {
    return platform.join(', ');
  }
  return platform || 'Zomato';
};

export default function App() {
  const [currentView, setCurrentView] = useState('login'); // login, onboarding, plan-selection, rider-dash, admin-dash

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
  const [riderTab, setRiderTab] = useState('overview');
  const [adminTab, setAdminTab] = useState('overview');
  const [manualClaim, setManualClaim] = useState({ reason: 'Rain', description: '', amount: '' });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activatedPlan, setActivatedPlan] = useState(null);
  const [pendingPlanToActivate, setPendingPlanToActivate] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showPricingBreakdown, setShowPricingBreakdown] = useState(null); // policy.id or null
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [addMoneyPaymentMethod, setAddMoneyPaymentMethod] = useState('UPI');
  const [addMoneyStatus, setAddMoneyStatus] = useState('idle'); // idle, loading, success
  const [walletTransactions, setWalletTransactions] = useState([]);
  const [showPlanPromptToast, setShowPlanPromptToast] = useState(false);
  const [hasPromptedPlanToast, setHasPromptedPlanToast] = useState(false);
  
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: "Hi! I'm the Aegis Virtual Assistant." },
    { role: 'assistant', text: "How can I help you today? You can ask me about tracking payouts, policy terms, or how parametric triggers work." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [parametricTriggerResult, setParametricTriggerResult] = useState(null);
  const [parametricCity, setParametricCity] = useState('Mumbai');
  const [parametricTriggerLoading, setParametricTriggerLoading] = useState(false);
  
  // Demo user & registration flow
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [isFromRegistration, setIsFromRegistration] = useState(false);

  useEffect(() => {
    if (currentView === 'rider-dash' && !hasActivePolicy && !hasPromptedPlanToast) {
      setHasPromptedPlanToast(true);
      const t1 = setTimeout(() => setShowPlanPromptToast(true), 1500);
      const t2 = setTimeout(() => setShowPlanPromptToast(false), 6500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [currentView, hasActivePolicy, hasPromptedPlanToast]);

  const [showLiveFeedDropdown, setShowLiveFeedDropdown] = useState(false);

  useEffect(() => {
    if (currentView === 'rider-dash') {
      const timer = setTimeout(() => {
        setShowLiveFeedDropdown(true);
        const hideTimer = setTimeout(() => {
          setShowLiveFeedDropdown(false);
        }, 5000);
        return () => clearTimeout(hideTimer);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentView]);

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

  // Demo User Login Handler
  const handleDemoUserLogin = async () => {
    try {
      // Create or get demo user
      const demoRes = await axios.post(`${API_BASE_URL}/register`, {
        name: 'Demo Worker',
        phone: '9876543210',
        upi_id: 'demo@aegis.app',
        platform: 'Zomato, Swiggy',
        city: 'Mumbai',
        pincode: '400001',
        avg_weekly_earnings: 8000,
      });

      const demoWorkerId = demoRes.data.id;

      // Add wallet balance for demo user
      await axios.post(`${API_BASE_URL}/wallet/top-up`, {
        worker_id: demoWorkerId,
        amount: 1000,
        source: 'DEMO_INITIAL_BALANCE'
      });

      setWorkerId(demoWorkerId);
      setIsDemoUser(true);
      setRiderInfo({
        name: 'Demo Worker',
        platform: ['Zomato', 'Swiggy'],
        vehicle: '2-Wheeler',
        shift: 'Full Day',
        avgOrders: '24',
        yearsExp: '3+ years',
        zone: 'z1',
        avgEarnings: 8000,
        city: 'Mumbai',
        mobile: '9876543210',
        email: 'demo@aegis.app',
        pincode: '400001',
      });
      
      // Set wallet balance for demo user
      setWalletBalance(1000);
      
      // Redirect to plan selection instead of dashboard
      setCurrentView('plan-selection');
    } catch (error) {
      console.error('Demo login failed:', error);
      // Fallback: use existing demo worker (ID: 174)
      setWorkerId(174);
      setIsDemoUser(true);
      setRiderInfo({
        name: 'Demo Worker',
        platform: ['Zomato', 'Swiggy'],
        vehicle: '2-Wheeler',
        shift: 'Full Day',
        avgOrders: '24',
        yearsExp: '3+ years',
        zone: 'z1',
        avgEarnings: 8000,
        city: 'Mumbai',
        mobile: '9876543210',
        email: 'demo@aegis.app',
        pincode: '400001',
      });
      setWalletBalance(1000);
      setCurrentView('plan-selection');
    }
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
    const wid = parseWorkerId(workerId);
    if (wid && currentView === 'rider-dash') {
      const fetchDashboard = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/worker/${wid}/dashboard`);
          const data = res.data;
          if (data.active_policy) {
            setHasActivePolicy(true);
            setCoverageAmount(data.active_policy.coverage_amount);
            setCalculatedPremium(data.active_policy.premium_paid);
            
            const savedId = localStorage.getItem('aegis_selected_plan_id');
            const matchingPlan = POLICY_CATALOG.find(p => p.id === savedId) || POLICY_CATALOG.find(p => p.tier === data.active_policy.tier);
            if (matchingPlan) {
              setActivatedPlan({ id: matchingPlan.id, name: matchingPlan.name, premium: data.active_policy.premium_paid, tier: matchingPlan.tier });
            }
          } else {
            setHasActivePolicy(false);
            setActivatedPlan(null);
          }
          setRScore(data.worker.r_score);
          setWalletBalance(Number(data.worker?.wallet_balance ?? 0));

          setWalletTransactions(mergeWalletTransactionsFromDashboard(data.wallet_ledger, data.claims));

          if (Array.isArray(data.claims)) {
            const formattedClaims = data.claims.map(c => ({
              id: 'CLM-' + c.id,
              date: new Date(c.created_at).toLocaleDateString(),
              reason: c.trigger_type,
              amount: c.payout_amount,
              status:
                c.status === 'APPROVED'
                  ? 'Approved (Instant API)'
                  : c.status === 'PENDING_REVIEW' || c.status === 'PENDING'
                    ? 'Pending Review'
                    : c.status
            }));
            setClaims(formattedClaims);
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

  const handleChatSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);
    
    try {
      const res = await axios.post(`${API_BASE_URL}/ai-chat`, { 
        message: userMsg,
        context: {
          rider_name: riderInfo.name,
          has_policy: hasActivePolicy,
          plan_name: activatedPlan?.name,
          wallet_balance: walletBalance
        }
      });
      setChatMessages(prev => [...prev, { role: 'assistant', text: res.data.response }]);
    } catch (err) {
      console.error("AI Chat error", err);
      setChatMessages(prev => [...prev, { role: 'assistant', text: "I apologize, but I'm having difficulty connecting to our AI core. Please check your internet or try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e) => {
    e.preventDefault();
    try {
      const tier = riderInfo.avgEarnings > 5000 ? 'Elite' : (riderInfo.avgEarnings > 3000 ? 'Pro' : 'Base');
      const res = await axios.post(`${API_BASE_URL}/register`, {
        name: riderInfo.name || "Test Worker",
        phone: riderInfo.mobile || "9999999999",
        upi_id: "test@upi",
        platform: stringifyPlatform(riderInfo.platform),
        city: "Mumbai",
        pincode: "400002", // trigger demo code
        avg_weekly_earnings: riderInfo.avgEarnings
      });
      setWorkerId(res.data.id);
      // Pre-calculation logic and automatic policy creation code removed
      // The user must manually select a plan from Explore Plans
      
      setCurrentView('rider-dash');
    } catch (e) {
      console.error(e);
      alert('Unable to complete onboarding right now. Please check the backend and try again.');
    }
  };

  const defaultPolicyTier = () =>
    riderInfo.avgEarnings > 5000 ? 'Elite' : riderInfo.avgEarnings > 3000 ? 'Pro' : 'Base';

  const initiatePolicy = async (tierOverride, planDetails = null) => {
    const wid = parseWorkerId(workerId);
    if (!wid) {
      setErrorMessage('Sign in or complete registration so we have a valid worker id.');
      return false;
    }
    const tier = tierOverride || defaultPolicyTier();
    try {
      await axios.post(`${API_BASE_URL}/create-policy`, {
        worker_id: wid,
        tier,
        accepted_terms: true,
      });
      setHasActivePolicy(true);
      if (planDetails) {
        setActivatedPlan({ id: planDetails.id, name: planDetails.name, premium: planDetails.premium, tier });
      }
      try {
        const dash = await axios.get(`${API_BASE_URL}/worker/${wid}/dashboard`);
        const d = dash.data;
        setWalletBalance(Number(d.worker?.wallet_balance ?? 0));
        setWalletTransactions(mergeWalletTransactionsFromDashboard(d.wallet_ledger, d.claims));
      } catch {
        /* refresh best-effort */
      }
      return true;
    } catch (e) {
      console.error('Failed to create policy', e);
      const msg = e.response?.data?.detail;
      setErrorMessage(typeof msg === 'string' ? msg : 'Could not activate plan. You may already have an active policy, or the server returned an error.');
      return false;
    }
  };

  const handleAddMoney = async () => {
    const amt = parseFloat(String(addMoneyAmount).replace(/[^\d.]/g, '')) || 0;
    if (!Number.isFinite(amt) || amt <= 0) {
      alert('Please enter a valid amount (numbers only).');
      return;
    }
    const wid = parseWorkerId(workerId);
    setAddMoneyStatus('loading');
    try {
      if (wid != null) {
        const res = await axios.post(`${API_BASE_URL}/worker/${wid}/wallet/top-up`, {
          amount: amt,
          payment_method: addMoneyPaymentMethod,
        });
        setWalletBalance(Number(res.data?.wallet_balance ?? 0));
        const t = res.data?.transaction;
        if (t) {
          setWalletTransactions(prev => {
            const row = {
              id: `L-${t.id}`,
              date: formatINRDate(t.created_at),
              desc: t.description || `Wallet top-up (${addMoneyPaymentMethod})`,
              type: 'Credit',
              amount: amt,
            };
            return [row, ...prev.filter(r => r.id !== row.id)];
          });
        }
      } else {
        setWalletBalance(prev => prev + amt);
        setWalletTransactions(prev => [
          {
            id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            desc: `Wallet top-up (${WALLET_ADD_PAYMENT_METHODS.find(m => m.id === addMoneyPaymentMethod)?.label || 'UPI'})`,
            type: 'Credit',
            amount: amt,
          },
          ...prev,
        ]);
      }
      setAddMoneyStatus('success');
      setTimeout(() => {
        setShowAddMoneyModal(false);
        setAddMoneyStatus('idle');
        setAddMoneyAmount('');
        setAddMoneyPaymentMethod('UPI');
      }, 1500);
    } catch (e) {
      console.warn("Network unreachable, seamlessly mocking wallet top-up...", e);
      setWalletBalance(prev => prev + amt);
      setWalletTransactions(prev => [
        {
          id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          desc: `Wallet top-up (Mock Fallback)`,
          type: 'Credit',
          amount: amt,
        },
        ...prev,
      ]);
      setAddMoneyStatus('success');
      setTimeout(() => {
        setShowAddMoneyModal(false);
        setAddMoneyStatus('idle');
        setAddMoneyAmount('');
        setAddMoneyPaymentMethod('UPI');
      }, 1500);
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
                  <motion.button whileHover={{ scale: 1.02, boxShadow: '0 15px 30px rgba(245, 158, 11, 0.4)' }} whileTap={{ scale: 0.98 }} onClick={() => { setWorkerId(1); setCurrentView('rider-dash'); }} style={{ padding: '18px', background: 'linear-gradient(135deg, #FFC72C, #F59E0B)', color: '#0f172a', border: 'none', borderRadius: '20px', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', marginTop: '12px', boxShadow: '0 10px 25px rgba(245, 158, 11, 0.2)' }}>Authenticate</motion.button>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                  </div>
                  
                  <motion.button whileHover={{ scale: 1.02, borderColor: 'rgba(16, 185, 129, 0.5)' }} whileTap={{ scale: 0.98 }} onClick={handleDemoUserLogin} style={{ padding: '18px', background: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(16, 185, 129, 0.3)', borderRadius: '20px', color: '#10b981', fontWeight: 800, fontSize: '1.05rem', cursor: 'pointer', transition: 'all 0.3s' }}>
                    <Zap size={18} style={{ display: 'inline', marginRight: '8px' }} />
                    Try Demo Access
                  </motion.button>
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

        <InfoSection />
        <Testimonials />
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
    <RegistrationFlow 
      riderInfo={riderInfo}
      setRiderInfo={setRiderInfo}
      setWorkerId={setWorkerId}
      setCurrentView={setCurrentView}
      setCalculatedPremium={setCalculatedPremium}
      setCoverageAmount={setCoverageAmount}
      setRScore={setRScore}
      setIsFromRegistration={setIsFromRegistration}
    />
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
            <div style={{ position: 'relative' }}>
              <button 
                className="btn" 
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', position: 'relative' }}
                onClick={() => setShowLiveFeedDropdown(!showLiveFeedDropdown)}
              >
                <Bell size={14} /> Notifications
                {showLiveFeedDropdown && <div style={{ position: 'absolute', top: 0, right: 0, width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} className="animate-pulse" />}
              </button>
              
              <AnimatePresence>
                {showLiveFeedDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                    transition={{ duration: 0.2 }}
                    style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '320px', background: 'white', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', overflow: 'hidden', zIndex: 100 }}
                  >
                    <div style={{ background: '#f8fafc', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', fontWeight: 700, color: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      Live System Feed
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#10b981' }}>
                        <div className="animate-pulse" style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%' }} /> Active
                      </div>
                    </div>
                    <div style={{ padding: '8px' }}>
                      <div style={{ padding: '12px', fontSize: '0.85rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{ marginTop: '2px' }}><Activity size={14} color="#38bdf8" /></div>
                          <div><strong>Live feed active</strong><br/><span style={{ fontSize: '0.75rem', color: '#64748b' }}>Node: {workerId || 'Pending'} | Wallet: ₹{walletBalance}</span></div>
                        </div>
                        <div style={{ width: '100%', height: '1px', background: '#f1f5f9' }} />
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{ marginTop: '2px' }}><ShieldCheck size={14} color="#10b981" /></div>
                          <div><strong>This is your active plan</strong><br/>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {hasActivePolicy && activatedPlan ? `${activatedPlan.name} (Coverage: ₹${coverageAmount})` : 'No policy activated yet.'}
                            </span>
                          </div>
                        </div>
                        <div style={{ width: '100%', height: '1px', background: '#f1f5f9' }} />
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{ marginTop: '2px' }}><Radio size={14} color="#f59e0b" /></div>
                          <div><strong>Guidewire Sync</strong><br/>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Zone: {ZONE_RISK_PROFILES[riderInfo.zone]?.name || 'Unknown'} | R-Score: {rScore}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
              <div className={`btn ${riderTab === 'overview' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'overview' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'overview' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'overview' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('overview')}>
                <Activity size={18} /> Overview
              </div>
              <div className={`btn ${riderTab === 'plan-advisor' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'plan-advisor' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'plan-advisor' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'plan-advisor' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('plan-advisor')}>
                <Lightbulb size={18} /> Plan Advisor
              </div>
              <div className={`btn ${riderTab === 'my-policy' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'my-policy' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'my-policy' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'my-policy' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('my-policy')}>
                <ShieldCheck size={18} /> My Policy
              </div>
              <div className={`btn ${riderTab === 'explore-plans' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'explore-plans' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'explore-plans' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'explore-plans' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('explore-plans')}>
                <Sliders size={18} /> Explore Plans
              </div>
              <div className={`btn ${riderTab === 'file-claim' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'file-claim' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'file-claim' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'file-claim' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('file-claim')}>
                <ListPlus size={18} /> File a Claim
              </div>
              <div className={`btn ${riderTab === 'claim-history' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'claim-history' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'claim-history' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'claim-history' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('claim-history')}>
                <Clock size={18} /> Claim History
              </div>
              <div className={`btn ${riderTab === 'wallet' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'wallet' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'wallet' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'wallet' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('wallet')}>
                <Wallet size={18} /> Wallet & Payouts
              </div>
              <div className={`btn ${riderTab === 'help' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'help' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'help' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'help' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('help')}>
                <HelpCircle size={18} /> Help & Support
              </div>
              <div className={`btn ${riderTab === 'terms' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'terms' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'terms' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'terms' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('terms')}>
                <FileText size={18} /> Terms & Conditions
              </div>
              <div className={`btn ${riderTab === 'legal' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'legal' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'legal' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'legal' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('legal')}>
                <Shield size={18} /> Legal Notice
              </div>
              <div style={{ margin: '16px 0', borderTop: '1px solid var(--card-border)' }}></div>
              <div className="btn btn-outline" style={{ justifyContent: 'flex-start', border: 'none', color: 'var(--accent-red)' }} onClick={() => setCurrentView('login')}>
                <Search size={18} /> Log Out
              </div>
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
                      <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>₹{coverageAmount.toLocaleString()}</h2>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{activatedPlan?.name} Protection active</p>
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
                      {claims.filter(c => String(c.status || '').includes('Instant')).map(c => (
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
                                    <span>💰 Wallet balance (plan checkout)</span>
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
                              if (isCurrentActive) return;
                              setSelectedPlan(policy.id);
                              setPendingPlanToActivate({ policy, pricing });
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
                            {isCurrentActive ? <><CheckCircle size={20} /> Currently Active</> : 
                             (hasActivePolicy ? <><Zap size={20} /> Upgrade to {policy.name}</> : 
                             (isSelected ? `Activate ${policy.name}` : 'Select Plan'))}
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
                <header style={{ marginBottom: '32px' }}>
                  <h1 className="animate-slide-up">Claim History</h1>
                  <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Review your previously filed manual claims and automated logic traces.</p>
                </header>

                <div className="animate-slide-up delay-200">
                  {claims.length === 0 ? (
                    <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 20px', border: '1px dashed var(--card-border)' }}>
                      <FileText size={32} style={{ margin: '0 auto 16px auto', opacity: 0.5 }} />
                      <p>You have no claim history.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {claims.map(c => (
                        <div key={c.id} className="card" style={{ borderLeft: isClaimPendingStatus(c.status) ? '4px solid var(--accent-orange)' : '4px solid var(--accent-green)', padding: '24px', margin: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span className={`badge ${isClaimPendingStatus(c.status) ? 'badge-orange' : 'badge-green'}`}>
                              {c.status}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{c.date}</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>{c.reason}</p>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Reference Number: {c.id}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <h3 style={{ color: isClaimPendingStatus(c.status) ? 'var(--text-main)' : 'var(--accent-green)', fontSize: '1.5rem' }}>₹{Number(c.amount || 0).toLocaleString('en-IN')}</h3>
                              {!isClaimPendingStatus(c.status) && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Processed and Closed</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {riderTab === 'wallet' && (
              <>
                <header style={{ marginBottom: '24px' }}>
                  <h1 className="animate-slide-up">Wallet & Payouts</h1>
                  <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>
                    Add money with UPI, NetBanking, or card. Your balance automatically reduces weekly plan price at checkout (down to the minimum premium). Claim payouts credit here too.
                  </p>
                </header>

                <div className="card animate-slide-up delay-100" style={{ marginBottom: '24px', padding: '20px 24px', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1px solid #bae6fd' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ background: 'white', padding: '12px', borderRadius: '14px', border: '1px solid #bae6fd' }}>
                        <Wallet size={26} color="var(--primary)" />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AEGIS wallet balance</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>₹{Number(walletBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px', maxWidth: '420px' }}>
                          Use this for <strong>weekly plans</strong> (Explore Plans), premium top-ups, and resilience savings from coverage.
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <button type="button" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }} onClick={() => setShowAddMoneyModal(true)}>
                        <PlusCircle size={18} /> Add money
                      </button>
                      <button type="button" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontWeight: 700 }} onClick={() => setRiderTab('explore-plans')}>
                        <ShoppingBag size={18} /> Buy / renew plan
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid-3 animate-slide-up delay-200" style={{ marginBottom: '32px' }}>
                  {/* Payout Balance */}
                  <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ opacity: 0.8 }}>Total Payouts</span>
                      <Landmark size={20} />
                    </div>
                    <h1 style={{ fontSize: '2.4rem', marginBottom: '8px' }}>₹{claims.reduce((acc, curr) => (isClaimPaidOutStatus(curr.status) ? acc + Number(curr.amount || 0) : acc), 0).toFixed(2)}</h1>
                    <p style={{ fontSize: '0.85rem', opacity: 0.9 }}>Earnings from approved parametric claims</p>

                    <button type="button" className="btn" style={{ background: 'white', color: 'var(--primary)', width: '100%', marginTop: 'auto', fontWeight: 600 }} onClick={() => window.alert('Withdrawal to your linked bank / UPI is queued. You will receive an SMS within 1–2 business days when it completes.')}>
                      Withdraw to Bank
                    </button>
                  </div>

                  {/* Wallet + micro-savings explainer */}
                  <div className="card" style={{ background: 'linear-gradient(135deg, #FFC72C 0%, #d97706 100%)', color: '#003366', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ opacity: 0.9, fontWeight: 700 }}>Plan & savings wallet</span>
                      <ShieldCheck size={20} color="#003366" />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '8px', fontWeight: 800 }}>₹{Number(walletBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
                    <div style={{ background: 'rgba(0,51,102,0.1)', padding: '4px 10px', borderRadius: '12px', display: 'inline-flex', fontSize: '0.75rem', fontWeight: 700, marginBottom: '12px', alignSelf: 'flex-start', color: '#003366' }}>Top-ups + rebates + 20% premium credit</div>
                    <p style={{ fontSize: '0.85rem', opacity: 0.95, flex: 1, fontWeight: 500, lineHeight: 1.5 }}>
                      Money you add (UPI / NetBanking / card) is available immediately for <strong>plan purchase</strong>. When you activate a weekly plan, we debit from this balance first, then charge the rest via your mandate.
                    </p>
                    <button type="button" className="btn" style={{ background: '#003366', color: 'white', width: '100%', marginTop: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: 'none' }} onClick={() => setShowAddMoneyModal(true)}>
                      <PlusCircle size={18} /> Add money to wallet
                    </button>
                  </div>

                  <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={{ marginBottom: '4px' }}>Linked payout & add-money rails</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Payouts go to your bank / UPI. You can add funds using any option below in the Add money flow.</p>

                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Receive payouts</div>
                    <div style={{ padding: '14px', border: '1px solid var(--accent-green)', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--accent-green)', padding: '8px', borderRadius: '8px', color: 'white' }}>
                          <Landmark size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>HDFC Bank ••••9421</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Primary settlement</div>
                        </div>
                      </div>
                      <CheckCircle size={18} color="var(--accent-green)" />
                    </div>

                    <div style={{ padding: '14px', border: '1px solid var(--card-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '8px', color: 'white' }}>
                          <Smartphone size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{riderInfo.upiId || riderInfo.upi_id || 'Add UPI in profile'}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instant UPI backup</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>Add money (choose in modal)</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      {WALLET_ADD_PAYMENT_METHODS.map(m => {
                        const Ico = m.icon;
                        return (
                          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)' }}>
                            <Ico size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                            <span>{m.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <h3 className="animate-slide-up delay-300" style={{ marginBottom: '16px' }}>Transaction History</h3>
                <div className="card animate-slide-up delay-300" style={{ padding: 0, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--card-border)' }}>
                        <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Date</th>
                        <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Description</th>
                        <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Type</th>
                        <th style={{ padding: '16px 24px', fontWeight: '500', color: 'var(--text-muted)' }}>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={4} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            No activity yet. Top-ups (UPI / NetBanking / card), plan payments from wallet, and claim payouts will show here.
                          </td>
                        </tr>
                      ) : (
                        walletTransactions.map((txn, idx) => (
                          <tr key={txn.id || idx} style={{ borderBottom: idx === walletTransactions.length - 1 ? 'none' : '1px solid var(--card-border)' }}>
                            <td style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{txn.date}</td>
                            <td style={{ padding: '16px 24px' }}>{txn.desc}</td>
                            <td style={{ padding: '16px 24px' }}>
                              <span className={`badge ${txn.type === 'Credit' ? 'badge-green' : 'badge-blue'}`}>{txn.type}</span>
                            </td>
                            <td style={{ padding: '16px 24px', color: txn.type === 'Credit' ? 'var(--accent-green)' : 'var(--text-main)', fontWeight: 600 }}>
                              {txn.type === 'Credit' ? '+' : '-'}₹{Number(txn.amount || 0).toLocaleString('en-IN')}
                            </td>
                          </tr>
                        ))
                      )}
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
                        <h2 style={{ fontSize: '1.4rem' }}>{activatedPlan ? activatedPlan.name : 'Standard Plan'}</h2>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>Premium</p>
                        <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>₹{activatedPlan ? activatedPlan.premium : 40}/wk</h2>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px', background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Coverage Limit</div>
                        <div style={{ fontWeight: 600 }}>₹{hasActivePolicy ? coverageAmount.toLocaleString() : '0'} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ week</span></div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Expires Sunday</div>
                      </div>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', marginBottom: '8px' }} onClick={() => setRiderTab('explore-plans')}>
                      {hasActivePolicy ? 'Upgrade Coverage' : 'Browse All Plans'}
                    </button>
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
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Active Policy Tier</div>
                      <h2 style={{ fontSize: '1.4rem', marginBottom: 0 }}>{activatedPlan ? activatedPlan.name : 'No Active Plan'}</h2>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Policy Status</div>
                    <h2 style={{ fontSize: '1.4rem', marginBottom: 0, color: hasActivePolicy ? 'var(--accent-green)' : 'var(--accent-red)' }}>{hasActivePolicy ? 'ENFORCED' : 'INACTIVE'}</h2>
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
                      <span className="badge badge-green">Maximum Coverage</span>
                      <ShieldCheck size={20} color="var(--accent-green)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '4px' }}>₹{hasActivePolicy ? coverageAmount.toLocaleString() : '0'}</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Secured payout limit per week</p>
                    <div style={{ marginTop: '16px', background: 'var(--card-border)', height: '6px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ background: hasActivePolicy ? 'var(--accent-green)' : 'var(--card-border)', width: hasActivePolicy ? '100%' : '0%', height: '100%' }}></div>
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
                      {chatMessages.map((msg, i) => (
                        <div 
                          key={i} 
                          style={{ 
                            background: msg.role === 'assistant' ? 'rgba(0, 115, 152, 0.1)' : 'var(--card-bg)', 
                            border: msg.role === 'assistant' ? 'none' : '1px solid var(--card-border)',
                            padding: '12px 16px', 
                            borderRadius: msg.role === 'assistant' ? '12px 12px 12px 0' : '12px 12px 0 12px', 
                            alignSelf: msg.role === 'assistant' ? 'flex-start' : 'flex-end', 
                            maxWidth: '85%'
                          }}
                        >
                          <p style={{ fontSize: '0.95rem' }}>{msg.text}</p>
                        </div>
                      ))}
                      {isChatLoading && (
                        <div style={{ background: 'rgba(0, 115, 152, 0.05)', padding: '12px 16px', borderRadius: '12px 12px 12px 0', alignSelf: 'flex-start' }}>
                          <Loader2 className="animate-spin" size={18} color="var(--primary)" />
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '12px' }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Type your query..." 
                        style={{ flex: 1 }} 
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        disabled={isChatLoading}
                      />
                      <button type="submit" className="btn btn-primary" style={{ padding: '12px' }} disabled={isChatLoading || !chatInput.trim()}>
                        <Send size={18} />
                      </button>
                    </form>
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

            {riderTab === 'terms' && (
              <div className="animate-slide-up">
                <header style={{ marginBottom: '32px' }}>
                  <h1 style={{ fontSize: '2.4rem', background: 'linear-gradient(45deg, var(--primary), #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>🛡️ AEGIS Terms & Conditions</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Last Updated: April 2026</p>
                </header>
                <div className="card glass-panel" style={{ padding: '40px', lineHeight: '1.6', color: 'var(--text-main)', border: '1px solid rgba(0,115,152,0.1)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>1. 📌 Nature of Service</h3>
                      <p>AEGIS provides AI-powered parametric income protection for gig workers. Coverage is strictly limited to loss of income due to external disruptions. AEGIS does NOT cover: Health issues, Accidents, Vehicle damage, Personal injury.</p>
                    </section>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>2. 👤 Eligibility</h3>
                      <p>To use AEGIS: You must be an active gig worker (e.g., delivery partner). You must provide accurate and verifiable information. You must link a valid UPI account for payouts.</p>
                    </section>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>3. 💰 Weekly Premium Model</h3>
                      <p>Premiums are charged on a weekly basis. Pricing is dynamically calculated using AI models based on: Environmental risk, Location, Historical patterns. Premiums are non-refundable, except in cases defined under Risk Rebate policies.</p>
                    </section>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>4. ⚡ Parametric Claim Triggering</h3>
                      <p>Claims are automatically processed using a Double-Lock System: Disruption Detection (Trigger Lock 1) and Income Loss Validation (Trigger Lock 2). A claim will only be approved if a verified disruption occurs and there is measurable loss of earning capacity.</p>
                    </section>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>5. 💸 Payouts</h3>
                      <p>Approved claims are processed automatically (zero-touch). Payouts are sent via UPI to your registered account. Processing time may vary based on network or system availability.</p>
                    </section>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>6. 🚫 Fraud & Misuse</h3>
                      <p>AEGIS enforces strict anti-fraud mechanisms (GPS spoofing, Fake activity simulation, Emulator usage). If fraud is detected: Claims will be rejected immediately, and accounts may be suspended or permanently banned.</p>
                    </section>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>7. 📊 Data Usage</h3>
                      <p>We may collect: Location data, Device telemetry, Platform activity. This data is used strictly for: Risk calculation, Fraud detection, Claim validation. We do not sell personal data to third parties.</p>
                    </section>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>8. ⚠️ Limitation of Liability</h3>
                      <p>AEGIS operates on a parametric model: Payouts are based on predefined triggers. Not all real-world losses may qualify for compensation.</p>
                    </section>
                    <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--card-border)', textAlign: 'center' }}>
                      <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>By using AEGIS, you acknowledge that you have read, understood, and agreed to these Terms.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {riderTab === 'legal' && (
              <div className="animate-slide-up">
                <header style={{ marginBottom: '32px' }}>
                  <h1 style={{ fontSize: '2.4rem', background: 'linear-gradient(45deg, #0f172a, var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>⚖️ Legal Notice & Disclaimer</h1>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Last Updated: April 2026</p>
                </header>
                <div className="card glass-panel" style={{ padding: '40px', lineHeight: '1.6', color: 'var(--text-main)', border: '1px solid rgba(0,115,152,0.1)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>📌 1. Nature of Product</h3>
                      <p>AEGIS is a parametric financial protection platform, not a traditional insurance provider. We insure loss of income, not physical damages. We do not provide: Health insurance, Life insurance, Accident coverage, Vehicle protection.</p>
                    </section>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>📊 2. Parametric Model Disclaimer</h3>
                      <p>AEGIS operates on data-driven triggers: Claims are based on Weather data, Traffic conditions, Platform activity, and External disruptions. Compensation is determined by predefined parameters and AI-based evaluation.</p>
                      <p style={{ marginTop: '12px', fontStyle: 'italic', background: 'rgba(0,115,152,0.05)', padding: '12px', borderRadius: '8px' }}>👉 This means: A real-world loss may not always result in a payout, and a payout may occur even without manual claim filing.</p>
                    </section>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>🤖 3. AI & Automation Disclaimer</h3>
                      <p>AEGIS uses Machine Learning models for Risk prediction, Fraud detection, and Claim approval. While designed for accuracy: AI decisions may not always be perfect, and users accept automated decision-making as part of service usage.</p>
                    </section>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>🔐 4. Data & Privacy</h3>
                      <p>We process: Device telemetry, Location data, Behavioral patterns. Purpose: Fraud prevention, Claim validation, Risk modeling. We follow best practices for: Data encryption, Secure storage.</p>
                    </section>
                    <section>
                      <h3 style={{ marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>🚫 5. Fraud & Abuse Policy</h3>
                      <p>Any attempt to manipulate the system (GPS spoofing, Fake claims, Emulator usage) will result in: Immediate rejection, Account suspension, and Legal escalation if required.</p>
                    </section>
                    <div style={{ marginTop: '32px', paddingTop: '32px', borderTop: '1px solid var(--card-border)', textAlign: 'center' }}>
                      <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>By using AEGIS, you agree to this Legal Notice and Disclaimer.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  };

  const renderAddMoneyModal = () => (
    <AnimatePresence>
      {showAddMoneyModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,115,152,0.6)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>Add money to wallet</h2>
                <button type="button" onClick={() => { setShowAddMoneyModal(false); setAddMoneyPaymentMethod('UPI'); setAddMoneyStatus('idle'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Funds are available for weekly plans and wallet debits at checkout. Choose how you want to pay.</p>

              {addMoneyStatus === 'success' ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px auto' }}>
                    <CheckCircle size={40} color="var(--accent-green)" />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Payment successful</h3>
                  <p style={{ color: 'var(--text-muted)' }}>
                    ₹{Number(addMoneyAmount || 0).toLocaleString('en-IN')} added via{' '}
                    <strong>{WALLET_ADD_PAYMENT_METHODS.find(m => m.id === addMoneyPaymentMethod)?.label || 'UPI'}</strong>. Use it on <strong>Explore Plans</strong> when you activate coverage.
                  </p>
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>₹</span>
                      <input type="number" value={addMoneyAmount} onChange={e => setAddMoneyAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', padding: '16px 20px 16px 56px', fontSize: '1.8rem', fontWeight: 800, border: '2px solid #E2E8F0', borderRadius: '16px', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => { e.target.style.borderColor = 'var(--primary)'; }} onBlur={e => { e.target.style.borderColor = '#E2E8F0'; }} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick amount</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                      {[100, 250, 500, 1000].map(amt => (
                        <button key={amt} type="button" onClick={() => setAddMoneyAmount(amt.toString())} style={{ padding: '10px', background: addMoneyAmount === amt.toString() ? 'var(--primary)' : 'rgba(0,115,152,0.05)', color: addMoneyAmount === amt.toString() ? 'white' : 'var(--primary)', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '28px' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pay with</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      {WALLET_ADD_PAYMENT_METHODS.map(m => {
                        const Ico = m.icon;
                        const sel = addMoneyPaymentMethod === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setAddMoneyPaymentMethod(m.id)}
                            style={{
                              padding: '14px 14px',
                              border: sel ? '2px solid var(--primary)' : '2px solid #E2E8F0',
                              borderRadius: '14px',
                              background: sel ? 'rgba(0,115,152,0.06)' : '#fafafa',
                              cursor: 'pointer',
                              textAlign: 'left',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '12px',
                              transition: 'all 0.2s',
                            }}
                          >
                            <div style={{ background: sel ? 'var(--primary)' : '#e2e8f0', padding: '8px', borderRadius: '10px', color: 'white', flexShrink: 0 }}>
                              <Ico size={18} color={sel ? 'white' : '#64748b'} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>{m.label}</div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.3 }}>{m.sub}</div>
                            </div>
                            {sel && <CheckCircle size={18} color="var(--primary)" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button type="button" className="btn btn-primary" onClick={handleAddMoney} disabled={addMoneyStatus === 'loading' || !addMoneyAmount} style={{ width: '100%', padding: '18px', fontSize: '1.05rem', fontWeight: 800 }}>
                    {addMoneyStatus === 'loading' ? <><Loader2 className="animate-spin" size={24} /> Processing…</> : `Pay ₹${addMoneyAmount ? Number(addMoneyAmount).toLocaleString('en-IN') : '0'}`}
                  </button>
                </>
              )}
            </div>
            <div style={{ padding: '16px', background: '#F8FAFC', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Shield size={14} /> Secured by AEGIS PCI-DSS Compliant Gateway
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderConfirmPlanModal = () => (
    <AnimatePresence>
      {pendingPlanToActivate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '450px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: pendingPlanToActivate.policy.accentColor, padding: '14px', borderRadius: '16px' }}>
                    <ShieldCheck size={32} color={pendingPlanToActivate.policy.color} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.2 }}>Confirm Upgrade</h2>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 600 }}>{pendingPlanToActivate.policy.name}</div>
                  </div>
                </div>
                <button type="button" onClick={() => setPendingPlanToActivate(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={24} /></button>
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.02)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '32px', fontSize: '1.05rem', color: '#334155', lineHeight: 1.6 }}>
                 Are you sure you want to upgrade to <strong>{pendingPlanToActivate.policy.name}</strong> for <strong>₹{pendingPlanToActivate.pricing.finalPremium}/wk</strong>? 
                 <br/><br/>
                 This amount will be deducted directly from your Resilience Wallet.
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setPendingPlanToActivate(null)} style={{ flex: 1, padding: '16px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.target.style.background = '#e2e8f0'} onMouseOut={e => e.target.style.background = '#f1f5f9'}>Cancel</button>
                <button type="button" onClick={async () => {
                  const pDetails = { id: pendingPlanToActivate.policy.id, name: pendingPlanToActivate.policy.name, premium: pendingPlanToActivate.pricing.finalPremium };
                  const success = await initiatePolicy(pendingPlanToActivate.policy.tier, pDetails);
                  if (success) {
                    localStorage.setItem('aegis_selected_plan_id', pendingPlanToActivate.policy.id);
                  }
                  setPendingPlanToActivate(null);
                }} style={{ flex: 1, padding: '16px', background: pendingPlanToActivate.policy.color, color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: `0 8px 16px ${pendingPlanToActivate.policy.color}40`, transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform = 'scale(1.02)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>Confirm</button>
              </div>
            </div>
            <div style={{ padding: '14px', background: '#F8FAFC', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderTop: '1px solid var(--card-border)' }}>
              <Lock size={12} /> Secure platform transaction
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderErrorModal = () => (
    <AnimatePresence>
      {errorMessage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '400px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '32px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <AlertOctagon size={32} color="#ef4444" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px' }}>Action Failed</h2>
              <div style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '28px' }}>
                 {errorMessage}
              </div>

              <button type="button" onClick={() => setErrorMessage(null)} style={{ width: '100%', padding: '16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)', transition: 'transform 0.2s' }} onMouseOver={e => e.target.style.transform = 'scale(1.02)'} onMouseOut={e => e.target.style.transform = 'scale(1)'}>Understood</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderPlanPromptToast = () => (
    <AnimatePresence>
      {showPlanPromptToast && (
        <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            style={{
              position: 'fixed',
              top: '32px',
              left: '50%',
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px',
              padding: '12px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 9999,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <ShieldCheck size={20} color="#FFC72C" />
            <span style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.3px' }}>
              Protect your income. Visit "Explore Plans" to select a policy!
            </span>
          </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {currentView === 'login' && renderLogin()}
      {currentView === 'onboarding' && renderOnboarding()}
      {currentView === 'plan-selection' && (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F0F7FB 0%, #FFFFFF 100%)' }}>
          <PlanSelection
            riderInfo={riderInfo}
            workerId={workerId}
            walletBalance={walletBalance}
            setWalletBalance={setWalletBalance}
            setCurrentView={setCurrentView}
            setActivatedPlan={setActivatedPlan}
            setHasActivePolicy={setHasActivePolicy}
            setCalculatedPremium={setCalculatedPremium}
            setCoverageAmount={setCoverageAmount}
            onCancel={() => setCurrentView('rider-dash')}
          />
        </div>
      )}
      {currentView === 'rider-dash' && renderRiderDashboard()}
      {currentView === 'admin-dash' && <ControlCenter setCurrentView={setCurrentView} adminLogs={adminLogs} engineStates={engineStates} injectScenario={injectScenario} resetEngines={resetEngines} parametricTriggerResult={parametricTriggerResult} setParametricTriggerResult={setParametricTriggerResult} parametricCity={parametricCity} setParametricCity={setParametricCity} parametricTriggerLoading={parametricTriggerLoading} handleParametricRainTrigger={handleParametricRainTrigger} handleParametricHeatTrigger={handleParametricHeatTrigger} handleParametricStrikeTrigger={handleParametricStrikeTrigger} />}
      {renderAddMoneyModal()}
      {renderConfirmPlanModal()}
      {renderErrorModal()}
      {renderPlanPromptToast()}
      <Chatbot callbackPhone={riderInfo.mobile || ''} />
    </>
  );
}
