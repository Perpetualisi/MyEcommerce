import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const slides = [
  {
    category: "Fashion",
    label: "Clothing & Apparel",
    accent: "#C9A96E",
    bg: "radial-gradient(ellipse at 60% 50%, rgba(201,169,110,0.13) 0%, transparent 70%)",
    emojis: [
      { e: "🧥", size: 110, x: 50, y: 38, delay: 0,    dur: 5.2 },
      { e: "👟", size: 72,  x: 22, y: 65, delay: 0.6,  dur: 6.1 },
      { e: "👜", size: 68,  x: 74, y: 68, delay: 1.1,  dur: 5.7 },
      { e: "🧣", size: 54,  x: 30, y: 22, delay: 0.3,  dur: 6.5 },
      { e: "🕶️", size: 50,  x: 72, y: 20, delay: 0.9,  dur: 5.9 },
      { e: "👒", size: 44,  x: 14, y: 42, delay: 1.4,  dur: 6.3 },
    ],
  },
  {
    category: "Electronics",
    label: "Tech & Gadgets",
    accent: "#6EC9C9",
    bg: "radial-gradient(ellipse at 60% 50%, rgba(110,201,201,0.13) 0%, transparent 70%)",
    emojis: [
      { e: "💻", size: 110, x: 50, y: 40, delay: 0,    dur: 5.0 },
      { e: "📱", size: 70,  x: 24, y: 64, delay: 0.7,  dur: 6.2 },
      { e: "🎧", size: 72,  x: 75, y: 62, delay: 1.0,  dur: 5.6 },
      { e: "⌚", size: 52,  x: 28, y: 22, delay: 0.4,  dur: 6.4 },
      { e: "📷", size: 54,  x: 73, y: 20, delay: 1.2,  dur: 5.8 },
      { e: "🖱️", size: 42,  x: 14, y: 44, delay: 0.8,  dur: 6.6 },
    ],
  },
  {
    category: "Furniture",
    label: "Home & Living",
    accent: "#B89A7A",
    bg: "radial-gradient(ellipse at 60% 50%, rgba(184,154,122,0.13) 0%, transparent 70%)",
    emojis: [
      { e: "🛋️", size: 115, x: 50, y: 40, delay: 0,    dur: 5.4 },
      { e: "🪑", size: 68,  x: 22, y: 65, delay: 0.6,  dur: 6.0 },
      { e: "🛏️", size: 70,  x: 76, y: 64, delay: 1.1,  dur: 5.7 },
      { e: "🪞", size: 50,  x: 30, y: 20, delay: 0.3,  dur: 6.5 },
      { e: "🪴", size: 52,  x: 72, y: 18, delay: 1.0,  dur: 5.9 },
      { e: "🕯️", size: 40,  x: 13, y: 44, delay: 1.5,  dur: 6.3 },
    ],
  },
  {
    category: "Groceries",
    label: "Artisan & Fresh",
    accent: "#7EBF7A",
    bg: "radial-gradient(ellipse at 60% 50%, rgba(126,191,122,0.13) 0%, transparent 70%)",
    emojis: [
      { e: "🧺", size: 105, x: 50, y: 40, delay: 0,    dur: 5.1 },
      { e: "🥑", size: 65,  x: 23, y: 64, delay: 0.7,  dur: 6.2 },
      { e: "🍞", size: 68,  x: 75, y: 63, delay: 1.0,  dur: 5.8 },
      { e: "🫙", size: 52,  x: 29, y: 20, delay: 0.4,  dur: 6.4 },
      { e: "🧀", size: 50,  x: 73, y: 19, delay: 1.2,  dur: 5.6 },
      { e: "🍋", size: 42,  x: 14, y: 43, delay: 0.9,  dur: 6.7 },
    ],
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (index === current) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(index);
      setTransitioning(false);
    }, 420);
  }, [current]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo]);

  useEffect(() => {
    const interval = setInterval(next, 5800);
    return () => clearInterval(interval);
  }, [next]);

  const slide = slides[current];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Overpass+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .hero-root { font-family: 'Overpass Mono', monospace; }

        .hero-section {
          width: 100%; height: 100vh; min-height: 600px;
          display: grid; grid-template-columns: 54% 46%;
          background: #080705; overflow: hidden;
        }

        /* MOBILE: stack vertically, text top, emoji bottom */
        @media (max-width: 768px) {
          .hero-section {
            grid-template-columns: 1fr;
            grid-template-rows: 58% 42%;
            min-height: 100svh;
          }
        }

        /* LEFT */
        .left-panel {
          position: relative; display: flex; flex-direction: column;
          justify-content: center; padding: 0 6vw; z-index: 10;
        }
        @media (max-width: 768px) {
          .left-panel { padding: 0 7vw; justify-content: flex-end; padding-bottom: 28px; }
        }

        .counter {
          font-size: 9px; letter-spacing: 0.45em;
          color: rgba(255,255,255,0.22); margin-bottom: 36px;
          display: flex; align-items: center; gap: 14px;
        }
        @media (max-width: 768px) {
          .counter { margin-bottom: 20px; }
        }

        .eyebrow {
          font-size: 9px; letter-spacing: 0.55em;
          text-transform: uppercase; margin-bottom: 18px;
        }
        @media (max-width: 768px) {
          .eyebrow { font-size: 8px; margin-bottom: 14px; }
        }

        /* ── HEADLINE: always exactly 2 lines ── */
        .headline {
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: -0.025em;
          color: #fff;
          margin-bottom: 24px;
          /* line 1: "Everything for" — line 2: "Modern Living." */
          font-size: clamp(32px, 4.6vw, 86px);
          white-space: nowrap; /* prevent reflow inside each line */
        }
        /* On small screens we allow a controlled font-size so both lines fit */
        @media (max-width: 768px) {
          .headline {
            font-size: clamp(28px, 9.5vw, 48px);
            white-space: normal;
          }
        }
        @media (max-width: 380px) {
          .headline { font-size: 7.8vw; }
        }

        .headline em {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-weight: 300; color: rgba(255,255,255,0.58);
        }

        .subline {
          font-size: 10.5px; line-height: 1.95; color: rgba(255,255,255,0.27);
          max-width: 340px; margin-bottom: 44px; letter-spacing: 0.04em;
        }
        @media (max-width: 768px) {
          .subline { font-size: 10px; margin-bottom: 30px; max-width: 100%; }
        }

        .cta-row { display: flex; gap: 14px; flex-wrap: wrap; }
        @media (max-width: 380px) {
          .cta-row { flex-direction: column; gap: 10px; }
          .cta-row a, .cta-row button { width: 100%; text-align: center; }
        }

        .btn-fill {
          padding: 16px 38px; font-family: 'Overpass Mono', monospace;
          font-size: 8.5px; letter-spacing: 0.38em; text-transform: uppercase;
          text-decoration: none; border: none; cursor: pointer;
          display: inline-block; color: #080705;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        @media (max-width: 768px) {
          .btn-fill { padding: 14px 28px; }
        }
        .btn-fill:hover { transform: translateY(-2px); box-shadow: 0 14px 44px rgba(0,0,0,0.5); }

        .btn-outline {
          padding: 15px 38px; border: 1px solid rgba(255,255,255,0.13);
          color: rgba(255,255,255,0.42); font-family: 'Overpass Mono', monospace;
          font-size: 8.5px; letter-spacing: 0.38em; text-transform: uppercase;
          text-decoration: none; background: transparent; cursor: pointer;
          display: inline-block; transition: border-color 0.3s, color 0.3s;
        }
        @media (max-width: 768px) {
          .btn-outline { padding: 13px 28px; }
        }
        .btn-outline:hover { border-color: rgba(255,255,255,0.5); color: rgba(255,255,255,0.9); }

        .dots {
          position: absolute; bottom: 42px; left: 6vw; display: flex; gap: 8px;
        }
        @media (max-width: 768px) {
          .dots { bottom: 16px; left: 7vw; }
        }
        .dot { height: 1px; cursor: pointer; transition: width 0.5s ease, background 0.5s ease; }

        /* RIGHT */
        .right-panel {
          position: relative; display: flex; align-items: center;
          justify-content: center; border-left: 1px solid rgba(255,255,255,0.05);
          overflow: hidden; background: #080705;
        }
        @media (max-width: 768px) {
          .right-panel { border-left: none; border-top: 1px solid rgba(255,255,255,0.05); }
        }

        .grid-lines {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
          background-size: 52px 52px;
        }
        .ring {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.05); z-index: 2;
        }

        /* Emoji items */
        .emoji-field { position: absolute; inset: 0; z-index: 10; }
        .emoji-item {
          position: absolute; line-height: 1; user-select: none;
          filter: drop-shadow(0 8px 32px rgba(0,0,0,0.55));
          transform-origin: center bottom;
        }

        .right-label {
          position: absolute; top: 24px; right: 24px;
          font-size: 8px; letter-spacing: 0.55em; text-transform: uppercase;
          z-index: 30; font-family: 'Overpass Mono', monospace;
        }
        @media (max-width: 768px) {
          .right-label { top: 16px; right: 16px; font-size: 7px; }
        }

        .vertical-text {
          position: absolute; bottom: 40px; right: -12px;
          transform: rotate(90deg); transform-origin: bottom right;
          font-size: 7.5px; letter-spacing: 0.6em; text-transform: uppercase;
          color: rgba(255,255,255,0.09); white-space: nowrap; z-index: 20;
          font-family: 'Overpass Mono', monospace;
        }
        @media (max-width: 768px) { .vertical-text { display: none; } }

        /* Page-load stagger */
        .fi { opacity: 0; transform: translateY(18px); animation: fadeUp 0.85s ease forwards; }
        .fd1 { animation-delay: 0.1s; } .fd2 { animation-delay: 0.25s; }
        .fd3 { animation-delay: 0.4s; } .fd4 { animation-delay: 0.55s; }
        .fd5 { animation-delay: 0.7s; }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }

        @keyframes floatA {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%      { transform: translateY(-14px) rotate(2deg); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px) rotate(1.5deg); }
          50%      { transform: translateY(-18px) rotate(-1.5deg); }
        }
        @keyframes floatC {
          0%,100% { transform: translateY(0px) rotate(-1deg); }
          50%      { transform: translateY(-10px) rotate(2.5deg); }
        }
        @keyframes floatD {
          0%,100% { transform: translateY(0px) rotate(2deg); }
          50%      { transform: translateY(-12px) rotate(-2deg); }
        }
        @keyframes floatE {
          0%,100% { transform: translateY(0px) rotate(-1.5deg); }
          50%      { transform: translateY(-16px) rotate(1deg); }
        }
        @keyframes floatF {
          0%,100% { transform: translateY(0px) rotate(1deg); }
          50%      { transform: translateY(-8px) rotate(-2deg); }
        }
      `}</style>

      <div className="hero-root">
        <section className="hero-section">

          {/* ── LEFT PANEL ── */}
          <div className="left-panel">
            <div className="counter fi fd1">
              <div style={{ width: 28, height: 1, background: slide.accent, transition: 'background 0.8s ease', flexShrink: 0 }} />
              <span>0{current + 1} — 0{slides.length}</span>
            </div>

            <div className="eyebrow fi fd2" style={{
              color: slide.accent,
              transition: 'color 0.8s ease, opacity 0.35s ease, transform 0.35s ease',
              opacity: transitioning ? 0 : 1,
              transform: `translateY(${transitioning ? '8px' : '0'})`,
            }}>
              {slide.category} Collection
            </div>

            <h1 className="headline fi fd3" style={{
              opacity: transitioning ? 0 : 1,
              transform: `translateY(${transitioning ? '14px' : '0'})`,
              transition: 'opacity 0.38s ease 0.04s, transform 0.38s ease 0.04s',
            }}>
              Everything for<br />
              <em>Modern Living.</em>
            </h1>

            <p className="subline fi fd4" style={{
              opacity: transitioning ? 0 : 1,
              transition: 'opacity 0.38s ease 0.08s',
            }}>
              Artisan groceries, curated tech, slow-fashion, and bespoke furniture —
              an intentional archive for every aspect of your day.
            </p>

            <div className="cta-row fi fd5">
              <Link to="/shop">
                <button className="btn-fill" style={{ background: slide.accent, transition: 'background 0.8s ease, transform 0.2s, box-shadow 0.2s' }}>
                  Browse Collection
                </button>
              </Link>
              <Link to="/categories">
                <button className="btn-outline">View Categories</button>
              </Link>
            </div>

            <div className="dots">
              {slides.map((s, i) => (
                <div key={i} className="dot" style={{
                  width: i === current ? '38px' : '13px',
                  background: i === current ? slide.accent : 'rgba(255,255,255,0.14)',
                }} onClick={() => goTo(i)} />
              ))}
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="right-panel">
            {/* Ambient glow */}
            <div style={{ position: 'absolute', inset: 0, background: slide.bg, transition: 'background 0.9s ease' }} />
            <div className="grid-lines" />
            <div className="ring" style={{ width: 'min(46vw, 400px)', height: 'min(46vw, 400px)' }} />
            <div className="ring" style={{ width: 'min(27vw, 240px)', height: 'min(27vw, 240px)' }} />

            {/* Emoji constellation */}
            <div className="emoji-field">
              {slide.emojis.map((item, i) => {
                const floatAnims = ['floatA','floatB','floatC','floatD','floatE','floatF'];
                // Scale emoji size: full on desktop, ~55% on mobile (≤768px)
                const scaledSize = `clamp(${Math.round(item.size * 0.42)}px, ${(item.size / 1440 * 100).toFixed(2)}vw + ${(item.size / 900 * 100).toFixed(2)}vh, ${item.size}px)`;
                return (
                  <div
                    key={`${current}-${i}`}
                    className="emoji-item"
                    style={{
                      fontSize: scaledSize,
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: 'translate(-50%, -50%)',
                      animation: transitioning
                        ? 'none'
                        : `${floatAnims[i]} ${item.dur}s ease-in-out ${item.delay}s infinite`,
                      opacity: transitioning ? 0 : 1,
                      transition: `opacity 0.4s ease ${item.delay * 0.15}s`,
                    }}
                  >
                    {item.e}
                  </div>
                );
              })}
            </div>

            {/* Label */}
            <div className="right-label" style={{
              color: slide.accent,
              transition: 'color 0.8s ease, opacity 0.35s ease',
              opacity: transitioning ? 0 : 1,
            }}>
              {slide.label}
            </div>

            <div className="vertical-text">Universal Archive · 2026 Edition</div>
          </div>

        </section>
      </div>
    </>
  );
};

export default Hero;