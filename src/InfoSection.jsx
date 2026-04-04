import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, ShieldAlert, Settings, Search, AlertTriangle } from 'lucide-react';

const slides = [
  {
    title: "Smart Protection",
    text: (
      <>
        Aegis continuously analyzes risk factors like severe weather or system outages. Upon detecting a disruption, it automatically processes your compensation.<br/><br/>
        This eliminates delays and manual reporting, letting you focus entirely on your work.
      </>
    ),
    icon: <ShieldAlert size={40} color="#ff8c00" />
  },
  {
    title: "How It Works",
    text: (
      <>
        Once enrolled, Aegis runs silently alongside your work. There's no need to file claims or submit proof manually. The system detects qualifying events automatically.<br/><br/>
        Compensation is then directly credited through your integrated payment system.
      </>
    ),
    icon: <Settings size={40} color="#ff8c00" />
  },
  {
    title: "Transparency & Trust",
    text: (
      <>
        All payouts use predefined conditions and verified data sources, with zero additional fees or third-party interventions.<br/><br/>
        Users receive real-time notifications for every transaction, ensuring complete transparency.
      </>
    ),
    icon: <Search size={40} color="#ff8c00" />
  },
  {
    title: "Safety & Awareness",
    text: (
      <>
        Aegis provides proactive alerts for high-risk situations like extreme weather or unsafe zones to help you make safer decisions.<br/><br/>
        We prioritize your security and keep you informed before you take on a risk.
      </>
    ),
    icon: <AlertTriangle size={40} color="#ff8c00" />
  }
];

export default function InfoSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds timeline

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      width: '100%',
      background: '#f9f9f9',
      padding: '30px 20px',
      borderTop: '1px solid #eaeaea',
      borderBottom: '1px solid #eaeaea',
      marginTop: '60px',
      marginBottom: '30px'
    }}>
      <div className="info-container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: '40px',
        alignItems: 'stretch'
      }}>
        
        {/* Left Side: About the company */}
        <div className="about-card" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          height: '100%',
          borderRight: '1px solid #eaeaea',
          paddingRight: '40px',
          margin: 0
        }}>
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{
              width: '40px', height: '40px',
              borderRadius: '50%',
              background: '#fff',
              border: '2px solid #ff8c00',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Building size={20} color="#00678a" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#333', margin: 0, fontFamily: '"Montserrat", sans-serif' }}>
              About the company
            </h3>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6, fontFamily: '"Poppins", sans-serif', margin: '0 0 10px 0' }}>
            Aegis supports gig workers with automated financial protection during unexpected work disruptions. It continuously monitors weather, platform outages, and low-demand periods to identify risks in real time.
          </p>
          <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6, fontFamily: '"Poppins", sans-serif', margin: '0 0 10px 0' }}>
            Through data intelligence, Aegis automatically ensures you receive timely compensation, removing the need for manual claims and adding stability to your income.
          </p>
        </div>

        {/* Right Side: Slider */}
        <div className="about-card" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          height: '100%',
          margin: 0,
          padding: 0,
          position: 'relative'
        }}>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
                    {slides[currentSlide].icon}
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 400, color: '#333', margin: 0, fontFamily: '"Montserrat", sans-serif' }}>
                    {slides[currentSlide].title}
                  </h3>
                </div>
                <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6, fontFamily: '"Poppins", sans-serif', margin: '0 0 10px 0' }}>
                  {slides[currentSlide].text}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination Indicators */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', marginTop: 'auto', paddingTop: '20px' }}>
            {slides.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  width: currentSlide === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: currentSlide === idx ? '#ff8c00' : '#d1d5db',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .info-container {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .about-card:first-child {
            border-right: none !important;
            padding-right: 0 !important;
            border-bottom: 1px solid #eaeaea;
            padding-bottom: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
