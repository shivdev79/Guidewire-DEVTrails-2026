import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Check, ChevronRight, Zap, Clock, Percent, AlertCircle, Loader2, MapPin, TrendingUp, Star, Wallet, AlertTriangle, X, Plus } from 'lucide-react';
import axios from 'axios';
import './PlanSelection.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `http://${window.location.hostname}:8000`;

const TERMS_AND_CONDITIONS = `
AEGIS INSURANCE - TERMS AND CONDITIONS

1. COVERAGE SCOPE
- Parametric coverage for loss of income due to natural disasters and civic disruptions
- Automatic claim payment upon trigger event (no manual claim submission required)
- Coverage applies during active policy period only

2. TRIGGER EVENTS (Location-based, Automatic)
- Heavy Rainfall: >15mm/hour in your operating zone
- Extreme Heat: >42°C recorded in your operating zone  
- Civic Strikes/Closures: Government-declared civic strikes in your area

3. CLAIM PAYOUT PROCESS
- Automatic claim creation when trigger detected (zero-touch process)
- Payment within claim processing time specified in your plan tier
- Payouts credited directly to registered UPI/wallet account
- Maximum coverage per trigger: Plan tier coverage amount

4. PREMIUM PAYMENT AND WALLET
- Weekly premium charged from wallet balance
- If wallet balance is insufficient, policy activation will FAIL
- Add balance to your wallet before activation
- Failed premium payments will result in policy cancellation
- 20% cashback on premium paid to wallet

5. FRAUD PREVENTION
- AI-powered fraud detection on all claims
- Payout may be rejected if fraud score exceeds threshold
- Worker must maintain valid documentation
- False trigger claims may result in policy suspension

6. POLICY DURATION
- Weekly renewal cycle (7 days)
- Policy subject to renewal each week
- Premium recalculated based on current earnings and zone data

7. ELIGIBILITY
- Must be active gig worker registered in supported city
- Must be 18+ years old
- Must maintain active engagement (weekly earnings >₹2000)

8. LIMITATION OF LIABILITY
- Coverage excludes intentional self-harm
- Coverage excludes false claim submissions
- Parametric trigger methodology may have delays (typically <2 hours)
- Company not liable for trigger system delays

9. CANCELLATION
- Worker may cancel anytime (effective after current week)
- Remaining balance will be refunded to wallet
- No penalties for cancellation

10. CONSENT AND ACKNOWLEDGMENT
By activating this plan, you confirm:
- You have read and agree to all terms
- You authorize automatic weekly premium deduction
- You understand the parametric claims process
- You provide accurate location and earnings data
`;

