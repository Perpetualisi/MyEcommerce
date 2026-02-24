import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, ShieldCheck, Truck, Heart, ArrowLeft, Plus, Check } from 'lucide-react';

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pd-root {
    font-family: 'Overpass Mono', monospace;
    background: #080705;
    color: #e8e4dd;
    min-height: 100vh;
  }

  /* ── 404 ── */
  .pd-404 {
    min-height: 100vh;
    background: #080705;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 20px;
    font-family: 'Overpass Mono', monospace;
    text-align: center;
    padding: 24px;
  }
  .pd-404-code {
    font-size: 9px;
    letter-spacing: 0.55em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
  }
  .pd-404-title {
    font-size: clamp(24px, 4vw, 42px);
    font-weight: 300;
    color: #fff;
    letter-spacing: -0.02em;
  }
  .pd-404-title em {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: rgba(255,255,255,0.4);
  }
  .pd-404-btn {
    margin-top: 8px;
    padding: 14px 32px;
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.4);
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    background: none;
    cursor: pointer;
    transition: border-color 0.3s, color 0.3s;
  }
  .pd-404-btn:hover { border-color: #C9A96E; color: #C9A96E; }

  /* ── WRAPPER ── */
  .pd-wrapper {
    max-width: 1440px;
    margin: 0 auto;
    padding: 100px 6vw 120px;
  }

  /* ── BREADCRUMB ── */
  .pd-breadcrumb {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 56px;
    flex-wrap: wrap;
  }
  .pd-back-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 8.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.3s;
    padding: 0;
    font-family: 'Overpass Mono', monospace;
  }
  .pd-back-btn:hover { color: rgba(255,255,255,0.75); }
  .pd-crumb-sep { color: rgba(255,255,255,0.1); }
  .pd-crumb {
    font-size: 8.5px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.22);
    cursor: pointer;
    transition: color 0.3s;
    background: none;
    border: none;
    font-family: 'Overpass Mono', monospace;
  }
  .pd-crumb:hover { color: rgba(255,255,255,0.65); }
  .pd-crumb-active {
    font-size: 8.5px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.55);
  }

  /* ── LAYOUT GRID ── */
  .pd-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;
    align-items: start;
  }
  @media (min-width: 900px) {
    .pd-grid {
      grid-template-columns: 1.1fr 1fr;
      gap: 64px;
    }
  }
  @media (min-width: 1200px) {
    .pd-grid { grid-template-columns: 1.3fr 1fr; gap: 80px; }
  }

  /* ── IMAGE COLUMN ── */
  .pd-img-col { display: flex; flex-direction: column; gap: 3px; }

  .pd-main-img-wrap {
    position: relative;
    aspect-ratio: 4/5;
    background: #0d0b09;
    overflow: hidden;
  }
  @media (min-width: 900px) {
    .pd-main-img-wrap { aspect-ratio: 4/5; }
  }

  .pd-main-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 40px;
    transition: transform 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .pd-main-img-wrap:hover .pd-main-img { transform: scale(1.05); }

  /* Category badge over image */
  .pd-img-badge {
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 7.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    padding: 5px 12px;
    background: #C9A96E;
    color: #080705;
  }

  /* Secondary image placeholders */
  .pd-img-thumbnails {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3px;
  }
  .pd-thumb {
    aspect-ratio: 1;
    background: #0d0b09;
    border: 1px solid rgba(255,255,255,0.04);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .pd-thumb-inner {
    font-size: 32px;
    opacity: 0.15;
    user-select: none;
  }

  /* ── INFO COLUMN ── */
  .pd-info-col {
    position: relative;
  }
  @media (min-width: 900px) {
    .pd-info-sticky {
      position: sticky;
      top: 100px;
    }
  }
  .pd-info-inner {
    display: flex;
    flex-direction: column;
    gap: 36px;
  }

  /* Header */
  .pd-info-header { display: flex; flex-direction: column; gap: 20px; }
  .pd-info-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .pd-info-eyebrow-line { width: 22px; height: 1px; background: #C9A96E; }
  .pd-info-eyebrow-text {
    font-size: 8px;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: #C9A96E;
  }
  .pd-info-name {
    font-size: clamp(28px, 4vw, 56px);
    font-weight: 300;
    color: #fff;
    letter-spacing: -0.025em;
    line-height: 1.08;
  }
  .pd-info-name em {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: rgba(255,255,255,0.5);
  }
  .pd-price-row {
    display: flex;
    align-items: baseline;
    gap: 16px;
  }
  .pd-price {
    font-size: clamp(22px, 3vw, 34px);
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.02em;
  }
  .pd-price-note {
    font-size: 8px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.22);
  }

  /* Divider */
  .pd-divider { height: 1px; background: rgba(255,255,255,0.06); }

  /* Description */
  .pd-desc-label {
    font-size: 8px;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    margin-bottom: 14px;
  }
  .pd-desc-text {
    font-size: 11px;
    line-height: 2;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.04em;
  }

  /* Meta table */
  .pd-meta { display: flex; flex-direction: column; gap: 10px; }
  .pd-meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .pd-meta-key {
    font-size: 8px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.22);
  }
  .pd-meta-val {
    font-size: 8.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
  }
  .pd-meta-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #7EBF7A;
    margin-right: 8px;
    vertical-align: middle;
  }

  /* Actions */
  .pd-actions { display: flex; flex-direction: column; gap: 10px; }

  .pd-add-btn {
    width: 100%;
    padding: 20px;
    background: #C9A96E;
    border: none;
    color: #080705;
    font-family: 'Overpass Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.45em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.3s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .pd-add-btn:hover { background: #d4b87a; }
  .pd-add-btn:active { transform: scale(0.99); }
  .pd-add-btn.adding {
    background: rgba(201,169,110,0.3);
    color: rgba(255,255,255,0.5);
    pointer-events: none;
  }
  .pd-add-btn.added {
    background: #7EBF7A;
    color: #080705;
  }

  /* Shimmer on add */
  .pd-add-btn::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  .pd-add-btn.adding::after { left: 140%; }

  .pd-wish-btn {
    width: 100%;
    padding: 17px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.35);
    font-family: 'Overpass Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: border-color 0.3s, color 0.3s, background 0.3s;
  }
  .pd-wish-btn:hover, .pd-wish-btn.active {
    border-color: rgba(232,112,112,0.35);
    color: #e87070;
    background: rgba(232,112,112,0.04);
  }

  /* Trust badges */
  .pd-trust { display: flex; flex-direction: column; gap: 20px; }
  .pd-trust-item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }
  .pd-trust-icon {
    width: 36px;
    height: 36px;
    border: 1px solid rgba(255,255,255,0.07);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(255,255,255,0.3);
    flex-shrink: 0;
  }
  .pd-trust-label {
    font-size: 8.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.6);
    margin-bottom: 6px;
  }
  .pd-trust-desc {
    font-size: 10px;
    line-height: 1.7;
    color: rgba(255,255,255,0.22);
    letter-spacing: 0.03em;
  }

  /* ── ENTRY ANIMATIONS ── */
  .pd-fade-up {
    opacity: 0;
    transform: translateY(16px);
    animation: pdFadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both;
  }
  .pd-d0 { animation-delay: 0.05s; }
  .pd-d1 { animation-delay: 0.15s; }
  .pd-d2 { animation-delay: 0.25s; }
  .pd-d3 { animation-delay: 0.35s; }
  .pd-d4 { animation-delay: 0.45s; }
  .pd-d5 { animation-delay: 0.55s; }
  .pd-d6 { animation-delay: 0.65s; }

  @keyframes pdFadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  /* Mobile */
  @media (max-width: 480px) {
    .pd-wrapper { padding: 80px 5vw 80px; }
    .pd-breadcrumb { margin-bottom: 36px; }
  }
