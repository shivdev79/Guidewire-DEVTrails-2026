import React, { useState, useEffect } from 'react';
import {
  Shield, Activity, Map, FileSearch, ShieldAlert,
  TrendingDown, Users, Settings, BrainCircuit,
  Zap, CloudRainWind, Siren, FileText, CheckCircle,
  BarChart2, CreditCard, Clock, Landmark, Search,
  Bell, User, Crosshair, Globe, Lock, Cpu, Database, Play, AlertOctagon,
  Smartphone, Server, ShieldCheck, ActivitySquare, Terminal, Banknote, Wallet
} from 'lucide-react';

export default function ControlCenter({ setCurrentView, adminLogs = [], engineStates = {} }) {
  const [activeTab, setActiveTab] = useState('overview');
  // Local state for live terminals to give the "OS" feel
  const [liveStream, setLiveStream] = useState([]);

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
        <main className="main-content" style={{ position: 'relative' }}>
          
          {activeTab === 'overview' && (
            <div className="animate-slide-up">
              <SectionHeader title="Control Room" desc="Live system vitals and global active map telemetry." />
              
              <div className="grid-3" style={{ marginBottom: '32px' }}>
                <KPICard title="Active Riders" value="14,204" sub="1Hz GPS Stream" icon={<Crosshair size={28}/>} />
                <KPICard title="Risk Level" value="Level 4" sub="High (City-wide)" icon={<Map size={28}/>} isAlert={true} />
                <KPICard title="Claims (Live)" value="1,245" sub="+12% from avg" icon={<Activity size={28}/>} />
                <KPICard title="Total Payouts" value="₹4.1M" sub="Instant UPI" icon={<Landmark size={28}/>} />
                <KPICard title="Fraud Blocked" value="14.2%" sub="Via CNN/Transf." icon={<ShieldAlert size={28}/>} isAlert={true}/>
                <KPICard title="Decision Time" value="42ms" sub="P99 Latency" icon={<Zap size={28}/>} />
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
                <KPICard title="Risk Score" value="0.84" sub="Avg GeoHash Output" icon={<BarChart2 size={24}/>}/>
                <KPICard title="Disruptions (Live)" value="4 Zones" sub="Next 2-6 Hrs active" isAlert={true} icon={<AlertOctagon size={24}/>}/>
                <KPICard title="Weather Max" value="22mm/hr" sub="Heavy Thunderstorm" icon={<CloudRainWind size={24}/>}/>
                <KPICard title="AQI Level" value="385" sub="Severe Hazard" isAlert={true} icon={<Siren size={24}/>}/>
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

          {activeTab === 'claims' && (
            <div className="animate-slide-up">
              <SectionHeader title="Claims & Payout System" desc="Real-time execution of evaluated smart contracts and instant UPI deposits." />
              
              <div className="grid-4" style={{ marginBottom: '32px' }}>
                <KPICard title="Approved" value="8,495" sub="Fully Automated" icon={<CheckCircle size={28}/>}/>
                <KPICard title="Rejected" value="654" sub="Outside Logic Rules" isAlert={true} icon={<ShieldAlert size={28}/>}/>
                <KPICard title="Avg Time" value="48s" sub="Creation to Bank UPI" icon={<Clock size={28}/>}/>
                <KPICard title="Total Amount" value="₹4.2M" sub="Today's Outflow" icon={<Banknote size={28}/>}/>
              </div>

              <div className="card glass-panel" style={{ borderTop: '4px solid var(--accent-green)', marginBottom: '32px' }}>
                <h3 style={{ marginBottom: '24px', fontSize: '1.4rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}><ActivitySquare/> Explainable AI (Trust Panel Format)</h3>
                <p style={{ color: 'var(--text-muted)', margin: '0 0 20px 0' }}>When a payout occurs, the exact trigger reasons are broadcast directly to the rider's phone to build absolute trust.</p>
                <div className="grid-3" style={{ background: 'var(--app-bg)', padding: '24px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                   <div style={{ padding: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                     <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>1. Reason (Physical)</div>
                     <div style={{ fontWeight: 700, fontSize: '1.3rem', marginTop: '8px', color: 'var(--text-main)' }}>Rain = 22mm/hr</div>
                     <div style={{ fontSize: '0.8rem', marginTop: '4px', color: 'var(--primary)' }}>Validated via IMD API</div>
                   </div>
                   <div style={{ padding: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                     <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>2. Impact (Economic)</div>
                     <div style={{ fontWeight: 700, fontSize: '1.3rem', marginTop: '8px', color: 'var(--text-main)' }}>Speed Drop = 80%</div>
                     <div style={{ fontSize: '0.8rem', marginTop: '4px', color: 'var(--primary)' }}>Validated via Telemetry DB</div>
                   </div>
                   <div style={{ padding: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', border: '2px solid var(--accent-green)' }}>
                     <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>3. Conclusion (Action)</div>
                     <div style={{ fontWeight: 800, fontSize: '1.4rem', marginTop: '8px', color: 'var(--accent-green)' }}>Loss = ₹450 Paid</div>
                     <div style={{ fontSize: '0.8rem', marginTop: '4px', color: 'var(--text-muted)' }}>UPI Tx: X79199241X</div>
                   </div>
                </div>
              </div>

              <div className="card glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--app-bg)', borderBottom: '1px solid var(--card-border)' }}>
                      <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Claim Ref</th>
                      <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Rider ID</th>
                      <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Location</th>
                      <th style={{ padding: '16px 24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['CLM-492X', 'CLM-991A', 'CLM-841M'].map((id, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid var(--card-border)' }}>
                        <td style={{ padding: '16px 24px', fontWeight: 600, color: 'var(--primary)' }}>{id}</td>
                        <td style={{ padding: '16px 24px' }}>RDR-{Math.floor(Math.random() * 10000)}</td>
                        <td style={{ padding: '16px 24px' }}>{index === 1 ? 'East Industrial' : 'Downtown Core'}</td>
                        <td style={{ padding: '16px 24px' }}>
                          <span className={index === 2 ? 'badge badge-red' : 'badge badge-green'}>{index === 2 ? 'Rejected (Fraud)' : 'Auto-Approved'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'fraud' && (
            <div className="animate-slide-up">
              <SectionHeader title="Fraud Intelligence" desc="Deep learning physics and network anomaly detection engines." />
              
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

          {activeTab === 'premium' && (
            <div className="animate-slide-up">
              <SectionHeader title="Premium & Actuarial" desc="Dynamic LSTM models setting base premiums against projected risks." />
              
              <div className="grid-3" style={{ marginBottom: '32px' }}>
                <KPICard title="Weekly Premium Avg" value="₹42.50" sub="Distributed dynamically" icon={<Landmark size={28}/>}/>
                <KPICard title="Expected Loss E(L)" value="₹1.14M" sub="99% Var limit projected" isAlert={true} icon={<TrendingDown size={28}/>}/>
                <KPICard title="Resilience Wallet" value="₹12.4M" sub="Liquidity Reserve Stored" icon={<Wallet size={28}/>}/>
              </div>
              
              <div className="grid-2">
                <div className="card glass-panel" style={{ background: '#f8fafc' }}>
                   <h3 style={{ marginBottom: '16px' }}>Pricing Formula Breakdown Engine</h3>
                   <div style={{ color: 'var(--primary)', fontFamily: 'monospace', fontSize: '1.2rem', background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid var(--card-border)', textAlign: 'center', fontWeight: 600 }}>
                      Premium = [ E[Loss] × Risk Score ]<br/><br/>- Resilience Discount + Admin Load
                   </div>
                   <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '24px', textAlign: 'center' }}>Weekly calculations occur strictly via secure smart-contract execution grids.</p>
                </div>
                
                <div className="card glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                   <h3 style={{ marginBottom: '8px' }}>Actuarial Insights</h3>
                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--card-border)', borderRadius: '12px', background: 'white' }}>
                     <div>
                       <div style={{ fontWeight: 600 }}>Risk Rebates Issued</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Safe active behavior returned to pool</div>
                     </div>
                     <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--accent-green)' }}>₹4.2L</div>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', border: '1px solid var(--card-border)', borderRadius: '12px', background: 'white' }}>
                     <div>
                       <div style={{ fontWeight: 600 }}>Coverage Tier: Elite Users</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Highest protection bracket adoption</div>
                     </div>
                     <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)' }}>18.4%</div>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'behavior' && (
            <div className="animate-slide-up">
              <SectionHeader title="User Behavior & Gamification" desc="Evaluating human action, compliance, and platform loyalty drivers." />
              
              <div className="grid-3" style={{ marginBottom: '32px' }}>
                <KPICard title="Active User Base" value="84,204" sub="MAU Logged this week" icon={<Users size={28}/>}/>
                <KPICard title="Resilience Score" value="78.4" sub="Avg R-Score (High Trust)" icon={<Activity size={28}/>}/>
                <KPICard title="Safe Zone Commute" value="72.4%" sub="Compliance redirection rate" icon={<CheckCircle size={28}/>}/>
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
                <KPICard title="Kafka T/P" value="48k/sec" sub="Throughput events" icon={<Database size={28}/>}/>
                <KPICard title="Flink Ping" value="18ms" sub="Cluster internal latency" icon={<Activity size={28}/>}/>
                <KPICard title="API Request" value="45ms" sub="Client facing edge" icon={<Globe size={28}/>}/>
                <KPICard title="Global Error" value="0.01%" sub="System exception rate" icon={<Server size={28}/>}/>
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

          {activeTab === 'finance' && (
            <div className="animate-slide-up">
              <SectionHeader title="Financial Control Panel" desc="Executive view of system treasury, loss ratios, and macroscopic ledgers." />
              <div className="grid-3" style={{ marginBottom: '24px' }}>
                 <KPICard title="Premium Total" value="₹18.5M" sub="Lifetime Collected" icon={<Landmark size={28}/>}/>
                 <KPICard title="Payout Total" value="₹8.4M" sub="Lifetime Paid" icon={<Banknote size={28}/>}/>
                 <KPICard title="Protocol PnL" value="+₹10.1M" sub="Net Buffer (Lambda)" icon={<TrendingDown size={28}/>}/>
              </div>
              
              <div className="card glass-panel" style={{ padding: '40px', textAlign: 'center', background: 'linear-gradient(145deg, white, var(--app-bg))' }}>
                 <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Current Risk Pool Liquidity Health</h2>
                 <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 32px auto' }}>
                    The system architecture is operating efficiently possessing an internal liquidity buffer of λ=0.8. Parametric loss ratios (total payouts / total premiums) currently hover at an optimal highly sustainable target of 45.4%.
                 </p>
                 <button className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>Initiate Financial Export (Q3 Ledger)</button>
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
                 <div style={{ padding: '16px', background: '#0f172a', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '0.85rem', display: 'flex', gap: '24px' }}>
                   <div><div style={{ width: 8, height: 8, background: '#10b981', borderRadius: '50%', display: 'inline-block', marginRight: '8px' }}></div> Connection Live: socket.io wss://stream.aegis</div>
                   <div style={{ marginLeft: 'auto' }}>DLQ Count: 0</div>
                 </div>
                 <div style={{ padding: '24px', flex: 1, fontFamily: 'monospace', fontSize: '0.9rem', color: '#38bdf8', overflowY: 'hidden', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {liveStream.map(l => <div key={l.id}>{l.log}</div>)}
                 </div>
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

        </main>
      </div>
    </div>
  );
}
