import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Zap } from 'lucide-react';

const offers = [
  {
    id: 1,
    title: 'Digital Archive Sale',
    subtitle: 'Electronics',
    emoji: '⚡',
    accent: '#6EC9C9',
    badge: '50% Off',
    description: 'Acquire precision technology at half valuation for a strictly limited window.',
    image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Artisan Pantry Bundle',
    subtitle: 'Groceries',
    emoji: '🧺',
    accent: '#7EBF7A',
    badge: 'Gift Included',
    description: 'Complimentary cold-pressed oil with any pantry curation over $75.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Living Space Pairing',
    subtitle: 'Furniture',
    emoji: '🛋️',
    accent: '#C9A96E',
    badge: 'Bonus Piece',
    description: 'Secondary accent piece complimentary with any sculptural seating acquisition.',
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop',
  },
];

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');

  .so-root {
    font-family: 'Overpass Mono', monospace;
    background: #080705;
    color: #e8e4dd;
    padding: 120px 6vw 100px;
    border-top: 1px solid rgba(255,255,255,0.05);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .so-inner { max-width: 1440px; margin: 0 auto; }

  /* ── HEADER ── */
  .so-header {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding-bottom: 52px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 64px;
  }
  @media (min-width: 768px) {
    .so-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
  }
  .so-eyebrow {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }
  .so-eyebrow-line { width: 28px; height: 1px; background: #C9A96E; }
  .so-eyebrow-text {
    font-size: 9px;
    letter-spacing: 0.55em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.28);
  }
  .so-title {
    font-size: clamp(36px, 5vw, 76px);
    font-weight: 300;
    letter-spacing: -0.025em;
    line-height: 1.05;
    color: #fff;
  }
  .so-title em {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: rgba(255,255,255,0.4);
  }
  .so-subtitle {
    font-size: 10px;
    line-height: 1.95;
    color: rgba(255,255,255,0.25);
    max-width: 240px;
    letter-spacing: 0.04em;
  }

  /* ── GRID ── */
  .so-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  @media (max-width: 900px) { .so-grid { grid-template-columns: 1fr; gap: 2px; } }

  /* ── OFFER CARD ── */
  .so-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #0d0b09;
    opacity: 0;
    transform: translateY(24px);
    transition: background 0.3s;
  }
  .so-card.in {
    animation: soReveal 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes soReveal {
    to { opacity: 1; transform: translateY(0); }
  }
  .so-card:hover { background: #111008; }

  /* Image */
  .so-img-wrap {
    position: relative;
    aspect-ratio: 16/10;
    overflow: hidden;
    background: #0a0805;
  }
  .so-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .so-card:hover .so-img { transform: scale(1.07); }

  /* Image overlay gradient */
  .so-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 40%, rgba(8,7,5,0.7) 100%);
    transition: opacity 0.5s;
  }

  /* Badges */
  .so-badge-row {
    position: absolute;
    top: 16px;
    left: 16px;
    right: 16px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .so-badge {
    font-size: 7.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    padding: 5px 10px;
    color: #080705;
  }
  .so-emoji-badge {
    width: 34px;
    height: 34px;
    background: rgba(8,7,5,0.75);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    opacity: 0;
    transform: scale(0.8);
    transition: opacity 0.3s, transform 0.3s;
  }
  .so-card:hover .so-emoji-badge {
    opacity: 1;
    transform: scale(1);
  }

  /* Info */
  .so-card-info {
    padding: 24px 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    flex: 1;
  }
  .so-card-sub {
    font-size: 8px;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
  }
  .so-card-title {
    font-size: clamp(18px, 2vw, 26px);
    font-weight: 300;
    color: #fff;
    letter-spacing: -0.01em;
    line-height: 1.2;
    transition: transform 0.4s ease;
  }
  .so-card:hover .so-card-title { transform: translateX(4px); }
  .so-card-desc {
    font-size: 10px;
    line-height: 1.9;
    color: rgba(255,255,255,0.28);
    letter-spacing: 0.03em;
    max-width: 320px;
  }

  /* CTA */
  .so-cta {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 8px;
    text-decoration: none;
    margin-top: auto;
  }
  .so-cta-text {
    font-size: 8.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    transition: color 0.3s;
  }
  .so-cta:hover .so-cta-text { color: rgba(255,255,255,0.9); }
  .so-cta-line {
    position: relative;
    height: 1px;
    width: 32px;
    background: rgba(255,255,255,0.12);
    overflow: hidden;
    transition: width 0.4s ease;
  }
  .so-cta:hover .so-cta-line { width: 48px; }
  .so-cta-line::after {
    content: '';
    position: absolute;
    inset: 0;
    background: #C9A96E;
    transform: translateX(-100%);
    transition: transform 0.4s ease;
  }
  .so-cta:hover .so-cta-line::after { transform: translateX(0); }
  .so-cta-arrow {
    opacity: 0;
    transform: translateX(-6px);
    transition: opacity 0.3s, transform 0.3s;
    color: #C9A96E;
  }
  .so-cta:hover .so-cta-arrow { opacity: 1; transform: translateX(0); }

  /* ── LOGISTICS BANNER ── */
  .so-banner {
    margin-top: 80px;
    padding: 40px 48px;
    border: 1px solid rgba(255,255,255,0.06);
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
    position: relative;
    overflow: hidden;
    opacity: 0;
    transform: translateY(16px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .so-banner.in { opacity: 1; transform: translateY(0); }
  @media (min-width: 640px) {
    .so-banner {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }
  /* Decorative corner */
  .so-banner::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: linear-gradient(180deg, #C9A96E, transparent);
  }
  .so-banner-left { display: flex; flex-direction: column; gap: 8px; }
  .so-banner-title {
    font-size: 9px;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: #fff;
  }
  .so-banner-sub {
    font-size: 10px;
    letter-spacing: 0.04em;
    color: rgba(255,255,255,0.28);
    line-height: 1.7;
    max-width: 380px;
  }
  .so-banner-icon {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #C9A96E;
    margin-bottom: 4px;
  }
  .so-banner-btn {
    flex-shrink: 0;
    padding: 14px 32px;
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.45);
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    text-decoration: none;
    transition: border-color 0.3s, color 0.3s, background 0.3s;
    white-space: nowrap;
    display: inline-block;
  }
  .so-banner-btn:hover {
    border-color: #C9A96E;
    color: #C9A96E;
    background: rgba(201,169,110,0.06);
  }

  /* Mobile adjustments */
  @media (max-width: 480px) {
    .so-root { padding: 80px 6vw 72px; }
    .so-banner { padding: 28px 24px; }
  }
`;

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const SpecialOffers = () => {
  const cardRefs = useRef([]);
  const bannerRef = useRef(null);
  const [visible, setVisible] = useState([]);
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const observers = [];

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(prev => [...new Set([...prev, i])]), i * 120);
            obs.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    if (bannerRef.current) {
      const bannerObs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setBannerVisible(true); bannerObs.disconnect(); } },
        { threshold: 0.15 }
      );
      bannerObs.observe(bannerRef.current);
      observers.push(bannerObs);
    }

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <>
      <style>{STYLES}</style>
      <section className="so-root" id="offers">
        <div className="so-inner">

          {/* HEADER */}
          <div className="so-header">
            <div>
              <div className="so-eyebrow">
                <div className="so-eyebrow-line" />
                <span className="so-eyebrow-text">Seasonal Opportunities</span>
              </div>
              <h2 className="so-title">
                Curated<br />
                <em>Exclusives.</em>
              </h2>
            </div>
            <p className="so-subtitle">
              Intentional value for the discerning collector. Time-sensitive windows only.
            </p>
          </div>

          {/* OFFER CARDS */}
          <div className="so-grid">
            {offers.map((offer, i) => (
              <div
                key={offer.id}
                className={`so-card${visible.includes(i) ? ' in' : ''}`}
                style={{ animationDelay: `${i * 100}ms` }}
                ref={el => cardRefs.current[i] = el}
              >
                {/* Image */}
                <div className="so-img-wrap">
                  <img className="so-img" src={offer.image} alt={offer.title} />
                  <div className="so-img-overlay" />
                  <div className="so-badge-row">
                    <span className="so-badge" style={{ background: offer.accent }}>
                      {offer.badge}
                    </span>
                    <span className="so-emoji-badge">{offer.emoji}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="so-card-info">
                  <span className="so-card-sub">{offer.subtitle}</span>
                  <h3 className="so-card-title">{offer.title}</h3>
                  <p className="so-card-desc">{offer.description}</p>
                  <Link to="/shop" className="so-cta">
                    <span className="so-cta-text">View Offer</span>
                    <span className="so-cta-line" />
                    <ArrowUpRight size={12} className="so-cta-arrow" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* LOGISTICS BANNER */}
          <div
            ref={bannerRef}
            className={`so-banner${bannerVisible ? ' in' : ''}`}
          >
            <div className="so-banner-left">
              <div className="so-banner-icon">
                <Zap size={11} strokeWidth={1.5} />
                <span style={{ fontSize: 8, letterSpacing: '0.4em', textTransform: 'uppercase' }}>Universal Logistics</span>
              </div>
              <p className="so-banner-title">Complimentary Global Transit</p>
              <p className="so-banner-sub">
                Free worldwide shipping on all acquisitions exceeding $150 valuation. Tracked, insured, and discreet.
              </p>
            </div>
            <Link to="/shipping-policy" className="so-banner-btn">
              Shipping Policy
            </Link>
          </div>

        </div>
      </section>
    </>
  );
};

export default SpecialOffers;