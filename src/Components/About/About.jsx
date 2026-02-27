import React, { useEffect, useRef } from 'react';
import { ArrowUpRight, Terminal, Cpu, Box, Compass, Layers } from 'lucide-react';

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ab-root {
    font-family: 'Overpass Mono', monospace;
    background: #080705;
    color: #e8e4dd;
    padding: 120px 6vw;
    border-top: 1px solid rgba(255,255,255,0.05);
    position: relative;
    overflow: hidden;
  }

  /* Background accent panel — right half */
  .ab-bg-accent {
    position: absolute;
    top: 0; right: -8%; bottom: 0;
    width: 52%;
    background: #0c0a09;
    transform: skewX(-4deg);
    z-index: 0;
    pointer-events: none;
  }

  .ab-inner {
    max-width: 1440px;
    margin: 0 auto;
    position: relative; z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10vw;
    align-items: center;
  }
  @media (max-width: 900px) {
    .ab-inner { grid-template-columns: 1fr; gap: 64px; }
  }

  /* ── LEFT — IMAGE SIDE ── */
  .ab-img-col {
    position: relative;
    opacity: 0; transform: translateX(-24px);
  }
  .ab-img-col.revealed {
    animation: abSlideL 0.9s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes abSlideL { to { opacity:1; transform:translateX(0); } }

  /* Ghost number watermark */
  .ab-ghost-num {
    position: absolute;
    top: -48px; left: -24px;
    font-size: clamp(120px,14vw,200px);
    font-weight: 600;
    color: rgba(255,255,255,0.022);
    line-height: 1;
    pointer-events: none;
    user-select: none;
    letter-spacing: -0.04em;
  }

  /* Image frame */
  .ab-img-frame {
    position: relative; z-index: 1;
    aspect-ratio: 4/5;
    overflow: hidden;
    background: #111008;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .ab-img {
    width: 100%; height: 100%;
    object-fit: cover;
    filter: grayscale(0.4) brightness(0.7);
    transform: scale(1.03);
    transition:
      transform 2.2s cubic-bezier(0.25,0.46,0.45,0.94),
      filter 1.4s ease;
    display: block;
  }
  .ab-img-frame:hover .ab-img {
    transform: scale(1.09);
    filter: grayscale(0) brightness(0.88);
  }

  /* Noise overlay */
  .ab-img-noise {
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
    opacity: 0.14;
    pointer-events: none;
  }

  /* Data badge */
  .ab-badge {
    position: absolute;
    bottom: -36px; right: -24px;
    background: #141210;
    border: 1px solid rgba(255,255,255,0.08);
    padding: 22px 24px;
    min-width: 210px;
    z-index: 2;
    box-shadow: 0 24px 60px rgba(0,0,0,0.55);
    opacity: 0; transform: scale(0.92);
  }
  .ab-badge.revealed {
    animation: abBadge 0.7s cubic-bezier(0.16,1,0.3,1) 0.45s both;
  }
  @keyframes abBadge { to { opacity:1; transform:scale(1); } }
  @media (max-width: 900px) { .ab-badge { display: none; } }

  .ab-badge-header {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px;
  }
  .ab-badge-header-text {
    font-size: 7.5px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.25);
  }
  .ab-badge-main {
    font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase;
    color: #fff; margin-bottom: 6px;
  }
  .ab-badge-sub {
    font-size: 8.5px; letter-spacing: 0.25em;
    color: rgba(255,255,255,0.25);
  }
  .ab-badge-divider {
    height: 1px; background: rgba(255,255,255,0.06);
    margin: 14px 0;
  }
  .ab-badge-stat {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase;
  }
  .ab-badge-stat-label { color: rgba(255,255,255,0.25); }
  .ab-badge-stat-val { color: #C9A96E; }

  /* ── RIGHT — CONTENT SIDE ── */
  .ab-content-col {
    opacity: 0; transform: translateX(24px);
  }
  .ab-content-col.revealed {
    animation: abSlideR 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s both;
  }
  @keyframes abSlideR { to { opacity:1; transform:translateX(0); } }

  .ab-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
  .ab-eyebrow-line { width: 28px; height: 1px; background: #C9A96E; flex-shrink: 0; }
  .ab-eyebrow-text {
    font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase;
    color: rgba(255,255,255,0.3);
  }

  .ab-title {
    font-size: clamp(36px,4.5vw,72px); font-weight: 300;
    letter-spacing: -0.025em; line-height: 1.06; color: #fff;
    margin-bottom: 40px;
  }
  .ab-title em {
    font-family: 'Cormorant Garamond', serif; font-style: italic;
    color: rgba(255,255,255,0.4);
  }

  .ab-quote {
    font-family: 'Cormorant Garamond', serif; font-style: italic;
    font-size: clamp(14px,1.4vw,18px); line-height: 1.85;
    color: rgba(255,255,255,0.42); letter-spacing: 0.01em;
    border-left: 1px solid rgba(201,169,110,0.3);
    padding-left: 20px; margin-bottom: 28px;
  }
  .ab-body {
    font-size: 10px; line-height: 2.1;
    color: rgba(255,255,255,0.32); letter-spacing: 0.05em;
    max-width: 480px; margin-bottom: 48px;
  }

  /* ── STAT STRIP ── */
  .ab-stats {
    display: grid; grid-template-columns: repeat(3,1fr); gap: 2px;
    margin-bottom: 52px;
  }
  .ab-stat {
    background: #0d0b09; padding: 20px 16px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .ab-stat-num {
    font-size: clamp(22px,2.5vw,34px); font-weight: 600;
    color: #C9A96E; letter-spacing: -0.02em; line-height: 1;
  }
  .ab-stat-label {
    font-size: 7.5px; letter-spacing: 0.42em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); line-height: 1.5;
  }

  /* ── CATEGORY PILLARS ── */
  .ab-divider { height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 40px; }
  .ab-pillars { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
  .ab-pillar {
    padding: 20px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: flex-start; gap: 14px;
    cursor: default;
    transition: background 0.3s;
  }
  .ab-pillar:nth-child(odd) { padding-right: 24px; border-right: 1px solid rgba(255,255,255,0.05); }
  .ab-pillar:nth-child(even) { padding-left: 24px; }
  .ab-pillar:nth-last-child(-n+2) { border-bottom: none; }
  .ab-pillar:hover .ab-pillar-icon { color: #C9A96E; }
  .ab-pillar:hover .ab-pillar-line { width: 32px; }
  .ab-pillar-icon { color: rgba(255,255,255,0.2); flex-shrink: 0; margin-top: 2px; transition: color 0.3s; }
  .ab-pillar-body { display: flex; flex-direction: column; gap: 8px; }
  .ab-pillar-label {
    font-size: 9px; letter-spacing: 0.42em; text-transform: uppercase;
    color: rgba(255,255,255,0.65); transition: letter-spacing 0.4s;
  }
  .ab-pillar:hover .ab-pillar-label { letter-spacing: 0.52em; }
  .ab-pillar-line {
    height: 1px; width: 14px; background: rgba(255,255,255,0.15);
    transition: width 0.45s ease;
  }

  /* ── CTA ── */
  .ab-cta-row {
    display: flex; align-items: center; gap: 20px; margin-top: 48px;
  }
  .ab-cta {
    display: inline-flex; align-items: center; gap: 14px;
    font-size: 8.5px; letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(255,255,255,0.4); background: none; border: none;
    cursor: pointer; font-family: 'Overpass Mono', monospace;
    transition: color 0.3s;
  }
  .ab-cta:hover { color: rgba(255,255,255,0.9); }
  .ab-cta-box {
    width: 36px; height: 36px;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.3s, border-color 0.3s, transform 0.3s;
  }
  .ab-cta:hover .ab-cta-box {
    background: rgba(201,169,110,0.1);
    border-color: rgba(201,169,110,0.3);
    transform: translateX(4px);
  }
  .ab-cta-rule { flex: 1; height: 1px; background: rgba(255,255,255,0.05); }

  @media (max-width: 480px) {
    .ab-root { padding: 80px 5vw; }
    .ab-stats { grid-template-columns: 1fr 1fr; }
    .ab-pillars { grid-template-columns: 1fr; }
    .ab-pillar:nth-child(odd) { border-right: none; padding-right: 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .ab-pillar:nth-child(even) { padding-left: 0; }
  }
`;

const PILLARS = [
  { label: 'Technical Gear',   icon: Cpu },
  { label: 'Domestic Objects', icon: Box },
  { label: 'Artisan Goods',    icon: Compass },
  { label: 'Core Attire',      icon: Layers },
];

const STATS = [
  { num: '60',   label: 'Curated\nObjects' },
  { num: '190+', label: 'Countries\nShipped' },
  { num: '4.9',  label: 'Avg.\nRating' },
];

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
const About = () => {
  const imgRef     = useRef(null);
  const badgeRef   = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const els = [
      { el: imgRef.current,     cls: 'revealed' },
      { el: badgeRef.current,   cls: 'revealed' },
      { el: contentRef.current, cls: 'revealed' },
    ];

    const observers = els.map(({ el, cls }) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { el.classList.add(cls); obs.disconnect(); } },
        { threshold: 0.1 }
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <section id="about" className="ab-root">
        <div className="ab-bg-accent" />

        <div className="ab-inner">

          {/* ── LEFT: IMAGE ── */}
          <div ref={imgRef} className="ab-img-col">
            <span className="ab-ghost-num">01</span>

            <div className="ab-img-frame">
              <img
                className="ab-img"
                src="https://images.pexels.com/photos/447592/pexels-photo-447592.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="The Vendo Archive Space"
                loading="lazy"
              />
              <div className="ab-img-noise" />
            </div>

            {/* Floating data badge */}
            <div ref={badgeRef} className="ab-badge">
              <div className="ab-badge-header">
                <Terminal size={11} style={{ color: 'rgba(255,255,255,0.25)' }} />
                <span className="ab-badge-header-text">System Log</span>
              </div>
              <p className="ab-badge-main">EST. Q1 — MMXXVI</p>
              <p className="ab-badge-sub">LOC: US-NY-HUB // 40.7128° N</p>
              <div className="ab-badge-divider" />
              <div className="ab-badge-stat">
                <span className="ab-badge-stat-label">Status</span>
                <span className="ab-badge-stat-val">Operational</span>
              </div>
              <div className="ab-badge-stat" style={{ marginTop: 6 }}>
                <span className="ab-badge-stat-label">Archive</span>
                <span className="ab-badge-stat-val">Active</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: CONTENT ── */}
          <div ref={contentRef} className="ab-content-col">

            <div className="ab-eyebrow">
              <div className="ab-eyebrow-line" />
              <span className="ab-eyebrow-text">The Narrative</span>
            </div>

            <h2 className="ab-title">
              Intentional living<br />
              <em>re-indexed.</em>
            </h2>

            <p className="ab-quote">
              "The world has enough products, but it suffers from a lack of curation."
            </p>

            <p className="ab-body">
              VENDO functions as a bridge between high-frequency innovation and
              timeless utility. We ingest objects that balance form with industrial
              function — ensuring your registry of daily essentials, whether digital,
              wearable, or domestic, is optimised for the modern era.
            </p>

            {/* Stats */}
            <div className="ab-stats">
              {STATS.map((s, i) => (
                <div key={i} className="ab-stat">
                  <span className="ab-stat-num">{s.num}</span>
                  <span className="ab-stat-label" style={{ whiteSpace: 'pre-line' }}>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="ab-divider" />

            {/* Category pillars */}
            <div className="ab-pillars">
              {PILLARS.map(({ label, icon: Icon }, i) => (
                <div key={i} className="ab-pillar">
                  <Icon size={13} className="ab-pillar-icon" />
                  <div className="ab-pillar-body">
                    <span className="ab-pillar-label">{label}</span>
                    <span className="ab-pillar-line" />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="ab-cta-row">
              <button className="ab-cta">
                Execute Manifesto
                <span className="ab-cta-box">
                  <ArrowUpRight size={13} strokeWidth={1.5} />
                </span>
              </button>
              <span className="ab-cta-rule" />
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default About;