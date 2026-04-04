import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Shield, Activity, Map, FileSearch, ShieldAlert,
  TrendingDown, Users, Settings, BrainCircuit,
  Zap, CloudRainWind, Siren, FileText, CheckCircle,
  BarChart2, CreditCard, Clock, Landmark, Search,
  Bell, User, Crosshair, Globe, Lock, Cpu, Database, Play, AlertOctagon,
  Smartphone, Server, ShieldCheck, ActivitySquare, Terminal, Banknote, Wallet, AlertTriangle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

export default function ControlCenter({ setCurrentView, adminLogs = [], engineStates = {} }) {
  const [activeTab, setActiveTab] = useState('overview');
  // Local state for live terminals to give the "OS" feel
  const [liveStream, setLiveStream] = useState([]);
  
  // Demo scenario state
  const [demoStatus, setDemoStatus] = useState(null);
  const [demoLogs, setDemoLogs] = useState([]);
  const [demoLoading, setDemoLoading] = useState(false);
  
  // Analytics state
  const [analyticsData, setAnalyticsData] = useState({
    premium: null,
    liquidity: null,
    claims: null,
    fraud: null,
    triggers: null,
    health: null,
    riskPools: null,
    network: null,
    ledger: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      const types = ['INFO', 'WARN', 'SYS', 'ML_OP'];
      const messages = [
        'Kafka partition offset committed.',
        '[Aggregator] Rider speed drop detected at Geohash "te7u".',
        'Transformer BSSID mismatch found. Tagging device.',
        'Play Integrity check passed for 4092 clients.',
        'XGBoost inference completed in 12ms.',
        'DistilBERT NLP parsed Local News -> No strike detected.',
      ];
      const type = types[Math.floor(Math.random() * types.length)];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      const time = new Date().toISOString().split('T')[1].slice(0, 11);
      
      setLiveStream(prev => [{ id: count, log: `[${time}] [${type}] ${msg}` }, ...prev.slice(0, 19)]);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Fetch admin analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        console.log('🔄 Fetching analytics data from backend...');
        const [premiumRes, liquidityRes, claimsRes, fraudRes, triggersRes, healthRes, poolsRes, networkRes, ledgerRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/premium-analytics`),
          axios.get(`${API_BASE_URL}/admin/liquidity`),
          axios.get(`${API_BASE_URL}/admin/claims-analytics`),
          axios.get(`${API_BASE_URL}/admin/fraud-intelligence`),
          axios.get(`${API_BASE_URL}/admin/trigger-engine`),
          axios.get(`${API_BASE_URL}/admin/system-health`),
          axios.get(`${API_BASE_URL}/admin/risk-pools`),
          axios.get(`${API_BASE_URL}/admin/network-analysis`),
          axios.get(`${API_BASE_URL}/admin/ledger`)
        ]);
        
        const newData = {
          premium: premiumRes.data,
          liquidity: liquidityRes.data,
          claims: claimsRes.data,
          fraud: fraudRes.data,
          triggers: triggersRes.data,
          health: healthRes.data,
          riskPools: poolsRes.data,
          network: networkRes.data,
          ledger: ledgerRes.data
        };
        
        console.log('✅ Data loaded:', newData);
        setAnalyticsData(newData);
      } catch (error) {
        console.error('❌ Analytics fetch error:', error.message);
        alert(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
    // Refresh every 10 seconds
    const interval = setInterval(fetchAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  // Demo scenario management functions
  const activateDemoScenario = async (scenarioName) => {
    try {
      setDemoLoading(true);
      const timestamp = new Date().toLocaleTimeString();
      
      const response = await axios.post(`${API_BASE_URL}/demo/activate-scenario`, {
        scenario: scenarioName
      });
      
      setDemoStatus(response.data);
      setDemoLogs(prev => [{
        id: Date.now(),
        time: timestamp,
        message: `✅ Scenario activated: ${scenarioName.toUpperCase()}`,
        type: 'success'
      }, ...prev.slice(0, 19)]);
      
      // Trigger a refresh of analytics
      setTimeout(() => {
        setAnalyticsData(prev => ({ ...prev }));
      }, 1500);
      
    } catch (error) {
      setDemoLogs(prev => [{
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        message: `❌ Failed: ${error.message}`,
        type: 'error'
      }, ...prev.slice(0, 19)]);
    } finally {
      setDemoLoading(false);
    }
  };

  const deactivateDemoScenario = async () => {
    try {
      setDemoLoading(true);
      const timestamp = new Date().toLocaleTimeString();
      
      const response = await axios.post(`${API_BASE_URL}/demo/deactivate`);
      
      setDemoStatus(response.data);
      setDemoLogs(prev => [{
        id: Date.now(),
        time: timestamp,
        message: '✅ Demo mode deactivated. System reset to normal.',
        type: 'success'
      }, ...prev.slice(0, 19)]);
      
    } catch (error) {
      setDemoLogs(prev => [{
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        message: `❌ Failed: ${error.message}`,
        type: 'error'
      }, ...prev.slice(0, 19)]);
    } finally {
      setDemoLoading(false);
    }
  };

  const checkDemoStatus = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/demo/status`);
      setDemoStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch demo status:', error);
    }
  };

  const navItems = [
    { id: 'overview', label: '1. Overview', icon: <Activity size={18} /> },
    { id: 'risk', label: '2. Risk Intelligence', icon: <Map size={18} /> },
    { id: 'claims', label: '3. Claims & Payouts', icon: <FileSearch size={18} /> },
    { id: 'fraud', label: '4. Fraud Intelligence', icon: <ShieldAlert size={18} /> },
    { id: 'premium', label: '5. Premium & Actuarial', icon: <Landmark size={18} /> },
    { id: 'behavior', label: '6. User Behavior', icon: <Users size={18} /> },
    { id: 'trigger', label: '7. Trigger Engine', icon: <Zap size={18} /> },
    { id: 'models', label: '8. AI Model Monitoring', icon: <BrainCircuit size={18} /> },
    { id: 'health', label: '9. System Health', icon: <Settings size={18} /> },
    { id: 'finance', label: '10. Financial Control', icon: <TrendingDown size={18} /> },
    { id: 'security', label: '11. Security & Device', icon: <Lock size={18} /> },
    { id: 'events', label: '12. Event Stream', icon: <Database size={18} /> },
    { id: 'decision', label: '13. Decision Engine', icon: <Cpu size={18} /> },
    { id: 'demo', label: '14. Demo Scenarios', icon: <Play size={18} style={{ color: 'var(--accent-orange)' }} /> },
  ];

  const KPICard = ({ title, value, sub, icon, isAlert }) => (
    <div className="card glass-panel" style={{ borderLeft: `4px solid ${isAlert ? 'var(--accent-red)' : 'var(--primary)'}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{title}</div>
        <div style={{ color: isAlert ? 'var(--accent-red)' : 'var(--primary)', opacity: 0.8 }}>{icon}</div>
      </div>
      <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>{value}</div>
      {sub && <div style={{ fontSize: '0.85rem', color: isAlert ? 'var(--accent-red)' : 'var(--text-muted)', fontWeight: 500 }}>{sub}</div>}
    </div>
  );

  const SectionHeader = ({ title, desc }) => (
    <div style={{ marginBottom: '32px' }}>
      <h1 className="text-gradient" style={{ fontSize: '2.4rem', fontWeight: 700, margin: '0 0 8px 0' }}>{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', margin: 0 }}>{desc}</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--app-bg)' }}>
      
      {/* 1. GLOBAL HEADER */}
      <header style={{ 
        background: 'var(--header-bg)', color: 'white', 
        padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={28} color="var(--accent-yellow)" />
            <div>
              <div style={{ fontSize: '0.75rem', opacity: 0.9, letterSpacing: '1px' }}>GUIDEWIRE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1 }}>DEV <span style={{ color: 'var(--accent-yellow)' }}>Trails</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', padding: '6px 16px', width: '300px' }}>
            <Search size={16} color="rgba(255,255,255,0.7)" style={{ marginRight: '8px' }}/>
            <input type="text" placeholder="Search User / Claim / Device ID..." style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '6px 12px', borderRadius: '20px', color: 'white', fontSize: '0.8rem', fontWeight: 600 }}>
             <div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }}></div>
             SYSTEM ONLINE (15ms lag)
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', opacity: 0.9 }}>
             <Globe size={16} /> Region: <b>All Clusters</b>
          </div>
          <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', position: 'relative' }}>
            <Bell size={14} /> Alerts
            <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--accent-red)', width: 8, height: 8, borderRadius: '50%' }}></div>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setCurrentView('login')}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>System Admin</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Log out</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <User size={18} />
            </div>
          </div>
        </div>
      </header>

      <div className="app-wrapper" style={{ flex: 1, minHeight: 0 }}>
        {/* 2. MAIN NAVIGATION */}
        <aside className="sidebar" style={{ width: '280px', overflowY: 'auto', background: 'white' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '32px' }}>Admin Console</div>
          
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`btn ${activeTab === item.id ? '' : 'btn-outline'}`}
                style={{
                  justifyContent: 'flex-start', border: activeTab === item.id ? 'none' : '1px solid transparent',
                  background: activeTab === item.id ? 'rgba(0,115,152,0.1)' : 'transparent',
                  color: activeTab === item.id ? 'var(--primary)' : 'var(--text-main)',
                  width: '100%'
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Dynamic Main Content */}
        <main className="main-content" style={{ position: 'relative', padding: loading ? '32px' : '0' }}>
          
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '24px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>Loading Dashboard...</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.3s' }}></div>
                <div style={{ width: '12px', height: '12px', background: 'var(--primary)', borderRadius: '50%', animation: 'pulse 1.5s infinite 0.6s' }}></div>
              </div>
            </div>
          )}
          
          {!loading && (
            <>
            {activeTab === 'overview' && (
              <div className="animate-slide-up">
              <SectionHeader title="Control Room" desc="Live system vitals and global active map telemetry." />
              
              <div className="grid-3" style={{ marginBottom: '32px' }}>
                <KPICard title="Active Riders" value={analyticsData.ledger?.workers?.length ?? 0} sub="Registered Workers" icon={<Crosshair size={28}/>} />
                <KPICard title="Loss Ratio" value={`${(analyticsData.premium?.loss_ratio_percentage ?? 0).toFixed(1)}%`} sub={(analyticsData.premium?.loss_ratio_percentage ?? 0) > 85 ? "⚠️ Alert" : "Healthy"} icon={<Map size={28}/>} isAlert={(analyticsData.premium?.loss_ratio_percentage ?? 0) > 85} />
                <KPICard title="Claims (Live)" value={analyticsData.claims?.total_claims ?? 0} sub="Open claims" icon={<Activity size={28}/>} />
                <KPICard title="Total Premiums" value={`₹${((analyticsData.premium?.total_premiums_collected ?? 0) / 100000).toFixed(1)}L`} sub="Collected" icon={<Landmark size={28}/>} />
                <KPICard title="Fraud Blocked" value={`${(((analyticsData.fraud?.alerts_triggered?.length ?? 0) / Math.max(1, analyticsData.claims?.total_claims ?? 1)) * 100).toFixed(1)}%`} sub="Detection Rate" icon={<ShieldAlert size={28}/>}/>
                <KPICard title="Avg Response" value={`${analyticsData.claims?.average_processing_time_seconds ?? 0}s`} sub="Claim Processing" icon={<Zap size={28}/>} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div className="card glass-panel" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
                   <h3 style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}><Globe color="var(--primary)"/> Live Rider Map (CORE)</h3>
                   <div style={{ flex: 1, borderRadius: '12px', background: 'linear-gradient(45deg, #f1f5f9 25%, #e2e8f0 25%, #e2e8f0 50%, #f1f5f9 50%, #f1f5f9 75%, #e2e8f0 75%, #e2e8f0 100%)', backgroundSize: '40px 40px', position: 'relative', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
                      <div style={{ position: 'absolute', top: '20%', left: '30%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)' }}></div>
                      <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, transparent 70%)' }}></div>
                      <div className="card" style={{ position: 'absolute', top: 16, right: 16, padding: '12px', background: 'rgba(255,255,255,0.9)' }}>
                        <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><span style={{ width: 10, height: 10, background: 'var(--accent-red)', borderRadius: '50%' }}></span> Red Zones (Risk)</div>
                        <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0', fontWeight: 600 }}><span style={{ width: 10, height: 10, background: 'var(--accent-green)', borderRadius: '50%' }}></span> Safe Zones (Bonus)</div>
                        <div style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><span style={{ width: 10, height: 10, background: 'var(--primary)', borderRadius: '50%' }}></span> Active Riders</div>
                      </div>
                   </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   <div className="card glass-panel" style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Terminal size={18}/> Real-time Event Stream</h3>
                      <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px', background: '#1e293b', color: '#38bdf8', padding: '16px', borderRadius: '12px', border: '1px solid var(--card-border)', height: '200px', overflowY: 'hidden' }}>
                         {liveStream.slice(0,6).map(l => <div key={l.id}>{l.log}</div>)}
                      </div>
                   </div>
                   <div className="card glass-panel" style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: '16px' }}>Claims vs Time</h3>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '100px', borderBottom: '1px solid var(--card-border)' }}>
                        {[10,20,15,40,90,100,60,30,20].map((h, i) => (
                          <div key={i} style={{ flex: 1, background: h > 80 ? 'var(--accent-red)' : 'var(--primary)', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }}></div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'risk' && (
            <div className="animate-slide-up">
              <SectionHeader title="Risk Intelligence" desc="Geohash mapping, physical environment anomalies, and smart routing." />
              
              <div className="grid-4" style={{ marginBottom: '32px' }}>
                <KPICard title="Total Workers" value={(() => Object.values(analyticsData.riskPools?.cities ?? {}).reduce((s, c) => s + (c.total_workers ?? 0), 0))() } sub="Across all pools" icon={<BarChart2 size={24}/>}/>
                <KPICard title="Active Policies" value={(() => Object.values(analyticsData.riskPools?.cities ?? {}).reduce((s, c) => s + (c.active_policies ?? 0), 0))() } sub="Live coverage zones" icon={<AlertOctagon size={24}/>}/>
                <KPICard title="Total Coverage" value={`₹${((() => Object.values(analyticsData.riskPools?.cities ?? {}).reduce((s, c) => s + (c.total_coverage ?? 0), 0))() / 1000).toFixed(0)}K`} sub="Pool maxima" icon={<CloudRainWind size={24}/>}/>
                <KPICard title="Total Claims" value={(() => Object.values(analyticsData.riskPools?.cities ?? {}).reduce((s, c) => s + (c.claims_count ?? 0), 0))() } sub="Triggered events" isAlert={(() => Object.values(analyticsData.riskPools?.cities ?? {}).reduce((s, c) => s + (c.claims_count ?? 0), 0))() > 5 } icon={<Siren size={24}/>}/>
              </div>

              <div className="grid-2" style={{ marginBottom: '24px' }}>
                <div className="card glass-panel">
                  <h3 style={{ marginBottom: '16px', color: 'var(--primary)' }}>Isolation Forest Anomalies</h3>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Unsupervised ML bounds evaluating geospatial blockages.</div>
                  <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', borderLeft: '4px solid var(--accent-red)', borderRadius: '0 8px 8px 0', marginBottom: '12px' }}>
                    <div style={{ color: 'var(--accent-red)', fontWeight: 600, fontSize: '1rem' }}>Cluster Anomaly: Null Speed in Highway Zone</div>
                    <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', marginTop: '4px' }}>System isolated sudden 0 km/h clusters. Probability: 94% undocumented roadblock.</div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(245, 158, 11, 0.05)', borderLeft: '4px solid var(--accent-orange)', borderRadius: '0 8px 8px 0' }}>
                    <div style={{ color: 'var(--accent-orange)', fontWeight: 600, fontSize: '1rem' }}>Volume Spikes in East Industrial</div>
                    <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', marginTop: '4px' }}>API request volume up 400% in 10 minutes. Tracing context.</div>
                  </div>
                </div>
                
                <div className="card glass-panel" style={{ border: '1px solid var(--accent-green)', background: 'linear-gradient(145deg, #ffffff, rgba(16,185,129,0.05))' }}>
                  <h3 style={{ color: 'var(--accent-green)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={20}/> Safe Zone Suggestions</h3>
                  <div style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700, marginBottom: '8px' }}>Dynamic Rider Redirection Protocol</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>"Move here → earn more". Rerouting riders to adjacent safe zones is executing automatically.</p>
                  
                  <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Expected Income Boost</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-green)' }}>+₹450 / shift</div>
                     </div>
                     <button className="btn btn-success" style={{ fontSize: '0.9rem' }}>Force Broadcast Push</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'claims' && analyticsData.claims && (
            <div className="animate-slide-up">
              <SectionHeader title="Claims & Payout System" desc="Real-time execution of zero-touch smart contracts with instant UPI settlements." />
              
              <div className="grid-4" style={{ marginBottom: '32px' }}>
                <KPICard title="Approved" value={analyticsData.claims?.claims_by_status?.approved ?? 0} sub="Fully Automated" icon={<CheckCircle size={28}/>}/>
                <KPICard title="Rejected" value={analyticsData.claims?.claims_by_status?.rejected ?? 0} sub="Fraud or Outside Rules" isAlert={true} icon={<ShieldAlert size={28}/>}/>
                <KPICard title="Avg Payout" value={`₹${(analyticsData.claims?.average_claim_amount ?? 0).toFixed(0)}`} sub="Per claim" icon={<Banknote size={28}/>}/>
                <KPICard title="Total Amount" value={`₹${((analyticsData.claims?.total_approved_payout ?? 0) / 100000).toFixed(1)}L`} sub="Lifetime payouts" icon={<TrendingDown size={28}/>}/>
              </div>

              <div className="card glass-panel" style={{ borderTop: '4px solid var(--accent-green)', marginBottom: '32px' }}>
                <h3 style={{ marginBottom: '24px', fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><ActivitySquare/> Double-Lock Validation Pipeline</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid var(--accent-green)', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--accent-green)' }}>Lock 1: Objective Disruption</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>{analyticsData.claims?.double_lock_validation?.lock1_weather ?? 'Weather condition met'}</div>
                  </div>
                  <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.05)', borderLeft: '4px solid var(--accent-green)', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--accent-green)' }}>Lock 2: Proof of Impairment</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>{analyticsData.claims?.double_lock_validation?.lock2_operational_impairment ?? 'Income loss verified'}</div>
                  </div>
                </div>
              </div>

              <div className="grid-2">
                <div className="card glass-panel">
                  <h3 style={{ marginBottom: '16px' }}>Claims by Status</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Approved (Auto)</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-green)' }}>{analyticsData.claims?.claims_by_status?.approved ?? 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Pending Review</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-orange)' }}>{analyticsData.claims?.claims_by_status?.pending ?? 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Rejected (Fraud/Rules)</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-red)' }}>{analyticsData.claims?.claims_by_status?.rejected ?? 0}</span>
                    </div>
                  </div>
                  <button className="btn btn-primary" style={{ width: '100%', marginTop: '16px' }}>Refresh Claims</button>
                </div>
                
                <div className="card glass-panel">
                  <h3 style={{ marginBottom: '16px' }}>Processing SLA</h3>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', textAlign: 'center' }}>
                    {analyticsData.claims?.average_processing_time_seconds ?? 0}s
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>Average time from trigger to UPI payout</div>
                  <div style={{ marginTop: '16px', padding: '12px', background: 'var(--app-bg)', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Target: &lt; 90 seconds ✅
                  </div>
                  <button className="btn btn-outline" style={{ width: '100%', marginTop: '16px' }}>View Processing Log</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fraud' && (
            <div className="animate-slide-up">
              <SectionHeader title="Fraud Intelligence" desc="Zero-Trust Multi-Modal Sensor Analysis & Temporal Pattern Detection" />
              
              <div className="grid-3" style={{ marginBottom: '32px' }}>
                <KPICard title="Blocked Claims" value="14.2%" sub="Total attempts neutralized" isAlert={true} icon={<ShieldAlert size={28}/>}/>
                <KPICard title="Fraud Score Avg" value="0.12" sub="Below global baseline threshold" icon={<Activity size={28}/>}/>
                <KPICard title="Suspicious Devices" value="482" sub="Honeypot tagged & blacklisted" icon={<Lock size={28}/>}/>
              </div>

              <div className="grid-2" style={{ marginBottom: '24px' }}>
                <div className="card glass-panel" style={{ borderTop: '4px solid var(--primary)' }}>
                  <h3 style={{ marginBottom: '20px' }}>🧠 CNN (Physics Engine)</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Evaluating spatial trajectory graphs for impossible physical movements.</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>GPS Trajectory Graphing</span> <span className="badge badge-orange">Active Scan</span>
                    </li>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>Teleportation Detection</span> <span className="badge badge-red">14 Flagged</span>
                    </li>
                    <li style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>Accelerometer Anomalies</span> <span className="badge badge-green">Nominal</span>
                    </li>
                  </ul>
                </div>
                
                <div className="card glass-panel" style={{ borderTop: '4px solid #8b5cf6' }}>
                  <h3 style={{ marginBottom: '20px', color: '#8b5cf6' }}>🧠 Transformer (Network Engine)</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>Cross-referencing temporal sequence data for collusion networks.</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>BSSID Wi-Fi Clustering</span> <span className="badge badge-green">Clear</span>
                    </li>
                    <li style={{ padding: '12px 0', borderBottom: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>Fraud Ring Synergy</span> <span className="badge badge-red">8 Sybils Detected</span>
                    </li>
                    <li style={{ padding: '12px 0', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 500 }}>Device Overlap Matrices</span> <span className="badge badge-orange">High Tension</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="card" style={{ background: 'linear-gradient(90deg, #f8fafc, #f1f5f9)', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                 <div>
                   <h3 style={{ color: 'var(--text-main)', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}><Play size={20} fill="var(--primary)" color="var(--primary)"/> Fraud Replay Simulation UI</h3>
                   <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.95rem' }}>Full context step-by-step 3D playback of flagged claims for manual review SIU teams.</p>
                 </div>
                 <button className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '1rem' }}>Launch Replay Viewer</button>
              </div>
            </div>
          )}

          {activeTab === 'premium' && analyticsData.premium && (
            <div className="animate-slide-up">
              <SectionHeader title="Premium & Actuarial Engine" desc="Dynamic LSTM models with loss ratio monitoring and fail-safe protocols." />
              
              <div className="grid-3" style={{ marginBottom: '32px' }}>
                <KPICard title="Weekly Premium Avg" value={`₹${analyticsData.premium?.average_premium ?? 0}`} sub="Distributed dynamically" icon={<Landmark size={28}/>}/>
                <KPICard title="Total Premiums" value={`₹${((analyticsData.premium?.total_premiums_collected ?? 0) / 100000).toFixed(1)}L`} sub="Lifetime Collected" icon={<Banknote size={28}/>}/>
                <KPICard title="Loss Ratio" value={`${(analyticsData.premium?.loss_ratio_percentage ?? 0).toFixed(1)}%`} sub={(analyticsData.premium?.loss_ratio_percentage ?? 0) > 85 ? "⚠️ CIRCUIT BREAKER ACTIVE" : "Healthy"} isAlert={(analyticsData.premium?.loss_ratio_percentage ?? 0) > 85} icon={<TrendingDown size={28}/>}/>
              </div>
              
              <div className="grid-2">
                <div className="card glass-panel" style={{ background: analyticsData.premium?.circuit_breaker_triggered ? 'rgba(239, 68, 68, 0.05)' : '#f8fafc' }}>
                   <h3 style={{ marginBottom: '16px', color: analyticsData.premium?.circuit_breaker_triggered ? 'var(--accent-red)' : 'var(--primary)' }}>
                     {analyticsData.premium?.circuit_breaker_triggered ? '🔴 Circuit Breaker Triggered' : '🟢 Pricing Formula Engine'}
                   </h3>
                   {analyticsData.premium?.circuit_breaker_triggered && (
                     <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--accent-red)', borderRadius: '8px', marginBottom: '16px' }}>
                       <div style={{ color: 'var(--accent-red)', fontWeight: 600, fontSize: '1rem' }}>Fail-Safe Activated: Loss Ratio > 85%</div>
                       <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginTop: '8px' }}>New enrollments halted to preserve liquidity pool</div>
                     </div>
                   )}
                   <div style={{ color: 'var(--primary)', fontFamily: 'monospace', fontSize: '0.95rem', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--card-border)', textAlign: 'center', fontWeight: 600, marginBottom: '16px', lineHeight: '1.8' }}>
                     P<sub>w</sub> = max([E(L) × (1+λ)] + γ - R_score×β - W_credit, P_floor)
                   </div>
                   <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                     <strong>E(L):</strong> Expected Loss (from forecasts)<br/>
                     <strong>λ:</strong> Systemic Risk Margin (0.08 current)<br/>
                     <strong>γ:</strong> Base OpEx Processing Fee (₹3)<br/>
                     <strong>β:</strong> R_score Behavioral Discount (0.3-0.65)<br/>
                     <strong>W:</strong> Resilience Wallet Credit
                   </div>
                   <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>View Pricing Details</button>
                </div>
                
                <div className="card glass-panel">
                  <h3 style={{ marginBottom: '16px', color: 'var(--accent-green)' }}>Stress Test Results</h3>
                  <div style={{ padding: '16px', background: 'white', borderRadius: '12px', border: '1px solid var(--card-border)', marginBottom: '16px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>Scenario: 14-Day Continuous Monsoon</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Delhi + Mumbai simultaneous rainfall > 50mm/hr</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                      <span>Pool Survival Forecast:</span>
                      <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '1.1rem' }}>✅ PASS</span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Projected claims: {analyticsData.premium?.stress_test_14day_monsoon?.projected_claims ?? 0}<br/>
                    Projected payouts: ₹{((analyticsData.premium?.stress_test_14day_monsoon?.projected_payouts ?? 0) / 100000).toFixed(1)}L<br/>
                    Reserve capacity: Sufficient
                  </div>
                  <button className="btn btn-outline" style={{ width: '100%', marginTop: '12px' }}>Run New Scenario</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="animate-slide-up">
              <SectionHeader title="User Behavior & Gamification" desc="Evaluating human action, compliance, and platform loyalty drivers." />
              
              <div className="grid-3" style={{ marginBottom: '32px' }}>
                <KPICard title="Active Workers" value={analyticsData.ledger?.workers?.length ?? 0} sub="Registered users" icon={<Users size={28}/>}/>
                <KPICard title="Avg Resilience Score" value={((() => {
                  const workers = analyticsData.ledger?.workers ?? [];
                  const total = workers.reduce((s, w) => s + (w.r_score ?? 0), 0);
                  return (total / Math.max(1, workers.length)).toFixed(1);
                })())} sub="High Trust metric" icon={<Activity size={28}/>}/>
                <KPICard title="Min Membership Days" value="7" sub="Activity warranty" icon={<CheckCircle size={28}/>}/>
              </div>
              
              <div className="card glass-panel" style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '24px' }}>Fintech Engagement Features</h3>
                <div className="grid-3">
                  <div style={{ background: 'var(--app-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                    <div className="badge badge-green" style={{ marginBottom: '12px' }}>Active Streak</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>8 Weeks</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Average rider claim-free streak</div>
                  </div>
                  <div style={{ background: 'var(--app-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                    <div className="badge badge-blue" style={{ marginBottom: '12px' }}>Usage Rate</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>42%</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Utilizing free coverage tier usage limits</div>
                  </div>
                  <div style={{ background: 'var(--app-bg)', padding: '24px', borderRadius: '16px', border: '1px solid var(--card-border)', textAlign: 'center' }}>
                    <div className="badge badge-orange" style={{ marginBottom: '12px' }}>Gamification</div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>1.2M</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Resilience Wallet points credited</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trigger' && (
            <div className="animate-slide-up">
              <SectionHeader title="Parametric Trigger Engine" desc="Multi-lock validation system mapping input truth to automated action." />
              <div className="grid-2" style={{ marginBottom: '32px' }}>
                <div className="card glass-panel" style={{ borderTop: '4px solid var(--primary)', background: 'linear-gradient(180deg, white, var(--app-bg))' }}>
                  <h3 style={{ color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={20} color="var(--primary)"/> Lock 1 (Disruption Physicals)</h3>
                  <ul style={{ color: 'var(--text-muted)', lineHeight: '2.5', listStylePosition: 'outside', paddingLeft: '16px' }}>
                    <li><strong>Weather & Sensors:</strong> Rain / Heat / AQI real-time thresholds via IMD APIs</li>
                    <li><strong>NLP Engine:</strong> DistilBERT parsing live Twitter / Civic Strike inputs</li>
                    <li><strong>Geofencing bounds:</strong> Active Red Polygon bounding verification</li>
                  </ul>
                </div>
                <div className="card glass-panel" style={{ borderTop: '4px solid #8b5cf6', background: 'linear-gradient(180deg, white, var(--app-bg))' }}>
                  <h3 style={{ color: 'var(--text-main)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Lock size={20} color="#8b5cf6"/> Lock 2 (Income Telemetry)</h3>
                  <ul style={{ color: 'var(--text-muted)', lineHeight: '2.5', listStylePosition: 'outside', paddingLeft: '16px' }}>
                    <li><strong>DBSCAN Density:</strong> Velocity clustering maps mapping true grid lockups</li>
                    <li><strong>Platform Link:</strong> Direct API verifying massive order drop percentages</li>
                    <li><strong>Rider State:</strong> Proof-of-Work active status validated locally</li>
                  </ul>
                </div>
              </div>
              
              <div className="card glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '32px', fontSize: '1.4rem' }}>Automated Trigger Pipeline Funnel</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <div className="badge badge-blue" style={{ fontSize: '1rem', padding: '16px 24px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)' }}>Environmental Event Output</div>
                  <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 800 }}>&rarr;</span>
                  <div className="badge badge-orange" style={{ fontSize: '1rem', padding: '16px 24px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.2)' }}>Valid Trigger (Lock 1)</div>
                  <span style={{ fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 800 }}>&rarr;</span>
                  <div className="badge badge-green" style={{ fontSize: '1rem', padding: '16px 24px', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>Loss Verified (Lock 2)</div>
                  <span style={{ fontSize: '1.5rem', color: 'var(--primary)', fontWeight: 800 }}>&rarr;</span>
                  <div className="badge badge-blue" style={{ fontSize: '1.2rem', padding: '16px 32px', background: 'var(--primary)', color: 'white', boxShadow: '0 4px 16px var(--glow-primary)' }}>Claim Constructed</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'models' && (
            <div className="animate-slide-up">
              <SectionHeader title="AI Model Monitoring" desc="Health & accuracy status for predictive algorithms deployed globally." />
              
              <div className="grid-3" style={{ marginBottom: '32px' }}>
                <div className="card glass-panel" style={{ textAlign: 'center', borderBottom: '4px solid var(--accent-green)' }}>
                  <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-main)' }}>98%</div>
                  <h3 style={{ margin: '8px 0', color: 'var(--accent-green)' }}>Baseline Accuracy</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Over last 10,000 processed events</div>
                </div>
                <div className="card glass-panel" style={{ textAlign: 'center', borderBottom: '4px solid var(--primary)' }}>
                  <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-main)' }}><TrendingDown size={48} color="var(--primary)" style={{display:'inline', marginBottom: '-4px'}}/></div>
                  <h3 style={{ margin: '8px 0', color: 'var(--primary)' }}>Drift Detection</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No distribution skew observed</div>
                </div>
                <div className="card glass-panel" style={{ textAlign: 'center', borderBottom: '4px solid var(--accent-orange)' }}>
                  <div style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--text-main)' }}>{`<1%`}</div>
                  <h3 style={{ margin: '8px 0', color: 'var(--accent-orange)' }}>Prediction Error Rate</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mean Absolute Error normalized</div>
                </div>
              </div>

              <div className="card glass-panel">
                 <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                   <thead>
                     <tr style={{ background: 'var(--app-bg)', borderBottom: '1px solid var(--card-border)' }}>
                       <th style={{ padding: '16px' }}>Neural Network Architecture</th>
                       <th style={{ padding: '16px' }}>Purpose Function</th>
                       <th style={{ padding: '16px' }}>Retraining Log</th>
                       <th style={{ padding: '16px' }}>Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                       <td style={{ padding: '16px', fontWeight: 600 }}>XGBoost Ensemble</td>
                       <td style={{ padding: '16px' }}>Risk Mapping / Disruptions</td>
                       <td style={{ padding: '16px' }}>2 hrs ago (Auto CI/CD)</td>
                       <td style={{ padding: '16px' }}><span className="badge badge-green">Running</span></td>
                     </tr>
                     <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                       <td style={{ padding: '16px', fontWeight: 600 }}>LSTM Temporal Model</td>
                       <td style={{ padding: '16px' }}>Premium Pricing Forecasting</td>
                       <td style={{ padding: '16px' }}>12 hrs ago</td>
                       <td style={{ padding: '16px' }}><span className="badge badge-green">Running</span></td>
                     </tr>
                     <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                       <td style={{ padding: '16px', fontWeight: 600 }}>Spatial CNN</td>
                       <td style={{ padding: '16px' }}>Fraud (GPS Vectors)</td>
                       <td style={{ padding: '16px' }}>30 mins ago</td>
                       <td style={{ padding: '16px' }}><span className="badge badge-green">Running</span></td>
                     </tr>
                     <tr>
                       <td style={{ padding: '16px', fontWeight: 600 }}>DistilBERT NLP</td>
                       <td style={{ padding: '16px' }}>Event Scraper & Intent checks</td>
                       <td style={{ padding: '16px' }}>5 mins ago</td>
                       <td style={{ padding: '16px' }}><span className="badge badge-blue">Optimizing</span></td>
                     </tr>
                   </tbody>
                 </table>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="animate-slide-up">
              <SectionHeader title="System Health & DevOps Operations" desc="Real-time Kubernetes scaling and latency monitoring interface." />
              
              <div className="grid-4" style={{ marginBottom: '32px' }}>
                <KPICard title="API Uptime" value={`${analyticsData.health?.api_uptime_percentage ?? 0}%`} sub="System availability" icon={<Database size={28}/>}/>
                <KPICard title="P99 Latency" value={`${analyticsData.health?.p99_decision_latency_ms ?? 0}ms`} sub="Decision time" icon={<Activity size={28}/>}/>
                <KPICard title="DB Status" value={analyticsData.health?.database_connections ?? "—"} sub="Connection pool" icon={<Globe size={28}/>}/>
                <KPICard title="Kafka Lag" value={analyticsData.health?.kafka_lag ?? "—"} sub="Event stream" icon={<Server size={28}/>}/>
              </div>

              <div className="card glass-panel" style={{ background: '#1e293b', color: 'white', border: '1px solid #334155' }}>
                 <h3 style={{ marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}><Terminal size={20}/> Production Stack Metric Logs</h3>
                 <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#38bdf8', padding: '16px', background: '#0f172a', borderRadius: '8px' }}>
                    <div>[SYS] Checking container orchestration load across 3 clusters... OK</div>
                    <div>[SYS] Database IOPS operating at 40% capacity limit.</div>
                    <div>[WARN] Minor spike in node CPU temperatures resolving automatically via scaler.</div>
                    <div style={{ color: '#34d399' }}>[HEALTH] Pipeline processing 14.2M events daily. 0 Dataloss verified.</div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'finance' && analyticsData.liquidity && (
            <div className="animate-slide-up">
              <SectionHeader title="Financial Control Panel" desc="Liquidity pool dashboard with loss ratio monitoring and fail-safe triggers." />
              <div className="grid-3" style={{ marginBottom: '24px' }}>
                 <KPICard title="Premium Collected" value={`₹${((analyticsData.liquidity?.total_premium_collected ?? 0) / 100000).toFixed(1)}L`} sub="Total collected" icon={<Landmark size={28}/>}/>
                 <KPICard title="Payouts Distributed" value={`₹${((analyticsData.liquidity?.total_payout_distributed ?? 0) / 100000).toFixed(1)}L`} sub="Claims approved & paid" icon={<Banknote size={28}/>}/>
                 <KPICard title="Current Liquidity" value={`₹${((analyticsData.liquidity?.current_liquidity ?? 0) / 100000).toFixed(1)}L`} sub="Net available buffer" icon={<Wallet size={28}/>} isAlert={analyticsData.liquidity?.fail_safe_activated}/>
              </div>
              
              <div className="card glass-panel" style={{ padding: '40px', textAlign: 'center', background: analyticsData.liquidity?.fail_safe_activated ? 'rgba(239, 68, 68, 0.05)' : 'linear-gradient(145deg, white, var(--app-bg))' }}>
                 <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: analyticsData.liquidity?.fail_safe_activated ? 'var(--accent-red)' : 'var(--text-main)' }}>
                   {analyticsData.liquidity?.fail_safe_activated ? '🔴 Circuit Breaker: ENROLLMENT HALTED' : '🟢 Risk Pool Liquidity Health'}
                 </h2>
                 <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 16px auto' }}>
                    Loss Ratio: <strong style={{ color: (analyticsData.liquidity?.loss_ratio ?? 0) > 85 ? 'var(--accent-red)' : 'var(--accent-green)', fontSize: '1.3rem' }}>{(analyticsData.liquidity?.loss_ratio ?? 0).toFixed(1)}%</strong> 
                    {(analyticsData.liquidity?.loss_ratio ?? 0) > 85 ? ' - Threshold exceeded. New enrollments blocked.' : ' - Healthy. Accepting new enrollments.'}
                 </p>
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                   <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Minimum Threshold</div>
                     <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>₹{((analyticsData.liquidity?.minimum_liquidity_threshold ?? 0) / 100000).toFixed(1)}L</div>
                   </div>
                   <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Liquidity Runway</div>
                     <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{(analyticsData.liquidity?.liquidity_runway_days ?? 0).toFixed(0)} days</div>
                   </div>
                   <div style={{ background: 'white', padding: '16px', borderRadius: '12px' }}>
                     <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Avg Premium</div>
                     <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>₹{(analyticsData.liquidity?.average_premium ?? 0).toFixed(0)}</div>
                   </div>
                 </div>
                 <div style={{ display: 'flex', gap: '12px' }}>
                   <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem', flex: 1 }}>Export Financial Report</button>
                   <button className="btn btn-outline" style={{ padding: '16px 32px', fontSize: '1.1rem', flex: 1 }}>Capital Injection</button>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="animate-slide-up">
              <SectionHeader title="Security & Device Trust Edge" desc="Aggressive hardware fingerprinting mitigating botnets or emulator access." />
              
              <div className="grid-3" style={{ marginBottom: '32px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', textAlign: 'center' }}>
                  <ShieldCheck size={48} color="var(--accent-green)" style={{ margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.4rem' }}>Play Integrity API</h3>
                  <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>98.4% Devices Secured & Verified</div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', textAlign: 'center' }}>
                  <Smartphone size={48} color="var(--accent-red)" style={{ margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.4rem' }}>Rooted Devices Blocked</h3>
                  <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>14 Active Sessions Terminated</div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', textAlign: 'center' }}>
                  <Lock size={48} color="var(--primary)" style={{ margin: '0 auto 16px auto' }} />
                  <h3 style={{ fontSize: '1.4rem' }}>Sybil Clusters</h3>
                  <div style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Tracking deep fingerprint variables</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="animate-slide-up">
              <SectionHeader title="Event Stream Monitor" desc="Microservice deep visibility. Debug Kafka logs and Dead Letter Queues (DLQ)." />
              <div className="card glass-panel" style={{ height: '60vh', background: '#020617', border: '1px solid #1e293b', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
                 <div style={{ padding: '16px', background: '#0f172a', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '0.85rem', display: 'flex', gap: '24px', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div><div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></div> Connection Live: socket.io wss://stream.aegis</div>
                   <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>DLQ Count: 0
                     <button className="btn" style={{ padding: '4px 12px', fontSize: '0.75rem', background: '#1e293b', color: '#94a3b8' }}>Clear</button>
                   </div>
                 </div>
                 <div style={{ padding: '24px', flex: 1, fontFamily: 'monospace', fontSize: '0.9rem', color: '#38bdf8', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {liveStream.map(l => <div key={l.id}>{l.log}</div>)}
                 </div>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                <button className="btn btn-primary" style={{ flex: 1 }}>Pause Stream</button>
                <button className="btn btn-outline" style={{ flex: 1 }}>Export Events</button>
                <button className="btn btn-outline" style={{ flex: 1 }}>Filter Events</button>
              </div>
            </div>
          )}

          {activeTab === 'decision' && (
            <div className="animate-slide-up">
              <SectionHeader title="Decision Orchestrator Consensus" desc="Execution brain of Aegis confirming boolean logic rules natively." />
              <div className="card glass-panel" style={{ padding: '60px 40px', background: 'linear-gradient(135deg, white, var(--app-bg))', borderTop: '4px solid var(--primary)' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                     <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Lock 1 Output (Environment)</div>
                     <CheckCircle color="var(--accent-green)" />
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                     <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Lock 2 Output (Lost Wages)</div>
                     <CheckCircle color="var(--accent-green)" />
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'white', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
                     <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>CNN/Transformer Fraud Clear</div>
                     <CheckCircle color="var(--accent-green)" />
                   </div>
                   
                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', background: 'var(--primary)', color: 'white', borderRadius: '12px', marginTop: '16px', boxShadow: '0 8px 16px var(--glow-primary)' }}>
                     <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>Consensus Met</div>
                     <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>Execute Payout</div>
                   </div>

                 </div>
              </div>
            </div>
          )}

          {activeTab === 'demo' && (
            <div className="animate-slide-up">
              <SectionHeader title="Live Demo Scenarios" desc="Inject parametric events in real-time to see all 5 engines respond instantly." />
              
              {demoStatus?.demo_mode_active && (
                <div style={{ 
                  padding: '16px', 
                  background: 'rgba(234, 179, 8, 0.1)', 
                  border: '2px solid var(--accent-orange)',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{ fontSize: '2rem' }}>🎬</div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '1.1rem' }}>DEMO MODE ACTIVE</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current: {demoStatus.active_scenario?.toUpperCase()}</div>
                  </div>
                  <button 
                    className="btn btn-danger" 
                    onClick={deactivateDemoScenario}
                    disabled={demoLoading}
                    style={{ marginLeft: 'auto' }}
                  >
                    Stop Demo & Reset
                  </button>
                </div>
              )}

              <div className="grid-2" style={{ marginBottom: '32px' }}>
                <div className="card glass-panel" style={{ padding: '32px', border: '2px solid var(--accent-orange)', position: 'relative' }}>
                  <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                    <CloudRainWind size={24} color="var(--primary)" /> Heavy Rain Scenario
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
                    Triggers rainfall ≥65mm/hr in delivery zones. Workers' orders drop to zero. Both Double-Lock conditions activate.
                  </p>
                  <div style={{ background: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <strong>Expected:</strong> All workers create claims with trigger_type="Heavy Rain"
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => activateDemoScenario('HEAVY_RAIN')}
                    disabled={demoLoading || demoStatus?.active_scenario === 'heavy_rain'}
                    style={{ width: '100%', fontSize: '1rem', fontWeight: 600 }}
                  >
                    {demoLoading ? '⏳ Activating...' : '▶️ Inject Rain Event'}
                  </button>
                </div>

                <div className="card glass-panel" style={{ padding: '32px', border: '2px solid var(--accent-orange)', position: 'relative' }}>
                  <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                    <AlertTriangle size={24} color="var(--accent-red)" /> Extreme Heat Scenario
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
                    Temperature spikes to 44°C+. Outdoor delivery becomes hazardous. Platform reduces order allocation to protect workers.
                  </p>
                  <div style={{ background: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <strong>Expected:</strong> Claims with trigger_type="Extreme Heat"
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => activateDemoScenario('EXTREME_HEAT')}
                    disabled={demoLoading || demoStatus?.active_scenario === 'extreme_heat'}
                    style={{ width: '100%', fontSize: '1rem', fontWeight: 600 }}
                  >
                    {demoLoading ? '⏳ Activating...' : '🔥 Inject Heat Event'}
                  </button>
                </div>
              </div>

              <div className="grid-2" style={{ marginBottom: '32px' }}>
                <div className="card glass-panel" style={{ padding: '32px', border: '2px solid #8b5cf6', position: 'relative' }}>
                  <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                    <AlertOctagon size={24} color="#8b5cf6" /> Critical AQI Scenario
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
                    Air pollution spikes to AQI {'>'} 300. Respiratory health hazard. Outdoor work suspended city-wide by authorities.
                  </p>
                  <div style={{ background: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <strong>Expected:</strong> Claims with trigger_type="Critical AQI"
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => activateDemoScenario('CRITICAL_AQI')}
                    disabled={demoLoading || demoStatus?.active_scenario === 'critical_aqi'}
                    style={{ width: '100%', fontSize: '1rem', fontWeight: 600 }}
                  >
                    {demoLoading ? '⏳ Activating...' : '💨 Inject AQI Event'}
                  </button>
                </div>

                <div className="card glass-panel" style={{ padding: '32px', border: '2px solid #8b5cf6', position: 'relative' }}>
                  <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                    <Siren size={24} color="#8b5cf6" /> Civic Strike Scenario
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
                    Unannounced civic strike or market closure. Workers cannot access pickup zones legally. Zero business allowed.
                  </p>
                  <div style={{ background: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <strong>Expected:</strong> Claims with trigger_type="Civic Strike"
                  </div>
                  <button 
                    className="btn btn-primary"
                    onClick={() => activateDemoScenario('CIVIC_STRIKE')}
                    disabled={demoLoading || demoStatus?.active_scenario === 'civic_strike'}
                    style={{ width: '100%', fontSize: '1rem', fontWeight: 600 }}
                  >
                    {demoLoading ? '⏳ Activating...' : '🚩 Inject Strike Event'}
                  </button>
                </div>
              </div>

              <div className="card glass-panel" style={{ padding: '32px', border: '2px solid #ef4444', marginBottom: '32px', position: 'relative' }}>
                <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)' }}>
                  <AlertOctagon size={24} color="#ef4444" /> Platform Crash Scenario
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>
                  Critical gig platform infrastructure failure (e.g., API down, order systems offline). Workers receive zero orders during outage window.
                </p>
                <div style={{ background: 'white', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <strong>Expected:</strong> Claims with trigger_type="Platform Outage" for all active workers
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={() => activateDemoScenario('PLATFORM_CRASH')}
                  disabled={demoLoading || demoStatus?.active_scenario === 'platform_crash'}
                  style={{ width: '100%', fontSize: '1rem', fontWeight: 600, background: '#ef4444' }}
                >
                  {demoLoading ? '⏳ Activating...' : '📱 Inject Platform Crash'}
                </button>
              </div>

              <div className="card glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' }}>
                <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={20} /> Demo Activity Log
                </h3>
                <div style={{ 
                  background: '#0f172a', 
                  color: '#e2e8f0', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  height: '240px',
                  overflowY: 'auto',
                  border: '1px solid #334155'
                }}>
                  {demoLogs.length === 0 ? (
                    <div style={{ color: '#64748b', textAlign: 'center', paddingTop: '80px' }}>
                      No activity yet. Select a scenario above to begin.
                    </div>
                  ) : (
                    demoLogs.map(log => (
                      <div key={log.id} style={{ 
                        color: log.type === 'error' ? '#f87171' : '#86efac',
                        marginBottom: '8px',
                        display: 'flex',
                        gap: '12px'
                      }}>
                        <span style={{ color: '#64748b', minWidth: '100px' }}>[{log.time}]</span>
                        <span>{log.message}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ marginTop: '32px', padding: '24px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <h3 style={{ marginBottom: '16px' }}>📊 What Happens When You Inject a Scenario</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <div>
                    <strong>1. Scenario Activates</strong><br/>
                    Demo mode flag set in backend
                  </div>
                  <div>
                    <strong>2. Triggers Fire</strong><br/>
                    Worker scheduler detects event (within 1 minute)
                  </div>
                  <div>
                    <strong>3. Claims Created</strong><br/>
                    Double-Lock verified, claims constructed
                  </div>
                  <div>
                    <strong>4. Payouts Process</strong><br/>
                    Check all other tabs - see real claims + payouts
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px', padding: '24px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <h3 style={{ marginBottom: '12px', color: 'var(--accent-red)' }}>🎯 Testing Checklist</h3>
                <ul style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '2', paddingLeft: '20px' }}>
                  <li>✅ Inject scenario from this tab</li>
                  <li>✅ Switch to "Claims & Payouts" tab to see triggered claims</li>
                  <li>✅ Check "Trigger Engine" tab for activation counts</li>
                  <li>✅ Review "Premium & Actuarial" for loss ratio impact</li>
                  <li>✅ Verify "Financial Control" shows updated liquidity</li>
                  <li>✅ Open browser DevTools (F12) → Network tab to see API calls</li>
                  <li>✅ Each claim appears with real payout calculated</li>
                  <li>✅ Click "Stop Demo & Reset" to return to normal</li>
                </ul>
              </div>
            </div>
          )}
            </>
          )}

        </main>
      </div>
    </div>
  );
}
