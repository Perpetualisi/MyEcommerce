import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cat-root {
    font-family: 'Overpass Mono', monospace;
    background: #080705;
    color: #e8e4dd;
    padding: 120px 6vw 120px;
    border-top: 1px solid rgba(255,255,255,0.05);
  }

  .cat-inner { max-width: 1440px; margin: 0 auto; }

  /* ── HEADER ── */
  .cat-header {
    display: flex; flex-direction: column; gap: 28px;
    padding-bottom: 56px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 64px;
  }
  @media (min-width: 768px) {
    .cat-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
  }

  .cat-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
  .cat-eyebrow-line { width: 28px; height: 1px; background: #C9A96E; }
  .cat-eyebrow-text {
    font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase;
    color: rgba(255,255,255,0.28);
  }

  .cat-title {
    font-size: clamp(36px, 5vw, 76px); font-weight: 300;
    letter-spacing: -0.025em; line-height: 1.05; color: #fff;
  }
  .cat-title em {
    font-family: 'Cormorant Garamond', serif; font-style: italic;
    color: rgba(255,255,255,0.4);
  }

  .cat-subtitle {
    font-size: 10px; line-height: 1.95;
    color: rgba(255,255,255,0.27);
    max-width: 260px; letter-spacing: 0.04em;
  }

  /* ── GRID ── */
  .cat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }
  @media (max-width: 1100px) { .cat-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 520px)  { .cat-grid { grid-template-columns: 1fr; } }

  /* ── CARD ── */
  .cat-card {
    display: block; text-decoration: none;
    position: relative;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0s, transform 0s;
  }
  .cat-card.revealed {
    animation: catIn 0.65s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes catIn { to { opacity: 1; transform: translateY(0); } }

  /* Image wrap */
  .cat-img-wrap {
    position: relative;
    aspect-ratio: 4/5;
    overflow: hidden;
    background: #111008;
  }

  .cat-img {
    width: 100%; height: 100%;
    object-fit: cover;
    filter: grayscale(0.35) brightness(0.75);
    transform: scale(1.03);
    transition:
      transform 1.4s cubic-bezier(0.25,0.46,0.45,0.94),
      filter 1.0s ease;
    display: block;
  }
  .cat-card:hover .cat-img {
    transform: scale(1.09);
    filter: grayscale(0) brightness(0.9);
  }

  /* Dark gradient at bottom */
  .cat-img-wrap::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 40%,
      rgba(8,7,5,0.75) 100%
    );
    pointer-events: none;
  }

  /* Number badge — top-left */
  .cat-num {
    position: absolute; top: 16px; left: 16px; z-index: 2;
    font-size: 8px; letter-spacing: 0.5em; text-transform: uppercase;
    background: rgba(8,7,5,0.85); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.5);
    padding: 5px 10px; line-height: 1;
  }

  /* Hover arrow circle — center */
  .cat-arrow-wrap {
    position: absolute; inset: 0; z-index: 2;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; transition: opacity 0.4s;
  }
  .cat-card:hover .cat-arrow-wrap { opacity: 1; }
  .cat-arrow-circle {
    width: 52px; height: 52px;
    border: 1px solid rgba(255,255,255,0.35);
    background: rgba(8,7,5,0.5);
    backdrop-filter: blur(10px);
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    transform: scale(0.85);
    transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s;
  }
  .cat-card:hover .cat-arrow-circle {
    transform: scale(1);
    border-color: rgba(201,169,110,0.55);
  }

  /* Gold tag — bottom of image (slides up on hover) */
  .cat-img-tag {
    position: absolute; bottom: 0; left: 0; right: 0; z-index: 3;
    padding: 14px 18px;
    display: flex; align-items: center; justify-content: space-between;
    transform: translateY(4px);
    transition: transform 0.4s ease;
  }
  .cat-card:hover .cat-img-tag { transform: translateY(0); }
  .cat-img-tag-name {
    font-size: 9px; letter-spacing: 0.45em; text-transform: uppercase;
    color: #C9A96E;
  }
  .cat-img-tag-line {
    flex: 1; height: 1px; background: rgba(201,169,110,0.25);
    margin: 0 14px;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.5s ease 0.1s;
  }
  .cat-card:hover .cat-img-tag-line { transform: scaleX(1); }

  /* ── INFO ROW below image ── */
  .cat-info {
    padding: 20px 0 0;
    background: #080705;
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 12px;
  }
  .cat-info-left { display: flex; flex-direction: column; gap: 8px; }

  .cat-name {
    font-size: 10px; letter-spacing: 0.42em; text-transform: uppercase;
    color: rgba(255,255,255,0.75); line-height: 1;
    transition: letter-spacing 0.5s ease, color 0.3s;
  }
  .cat-card:hover .cat-name { letter-spacing: 0.52em; color: #fff; }

  .cat-tag {
    font-size: 8.5px; letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(255,255,255,0.22);
  }

  .cat-count {
    font-size: 8px; letter-spacing: 0.3em;
    color: rgba(255,255,255,0.18); text-transform: uppercase;
    padding: 6px 0;
  }
  .cat-count span { color: #C9A96E; }

  /* ── BOTTOM CTA BAR ── */
  .cat-cta-bar {
    margin-top: 64px; padding-top: 40px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: center;
  }
  .cat-cta {
    display: inline-flex; align-items: center; gap: 16px;
    text-decoration: none;
    font-size: 9px; letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    transition: color 0.3s;
  }
  .cat-cta:hover { color: rgba(255,255,255,0.85); }
  .cat-cta-arrow {
    width: 36px; height: 36px;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.3s, border-color 0.3s, transform 0.3s;
  }
  .cat-cta:hover .cat-cta-arrow {
    background: rgba(201,169,110,0.12);
    border-color: rgba(201,169,110,0.3);
    transform: translateX(4px);
  }

  @media (max-width: 480px) { .cat-root { padding: 80px 5vw 80px; } }
`;

/* ═══════════════════════════════════════════════
   CATEGORY DATA
═══════════════════════════════════════════════ */
const CATEGORIES = [
  {
    id: '01',
    name: 'Digital Archive',
    tag: 'Tech & Gadgets',
    dept: 'Electronics',
    path: '/shop',
    count: 15,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: '02',
    name: 'Sartorial',
    tag: 'Premium Fashion',
    dept: 'Fashion',
    path: '/shop',
    count: 15,
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: '03',
    name: 'Pantry Essentials',
    tag: 'Artisan Groceries',
    dept: 'Groceries',
    path: '/shop',
    count: 15,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: '04',
    name: 'Living Space',
    tag: 'Sculptural Furniture',
    dept: 'Furniture',
    path: '/shop',
    count: 15,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1200',
  },
];

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
const Categories = () => {
  const cardRefs = useRef([]);

  /* Scroll-triggered card reveals */
  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.style.animationDelay = `${i * 90}ms`;
            el.classList.add('revealed');
            obs.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <section className="cat-root">
        <div className="cat-inner">

          {/* HEADER */}
          <div className="cat-header">
            <div>
              <div className="cat-eyebrow">
                <div className="cat-eyebrow-line" />
                <span className="cat-eyebrow-text">Index · 2026</span>
              </div>
              <h2 className="cat-title">
                Browse by<br />
                <em>Department.</em>
              </h2>
            </div>
            <p className="cat-subtitle">
              Systematic navigation through our curated multi-sector archive. Four departments. Sixty objects.
            </p>
          </div>

          {/* GRID */}
          <div className="cat-grid">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.id}
                to={cat.path}
                ref={el => cardRefs.current[i] = el}
                className="cat-card"
              >
                {/* Image */}
                <div className="cat-img-wrap">
                  <img
                    className="cat-img"
                    src={cat.image}
                    alt={cat.name}
                    onError={e => { e.target.style.opacity = 0.05; }}
                  />

                  {/* Number badge */}
                  <span className="cat-num">{cat.id}</span>

                  {/* Centre arrow */}
                  <div className="cat-arrow-wrap">
                    <div className="cat-arrow-circle">
                      <ArrowUpRight size={16} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Bottom tag strip */}
                  <div className="cat-img-tag">
                    <span className="cat-img-tag-name">{cat.dept}</span>
                    <span className="cat-img-tag-line" />
                  </div>
                </div>

                {/* Info row */}
                <div className="cat-info">
                  <div className="cat-info-left">
                    <span className="cat-name">{cat.name}</span>
                    <span className="cat-tag">{cat.tag}</span>
                  </div>
                  <span className="cat-count">
                    <span>{String(cat.count).padStart(2,'0')}</span> items
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="cat-cta-bar">
            <Link to="/shop" className="cat-cta">
              View Full Archive
              <span className="cat-cta-arrow">
                <ArrowUpRight size={14} strokeWidth={1.5} />
              </span>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
};

export default Categories;