`;

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const ProductDetail = ({ products = [], onAddToCart = () => {} }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [addState, setAddState] = useState('idle'); // idle | adding | added
  const [wishlisted, setWishlisted] = useState(false);

  const product = products.find(p =>
    String(p.id) === String(id) || p.id === parseInt(id)
  );

  const handleAddToCart = () => {
    if (addState !== 'idle') return;
    setAddState('adding');
    onAddToCart(product);
    setTimeout(() => {
      setAddState('added');
      setTimeout(() => navigate('/cart'), 700);
    }, 600);
  };

  const addBtnClass = `pd-add-btn${addState === 'adding' ? ' adding' : addState === 'added' ? ' added' : ''}`;
  const addBtnLabel =
    addState === 'adding' ? 'Adding to Archive...' :
    addState === 'added'  ? 'Added — Heading to Cart' :
    'Add to Archive';
  const addBtnIcon =
    addState === 'added' ? <Check size={14} /> :
    addState === 'adding' ? null :
    <ShoppingBag size={14} />;

  /* 404 */
  if (!product) return (
    <>
      <style>{STYLES}</style>
      <div className="pd-root">
        <div className="pd-404">
          <span className="pd-404-code">Error 404 · Not Found</span>
          <h2 className="pd-404-title">Object not found<br />in <em>archive.</em></h2>
          <button className="pd-404-btn" onClick={() => navigate('/shop')}>
            Return to Shop
          </button>
        </div>
      </div>
    </>
  );

  const price = Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 });
  const ref   = String(product.id || '').slice(0, 8).toUpperCase();

  return (
    <>
      <style>{STYLES}</style>
      <div className="pd-root">
        <div className="pd-wrapper">

          {/* ── BREADCRUMB ── */}
          <nav className="pd-breadcrumb pd-fade-up pd-d0">
            <button className="pd-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={11} strokeWidth={1.5} /> Back
            </button>
            <span className="pd-crumb-sep">/</span>
            <button className="pd-crumb" onClick={() => navigate('/shop')}>Archive</button>
            <span className="pd-crumb-sep">/</span>
            <button className="pd-crumb" onClick={() => navigate('/shop')}>{product.category}</button>
            <span className="pd-crumb-sep">/</span>
            <span className="pd-crumb-active">{product.name}</span>
          </nav>

          {/* ── MAIN GRID ── */}
          <div className="pd-grid">

            {/* IMAGE COLUMN */}
            <div className="pd-img-col pd-fade-up pd-d1">
              <div className="pd-main-img-wrap">
                <img
                  className="pd-main-img"
                  src={product.imageURL || product.image}
                  alt={product.name}
                  onError={e => { e.target.style.opacity = 0.05; }}
                />
                <div className="pd-img-badge">{product.category || 'Item'}</div>
              </div>

              {/* Thumbnail placeholders — swap with real secondary images if available */}
              <div className="pd-img-thumbnails">
                <div className="pd-thumb">
                  <span className="pd-thumb-inner">◻</span>
                </div>
                <div className="pd-thumb">
                  <span className="pd-thumb-inner">◻</span>
                </div>
              </div>
            </div>

            {/* INFO COLUMN */}
            <div className="pd-info-col">
              <div className="pd-info-sticky">
                <div className="pd-info-inner">

                  {/* Header */}
                  <div className="pd-info-header pd-fade-up pd-d2">
                    <div className="pd-info-eyebrow">
                      <div className="pd-info-eyebrow-line" />
                      <span className="pd-info-eyebrow-text">{product.category} · 2026 Registry</span>
                    </div>
                    <h1 className="pd-info-name">{product.name}</h1>
                    <div className="pd-price-row">
                      <span className="pd-price">${price}</span>
                      <span className="pd-price-note">Tax Incl.</span>
                    </div>
                  </div>

                  <div className="pd-divider pd-fade-up pd-d2" />

                  {/* Description */}
                  <div className="pd-fade-up pd-d3">
                    <p className="pd-desc-label">Provenance & Specifications</p>
                    <p className="pd-desc-text">
                      A carefully selected entry in our 2026 archive. This {(product.category || 'product').toLowerCase()} piece represents the intersection of functional necessity and refined aesthetic — designed for longevity and daily utility.
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="pd-meta pd-fade-up pd-d3">
                    <div className="pd-meta-row">
                      <span className="pd-meta-key">Reference</span>
                      <span className="pd-meta-val">{ref}</span>
                    </div>
                    <div className="pd-meta-row">
                      <span className="pd-meta-key">Availability</span>
                      <span className="pd-meta-val">
                        <span className="pd-meta-dot" />In Stock
                      </span>
                    </div>
                    <div className="pd-meta-row">
                      <span className="pd-meta-key">Market</span>
                      <span className="pd-meta-val">USD / Global</span>
                    </div>
                    <div className="pd-meta-row">
                      <span className="pd-meta-key">Edition</span>
                      <span className="pd-meta-val">2026 Archive</span>
                    </div>
                  </div>

                  <div className="pd-divider pd-fade-up pd-d3" />

                  {/* Actions */}
                  <div className="pd-actions pd-fade-up pd-d4">
                    <button className={addBtnClass} onClick={handleAddToCart}>
                      {addBtnIcon}
                      {addBtnLabel}
                    </button>
                    <button
                      className={`pd-wish-btn${wishlisted ? ' active' : ''}`}
                      onClick={() => setWishlisted(v => !v)}
                    >
                      <Heart size={13} fill={wishlisted ? '#e87070' : 'none'} strokeWidth={1.5} />
                      {wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
                    </button>
                  </div>

                  <div className="pd-divider pd-fade-up pd-d5" />

                  {/* Trust */}
                  <div className="pd-trust pd-fade-up pd-d6">
                    <div className="pd-trust-item">
                      <div className="pd-trust-icon"><Truck size={15} strokeWidth={1.5} /></div>
                      <div>
                        <p className="pd-trust-label">Global Logistics</p>
                        <p className="pd-trust-desc">Insured white-glove delivery within 4–7 business days worldwide.</p>
                      </div>
                    </div>
                    <div className="pd-trust-item">
                      <div className="pd-trust-icon"><ShieldCheck size={15} strokeWidth={1.5} /></div>
                      <div>
                        <p className="pd-trust-label">Archive Guarantee</p>
                        <p className="pd-trust-desc">2-year certified coverage for electronics and furnishings.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;