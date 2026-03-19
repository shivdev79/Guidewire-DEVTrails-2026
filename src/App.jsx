import React, { useState, useEffect } from 'react';
import { Shield, CloudRain, Wind, Thermometer, AlertTriangle, CloudRainWind, Wallet, CheckCircle, Activity, Search, Siren, Sun, FileText, Upload, User, Bell, Clock, CreditCard, Banknote, Landmark, ListPlus, ShieldCheck, TrendingDown, AlertOctagon, BarChart2, CalendarClock, HelpCircle, Send, Map, Radio, ShieldAlert, FileSearch, Settings, ArrowRightLeft, BrainCircuit, PieChart, Users, Zap, Download, CalendarCheck, Lightbulb, Gauge } from 'lucide-react';
import ControlCenter from './ControlCenter';

const MOCK_ZONES = [
  { id: 'z1', name: 'Downtown Core', risk: 'High', aqi: 240, weather: 'Heavy Rain' },
  { id: 'z2', name: 'North Suburbs', risk: 'Low', aqi: 85, weather: 'Clear' },
  { id: 'z3', name: 'East Industrial', risk: 'Critical', aqi: 310, weather: 'Smog' }
];

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
    name: '', platform: 'Zomato', zone: 'z1', avgEarnings: 1500,
    gender: 'Male', dob: '', mobile: '', email: '', pincode: '', city: 'Mumbai', occupation: 'Platform Partner'
  });
  const [hasActivePolicy, setHasActivePolicy] = useState(false);
  const [claims, setClaims] = useState([]);
  const [riderTab, setRiderTab] = useState('overview'); // overview, claims
  const [adminTab, setAdminTab] = useState('overview'); // overview, risk, disruptions, claims, fraud, policies, payouts, analytics, loss-ratio, workers, triggers, reports
  const [manualClaim, setManualClaim] = useState({ reason: 'Rain', description: '', amount: '' });

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

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    setCurrentView('rider-dash');
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
    <div style={{ background: '#f8f9fa', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px', textAlign: 'center', padding: '48px', border: 'none', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', borderRadius: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', padding: '20px', background: 'rgba(0, 115, 152, 0.1)', borderRadius: '24px', marginBottom: '20px' }}>
            <Shield size={64} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>AEGIS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            AI-Powered Parametric Income Security
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <button
            className="btn"
            style={{ padding: '18px', fontSize: '1.1rem', background: 'var(--primary)', color: 'white', borderRadius: '12px', fontWeight: 600, boxShadow: '0 4px 14px var(--glow-primary)' }}
            onClick={() => setCurrentView('rider-dash')}
          >
            Access Partner Portal
          </button>

          <div style={{ position: 'relative', margin: '20px 0', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, borderTop: '1px solid #e2e8f0' }}></div>
            <span style={{ padding: '0 16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>OR MANAGER ACCESS</span>
            <div style={{ flex: 1, borderTop: '1px solid #e2e8f0' }}></div>
          </div>

          <button
            className="btn btn-outline"
            style={{ padding: '18px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: 500 }}
            onClick={() => setCurrentView('admin-dash')}
          >
            Launch Insurer Console
          </button>
        </div>

        <p style={{ marginTop: '40px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Powered by Aegis AI • Parametric Protection for the Gig Economy
        </p>
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
                  <input type="text" className="input-field" placeholder="DD/MM/YYYY" value={riderInfo.dob} onChange={e => setRiderInfo({ ...riderInfo, dob: e.target.value })} />
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
                  <input type="text" className="input-field" placeholder="10 digit mobile number" value={riderInfo.mobile} onChange={e => setRiderInfo({ ...riderInfo, mobile: e.target.value })} />
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
    const selectedZone = MOCK_ZONES.find(z => z.id === riderInfo.zone);
    const calculatedPremium = Math.round(riderInfo.avgEarnings * 0.02); // 2% of earnings
    const coverageAmount = Math.round(riderInfo.avgEarnings * 0.8);

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
              <div className={`btn ${riderTab === 'overview' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'overview' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'overview' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'overview' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('overview')}>
                <Activity size={18} /> Overview
              </div>
              <div className={`btn ${riderTab === 'plan-advisor' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'plan-advisor' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'plan-advisor' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'plan-advisor' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('plan-advisor')}>
                <Lightbulb size={18} /> Plan Advisor
              </div>
              <div className={`btn ${riderTab === 'my-policy' ? '' : 'btn-outline'}`} style={{ justifyContent: 'flex-start', color: riderTab === 'my-policy' ? 'var(--primary)' : 'var(--text-main)', background: riderTab === 'my-policy' ? 'rgba(0,115,152,0.1)' : 'transparent', border: riderTab === 'my-policy' ? 'none' : '1px solid transparent' }} onClick={() => setRiderTab('my-policy')}>
                <ShieldCheck size={18} /> My Policy
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
                      4.2 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>/ 10</span>
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
                      <button className="btn btn-primary" style={{ padding: '12px 24px' }} onClick={() => setHasActivePolicy(true)}>
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
                        <div key={c.id} className="card" style={{ borderLeft: c.status.includes('Pending') ? '4px solid var(--accent-orange)' : '4px solid var(--accent-green)', padding: '24px', margin: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span className={`badge ${c.status.includes('Pending') ? 'badge-orange' : 'badge-green'}`}>
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
                              <h3 style={{ color: c.status.includes('Pending') ? 'var(--text-main)' : 'var(--accent-green)', fontSize: '1.5rem' }}>₹{c.amount}</h3>
                              {!c.status.includes('Pending') && (
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
                <header style={{ marginBottom: '32px' }}>
                  <h1 className="animate-slide-up">Wallet & Payouts</h1>
                  <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Manage how your approved claims are credited to your bank.</p>
                </header>

                <div className="grid-2 animate-slide-up delay-200" style={{ marginBottom: '32px' }}>
                  <div className="card" style={{ background: 'var(--primary)', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <span style={{ opacity: 0.8 }}>Available Balance</span>
                      <Landmark size={20} />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>₹1,200.00</h1>
                    <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Available for withdrawal instantly via UPI</p>

                    <button className="btn" style={{ background: 'white', color: 'var(--primary)', width: '100%', marginTop: '24px', fontWeight: 600 }}>
                      Withdraw to Bank
                    </button>
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
              <header style={{ marginBottom: '32px' }}>
                <h1 className="animate-slide-up">Policy Management</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Configure weekly insurance plans and parametric limits.</p>
              </header>
              <div className="grid-3 animate-slide-up delay-200">
                <div className="card glass-panel">
                  <h3>Basic Plan</h3>
                  <h2 style={{ margin: '16px 0', color: 'var(--primary)' }}>₹25 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ week</span></h2>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <li>Max Payout: ₹800</li>
                    <li>Rain & Heat Only</li>
                    <li>48h Claim Processing</li>
                  </ul>
                  <button className="btn btn-outline" style={{ width: '100%' }}>Edit Plan</button>
                </div>
                <div className="card glass-panel" style={{ border: '1px solid var(--accent-green)' }}>
                  <span className="badge badge-green" style={{ float: 'right' }}>Most Popular</span>
                  <h3>Standard Plan</h3>
                  <h2 style={{ margin: '16px 0', color: 'var(--primary)' }}>₹40 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ week</span></h2>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <li>Max Payout: ₹1,500</li>
                    <li>All Weather Triggers</li>
                    <li>2h Claim Processing</li>
                  </ul>
                  <button className="btn btn-primary" style={{ width: '100%' }}>Edit Plan</button>
                </div>
                <div className="card glass-panel">
                  <h3>Premium Plan</h3>
                  <h2 style={{ margin: '16px 0', color: 'var(--primary)' }}>₹85 <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ week</span></h2>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <li>Max Payout: ₹3,500</li>
                    <li>All Triggers + Strikes</li>
                    <li>Instant Payouts</li>
                  </ul>
                  <button className="btn btn-outline" style={{ width: '100%' }}>Edit Plan</button>
                </div>
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
                <h1 className="animate-slide-up">Trigger Monitoring</h1>
                <p className="animate-slide-up delay-100" style={{ color: 'var(--text-muted)' }}>Active API endpoints generating parametric truths.</p>
              </header>
              <div className="grid-3">
                {PREDEFINED_TRIGGERS.map((t, idx) => (
                  <div key={idx} className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', background: 'rgba(0,115,152,0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                      {t.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{t.condition}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                        <div style={{ width: 8, height: 8, background: 'var(--accent-green)', borderRadius: '50%' }}></div> Polling Every 60s
                      </div>
                    </div>
                  </div>
                ))}
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