export default function PlanSelection({
  riderInfo,
  workerId,
  walletBalance,
  setWalletBalance,
  setCurrentView,
  setActivatedPlan,
  setHasActivePolicy,
  setCalculatedPremium,
  setCoverageAmount,
  onCancel
}) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isActivating, setIsActivating] = useState(false);
  const [activationError, setActivationError] = useState(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [addBalanceAmount, setAddBalanceAmount] = useState('');
  const [isAddingBalance, setIsAddingBalance] = useState(false);
  const [activeTab, setActiveTab] = useState('explore-plans');

  // Dynamically filter plans based on earnings and location
  const earnings = riderInfo.avgEarnings || 6000;
  const city = riderInfo.city || 'Mumbai';

  // Plan recommendations based on earnings tier
  const getRecommendedPlans = () => {
    const allPlans = [
      {
        id: 'aegis-smart-base',
        name: 'Aegis Smart Base',
        tagline: 'Balanced entry plan for gig workers',
        basePrice: 25,
        coverage: 1200,
        tier: 'Base',
        color: '#3b82f6',
        accentColor: 'rgba(59,130,246,0.1)',
        badge: null,
        coverageHours: 10,
        triggers: ['Rain (>18mm/hr)', 'Heat (>42°C)', 'AQI (>300)'],
        recoverPercentage: 40,
        perks: ['Claim: 36h processing', 'Wallet: 15% cashback', 'Basic risk alerts'],
        recommended: false,
        minEarnings: 4000,
        maxEarnings: 6999,
      },
      {
        id: 'aegis-shield-pro',
        name: 'Aegis Shield Pro',
        tagline: 'Most Popular - Best Value',
        basePrice: 34,
        coverage: 2500,
        tier: 'Pro',
        color: '#00678a',
        accentColor: 'rgba(0,103,138,0.1)',
        badge: 'Most Popular',
        coverageHours: 12,
        triggers: ['Rain (>15mm/hr)', 'AQI (>250)', 'Civic Strikes', 'Platform Outage'],
        recoverPercentage: 50,
        perks: ['Claim: <12h processing', 'Wallet: 20% cashback', 'Mid-week rebate', 'Safe zone alerts'],
        recommended: true,
        minEarnings: 5000,
        maxEarnings: 10000,
      },
      {
        id: 'aegis-elite-core',
        name: 'Aegis Elite Core',
        tagline: 'Maximum protection for high-earners',
        basePrice: 45,
        coverage: 3500,
        tier: 'Elite',
        color: '#d97706',
        accentColor: 'rgba(217,119,6,0.1)',
        badge: 'Premium',
        coverageHours: 14,
        triggers: ['Rain (>12mm/hr)', 'AQI (>200)', 'Civic Strikes', 'Traffic Gridlock', 'Platform Outage'],
        recoverPercentage: 65,
        perks: ['Claim: <4h processing', 'Wallet: 25% cashback', 'Weekly rebate', 'Priority support', 'Injury coverage'],
        recommended: false,
        minEarnings: 9000,
        maxEarnings: 15000,
      },
    ];

    // Filter plans based on earnings
    let filtered = allPlans.filter(
      p => earnings >= p.minEarnings && earnings <= p.maxEarnings
    );

    // If no exact match, return nearby tiers
    if (filtered.length === 0) {
      if (earnings < 4000) {
        filtered = [allPlans[0]]; // Micro Base
      } else if (earnings < 9000) {
        filtered = allPlans.filter(p => p.tier === 'Base' || p.tier === 'Pro');
      } else {
        filtered = allPlans;
      }
    }

    return filtered;
  };

  const plans = getRecommendedPlans();

  const handleAddBalance = async () => {
    if (!addBalanceAmount || parseFloat(addBalanceAmount) <= 0) {
      setActivationError('Please enter a valid amount');
      return;
    }

    setIsAddingBalance(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/wallet/top-up`, {
        worker_id: workerId,
        amount: parseFloat(addBalanceAmount),
        source: 'MANUAL_TOP_UP'
      });

      setWalletBalance(Number(res.data?.wallet_balance ?? 0));
      setShowAddBalanceModal(false);
      setAddBalanceAmount('');
      setActivationError(null);
    } catch (error) {
      console.error('Add balance failed:', error);
      setActivationError(error.response?.data?.message || 'Failed to add balance. Please try again.');
    } finally {
      setIsAddingBalance(false);
    }
  };

  const handleActivatePlan = async () => {
    if (!termsAccepted) {
      setActivationError('You must accept the terms and conditions to activate this plan');
      return;
    }

    const planPrice = selectedPlan.basePrice;
    if (walletBalance < planPrice) {
      setActivationError(`Insufficient balance. You need ₹${planPrice} but have ₹${walletBalance.toFixed(2)}`);
      setShowTermsModal(false);
      setShowAddBalanceModal(true);
      return;
    }

    setIsActivating(true);
    setActivationError(null);

    try {
      // Create policy on backend
      const policyRes = await axios.post(`${API_BASE_URL}/create-policy`, {
        worker_id: workerId,
        tier: selectedPlan.tier,
        accepted_terms: true,
      });

      if (policyRes.data && policyRes.data.id) {
        // Update wallet balance after successful policy creation
        setWalletBalance(Number(policyRes.data.worker?.wallet_balance ?? walletBalance));
        
        setActivatedPlan(selectedPlan);
        setHasActivePolicy(true);
        setCalculatedPremium(selectedPlan.basePrice);
        setCoverageAmount(selectedPlan.coverage);

        // Clear state and navigate to dashboard
        setSelectedPlan(null);
        setTermsAccepted(false);
        setShowTermsModal(false);
        
        setTimeout(() => {
          setCurrentView('rider-dash');
        }, 1500);
      }
    } catch (error) {
      console.error('Policy creation failed:', error);
      setActivationError(error.response?.data?.detail || error.response?.data?.message || 'Failed to activate plan. Please try again.');
      setIsActivating(false);
    }
  };

  return (
    <div className="plan-selection-wrapper">
      {/* Header */}
      <div className="plan-selection-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'linear-gradient(135deg, #1279A8, #0E638C)', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={32} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0A1F2E', margin: 0 }}>Select Your Coverage Plan</h1>
              <p style={{ fontSize: '15px', color: '#5A7A8A', margin: '4px 0 0 0', fontWeight: 500 }}>
                Based on your earnings (₹{earnings.toLocaleString()}/week) in {city}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={24} color="#5A7A8A" />
          </button>
        </div>

        {/* Wallet Status Card */}
        <div style={{ background: walletBalance < 50 ? 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(220,38,38,0.04) 100%)' : 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(5,150,105,0.04) 100%)', border: walletBalance < 50 ? '1px solid rgba(239,68,68,0.15)' : '1px solid rgba(16,185,129,0.15)', borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '24px', marginBottom: '32px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
            <div style={{ background: walletBalance < 50 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
              <Wallet size={18} color={walletBalance < 50 ? '#EF4444' : '#10B981'} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A7A8A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Wallet Balance</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: walletBalance < 50 ? '#DC2626' : '#10B981' }}>₹{walletBalance.toFixed(2)}</div>
            </div>
          </div>
          {walletBalance < 50 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddBalanceModal(true)}
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
              }}
            >
              <Plus size={16} />
              Add Balance
            </motion.button>
          )}
        </div>

        {/* Location & Earnings Context Card */}
        <div style={{ background: 'linear-gradient(135deg, rgba(18,121,168,0.08) 0%, rgba(14,99,140,0.04) 100%)', border: '1px solid rgba(18,121,168,0.15)', borderRadius: '16px', padding: '16px 20px', display: 'flex', gap: '24px', marginBottom: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(18,121,168,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
              <TrendingUp size={18} color="#1279A8" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A7A8A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weekly Earnings</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0A1F2E' }}>₹{earnings.toLocaleString()}</div>
            </div>
          </div>

          <div style={{ height: '100%', width: '1px', background: 'rgba(18,121,168,0.1)' }}></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(18,121,168,0.1)', padding: '8px 12px', borderRadius: '8px' }}>
              <MapPin size={18} color="#1279A8" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#5A7A8A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Operating Zone</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0A1F2E' }}>{city}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '16px', marginTop: '32px', marginBottom: '32px', borderBottom: '2px solid #E2E8F0', paddingBottom: '0' }}>
        <button
          onClick={() => setActiveTab('explore-plans')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'explore-plans' ? 'transparent' : 'transparent',
            border: 'none',
            borderBottom: activeTab === 'explore-plans' ? '3px solid #1279A8' : 'none',
            color: activeTab === 'explore-plans' ? '#1279A8' : '#5A7A8A',
            fontWeight: activeTab === 'explore-plans' ? 800 : 600,
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            marginBottom: '-2px',
          }}
        >
          Explore Plans
        </button>
      </div>

      {/* Plans Grid - Explore Plans Tab */}
      {activeTab === 'explore-plans' && (
        <div className="plans-grid">
          <AnimatePresence>
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''} ${plan.recommended ? 'recommended' : ''}`}
                onClick={() => !isActivating && !showTermsModal && setSelectedPlan(plan)}
                style={{
                  background: '#FFFFFF',
                  border: selectedPlan?.id === plan.id ? '2px solid #1279A8' : plan.recommended ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '32px',
                  cursor: isActivating || showTermsModal ? 'default' : 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: selectedPlan?.id === plan.id ? '0 20px 40px rgba(18,121,168,0.15)' : plan.recommended ? '0 12px 30px rgba(245,158,11,0.12)' : 'none',
                  transform: selectedPlan?.id === plan.id || plan.recommended ? 'scale(1.02)' : 'scale(1)',
                  opacity: selectedPlan && selectedPlan.id !== plan.id && showTermsModal ? 0.3 : 1,
                  pointerEvents: selectedPlan && selectedPlan.id !== plan.id && showTermsModal ? 'none' : 'auto',
                }}
              >
                {/* Badge */}
                {plan.badge && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'linear-gradient(135deg, #F59E0B, #F97316)', color: 'white', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, letterSpacing: '0.5px' }}>
                    <Star size={12} style={{ display: 'inline', marginRight: '4px' }} /> {plan.badge}
                  </div>
                )}

                {/* Plan Name & Tagline */}
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0A1F2E', margin: '0 0 8px 0' }}>{plan.name}</h3>
                  <p style={{ fontSize: '14px', color: '#5A7A8A', margin: 0, fontWeight: 500 }}>{plan.tagline}</p>
                </div>

                {/* Price Display */}
                <div style={{ background: plan.accentColor, border: `1px solid ${plan.color}20`, borderRadius: '16px', padding: '20px', marginBottom: '24px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: plan.color }}>₹{plan.basePrice}</div>
                  <div style={{ fontSize: '14px', color: '#5A7A8A', fontWeight: 600, marginTop: '4px' }}>/week</div>
                </div>

                {/* Coverage Amount */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '14px', background: '#F0F7FB', borderRadius: '12px', border: '1px solid #E0F2FE' }}>
                  <Shield size={20} color="#1279A8" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#5A7A8A', fontWeight: 600 }}>Coverage Amount</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#1279A8' }}>₹{plan.coverage.toLocaleString()}</div>
                  </div>
                </div>

                {/* Perks */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#5A7A8A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Key Perks</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {plan.perks.map((perk, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#0A1F2E', fontWeight: 500 }}>
                        <Check size={16} color="#10B981" strokeWidth={3} />
                        {perk}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Triggers */}
                <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#5A7A8A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>Auto-Triggers</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {plan.triggers.map((trigger, i) => (
                      <div key={i} style={{ fontSize: '13px', color: '#5A7A8A', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Zap size={12} color="#F59E0B" />
                        {trigger}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recovery % Info */}
                <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(16,185,129,0.04) 100%)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Percent size={18} color="#10B981" />
                  <div>
                    <div style={{ fontSize: '12px', color: '#5A7A8A', fontWeight: 600 }}>Income Recovery</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#10B981' }}>{plan.recoverPercentage}% of weekly earnings</div>
                  </div>
                </div>

                {/* Select/Activate Button */}
                {selectedPlan?.id === plan.id && showTermsModal ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActivatePlan();
                    }}
                    disabled={isActivating || !termsAccepted}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: termsAccepted ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #D1D5DB, #9CA3AF)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '14px',
                      fontWeight: 800,
                      fontSize: '15px',
                      cursor: termsAccepted && !isActivating ? 'pointer' : 'not-allowed',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: isActivating ? 0.6 : 1,
                    }}
                  >
                    {isActivating ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Activating...
                      </>
                    ) : (
                      <>
                        <Check size={18} />
                        Confirm & Activate
                      </>
                    )}
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlan(plan);
                      setShowTermsModal(true);
                      setTermsAccepted(false);
                      setActivationError(null);
                    }}
                    disabled={isActivating}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: selectedPlan?.id === plan.id ? 'linear-gradient(135deg, #1279A8, #0E638C)' : '#F0F7FB',
                      color: selectedPlan?.id === plan.id ? 'white' : '#1279A8',
                      border: 'none',
                      borderRadius: '14px',
                      fontWeight: 800,
                      fontSize: '15px',
                      cursor: isActivating ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: isActivating ? 0.6 : 1,
                    }}
                  >
                    {selectedPlan?.id === plan.id ? (
                      <>
                        Review & Activate
                        <ChevronRight size={18} />
                      </>
                    ) : (
                      <>
                        Select Plan
                        <ChevronRight size={18} />
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Terms & Conditions Modal */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '20px',
            }}
            onClick={() => {
              setShowTermsModal(false);
              setTermsAccepted(false);
              setActivationError(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '20px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Modal Header */}
              <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A1F2E', margin: 0 }}>Terms & Conditions</h2>
                <button
                  onClick={() => {
                    setShowTermsModal(false);
                    setTermsAccepted(false);
                    setActivationError(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={20} color="#5A7A8A" />
                </button>
              </div>

              {/* Modal Body - Terms Content */}
              <div style={{ padding: '24px', overflowY: 'auto', flex: 1, background: '#F9FAFB' }}>
                <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.6', whiteSpace: 'pre-wrap', fontFamily: '"Monaco", "Courier New", monospace' }}>
                  {TERMS_AND_CONDITIONS}
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ padding: '24px', borderTop: '1px solid #E2E8F0', background: 'white' }}>
                {/* Error Message */}
                {activationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: '#FEE2E2',
                      border: '1px solid #FECACA',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '16px',
                      color: '#991B1B',
                      fontSize: '13px',
                    }}
                  >
                    <AlertCircle size={16} />
                    {activationError}
                  </motion.div>
                )}

                {/* Agreement Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                  <input
                    type="checkbox"
                    id="terms-accept"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      setActivationError(null);
                    }}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#10B981',
                    }}
                  />
                  <label htmlFor="terms-accept" style={{ fontSize: '14px', color: '#0A1F2E', fontWeight: 600, cursor: 'pointer', margin: 0, flex: 1 }}>
                    I have read and agree to the terms and conditions. I authorize automatic weekly premium deduction from my wallet.
                  </label>
                </div>

                {/* Plan Summary */}
                {selectedPlan && (
                  <div style={{ background: selectedPlan.accentColor, border: `1px solid ${selectedPlan.color}20`, borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#5A7A8A', fontWeight: 600 }}>Plan: {selectedPlan.name}</span>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: selectedPlan.color }}>₹{selectedPlan.basePrice}/week</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#5A7A8A' }}>
                      <span>Coverage: ₹{selectedPlan.coverage.toLocaleString()}</span>
                      <span>Current Balance: ₹{walletBalance.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowTermsModal(false);
                      setTermsAccepted(false);
                      setActivationError(null);
                    }}
                    disabled={isActivating}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'transparent',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      color: '#5A7A8A',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: isActivating ? 'not-allowed' : 'pointer',
                      opacity: isActivating ? 0.6 : 1,
                      transition: 'all 0.3s',
                    }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleActivatePlan}
                    disabled={isActivating || !termsAccepted}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: termsAccepted ? 'linear-gradient(135deg, #10B981, #059669)' : 'linear-gradient(135deg, #D1D5DB, #9CA3AF)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: termsAccepted && !isActivating ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: isActivating ? 0.6 : 1,
                      transition: 'all 0.3s',
                    }}
                  >
                    {isActivating ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Activating...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Activate Plan
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Balance Modal */}
      <AnimatePresence>
        {showAddBalanceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              padding: '20px',
            }}
            onClick={() => {
              setShowAddBalanceModal(false);
              setAddBalanceAmount('');
              setActivationError(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: '20px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Modal Header */}
              <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AlertTriangle size={20} color="white" />
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A1F2E', margin: 0 }}>Insufficient Balance</h2>
                </div>
                <button
                  onClick={() => {
                    setShowAddBalanceModal(false);
                    setAddBalanceAmount('');
                    setActivationError(null);
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={20} color="#5A7A8A" />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '24px' }}>
                {/* Current Status */}
                <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <AlertTriangle size={20} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#92400E', marginBottom: '4px' }}>Current Balance: ₹{walletBalance.toFixed(2)}</div>
                    <div style={{ fontSize: '13px', color: '#B45309' }}>
                      {selectedPlan && `You need ₹${selectedPlan.basePrice} to activate ${selectedPlan.name}`}
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {activationError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: '#FEE2E2',
                      border: '1px solid #FECACA',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '16px',
                      color: '#991B1B',
                      fontSize: '13px',
                    }}
                  >
                    <AlertCircle size={16} />
                    {activationError}
                  </motion.div>
                )}

                {/* Input Fields */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#5A7A8A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount to Add</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F3F4F6', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '12px 16px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#0A1F2E' }}>₹</span>
                    <input
                      type="number"
                      value={addBalanceAmount}
                      onChange={(e) => setAddBalanceAmount(e.target.value)}
                      placeholder="0.00"
                      step="10"
                      min="0"
                      disabled={isAddingBalance}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#0A1F2E',
                      }}
                    />
                  </div>
                </div>

                {/* Quick Add Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '24px' }}>
                  {[50, 100, 200, 500].map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAddBalanceAmount(String(amount))}
                      disabled={isAddingBalance}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(18, 121, 168, 0.1)',
                        border: '1px solid rgba(18, 121, 168, 0.2)',
                        borderRadius: '10px',
                        color: '#1279A8',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: isAddingBalance ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: isAddingBalance ? 0.6 : 1,
                      }}
                    >
                      +₹{amount}
                    </motion.button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowAddBalanceModal(false);
                      setAddBalanceAmount('');
                      setActivationError(null);
                    }}
                    disabled={isAddingBalance}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'transparent',
                      border: '1px solid #E2E8F0',
                      borderRadius: '12px',
                      color: '#5A7A8A',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: isAddingBalance ? 'not-allowed' : 'pointer',
                      opacity: isAddingBalance ? 0.6 : 1,
                      transition: 'all 0.3s',
                    }}
                  >
                    Close
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddBalance}
                    disabled={isAddingBalance || !addBalanceAmount || parseFloat(addBalanceAmount) <= 0}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: !addBalanceAmount || parseFloat(addBalanceAmount) <= 0 ? 'linear-gradient(135deg, #D1D5DB, #9CA3AF)' : 'linear-gradient(135deg, #1279A8, #0E638C)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: 700,
                      fontSize: '14px',
                      cursor: (!addBalanceAmount || parseFloat(addBalanceAmount) <= 0 || isAddingBalance) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: isAddingBalance ? 0.6 : 1,
                      transition: 'all 0.3s',
                    }}
                  >
                    {isAddingBalance ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Add Balance
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Button - Only Show if No Model is Open */}
      {!showTermsModal && !showAddBalanceModal && (
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={onCancel}
            disabled={isActivating}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              color: '#5A7A8A',
              fontWeight: 600,
              cursor: isActivating ? 'not-allowed' : 'pointer',
              opacity: isActivating ? 0.6 : 1,
              transition: 'all 0.3s',
            }}
          >
            Skip for Now
          </button>
        </div>
      )}
    </div>
  );
}
