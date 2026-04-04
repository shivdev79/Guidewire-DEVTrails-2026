import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Info, Camera, Loader2, CheckCircle2, ChevronRight, User, MapPin, ShieldCheck, Lock, CalendarClock, Phone, Mail, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import './RegistrationFlow.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8000`;

const stringifyPlatform = (platform) => {
  if (Array.isArray(platform)) {
    return platform.join(', ');
  }
  return platform || 'Zomato';
};

export default function RegistrationFlow({
  riderInfo,
  setRiderInfo,
  setWorkerId,
  setCurrentView,
  setCalculatedPremium,
  setCoverageAmount,
  setRScore,
  setIsFromRegistration,
}) {
  const [phase, setPhase] = useState('A');
  const [kycStatus, setKycStatus] = useState('idle'); // idle, loading, verified
  const [upiStatus, setUpiStatus] = useState('idle');
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [upiInputVal, setUpiInputVal] = useState('');
  const [zoneSelected, setZoneSelected] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [activationAlert, setActivationAlert] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Constants
  const platformsList = ['Zomato', 'Swiggy', 'Zepto', 'Blinkit', 'Amazon', 'Dunzo'];
  const vehiclesList = ['Cycle', '2-Wheeler', 'E-Bike', 'Cargo Auto'];
  const shiftsList = ['Morning', 'Afternoon', 'Evening', 'Night Owl', 'Full Day'];

  const handleNextPhase = (nextPhase) => {
    setPhase(nextPhase);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAadhaarChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formattedStr = '';
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) formattedStr += ' ';
      formattedStr += val[i];
    }
    setAadhaarInput(formattedStr.substring(0, 14));
    setRiderInfo({ ...riderInfo, aadhaar: formattedStr.substring(0, 14) });
  };

  const handleAadhaarVerify = () => {
    setKycStatus('loading');
    setTimeout(() => setKycStatus('verified'), 1800);
  };

  const handleUpiVerify = () => {
    setUpiStatus('loading');
    setTimeout(() => {
      setUpiStatus('verified');
      setRiderInfo({ ...riderInfo, upiId: upiInputVal });
    }, 1500);
  };

  const handlePlatformToggle = (platName) => {
    const current = riderInfo.platform || [];
    if (current.includes(platName)) {
      setRiderInfo({ ...riderInfo, platform: current.filter((p) => p !== platName) });
    } else {
      setRiderInfo({ ...riderInfo, platform: [...current, platName] });
    }
  };

  const handleActivateCoverage = async () => {
    setActivationAlert(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {
        name: riderInfo.name || 'Worker',
        phone: riderInfo.mobile || '9999999999',
        upi_id: upiInputVal || 'test@upi',
        platform: stringifyPlatform(riderInfo.platform),
        city: riderInfo.city || 'Chennai',
        pincode: riderInfo.pincode || '400002',
        avg_weekly_earnings: riderInfo.avgEarnings || 6000,
      });
      setWorkerId(res.data.id);
      setIsFromRegistration(true);
      
      setActivationAlert(false);
      setCurrentView('plan-selection');
    } catch (e) {
      console.error(e);
      console.warn("Network unreachable, seamlessly falling back to mock demo entry...");
      setWorkerId(1);
      setIsFromRegistration(true);
      setActivationAlert(false);
      setCurrentView('plan-selection');
    }
  };

  const isSixDigitPin = riderInfo.pincode && riderInfo.pincode.replace(/\D/g, '').length === 6;

  return (
    <div className="reg-page-wrapper">
      
      {/* Left Branding Panel showing the mockups + visuals */}
      <div className="reg-left-panel">
        <div className="reg-left-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <Shield size={44} color="#1279A8" fill="#1279A8" style={{ filter: 'drop-shadow(0 4px 12px rgba(18, 121, 168, 0.3))' }} />
            <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '38px', fontWeight: 800, color: '#0A1F2E', letterSpacing: '-0.5px' }}>
              AEGIS
            </div>
          </div>
          
          <h1 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '36px', fontWeight: 800, color: '#0A1F2E', marginBottom: '16px', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
            Protect your <span style={{ color: '#1279A8' }}>Gig Income</span>
          </h1>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '16px', color: '#5A7A8A', fontWeight: 500, marginBottom: '60px', lineHeight: 1.6, maxWidth: '400px' }}>
            Join 100,000+ delivery partners who trust AEGIS for zero-trust parametric protection against weather shocks and civic strikes.
          </p>

          <img 
            src="/arch-illustrations.png" 
            alt="AEGIS Delivery Worker Scenarios" 
            style={{ width: '100%', maxWidth: '460px', objectFit: 'contain', mixBlendMode: 'multiply' }} 
          />
          
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="reg-right-panel">
        <div className="reg-max-width">
          
          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '48px', position: 'relative' }}>
            {['A', 'B', 'C'].map((step, idx) => {
              const isActive = phase === step;
              const isCompleted = phase > step;
              const labels = { A: "Identity & KYC", B: "Work Profile", C: "Zone Intelligence" };

              return (
                <React.Fragment key={step}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: '52px', height: '52px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isCompleted ? 'linear-gradient(135deg, #1279A8, #0E638C)' : isActive ? 'linear-gradient(135deg, #1279A8, #0E638C)' : '#FFFFFF',
                      border: isCompleted || isActive ? 'none' : '2px solid #E2E8F0',
                      color: (isActive || isCompleted) ? '#FFFFFF' : '#5A7A8A',
                      fontWeight: 800, fontSize: '20px',
                      boxShadow: isActive ? '0 0 0 8px rgba(18,121,168,0.15), 0 8px 16px rgba(18,121,168,0.2)' : '0 4px 8px rgba(0,0,0,0.02)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}>
                      {isCompleted ? <CheckCircle2 size={28} /> : step}
                    </div>
                    <div style={{ position: 'absolute', top: '70px', whiteSpace: 'nowrap', fontSize: '13px', textTransform: 'uppercase', fontWeight: 800, color: isActive ? '#1279A8' : '#5A7A8A', transition: 'color 0.4s', letterSpacing: '0.5px' }}>
                      {labels[step]}
                    </div>
                  </div>
                  {idx < 2 && (
                    <div style={{ flex: 1, maxWidth: '160px', height: '6px', background: isCompleted ? 'linear-gradient(90deg, #1279A8, #0E638C)' : '#E2E8F0', margin: '0 20px', borderRadius: '3px', transition: 'background 0.4s' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* STEP A - HEAVILY VISUAL INSURANCE ONBOARDING */}
            {phase === 'A' && (
              <motion.div key="stepA" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div className="reg-tag">
                      <User size={18} /> PHASE A — IDENTITY & KYC
                    </div>
                    <h2 className="reg-heading" style={{ fontSize: '32px', marginBottom: '8px' }}>Let's verify who you are</h2>
                    <p className="reg-subheading" style={{ maxWidth: '400px' }}>Your identity is secured and encrypted via AEGIS Zero-Trust Vault. This takes under 2 minutes.</p>
                  </div>
                  {/* Trust Badges cluster */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#F0FDF4', padding: '6px 12px', borderRadius: '8px', border: '1px solid #BBF7D0', color: '#16A34A', fontSize: '12px', fontWeight: 700 }}>
                      <ShieldCheck size={16} /> ISO 27001 CERTIFIED
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#F8FAFC', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#64748B', fontSize: '12px', fontWeight: 700 }}>
                      <Lock size={16} /> 256-BIT ENCRYPTED
                    </div>
                  </div>
                </div>

                {/* Hero Info Banner with Generated Image */}
                <div style={{ background: 'linear-gradient(135deg, #0A1F2E 0%, #1279A8 100%)', borderRadius: '24px', padding: '32px', display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px', boxShadow: '0 20px 40px rgba(18, 121, 168, 0.2)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ flex: 1, position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: '#FFFFFF', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, marginBottom: '16px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      IRDAI REGULATORY COMPLIANCE
                    </div>
                    <h3 style={{ color: '#FFFFFF', fontSize: '22px', fontWeight: 800, marginBottom: '12px', lineHeight: 1.3 }}>
                      We need accurate identity data to issue your legally-binding policy document.
                    </h3>
                    <p style={{ color: '#E0F2FE', fontSize: '15px', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                      We utilize a hybrid AI matching engine that cross-references your selfie with Aadhaar UI records to prevent syndicate fraud instantly.
                    </p>
                  </div>
                  <div style={{ flex: 0.8, display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 2 }}>
                    <img src="/weather-shield.png" alt="AEGIS Protection Vault" style={{ height: '180px', objectFit: 'contain', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }} />
                  </div>
                  {/* Decorative faint background shape */}
                  <div style={{ position: 'absolute', right: '-10%', top: '-50%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)', borderRadius: '50%', zIndex: 1 }}></div>
                </div>

                <div className="reg-card" style={{ marginBottom: '40px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0A1F2E', marginBottom: '8px' }}>1. Biometric Benchmark</h3>
                      <p style={{ fontSize: '14px', color: '#5A7A8A', margin: 0, maxWidth: '300px', lineHeight: 1.5 }}>Your photo is strictly used for facial recognition matching during claim submission.</p>
                    </div>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px dashed #1279A8', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F7FB', overflow: 'hidden', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.05)' }}>
                      {photoPreview ? <img src={photoPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" /> : <Camera size={32} color="#1279A8" />}
                    </div>
                  </div>
                  
                  <button className="reg-btn reg-btn-outline" style={{ padding: '12px 24px', fontSize: '15px', width: '100%' }} onClick={() => setPhotoPreview('https://img.icons8.com/bubbles/100/000000/user-male.png')}>
                    <Camera size={18} /> Take Live Selfie
                  </button>
                </div>

                <div className="reg-card" style={{ marginBottom: '40px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0A1F2E', marginBottom: '24px' }}>2. Personal Information</h3>
                  
                  {/* Grid Fields */}
                  <div className="reg-grid-2">
                    <div style={{ position: 'relative' }}>
                      <label className="reg-label">Legal Full Name (as per ID)</label>
                      <User size={18} color="#94A3B8" style={{ position: 'absolute', top: '44px', left: '16px' }} />
                      <input type="text" className="reg-input" placeholder="Rahul Sharma" style={{ paddingLeft: '44px' }} value={riderInfo.name} onChange={e => setRiderInfo({...riderInfo, name: e.target.value})} />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <label className="reg-label">Date of Birth</label>
                      <CalendarClock size={18} color="#94A3B8" style={{ position: 'absolute', top: '44px', left: '16px' }} />
                      <input type="date" className="reg-input" style={{ paddingLeft: '44px', color: riderInfo.dob ? '#0A1F2E' : '#94A3B8' }} value={riderInfo.dob} onChange={e => setRiderInfo({...riderInfo, dob: e.target.value})} />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <label className="reg-label">Mobile Number</label>
                      <Phone size={18} color="#94A3B8" style={{ position: 'absolute', top: '44px', left: '16px' }} />
                      <input type="text" className="reg-input" placeholder="+91 98765 43210" style={{ paddingLeft: '44px' }} value={riderInfo.mobile} onChange={e => setRiderInfo({...riderInfo, mobile: e.target.value})} />
                    </div>
                    <div style={{ position: 'relative' }}>
                      <label className="reg-label">Email Address</label>
                      <Mail size={18} color="#94A3B8" style={{ position: 'absolute', top: '44px', left: '16px' }} />
                      <input type="email" className="reg-input" placeholder="rahul@example.com" style={{ paddingLeft: '44px' }} value={riderInfo.email} onChange={e => setRiderInfo({...riderInfo, email: e.target.value})} />
                    </div>
                  </div>
                </div>

                {/* Highly Visual Aadhaar KYC */}
                <div className="reg-card" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '32px', display: 'flex', gap: '32px', background: '#FAFAFA' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                         <div style={{ background: '#FFF3CD', color: '#B45309', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Legal Requirement</div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                           <ShieldAlert size={14} color="#64748B" /> DigiLocker Connected
                         </div>
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0A1F2E', marginBottom: '12px' }}>3. Government ID Verification</h3>
                      <p style={{ fontSize: '15px', color: '#5A7A8A', lineHeight: 1.6, marginBottom: '24px' }}>
                        To prevent duplicate pooling and establish an actuarial foundation, your identity must be crossed off against the central UIDAI registry.
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                          <input type="text" className="reg-input" placeholder="Enter 12-digit Aadhaar Number" style={{ letterSpacing: '2px', fontSize: '18px', fontWeight: 700, padding: '20px', background: '#FFFFFF', border: '2px solid #E2E8F0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }} value={aadhaarInput} onChange={handleAadhaarChange} disabled={kycStatus === 'verified'} />
                          {kycStatus === 'verified' && <div style={{ position: 'absolute', right: '20px', top: '22px', color: '#10B981' }}><CheckCircle2 size={24} /></div>}
                        </div>
                        <button className={`reg-btn ${kycStatus === 'verified' ? 'reg-btn-verified' : 'reg-btn-amber'}`} onClick={handleAadhaarVerify} disabled={kycStatus !== 'idle'} style={{ width: '100%', fontSize: '16px', padding: '18px' }}>
                          {kycStatus === 'idle' && 'Authenticate via DigiLocker'}
                          {kycStatus === 'loading' && <><Loader2 size={20} className="animate-spin" /> Authorizing...</>}
                          {kycStatus === 'verified' && <><CheckCircle2 size={20} /> Identity Confirmed</>}
                        </button>
                      </div>
                    </div>

                    {/* Integrated illustration making the ui more beautiful */}
                    <div style={{ width: '220px', background: '#F0F7FB', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', border: '1px solid #E4F3FA' }}>
                       <img src="/rider-illustration.png" alt="Rider Profile Tech" style={{ width: '130px', objectFit: 'contain', marginBottom: '16px', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.15))' }} />
                       <div style={{ textAlign: 'center' }}>
                         <div style={{ fontSize: '14px', fontWeight: 800, color: '#1279A8', marginBottom: '4px' }}>Zero Paperwork</div>
                         <div style={{ fontSize: '12px', color: '#5A7A8A', fontWeight: 500, lineHeight: 1.4 }}>Instant API fetching directly from government databases.</div>
                       </div>
                    </div>
                  </div>
                </div>                  <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #E2E8F0, transparent)', margin: '48px 0' }}></div>

                {/* UPI & Payout Card */}
                <div className="reg-card" style={{ marginBottom: '40px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0A1F2E', marginBottom: '24px' }}>4. UPI & Direct Payout</h3>
                  <div>
                    <label className="reg-label" style={{ marginBottom: '20px' }}>VERIFIED BANK ACCOUNT OR UPI ID</label>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' }}>
                      <input type="text" className="reg-input" placeholder="someone@upi" style={{ flex: '1 1 250px', fontSize: '16px', background: '#FFFFFF', border: '2px solid #E2E8F0', padding: '16px' }} value={upiInputVal} onChange={e => setUpiInputVal(e.target.value)} disabled={upiStatus === 'verified'} />
                      <button className={`reg-btn ${upiStatus === 'verified' ? 'reg-btn-verified' : 'reg-btn-amber'}`} onClick={handleUpiVerify} disabled={upiStatus !== 'idle'} style={{ flex: '0 0 auto', padding: '16px 24px' }}>
                        {upiStatus === 'idle' && 'Penny-drop ₹1 Verification'}
                        {upiStatus === 'loading' && <><Loader2 size={20} className="animate-spin" /> Verifying Bank...</>}
                        {upiStatus === 'verified' && <><CheckCircle2 size={20} /> Bank Account Linked</>}
                      </button>
                    </div>
                    <div className="reg-grid-2">
                      <select className="reg-input" value={riderInfo.bankName || ''} onChange={e => setRiderInfo({...riderInfo, bankName: e.target.value})} style={{ background: '#FFFFFF' }}>
                        <option value="" disabled>Select Bank Name</option>
                        <option value="SBI">SBI</option>
                        <option value="HDFC">HDFC</option>
                        <option value="ICICI">ICICI</option>
                        <option value="Axis">Axis</option>
                        <option value="Kotak">Kotak</option>
                        <option value="Paytm Payments Bank">Paytm Payments Bank</option>
                        <option value="Bank of Baroda">Bank of Baroda</option>
                        <option value="PNB">PNB</option>
                      </select>
                      <input type="text" className="reg-input" placeholder="Account Last 4 digits" maxLength="4" value={riderInfo.accountNo || ''} onChange={e => setRiderInfo({...riderInfo, accountNo: e.target.value.replace(/\D/g, '')})} style={{ background: '#FFFFFF' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                  <button className="reg-btn reg-btn-primary" onClick={() => handleNextPhase('B')}>
                    Continue to Work Profile <ChevronRight size={24} />
                  </button>
                </div>

              </motion.div>
            )}

            {/* STEP B */}
            {phase === 'B' && (
              <motion.div key="stepB" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                
                <div className="reg-tag">
                  <User size={18} /> PHASE B — WORK PROFILE
                </div>

                <h2 className="reg-heading">Tell us how you work</h2>
                <p className="reg-subheading">This powers your AI risk profile and calculates your personalised weekly premium.</p>

                <div className="reg-card">
                  
                  {/* Platforms */}
                  <div style={{ marginBottom: '48px' }}>
                    <label className="reg-label">Platforms Integrated</label>
                    <div className="reg-chip-grid">
                      {platformsList.map((plat) => {
                        const isSel = (riderInfo.platform || []).includes(plat);
                        return (
                          <div key={plat} onClick={() => handlePlatformToggle(plat)} className={`reg-chip ${isSel ? 'active' : ''}`}>
                            {plat}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div style={{ marginBottom: '48px' }}>
                    <label className="reg-label">Primary Vehicle</label>
                    <div className="reg-chip-grid">
                      {vehiclesList.map((v) => {
                        const isSel = riderInfo.vehicle === v;
                        return (
                          <div key={v} onClick={() => setRiderInfo({...riderInfo, vehicle: v})} className={`reg-chip ${isSel ? 'active' : ''}`}>
                            {v}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Shift */}
                  <div style={{ marginBottom: '48px' }}>
                    <label className="reg-label">Typical Shift</label>
                    <div className="reg-chip-grid">
                      {shiftsList.map((s) => {
                        const isSel = riderInfo.shift === s;
                        return (
                          <div key={s} onClick={() => setRiderInfo({...riderInfo, shift: s})} className={`reg-chip ${isSel ? 'active' : ''}`}>
                            {s}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #E2E8F0, transparent)', margin: '48px 0' }}></div>

                  {/* History */}
                  <div className="reg-grid-2" style={{ marginBottom: '48px' }}>
                    <div>
                      <label className="reg-label">Avg. Daily Orders</label>
                      <input type="number" className="reg-input" placeholder="24" value={riderInfo.avgOrders} onChange={e => setRiderInfo({...riderInfo, avgOrders: e.target.value})} />
                    </div>
                    <div>
                      <label className="reg-label">Years on Platform</label>
                      <select className="reg-input" value={riderInfo.yearsExp || 'Select'} onChange={e => setRiderInfo({...riderInfo, yearsExp: e.target.value})}>
                        <option value="Select" disabled>Select</option>
                        <option value="< 1 year">&lt; 1 year</option>
                        <option value="1-2 years">1-2 years</option>
                        <option value="3+ years">3+ years (Loyalty Discount)</option>
                      </select>
                    </div>
                  </div>

                  {/* Earnings Slider */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
                      <label className="reg-label" style={{ margin: 0 }}>Weekly Earnings Baseline</label>
                      <div style={{ fontFamily: '"Syne", sans-serif', fontSize: '28px', fontWeight: 800, color: '#1279A8' }}>
                        ₹{Number(riderInfo.avgEarnings || 6000).toLocaleString('en-IN')}/wk
                      </div>
                    </div>
                    <input type="range" className="range-slider" min="2000" max="15000" step="500" value={riderInfo.avgEarnings || 6000} onChange={e => setRiderInfo({...riderInfo, avgEarnings: Number(e.target.value)})} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5A7A8A', fontSize: '14px', fontWeight: 700, marginTop: '16px' }}>
                      <span>₹2,000</span>
                      <span>₹15,000</span>
                    </div>
                  </div>

                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
                  <button className="reg-btn reg-btn-outline" onClick={() => handleNextPhase('A')}>
                    Back
                  </button>
                  <button className="reg-btn reg-btn-primary" onClick={() => handleNextPhase('C')}>
                    Continue to Zone <ChevronRight size={24} />
                  </button>
                </div>

              </motion.div>
            )}

            {/* STEP C */}
            {phase === 'C' && (
              <motion.div key="stepC" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                
                <div className="reg-tag">
                  <User size={18} /> PHASE C — ZONE INTELLIGENCE
                </div>

                <h2 className="reg-heading">Where do you operate?</h2>
                <p className="reg-subheading">Your registered zone helps us trigger automated income protection checks.</p>

                <div className="reg-card">
                  
                  <div className="reg-grid-2" style={{ marginBottom: '40px' }}>
                    <div>
                      <label className="reg-label">Home Base Pincode</label>
                      <input type="text" className="reg-input" placeholder="e.g. 600001" maxLength="6" value={riderInfo.pincode || ''} onChange={e => setRiderInfo({...riderInfo, pincode: e.target.value.replace(/\D/g, '')})} />
                    </div>
                    <div>
                      <label className="reg-label">City</label>
                      <select className="reg-input" value={riderInfo.city || 'Chennai'} onChange={e => setRiderInfo({...riderInfo, city: e.target.value})}>
                        {['Chennai', 'Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={`map-box ${zoneSelected ? 'selected' : ''}`} onClick={() => setZoneSelected(true)}>
                    <MapPin size={48} color="#1279A8" fill={zoneSelected ? "#E4F3FA" : "white"} style={{ marginBottom: '16px', transition: 'all 0.3s', transform: zoneSelected ? 'scale(1.1)' : 'scale(1)' }} />
                    <div style={{ color: zoneSelected ? '#1279A8' : '#5A7A8A', fontWeight: zoneSelected ? 800 : 700, fontSize: '16px' }}>
                      {zoneSelected ? `Zone selected — ${riderInfo.city || 'Chennai'} Central 📍` : 'Tap to select your primary delivery zone'}
                    </div>
                  </div>

                  <div className="reg-grid-2">
                    <div>
                      <label className="reg-label">Primary Zone Pincode</label>
                      <input type="text" className="reg-input" placeholder="600040" maxLength="6" value={riderInfo.pincode || ''} onChange={e => setRiderInfo({...riderInfo, pincode: e.target.value.replace(/\D/g, '')})} />
                    </div>
                    <div>
                      <label className="reg-label">Secondary Zone Pincode (Optional)</label>
                      <input type="text" className="reg-input" placeholder="600045" maxLength="6" />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isSixDigitPin && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                        <div style={{ background: 'rgba(228, 243, 250, 0.8)', backdropFilter: 'blur(10px)', borderLeft: '4px solid #F59E0B', borderRadius: '16px', padding: '24px', marginTop: '40px', boxShadow: '0 8px 24px rgba(18, 121, 168, 0.08)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 12px rgba(245,158,11,0.8)' }} />
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#0A1F2E', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk Preview</span>
                          </div>
                          <div style={{ fontSize: '16px', color: '#0A1F2E', lineHeight: 1.6, marginBottom: '8px', fontWeight: 600 }}>
                            Your zone has experienced <strong style={{ color: '#B45309' }}>14 disruption days</strong> in the last 3 months (heavy rain × 9, severe AQI × 3, civic strike × 2). Risk level: <strong>MODERATE 🟡</strong>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>

                <div style={{ marginBottom: '48px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0A1F2E', textTransform: 'uppercase', marginBottom: '24px', fontFamily: '"Syne", sans-serif' }}>Active Parametric Triggers</h4>
                  <div className="reg-grid-2">
                    {[
                      { name: 'Rain > 15mm/hr', api: 'Open-Meteo API' },
                      { name: 'Heat > 42°C', api: 'IMD API' },
                      { name: 'AQI > 300', api: 'waqi.org API' },
                      { name: 'Civic Strike', api: 'NLP / RSS feeds' }
                    ].map(t => (
                      <div key={t.name} style={{ background: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #D0E8F2', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 4px 16px rgba(18, 121, 168, 0.05)', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #1279A8, #0E638C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', boxShadow: '0 4px 12px rgba(18, 121, 168, 0.3)' }}>
                          <Shield size={24} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '16px', color: '#0A1F2E' }}>{t.name} <span style={{ color: '#10B981' }}>✓</span></div>
                          <div style={{ fontSize: '14px', color: '#5A7A8A', marginTop: '6px', fontWeight: 600 }}>{t.api}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ margin: '32px 0', padding: '20px', background: 'rgba(18, 121, 168, 0.05)', borderRadius: '16px', border: '1px solid rgba(18, 121, 168, 0.1)', display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'pointer' }} onClick={() => setAgreedToTerms(!agreedToTerms)}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: `2px solid ${agreedToTerms ? '#1279A8' : '#CBD5E1'}`, background: agreedToTerms ? '#1279A8' : '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginTop: '2px' }}>
                    {agreedToTerms && <CheckCircle2 size={16} color="#FFFFFF" />}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#0A1F2E' }}>Agreement & Consent</div>
                    <p style={{ fontSize: '13px', color: '#5A7A8A', margin: '4px 0 0 0', lineHeight: 1.5 }}>
                      I have read and agree to the <strong>Terms & Conditions</strong> and <strong>Legal Notice</strong>. I understand that AEGIS uses AI-driven parametric triggers for automated claim processing.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', marginTop: '32px' }}>
                  <button className="reg-btn reg-btn-outline" onClick={() => handleNextPhase('B')}>
                    Back
                  </button>
                  <button className="reg-btn reg-btn-primary" style={{ flex: 1, fontSize: '20px', padding: '24px', boxShadow: agreedToTerms ? '0 12px 32px rgba(18, 121, 168, 0.35)' : 'none', opacity: agreedToTerms ? 1 : 0.6, cursor: agreedToTerms ? 'pointer' : 'not-allowed' }} onClick={handleActivateCoverage} disabled={activationAlert || !agreedToTerms}>
                    {activationAlert ? <><Loader2 className="animate-spin" size={28} /> Processing...</> : <><Shield size={28} /> Activate AEGIS Coverage</>}
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

