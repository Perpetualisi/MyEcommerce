import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { firestore } from '../../../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingBag, Plus, ArrowUpRight, Heart, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .fp-root {
    font-family: 'Overpass Mono', monospace;
    background: #080705;
    color: #e8e4dd;
  }

  /* ── SKELETON LOADER ── */
  .fp-loader {
    min-height: 100vh;
    background: #080705;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 48px;
    padding: 0 6vw;
  }
  .loader-header {
    width: 100%;
    max-width: 1440px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .skel {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 400% 100%;
    animation: shimmer 1.6s ease infinite;
    border-radius: 0;
  }
  @keyframes shimmer {
    0%   { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }
  .skel-line-sm  { height: 10px; width: 160px; }
  .skel-line-lg  { height: 56px; width: 340px; margin-top: 8px; }
  .skel-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
    width: 100%;
    max-width: 1440px;
  }
  @media (max-width: 1100px) { .skel-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 768px)  { .skel-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px)  { .skel-grid { grid-template-columns: 1fr; } }
  .skel-card { display: flex; flex-direction: column; gap: 12px; }
  .skel-img   { aspect-ratio: 4/5; }
  .skel-name  { height: 10px; width: 70%; }
  .skel-price { height: 10px; width: 40%; }

  /* ── SECTION ── */
  .fp-section {
    padding: 120px 6vw 100px;
    max-width: 1440px;
    margin: 0 auto;
  }

  /* ── HEADER ── */
  .fp-header {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding-bottom: 52px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 52px;
  }
  @media (min-width: 768px) {
    .fp-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
  }
  .fp-eyebrow {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 16px;
  }
  .fp-eyebrow-line {
    width: 28px; height: 1px;
    background: #C9A96E;
  }
  .fp-eyebrow-text {
    font-size: 9px;
    letter-spacing: 0.55em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
  }
  .fp-title {
    font-size: clamp(36px, 5vw, 76px);
    font-weight: 300;
    letter-spacing: -0.025em;
    line-height: 1.05;
    color: #fff;
  }
  .fp-title em {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: rgba(255,255,255,0.4);
  }
  .fp-subtitle {
    font-size: 10px;
    line-height: 1.95;
    color: rgba(255,255,255,0.27);
    max-width: 260px;
    letter-spacing: 0.04em;
  }

  /* ── CATEGORY FILTER ── */
  .fp-filters {
    display: flex;
    align-items: center;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
    margin-bottom: 48px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .fp-filters::-webkit-scrollbar { display: none; }
  .fp-filter-btn {
    flex-shrink: 0;
    padding: 14px 0;
    margin-right: 28px;
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px;
    letter-spacing: 0.45em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    transition: color 0.3s;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .fp-filter-btn:hover { color: rgba(255,255,255,0.7); }
  .fp-filter-btn.active { color: #fff; }
  .fp-filter-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px;
    background: #C9A96E;
  }
  .fp-filter-count {
    font-size: 7px;
    color: rgba(255,255,255,0.18);
    transition: color 0.3s;
  }
  .fp-filter-btn.active .fp-filter-count { color: #C9A96E; }

  /* ── PRODUCTS GRID ── */
  .fp-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }
  @media (max-width: 1100px) { .fp-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 768px)  { .fp-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px)  { .fp-grid { grid-template-columns: 1fr; } }

  /* ── PRODUCT CARD ── */
  .fp-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #0d0b09;
    opacity: 0;
    transform: translateY(18px);
    transition: background 0.3s;
  }
  .fp-card.visible {
    animation: cardReveal 0.55s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes cardReveal {
    to { opacity: 1; transform: translateY(0); }
  }
  .fp-card:hover { background: #111008; }

  .fp-card-img-wrap {
    position: relative;
    aspect-ratio: 4/5;
    overflow: hidden;
    background: #111008;
    cursor: pointer;
  }
  .fp-card-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 24px;
    transition: transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .fp-card:hover .fp-card-img { transform: scale(1.07); }

  /* Overlay */
  .fp-card-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 14px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .fp-card:hover .fp-card-overlay { opacity: 1; }

  .fp-overlay-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .fp-cat-badge {
    font-size: 7.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: #080705;
    background: #C9A96E;
    padding: 5px 10px;
  }
  .fp-overlay-actions { display: flex; gap: 6px; }

  .fp-icon-btn {
    width: 34px; height: 34px;
    background: rgba(8,7,5,0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    color: rgba(255,255,255,0.6);
  }
  .fp-icon-btn:hover { background: rgba(20,18,14,0.98); color: #fff; }
  .fp-icon-btn.wishlisted { color: #e87070; border-color: rgba(232,112,112,0.3); }

  .fp-overlay-bottom { display: flex; flex-direction: column; gap: 6px; }

  .fp-quick-btn {
    width: 100%;
    padding: 11px;
    background: rgba(8,7,5,0.88);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.65);
    font-family: 'Overpass Mono', monospace;
    font-size: 7.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transform: translateY(8px);
    transition: transform 0.3s ease, background 0.2s, color 0.2s;
  }
  .fp-card:hover .fp-quick-btn { transform: translateY(0); }
  .fp-quick-btn:hover { background: rgba(201,169,110,0.15); color: #C9A96E; }

  .fp-add-btn {
    width: 100%;
    padding: 11px;
    background: #C9A96E;
    border: none;
    color: #080705;
    font-family: 'Overpass Mono', monospace;
    font-size: 7.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transform: translateY(8px);
    transition: transform 0.3s ease 0.04s, background 0.2s;
  }
  .fp-card:hover .fp-add-btn { transform: translateY(0); }
  .fp-add-btn:hover { background: #d4b87a; }

  /* Card info */
  .fp-card-info {
    padding: 16px 18px 18px;
    border-top: 1px solid rgba(255,255,255,0.04);
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .fp-card-name {
    font-size: 10px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.72);
    line-height: 1.5;
  }
  .fp-card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .fp-card-price {
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.04em;
  }
  .fp-card-ref {
    font-size: 7.5px;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.16);
    text-transform: uppercase;
  }

  /* Mobile add btn */
  .fp-mobile-add {
    display: none;
    width: 100%;
    padding: 13px;
    background: rgba(255,255,255,0.04);
    border: none;
    border-top: 1px solid rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.5);
    font-family: 'Overpass Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s, color 0.2s;
  }
  .fp-mobile-add:active { background: rgba(201,169,110,0.12); color: #C9A96E; }
  @media (max-width: 768px) {
    .fp-mobile-add { display: flex; }
    .fp-card-overlay { display: none; }
  }

  /* ── FOOTER CTA ── */
  .fp-footer {
    margin-top: 80px;
    padding-top: 52px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .fp-cta-btn {
    display: flex;
    align-items: center;
    gap: 16px;
    font-family: 'Overpass Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    background: none;
    border: none;
    cursor: pointer;
    transition: color 0.3s;
  }
  .fp-cta-btn:hover { color: rgba(255,255,255,0.85); }
  .fp-cta-arrow {
    width: 36px; height: 36px;
    border: 1px solid rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s, border-color 0.3s, transform 0.3s;
  }
  .fp-cta-btn:hover .fp-cta-arrow {
    background: rgba(201,169,110,0.12);
    border-color: rgba(201,169,110,0.3);
    transform: translateX(4px);
  }

  /* ── QUICK VIEW MODAL ── */
  .fp-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(4,3,2,0.9);
    backdrop-filter: blur(14px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: bdin 0.25s ease;
  }
  @keyframes bdin { from { opacity: 0; } to { opacity: 1; } }

  .fp-modal {
    background: #0f0d0a;
    border: 1px solid rgba(255,255,255,0.07);
    width: 100%;
    max-width: 860px;
    max-height: 90vh;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    animation: mup 0.32s cubic-bezier(0.16,1,0.3,1);
  }
  @media (max-width: 640px) {
    .fp-modal { grid-template-columns: 1fr; max-height: 95vh; }
  }
  @keyframes mup { from { transform: translateY(22px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .fp-modal-close {
    position: absolute;
    top: 16px; right: 16px;
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background 0.2s, color 0.2s;
  }
  .fp-modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

  .fp-modal-img-side {
    background: #0a0805;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    min-height: 380px;
  }
  .fp-modal-img-side img {
    width: 100%;
    max-height: 340px;
    object-fit: contain;
    transition: transform 0.5s ease;
  }
  .fp-modal-img-side img:hover { transform: scale(1.04); }

  .fp-modal-info {
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-left: 1px solid rgba(255,255,255,0.05);
  }
  @media (max-width: 640px) {
    .fp-modal-info { border-left: none; border-top: 1px solid rgba(255,255,255,0.05); padding: 32px 24px; }
    .fp-modal-img-side { min-height: 240px; padding: 28px; }
  }
  .fp-modal-cat {
    font-size: 8px;
    letter-spacing: 0.55em;
    text-transform: uppercase;
    color: #C9A96E;
  }
  .fp-modal-name {
    font-size: clamp(22px, 3vw, 34px);
    font-weight: 300;
    color: #fff;
    letter-spacing: -0.01em;
    line-height: 1.18;
  }
  .fp-modal-price {
    font-size: 24px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.02em;
  }
  .fp-modal-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 0;
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .fp-modal-meta-row {
    display: flex;
    justify-content: space-between;
    font-size: 8.5px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
  }
  .fp-modal-meta-k { color: rgba(255,255,255,0.22); }
  .fp-modal-meta-v { color: rgba(255,255,255,0.6); }

  .fp-modal-actions { display: flex; flex-direction: column; gap: 9px; }
  .fp-modal-add {
    padding: 17px;
    background: #C9A96E;
    border: none;
    color: #080705;
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    transition: background 0.2s;
  }
  .fp-modal-add:hover { background: #d4b87a; }
  .fp-modal-wish {
    padding: 15px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.4);
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    transition: border-color 0.3s, color 0.3s;
  }
  .fp-modal-wish:hover, .fp-modal-wish.active {
    border-color: rgba(232,112,112,0.35);
    color: #e87070;
  }
  .fp-modal-nav {
    padding: 14px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.35);
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    transition: border-color 0.3s, color 0.3s;
  }
  .fp-modal-nav:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.8); }

  /* ── EMPTY STATE ── */
  .fp-empty {
    grid-column: 1 / -1;
    padding: 80px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    border: 1px solid rgba(255,255,255,0.04);
  }
  .fp-empty-icon { font-size: 36px; opacity: 0.25; }
  .fp-empty-text {
    font-size: 9px;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.18);
  }
`;

/* ═══════════════════════════════════════════════
   CATEGORY CONFIG
═══════════════════════════════════════════════ */
const CATEGORIES = [
  { id: 'all',         label: 'All Items',     emoji: '✦', filter: () => true },
  { id: 'electronics', label: 'Electronics',   emoji: '⚡', filter: p => { const c = p.category?.toLowerCase() || ''; return c.includes('tech') || c.includes('electr') || c.includes('gadget'); }},
  { id: 'fashion',     label: 'Fashion',     emoji: '🧥', filter: p => { const c = p.category?.toLowerCase() || ''; return c.includes('fashion') || c.includes('retail') || c.includes('cloth'); }},
  { id: 'groceries',   label: 'Groceries',   emoji: '🧺', filter: p => { const c = p.category?.toLowerCase() || ''; return c.includes('grocer') || c.includes('food') || c.includes('pantry'); }},
  { id: 'furniture',   label: 'Furniture',   emoji: '🛋️', filter: p => { const c = p.category?.toLowerCase() || ''; return c.includes('furnit') || c.includes('interior') || c.includes('home'); }},
];

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════ */
const SkeletonLoader = () => (
  <div className="fp-loader">
    <div className="loader-header">
      <div className="skel skel-line-sm" />
      <div className="skel skel-line-lg" />
    </div>
    <div className="skel-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="skel-card" style={{ animationDelay: `${i * 80}ms` }}>
          <div className="skel skel-img" style={{ animationDelay: `${i * 80}ms` }} />
          <div className="skel skel-name" style={{ animationDelay: `${i * 80 + 100}ms` }} />
          <div className="skel skel-price" style={{ animationDelay: `${i * 80 + 160}ms` }} />
        </div>
      ))}
    </div>
  </div>
);

const QuickViewModal = ({ product, onClose, onAddToCart, wishlisted, onToggleWishlist, onNavigate }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="fp-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="fp-modal">
        <button className="fp-modal-close" onClick={onClose}><X size={13} /></button>

        <div className="fp-modal-img-side">
          <img src={product.imageURL} alt={product.name} onError={e => { e.target.style.opacity = 0.05; }} />
        </div>

        <div className="fp-modal-info">
          <div className="fp-modal-cat">{product.category || 'Universal Archive'}</div>
          <h2 className="fp-modal-name">{product.name}</h2>
          <div className="fp-modal-price">
            ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="fp-modal-meta">
            <div className="fp-modal-meta-row">
              <span className="fp-modal-meta-k">Reference</span>
              <span className="fp-modal-meta-v">{String(product.id || '').slice(0, 8).toUpperCase() || '—'}</span>
            </div>
            <div className="fp-modal-meta-row">
              <span className="fp-modal-meta-k">Status</span>
              <span className="fp-modal-meta-v">Available</span>
            </div>
            <div className="fp-modal-meta-row">
              <span className="fp-modal-meta-k">Market</span>
              <span className="fp-modal-meta-v">USD / Global</span>
            </div>
          </div>
          <div className="fp-modal-actions">
            <button className="fp-modal-add" onClick={() => { onAddToCart(product); onClose(); }}>
              <Plus size={13} /> Add to Bag
            </button>
            <button
              className={`fp-modal-wish${wishlisted ? ' active' : ''}`}
              onClick={() => onToggleWishlist(product.id)}
            >
              <Heart size={12} fill={wishlisted ? '#e87070' : 'none'} />
              {wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>
            <button className="fp-modal-nav" onClick={() => { onClose(); onNavigate(product.id); }}>
              <ArrowUpRight size={12} /> View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, onQuickView, wishlisted, onToggleWishlist, onNavigate, animDelay, visible }) => (
  <div className={`fp-card${visible ? ' visible' : ''}`} style={{ animationDelay: `${animDelay}ms` }}>
    <div className="fp-card-img-wrap" onClick={() => onNavigate(product.id)}>
      <img
        className="fp-card-img"
        src={product.imageURL}
        alt={product.name}
        onError={e => { e.target.style.opacity = 0.05; }}
      />
      <div className="fp-card-overlay">
        <div className="fp-overlay-top">
          <span className="fp-cat-badge">{product.category || 'Item'}</span>
          <div className="fp-overlay-actions">
            <button
              className={`fp-icon-btn${wishlisted ? ' wishlisted' : ''}`}
              onClick={e => { e.stopPropagation(); onToggleWishlist(product.id); }}
              title="Save to wishlist"
            >
              <Heart size={12} fill={wishlisted ? '#e87070' : 'none'} strokeWidth={1.5} />
            </button>
            <button
              className="fp-icon-btn"
              onClick={e => { e.stopPropagation(); onQuickView(product); }}
              title="Quick view"
            >
              <Eye size={12} strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <div className="fp-overlay-bottom">
          <button className="fp-quick-btn" onClick={e => { e.stopPropagation(); onQuickView(product); }}>
            <Eye size={10} /> Quick View
          </button>
          <button className="fp-add-btn" onClick={e => { e.stopPropagation(); onAddToCart(product); }}>
            <Plus size={10} /> Add to Bag
          </button>
        </div>
      </div>
    </div>

    <div className="fp-card-info" onClick={() => onNavigate(product.id)} style={{cursor: 'pointer'}}>
      <p className="fp-card-name">{product.name}</p>
      <div className="fp-card-bottom">
        <span className="fp-card-price">
          ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        <span className="fp-card-ref">REF {String(product.id || '').slice(0, 6).toUpperCase()}</span>
      </div>
    </div>

    <button className="fp-mobile-add" onClick={() => onAddToCart(product)}>
      <ShoppingBag size={12} /> Add to Bag
    </button>
  </div>
);

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const FeaturedProducts = ({ onAddToCart = () => {} }) => {
  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [wishlist, setWishlist]       = useState(new Set());
  const [quickView, setQuickView]     = useState(null);
  const [cardsVisible, setCardsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(firestore, 'featuredProducts'));
        // We ensure we keep the Firestore ID as the primary 'id'
        setProducts(snap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setTimeout(() => setLoading(false), 900);
      }
    };
    fetchProducts();
  }, []);

  /* Trigger card reveal after loading */
  useEffect(() => {
    if (!loading) {
      requestAnimationFrame(() => {
        setTimeout(() => setCardsVisible(true), 80);
      });
    }
  }, [loading]);

  const toggleWishlist = useCallback(id => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const activeCat = useMemo(() => CATEGORIES.find(c => c.id === activeCategory), [activeCategory]);

  const filtered = useMemo(() =>
    products.filter(activeCat?.filter || (() => true)),
    [products, activeCat]
  );

  // Helper function to handle navigation
  const handleNavigate = (productId) => {
    // If you are using Firestore IDs, ensure your ProductDetail component 
    // is set up to find products by that string ID.
    navigate(`/product/${productId}`);
  };

  if (loading) return (
    <>
      <style>{STYLES}</style>
      <div className="fp-root"><SkeletonLoader /></div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="fp-root">
        <div className="fp-section">

          {/* HEADER */}
          <div className="fp-header">
            <div>
              <div className="fp-eyebrow">
                <div className="fp-eyebrow-line" />
                <span className="fp-eyebrow-text">Selected Works · 2026</span>
              </div>
              <h1 className="fp-title">
                Featured<br />
                <em>Selection.</em>
              </h1>
            </div>
            <p className="fp-subtitle">
              A high-definition sequence of functional objects and tech essentials.
              Globally available in USD.
            </p>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="fp-filters">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`fp-filter-btn${activeCategory === cat.id ? ' active' : ''}`}
                onClick={() => { setActiveCategory(cat.id); setCardsVisible(false); setTimeout(() => setCardsVisible(true), 60); }}
              >
                <span>{cat.emoji}</span>
                {cat.label}
                <span className="fp-filter-count">
                  {cat.id === 'all' ? products.length : products.filter(cat.filter).length}
                </span>
              </button>
            ))}
          </div>

          {/* GRID */}
          <div className="fp-grid">
            {filtered.length > 0 ? (
              filtered.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                  onQuickView={setQuickView}
                  wishlisted={wishlist.has(product.id)}
                  onToggleWishlist={toggleWishlist}
                  onNavigate={handleNavigate}
                  animDelay={i * 60}
                  visible={cardsVisible}
                />
              ))
            ) : (
              <div className="fp-empty">
                <span className="fp-empty-icon">◌</span>
                <p className="fp-empty-text">No items in this category</p>
              </div>
            )}
          </div>

          {/* FOOTER CTA */}
          <div className="fp-footer">
            <button className="fp-cta-btn" onClick={() => navigate('/shop')}>
              View Full Archive
              <span className="fp-cta-arrow">
                <ArrowUpRight size={14} strokeWidth={1.5} />
              </span>
            </button>
          </div>
        </div>

        {/* QUICK VIEW MODAL */}
        {quickView && (
          <QuickViewModal
            product={quickView}
            onClose={() => setQuickView(null)}
            onAddToCart={onAddToCart}
            wishlisted={wishlist.has(quickView.id)}
            onToggleWishlist={toggleWishlist}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </>
  );
};

export default FeaturedProducts;