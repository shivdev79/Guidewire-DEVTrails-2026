import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const testimonials = [
  {
    quote: "During heavy rain in Chennai, I couldn’t complete deliveries for hours. Aegis automatically credited ₹480 to my UPI. No forms, no stress — it just worked.",
    name: "Rajesh K.",
    role: "Swiggy Delivery Partner",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    quote: "Usually when the platform crashes, we earn nothing. But with Aegis, I still got paid. It feels like someone has my back.",
    name: "Arun M.",
    role: "Zepto Rider",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 5
  },
  {
    quote: "In 42°C heat, I logged off early. Aegis still compensated me. This is not insurance — this is real support.",
    name: "Karthik S.",
    role: "Zomato Partner",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 4
  },
  {
    quote: "I didn’t even know a claim was processed until the money came. Aegis works silently in the background.",
    name: "Naveen R.",
    role: "Blinkit Rider",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    rating: 5
  },
  {
    quote: "Aegis warned me about a flooded area and I avoided it. Got a discount next week too. That’s smart protection.",
    name: "Praveen T.",
    role: "Dunzo Partner",
    image: "https://randomuser.me/api/portraits/men/84.jpg",
    rating: 4
  },
  {
    quote: "There was one evening where I was online but barely got any orders. I just assumed it was a slow day. Later I saw a payout from Aegis. I hadn’t done anything for it, so that was unexpected.",
    name: "Imran S.",
    role: "Swiggy Instamart",
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    rating: 5
  },
  {
    quote: "I joined Aegis just to try it out. Didn’t really think about it after that. A few days later, I got a credit and had to check where it came from. That’s when it clicked.",
    name: "Manoj P.",
    role: "Zepto Rider",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    rating: 4
  },
  {
    quote: "Traffic was really bad due to some local issue and I couldn’t complete many deliveries. I thought the whole shift was a waste, but later I saw some compensation. That helped.",
    name: "Suresh V.",
    role: "Zomato Partner",
    image: "https://randomuser.me/api/portraits/men/35.jpg",
    rating: 5
  },
  {
    quote: "What I liked is I didn’t have to raise anything manually. Usually these things take time, but here it just happened on its own.",
    name: "Dinesh R.",
    role: "Blinkit Rider",
    image: "https://randomuser.me/api/portraits/men/36.jpg",
    rating: 5
  },
  {
    quote: "I’ve had days where I’m just waiting with no orders coming in. One of those days, I later noticed a credit. It’s small, but it makes a difference.",
    name: "Akash K.",
    role: "Swiggy Delivery Partner",
    image: "https://randomuser.me/api/portraits/men/37.jpg",
    rating: 4
  },
  {
    quote: "I wasn’t expecting much when I signed up. But after seeing how it works without any effort from my side, I feel it’s worth keeping.",
    name: "Rahul N.",
    role: "Dunzo Partner",
    image: "https://randomuser.me/api/portraits/men/38.jpg",
    rating: 5
  },
  {
    quote: "The app gave an alert about a problem area, so I avoided it. Didn’t think much of it then, but later I realized it actually helped me avoid getting stuck.",
    name: "Kiran M.",
    role: "Zepto Rider",
    image: "https://randomuser.me/api/portraits/men/39.jpg",
    rating: 4
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 3));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev < testimonials.length - 3 ? prev + 1 : 0));
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev < testimonials.length - 3 ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 3);

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '80px auto', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{ color: '#FFC72C', fontWeight: 800, letterSpacing: '1px', marginBottom: '16px' }}>REAL STORIES</div>
        <h2 style={{ fontSize: '2.6rem', color: '#00678a', marginBottom: '16px', fontWeight: 800 }}>
          Loved by Gig Workers
        </h2>
        <p style={{ color: '#666666', fontFamily: '"Poppins", sans-serif', fontSize: '1.15rem', margin: '0 auto', maxWidth: '700px', lineHeight: 1.6 }}>
          Hear what our partners have to say about Aegis empowering them when it matters the most.
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
        <button className="slider-arrow" onClick={prevSlide}>
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>

        <div style={{ display: 'flex', gap: '30px', overflow: 'visible', padding: '40px 10px', width: '100%' }}>
          <AnimatePresence mode="popLayout">
            {visibleTestimonials.map((item, idx) => (
              <motion.div
                key={item.name + currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                className={`testimonial-card ${idx === 1 ? 'middle-card' : ''}`}
                style={{
                  flex: 1,
                  minWidth: '320px'
                }}
              >
                <div>
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={18} fill={i < (item.rating || 5) ? "#f5b301" : "none"} color={i < (item.rating || 5) ? "#f5b301" : "#e0e0e0"} />
                    ))}
                  </div>
                  <p className="testimonial-text">
                    "{item.quote}"
                  </p>
                </div>
                
                <div className="author">
                  <img src={item.image} alt={item.name} className="avatar" />
                  <div>
                    <div className="author-name">{item.name}</div>
                    <div className="author-role">{item.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button className="slider-arrow" onClick={nextSlide}>
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
        {Array.from({ length: testimonials.length - 2 }).map((_, idx) => (
          <div
            key={idx}
            className={`dot ${currentIndex === idx ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>

      <style>{`
        .testimonial-card {
          background: #fff;
          border-radius: 20px;
          padding: 32px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          border: 1px solid rgba(0,0,0,0.03);
          overflow: hidden;
        }

        .testimonial-card::before {
          content: "“";
          font-family: serif;
          font-size: 140px;
          color: rgba(0,0,0,0.03);
          position: absolute;
          top: -20px;
          left: 10px;
          line-height: 1;
        }

        .testimonial-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(0,0,0,0.1);
        }
        
        .middle-card {
          transform: scale(1.05);
          box-shadow: 0 16px 40px rgba(0,103,138,0.1);
          z-index: 2;
          border: 1px solid rgba(0, 103, 138, 0.1);
        }

        .middle-card:hover {
          transform: scale(1.05) translateY(-6px);
        }

        .stars {
          display: flex;
          gap: 4px;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        
        .testimonial-text {
          font-family: "Poppins", sans-serif;
          font-size: 1.05rem;
          line-height: 1.7;
          color: #444;
          font-style: italic;
          margin: 0 0 32px 0;
          position: relative;
          z-index: 1;
        }

        .author {
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 2px solid #f0f0f0;
          object-fit: cover;
        }

        .author-name {
          font-family: "Poppins", sans-serif;
          font-weight: 600;
          color: #222;
          font-size: 1rem;
        }

        .author-role {
          font-family: "Poppins", sans-serif;
          font-size: 0.8rem;
          color: #888;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 4px;
        }

        .slider-arrow {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid #eaeaea;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
          cursor: pointer;
          color: #00678a;
          transition: all 0.3s ease;
          flex-shrink: 0;
          z-index: 10;
        }

        .slider-arrow:hover {
          background: #00678a;
          color: white;
          border-color: #00678a;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 103, 138, 0.2);
        }

        .dot {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          border-radius: 50%;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .dot.active {
          width: 28px;
          border-radius: 4px;
          background: #00678a;
        }
      `}</style>
    </div>
  );
}
