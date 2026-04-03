import sys
import re

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add motion import if not present
if "import { motion }" not in content:
    content = content.replace("import axios from 'axios';", "import axios from 'axios';\nimport { motion } from 'framer-motion';")

# Our new beautiful section
new_section = """        {/* Experience on the Go Section */}
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

            {/* Right Side - Creative 3D Phone Mockup */}
            <div style={{ flex: 0.9, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'radial-gradient(circle at center, rgba(0,103,138,0.06) 0%, transparent 70%)', minHeight: '700px' }}>
              
              {/* Abstract Circular Behind Phone */}
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 40, ease: "linear" }} style={{ position: 'absolute', width: '480px', height: '480px', border: '2px dashed rgba(0,103,138,0.15)', borderRadius: '50%', background: 'conic-gradient(from 0deg, transparent 0%, rgba(0,103,138,0.05) 25%, transparent 50%)', zIndex: 0 }}></motion.div>
              <div style={{ position: 'absolute', width: '380px', height: '380px', border: '1px solid rgba(0,103,138,0.1)', borderRadius: '50%', zIndex: 0 }}></div>

              {/* Floating Card 1: Payout */}
              <motion.div initial={{ opacity: 0, x: 50, y: -20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} viewport={{ once: true }} 
                 whileHover={{ scale: 1.05 }}
                 style={{ position: 'absolute', top: '22%', right: '-15px', background: 'white', padding: '16px 20px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,103,138,0.15)', zIndex: 3, display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(0,103,138,0.05)', cursor: 'pointer' }}>
                <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '12px' }}><CheckCircle size={24} color="#10b981" /></div>
                <div>
                   <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Payout Initiated</div>
                   <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#333' }}>+ ₹1,500 <span style={{fontSize: '0.8rem', fontWeight: 500}}>UPI</span></div>
                </div>
              </motion.div>

              {/* Floating Card 2: Risk Alert */}
              <motion.div initial={{ opacity: 0, x: -50, y: 20 }} whileInView={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} viewport={{ once: true }} 
                 whileHover={{ scale: 1.05 }}
                 style={{ position: 'absolute', bottom: '22%', left: '10px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', padding: '16px 20px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,103,138,0.15)', zIndex: 3, display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(0,103,138,0.05)', cursor: 'pointer' }}>
                <div style={{ background: '#fef2f2', padding: '10px', borderRadius: '12px' }}><AlertTriangle size={24} color="#ef4444" /></div>
                <div>
                   <div style={{ fontSize: '0.8rem', color: '#666', fontWeight: 600 }}>Risk Detected</div>
                   <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#333' }}>Heavy Rain Sector 4</div>
                </div>
              </motion.div>

              {/* Phone Frame wrapper with float animation */}
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }} style={{ position: 'relative', zIndex: 1, transform: 'rotate(5deg)' }}>
                <div style={{ width: '310px', height: '630px', background: '#111', borderRadius: '48px', padding: '10px', boxShadow: '0 30px 60px rgba(0,0,0,0.25), inset 0 0 10px rgba(255,255,255,0.4)', border: '2px solid rgba(255,255,255,0.2)' }}>
                  {/* Inner Screen */}
                  <div style={{ width: '100%', height: '100%', background: '#fff', borderRadius: '38px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                     {/* Dynamic Island */}
                     <div style={{ position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', width: '100px', height: '28px', background: '#000', borderRadius: '20px', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                       <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#111', border: '1px solid #333' }}></div>
                     </div>

                     {/* App Topbar */}
                     <div style={{ background: '#fdfdfd', padding: '50px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #00678a, #003366)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,103,138,0.2)' }}>
                           <User size={20} color="white" />
                         </div>
                         <div>
                           <div style={{ fontSize: '0.8rem', color: '#666', fontFamily: '"Poppins", sans-serif' }}>Partner Portal</div>
                           <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#333' }}>Live Status</div>
                         </div>
                       </div>
                       <div style={{ position: 'relative', background: '#f0f4f8', padding: '8px', borderRadius: '50%' }}>
                         <Bell size={20} color="#00678a" />
                         <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#ff3b30', borderRadius: '50%', border: '2px solid white' }}></div>
                       </div>
                     </div>

                     {/* App Content */}
                     <div style={{ padding: '20px', background: '#f8f9fa', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        {/* Active Coverage Glowing Card */}
                        <div style={{ background: 'linear-gradient(135deg, #00678a 0%, #004b66 100%)', borderRadius: '24px', padding: '24px', color: 'white', boxShadow: '0 12px 30px rgba(0, 103, 138, 0.3)', position: 'relative', overflow: 'hidden' }}>
                          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }} transition={{ repeat: Infinity, duration: 4 }} style={{ position: 'absolute', right: '-20px', bottom: '-20px' }}>
                            <ShieldCheck size={140} />
                          </motion.div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', position: 'relative' }}>
                             <div style={{ padding: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px' }}>
                               <ShieldCheck size={20} color="#FFC72C" />
                             </div>
                             <span style={{ fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.5px' }}>ACTIVE COVERAGE</span>
                          </div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: '2px', position: 'relative' }}>Current Weekly Floor</div>
                          <div style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '20px', letterSpacing: '-0.5px', position: 'relative' }}>₹8,000</div>
                          <button style={{ background: '#FFC72C', color: '#00678a', border: 'none', padding: '12px 16px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 800, width: '100%', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', position: 'relative' }}>Renew Policy</button>
                        </div>

                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#333', marginTop: '4px' }}>Essentials</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                           <div style={{ background: 'white', padding: '14px 8px', borderRadius: '18px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '14px' }}><Upload size={20} color="#3b82f6" /></div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#444' }}>Claim</div>
                           </div>
                           <div style={{ background: 'white', padding: '14px 8px', borderRadius: '18px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '14px' }}><Wallet size={20} color="#d97706" /></div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#444' }}>Wallet</div>
                           </div>
                           <div style={{ background: 'white', padding: '14px 8px', borderRadius: '18px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <div style={{ background: '#ecfdf5', padding: '12px', borderRadius: '14px' }}><Map size={20} color="#10b981" /></div>
                              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#444' }}>Zones</div>
                           </div>
                        </div>

                        <div style={{ background: 'white', padding: '16px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px' }}>
                           <div style={{ background: '#fef2f2', padding: '12px', borderRadius: '14px' }}>
                             <CloudRainWind size={22} color="#ef4444" />
                           </div>
                           <div>
                              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#333' }}>Heavy Rain Forecast</div>
                              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px', fontWeight: 500 }}>Severe • Next 2 hours</div>
                           </div>
                        </div>
                     </div>

                     {/* App Bottom Navbar */}
                     <div style={{ background: 'white', padding: '16px 20px 24px 20px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #f0f0f0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#00678a' }}>
                          <Activity size={22} /><span style={{ fontSize: '0.65rem', fontWeight: 800 }}>Home</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#ccc' }}>
                          <ShieldCheck size={22} /><span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Policies</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#ccc' }}>
                          <Wallet size={22} /><span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Wallet</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', color: '#ccc' }}>
                          <User size={22} /><span style={{ fontSize: '0.65rem', fontWeight: 600 }}>Profile</span>
                        </div>
                     </div>
                     {/* Home Indicator */}
                     <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', width: '35%', height: '4px', background: '#ccc', borderRadius: '2px' }}></div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>"""

# Extract the existing block and replace
start_idx = -1
end_idx = -1

lines = content.split('\n')
for i, line in enumerate(lines):
    if "{/* Experience on the Go Section */}" in line:
        start_idx = i
        break
        
if start_idx != -1:
    # Need to find the end of it
    # We look for the next section start "WHY CHOOSE AEGIS" or just hardcode the end since we know it's right above it.
    for i in range(start_idx + 1, len(lines)):
        if "{/* Why Choose AEGIS Section */}" in line:
            # We want to replace from start_idx to i-1
            end_idx = i - 1
            break
            
    if end_idx != -1:
        # replace lines
        lines[start_idx:end_idx] = new_section.split('\n')
        content = '\n'.join(lines)
        with open('src/App.jsx', 'w', encoding='utf-8') as f:
            f.write(content)
        print("Successfully beautified section.")
    else:
        # if the comment is lost, fallback to an absolute replace?
        print("Could not find the end of the section by looking for WHY CHOOSE AEGIS.")
else:
    print("Could not find start of the block.")
