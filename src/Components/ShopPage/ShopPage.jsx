import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ShoppingBag, Plus, X, Heart, Search, ArrowUpDown, ArrowUpRight, ChevronDown, Eye } from 'lucide-react';

/* ─────────────────────────────────────────────
   STYLE BLOCK — shared across all sub-components
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .shop-root {
    font-family: 'Overpass Mono', monospace;
    background: #080705;
    color: #e8e4dd;
    min-height: 100vh;
  }

  /* ── SCROLLBAR ── */
  .shop-root ::-webkit-scrollbar { width: 4px; height: 4px; }
  .shop-root ::-webkit-scrollbar-track { background: #0f0e0b; }
  .shop-root ::-webkit-scrollbar-thumb { background: #2a2820; border-radius: 2px; }
  .no-scroll { overflow: hidden; }

  /* ── HEADER ── */
  .shop-header {
    padding: 120px 6vw 60px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    max-width: 1440px;
    margin: 0 auto;
  }
  .shop-header-inner {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  @media (min-width: 768px) {
    .shop-header-inner {
      flex-direction: row;
      align-items: flex-end;
      justify-content: space-between;
    }
  }
  .shop-eyebrow {
    font-size: 9px;
    letter-spacing: 0.55em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    margin-bottom: 14px;
  }
  .shop-title {
    font-size: clamp(36px, 5vw, 80px);
    font-weight: 300;
    letter-spacing: -0.025em;
    line-height: 1.05;
    color: #fff;
  }
  .shop-title em {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic;
    color: rgba(255,255,255,0.45);
  }
  .shop-subtitle {
    font-size: 10px;
    line-height: 1.9;
    color: rgba(255,255,255,0.28);
    max-width: 260px;
    letter-spacing: 0.04em;
  }

  /* ── CONTROLS BAR ── */
  .controls-bar {
    position: sticky;
    top: 0;
    z-index: 40;
    background: rgba(8,7,5,0.96);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .controls-inner {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 6vw;
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* ── DEPT NAV ── */
  .dept-nav {
    display: flex;
    align-items: center;
    gap: 0;
    overflow-x: auto;
    scrollbar-width: none;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .dept-nav::-webkit-scrollbar { display: none; }
  .dept-btn {
    flex-shrink: 0;
    padding: 18px 0;
    margin-right: 32px;
    font-size: 8.5px;
    letter-spacing: 0.45em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.3);
    background: none;
    border: none;
    cursor: pointer;
    position: relative;
    transition: color 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }
  .dept-btn:hover { color: rgba(255,255,255,0.75); }
  .dept-btn.active { color: #fff; }
  .dept-btn.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: #C9A96E;
  }
  .dept-count {
    font-size: 7px;
    color: rgba(255,255,255,0.2);
    transition: color 0.3s;
  }
  .dept-btn.active .dept-count { color: #C9A96E; }

  /* ── SEARCH & SORT ROW ── */
  .search-sort-row {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 0;
    flex-wrap: wrap;
  }
  .search-wrap {
    position: relative;
    flex: 1;
    min-width: 180px;
  }
  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255,255,255,0.25);
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: #e8e4dd;
    font-family: 'Overpass Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.1em;
    padding: 10px 14px 10px 36px;
    outline: none;
    transition: border-color 0.3s, background 0.3s;
  }
  .search-input::placeholder { color: rgba(255,255,255,0.2); }
  .search-input:focus {
    border-color: rgba(201,169,110,0.4);
    background: rgba(255,255,255,0.06);
  }
  .sort-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.5);
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    padding: 10px 16px;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.3s, color 0.3s, border-color 0.3s;
    position: relative;
  }
  .sort-btn:hover, .sort-btn.open {
    background: rgba(255,255,255,0.07);
    color: #fff;
    border-color: rgba(255,255,255,0.15);
  }
  .sort-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    background: #141210;
    border: 1px solid rgba(255,255,255,0.08);
    z-index: 50;
    min-width: 180px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.6);
  }
  .sort-option {
    display: block;
    width: 100%;
    padding: 12px 16px;
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.45);
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s, color 0.2s;
  }
  .sort-option:hover { background: rgba(255,255,255,0.04); color: #fff; }
  .sort-option.selected { color: #C9A96E; }

  .results-count {
    font-size: 8px;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.2);
    text-transform: uppercase;
    white-space: nowrap;
  }
  .wishlist-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 8.5px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.35);
    background: none;
    border: 1px solid rgba(255,255,255,0.07);
    padding: 10px 14px;
    cursor: pointer;
    transition: color 0.3s, border-color 0.3s;
    white-space: nowrap;
    font-family: 'Overpass Mono', monospace;
  }
  .wishlist-toggle:hover, .wishlist-toggle.active {
    color: #e87070;
    border-color: rgba(232,112,112,0.3);
  }

  /* ── MAIN GRID ── */
  .shop-main {
    max-width: 1440px;
    margin: 0 auto;
    padding: 64px 6vw 120px;
  }
  .dept-section { margin-bottom: 96px; }
  .dept-heading {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 48px;
  }
  .dept-heading-label {
    font-size: 9px;
    letter-spacing: 0.55em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.5);
    white-space: nowrap;
  }
  .dept-heading-line {
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.06);
  }
  .dept-heading-num {
    font-size: 9px;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.15);
  }

  .products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }
  @media (max-width: 1100px) { .products-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (max-width: 768px)  { .products-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 480px)  { .products-grid { grid-template-columns: 1fr; } }

  /* ── PRODUCT CARD ── */
  .product-card {
    position: relative;
    display: flex;
    flex-direction: column;
    background: #0d0b09;
    cursor: pointer;
    transition: background 0.3s;
  }
  .product-card:hover { background: #111008; }

  .card-image-wrap {
    position: relative;
    aspect-ratio: 4/5;
    overflow: hidden;
    background: #111008;
  }
  .card-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 24px;
    transition: transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94);
    opacity: 1;
  }
  .product-card:hover .card-img {
    transform: scale(1.06);
  }

  /* Hover overlay */
  .card-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16px;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .product-card:hover .card-overlay { opacity: 1; }
  .card-overlay-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .card-overlay-bottom { display: flex; flex-direction: column; gap: 8px; }

  .icon-btn {
    width: 36px;
    height: 36px;
    background: rgba(8,7,5,0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    color: rgba(255,255,255,0.6);
  }
  .icon-btn:hover { background: rgba(20,18,14,0.95); color: #fff; }
  .icon-btn.wishlisted { color: #e87070; border-color: rgba(232,112,112,0.3); }

  .card-quick-view-btn {
    width: 100%;
    padding: 12px;
    background: rgba(8,7,5,0.9);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.7);
    font-family: 'Overpass Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transform: translateY(6px);
    transition: transform 0.3s ease, background 0.2s, color 0.2s;
  }
  .product-card:hover .card-quick-view-btn { transform: translateY(0); }
  .card-quick-view-btn:hover { background: rgba(201,169,110,0.15); color: #C9A96E; }

  .card-add-btn {
    width: 100%;
    padding: 12px;
    background: #C9A96E;
    border: none;
    color: #080705;
    font-family: 'Overpass Mono', monospace;
    font-size: 8px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transform: translateY(6px);
    transition: transform 0.3s ease 0.04s, background 0.2s;
  }
  .product-card:hover .card-add-btn { transform: translateY(0); }
  .card-add-btn:hover { background: #d4b87a; }

  /* Card info */
  .card-info {
    padding: 16px 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-top: 1px solid rgba(255,255,255,0.04);
  }
  .card-name {
    font-size: 10px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.75);
    line-height: 1.5;
  }
  .card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-price {
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.05em;
  }
  .card-ref {
    font-size: 7.5px;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.18);
    text-transform: uppercase;
  }

  /* Mobile add btn */
  .card-mobile-add {
    display: none;
    width: 100%;
    padding: 14px;
    background: rgba(255,255,255,0.05);
    border: none;
    border-top: 1px solid rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.6);
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.2s, color 0.2s;
  }
  @media (max-width: 768px) {
    .card-mobile-add { display: flex; }
    .card-overlay { display: none; }
  }

  /* Empty state */
  .empty-state {
    grid-column: 1 / -1;
    padding: 80px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    border: 1px solid rgba(255,255,255,0.04);
  }
  .empty-state-emoji { font-size: 40px; opacity: 0.3; }
  .empty-state-text {
    font-size: 9px;
    letter-spacing: 0.5em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.2);
  }

  /* ── QUICK VIEW MODAL ── */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(4,3,2,0.88);
    backdrop-filter: blur(12px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fadeIn 0.25s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal-panel {
    background: #0f0d0a;
    border: 1px solid rgba(255,255,255,0.07);
    width: 100%;
    max-width: 860px;
    max-height: 90vh;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1);
    position: relative;
  }
  @media (max-width: 640px) {
    .modal-panel { grid-template-columns: 1fr; max-height: 95vh; }
  }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    transition: background 0.2s, color 0.2s;
  }
  .modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; }

  .modal-image-side {
    background: #0a0805;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px;
    min-height: 400px;
  }
  .modal-image-side img {
    width: 100%;
    max-height: 360px;
    object-fit: contain;
    opacity: 1;
    transition: transform 0.4s ease;
  }
  .modal-image-side img:hover { transform: scale(1.04); }

  .modal-info-side {
    padding: 48px 40px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    border-left: 1px solid rgba(255,255,255,0.05);
  }
  @media (max-width: 640px) {
    .modal-info-side { border-left: none; border-top: 1px solid rgba(255,255,255,0.05); padding: 32px 24px; }
    .modal-image-side { min-height: 260px; padding: 32px; }
  }
  .modal-category {
    font-size: 8px;
    letter-spacing: 0.55em;
    text-transform: uppercase;
    color: #C9A96E;
  }
  .modal-name {
    font-size: clamp(20px, 3vw, 32px);
    font-weight: 300;
    color: #fff;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }
  .modal-price {
    font-size: 22px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.02em;
  }
  .modal-desc {
    font-size: 10px;
    line-height: 1.9;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.04em;
  }
  .modal-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px 0;
    border-top: 1px solid rgba(255,255,255,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .modal-meta-row {
    display: flex;
    justify-content: space-between;
    font-size: 8.5px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
  }
  .modal-meta-key { color: rgba(255,255,255,0.25); }
  .modal-meta-val { color: rgba(255,255,255,0.65); }
  .modal-actions { display: flex; flex-direction: column; gap: 10px; }
  .modal-add-btn {
    padding: 18px;
    background: #C9A96E;
    border: none;
    color: #080705;
    font-family: 'Overpass Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: background 0.2s;
  }
  .modal-add-btn:hover { background: #d4b87a; }
  .modal-wish-btn {
    padding: 16px;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.45);
    font-family: 'Overpass Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: border-color 0.3s, color 0.3s;
  }
  .modal-wish-btn:hover, .modal-wish-btn.active {
    border-color: rgba(232,112,112,0.4);
    color: #e87070;
  }

  /* ── FADE-IN ANIM FOR GRID ── */
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .card-anim {
    animation: cardIn 0.4s ease both;
  }
`;

/* ─────────────────────────────────────────────
   SORT OPTIONS
───────────────────────────────────────────── */
const SORT_OPTIONS = [
  { id: 'default',    label: 'Default' },
  { id: 'price-asc',  label: 'Price: Low → High' },
  { id: 'price-desc', label: 'Price: High → Low' },
  { id: 'name-asc',   label: 'Name: A → Z' },
  { id: 'name-desc',  label: 'Name: Z → A' },
];

/* ─────────────────────────────────────────────
   DEPARTMENT CONFIG
───────────────────────────────────────────── */
const getDepts = (products) => [
  {
    id: 'all',
    label: 'All',
    emoji: '✦',
    filter: () => true,
  },
  {
    id: 'digital-archive',
    label: 'Electronics',
    emoji: '⚡',
    filter: (p) => {
      const c = p.category?.toLowerCase() || '';
      return c.includes('tech') || c.includes('electr') || c.includes('gadget');
    },
  },
  {
    id: 'sartorial',
    label: 'Fashion',
    emoji: '🧥',
    filter: (p) => {
      const c = p.category?.toLowerCase() || '';
      return c.includes('fashion') || c.includes('retail') || c.includes('cloth');
    },
  },
  {
    id: 'pantry-essentials',
    label: 'Groceries',
    emoji: '🧺',
    filter: (p) => {
      const c = p.category?.toLowerCase() || '';
      return c.includes('grocer') || c.includes('food') || c.includes('pantry');
    },
  },
  {
    id: 'living-space',
    label: 'Furniture',
    emoji: '🛋️',
    filter: (p) => {
      const c = p.category?.toLowerCase() || '';
      return c.includes('furnit') || c.includes('interior') || c.includes('home');
    },
  },
];

/* ─────────────────────────────────────────────
   QUICK VIEW MODAL
───────────────────────────────────────────── */
const QuickViewModal = ({ product, onClose, onAddToCart, wishlisted, onToggleWishlist }) => {
  useEffect(() => {
    document.body.classList.add('no-scroll');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-panel">
        <button className="modal-close" onClick={onClose}><X size={14} /></button>

        <div className="modal-image-side">
          <img
            src={product.imageURL || product.image}
            alt={product.name}
            onError={(e) => { e.target.style.opacity = 0.1; }}
          />
        </div>

        <div className="modal-info-side">
          <div className="modal-category">{product.category || 'Universal Archive'}</div>
          <div>
            <h2 className="modal-name">{product.name}</h2>
          </div>
          <div className="modal-price">
            ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          {product.description && (
            <p className="modal-desc">{product.description}</p>
          )}
          <div className="modal-meta">
            <div className="modal-meta-row">
              <span className="modal-meta-key">Reference</span>
              <span className="modal-meta-val">{String(product.id || '').slice(0,8).toUpperCase() || '—'}</span>
            </div>
            <div className="modal-meta-row">
              <span className="modal-meta-key">Status</span>
              <span className="modal-meta-val">Available</span>
            </div>
            <div className="modal-meta-row">
              <span className="modal-meta-key">Market</span>
              <span className="modal-meta-val">USD / Global</span>
            </div>
          </div>
          <div className="modal-actions">
            <button className="modal-add-btn" onClick={() => { onAddToCart(product); onClose(); }}>
              <Plus size={14} /> Add to Bag
            </button>
            <button
              className={`modal-wish-btn${wishlisted ? ' active' : ''}`}
              onClick={() => onToggleWishlist(product.id)}
            >
              <Heart size={13} fill={wishlisted ? '#e87070' : 'none'} />
              {wishlisted ? 'Saved to Wishlist' : 'Save to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────── */
const ProductCard = ({ product, onAddToCart, onQuickView, wishlisted, onToggleWishlist, animDelay }) => (
  <div className="product-card card-anim" style={{ animationDelay: `${animDelay}ms` }}>
    <div className="card-image-wrap">
      <img
        className="card-img"
        src={product.imageURL || product.image}
        alt={product.name}
        onError={(e) => { e.target.style.opacity = 0.05; }}
      />
      <div className="card-overlay">
        <div className="card-overlay-top">
          <button
            className={`icon-btn${wishlisted ? ' wishlisted' : ''}`}
            onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
            title="Wishlist"
          >
            <Heart size={13} fill={wishlisted ? '#e87070' : 'none'} strokeWidth={1.5} />
          </button>
          <button
            className="icon-btn"
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            title="Quick view"
          >
            <ArrowUpRight size={13} strokeWidth={1.5} />
          </button>
        </div>
        <div className="card-overlay-bottom">
          <button className="card-quick-view-btn" onClick={() => onQuickView(product)}>
            <Eye size={11} /> Quick View
          </button>
          <button className="card-add-btn" onClick={() => onAddToCart(product)}>
            <Plus size={11} /> Add to Bag
          </button>
        </div>
      </div>
    </div>

    <div className="card-info">
      <p className="card-name">{product.name}</p>
      <div className="card-bottom">
        <span className="card-price">
          ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
        <span className="card-ref">REF {String(product.id || '').slice(0, 6).toUpperCase()}</span>
      </div>
    </div>

    <button className="card-mobile-add" onClick={() => onAddToCart(product)}>
      <ShoppingBag size={13} /> Add to Bag
    </button>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN SHOP PAGE
───────────────────────────────────────────── */
const ShopPage = ({ products = [], onAddToCart = () => {} }) => {
  const [activeDept, setActiveDept]       = useState('all');
  const [searchQuery, setSearchQuery]     = useState('');
  const [sortBy, setSortBy]               = useState('default');
  const [sortOpen, setSortOpen]           = useState(false);
  const [wishlist, setWishlist]           = useState(new Set());
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const depts = useMemo(() => getDepts(products), [products]);

  const activeDeptObj = useMemo(() => depts.find(d => d.id === activeDept), [depts, activeDept]);

  const filtered = useMemo(() => {
    let list = products.filter(activeDeptObj?.filter || (() => true));

    if (showWishlistOnly) list = list.filter(p => wishlist.has(p.id));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price-asc':  return [...list].sort((a, b) => Number(a.price) - Number(b.price));
      case 'price-desc': return [...list].sort((a, b) => Number(b.price) - Number(a.price));
      case 'name-asc':   return [...list].sort((a, b) => a.name?.localeCompare(b.name));
      case 'name-desc':  return [...list].sort((a, b) => b.name?.localeCompare(a.name));
      default:           return list;
    }
  }, [products, activeDeptObj, searchQuery, sortBy, wishlist, showWishlistOnly]);

  const toggleWishlist = useCallback((id) => {
    setWishlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const currentSort = SORT_OPTIONS.find(o => o.id === sortBy);

  return (
    <>
      <style>{STYLES}</style>
      <div className="shop-root">

        {/* ── HEADER ── */}
        <div className="shop-header">
          <div className="shop-header-inner">
            <div>
              <p className="shop-eyebrow">Universal Archive / 2026 Edition</p>
              <h1 className="shop-title">
                High-Definition<br />
                <em>Curations.</em>
              </h1>
            </div>
            <p className="shop-subtitle">
              International inventory curated for technical brilliance and vibrant character.
              All prices in USD.
            </p>
          </div>
        </div>

        {/* ── STICKY CONTROLS ── */}
        <div className="controls-bar">
          <div className="controls-inner">
            {/* Dept tabs */}
            <nav className="dept-nav">
              {depts.map(d => (
                <button
                  key={d.id}
                  className={`dept-btn${activeDept === d.id ? ' active' : ''}`}
                  onClick={() => { setActiveDept(d.id); setShowWishlistOnly(false); }}
                >
                  <span>{d.emoji}</span>
                  {d.label}
                  <span className="dept-count">
                    {d.id === 'all' ? products.length : products.filter(d.filter).length}
                  </span>
                </button>
              ))}
            </nav>

            {/* Search + sort + wishlist */}
            <div className="search-sort-row">
              <div className="search-wrap">
                <Search size={12} className="search-icon" />
                <input
                  className="search-input"
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              <span className="results-count">{filtered.length} items</span>

              <button
                className={`wishlist-toggle${showWishlistOnly ? ' active' : ''}`}
                onClick={() => setShowWishlistOnly(v => !v)}
              >
                <Heart size={11} fill={showWishlistOnly ? '#e87070' : 'none'} />
                Saved ({wishlist.size})
              </button>

              <div style={{ position: 'relative' }}>
                <button
                  className={`sort-btn${sortOpen ? ' open' : ''}`}
                  onClick={() => setSortOpen(v => !v)}
                >
                  <ArrowUpDown size={11} />
                  {currentSort?.label}
                  <ChevronDown size={10} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {sortOpen && (
                  <div className="sort-dropdown">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        className={`sort-option${sortBy === opt.id ? ' selected' : ''}`}
                        onClick={() => { setSortBy(opt.id); setSortOpen(false); }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── PRODUCT GRID ── */}
        <main className="shop-main">
          {activeDept === 'all' ? (
            /* All mode: show by department sections */
            depts.filter(d => d.id !== 'all').map(dept => {
              let items = products.filter(dept.filter);
              if (showWishlistOnly) items = items.filter(p => wishlist.has(p.id));
              if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                items = items.filter(p =>
                  p.name?.toLowerCase().includes(q) ||
                  p.category?.toLowerCase().includes(q)
                );
              }
              if (sortBy !== 'default') {
                items = [...items].sort((a, b) => {
                  if (sortBy === 'price-asc')  return Number(a.price) - Number(b.price);
                  if (sortBy === 'price-desc') return Number(b.price) - Number(a.price);
                  if (sortBy === 'name-asc')   return a.name?.localeCompare(b.name);
                  if (sortBy === 'name-desc')  return b.name?.localeCompare(a.name);
                  return 0;
                });
              }
              if (items.length === 0) return null;
              return (
                <section key={dept.id} id={dept.id} className="dept-section">
                  <div className="dept-heading">
                    <span className="dept-heading-label">{dept.emoji} {dept.label}</span>
                    <div className="dept-heading-line" />
                    <span className="dept-heading-num">{String(items.length).padStart(2, '0')}</span>
                  </div>
                  <div className="products-grid">
                    {items.map((p, i) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onAddToCart={onAddToCart}
                        onQuickView={setQuickViewProduct}
                        wishlisted={wishlist.has(p.id)}
                        onToggleWishlist={toggleWishlist}
                        animDelay={i * 40}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          ) : (
            /* Single dept mode */
            <section className="dept-section">
              <div className="dept-heading">
                <span className="dept-heading-label">{activeDeptObj?.emoji} {activeDeptObj?.label}</span>
                <div className="dept-heading-line" />
                <span className="dept-heading-num">{String(filtered.length).padStart(2, '0')}</span>
              </div>
              <div className="products-grid">
                {filtered.length > 0 ? (
                  filtered.map((p, i) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={onAddToCart}
                      onQuickView={setQuickViewProduct}
                      wishlisted={wishlist.has(p.id)}
                      onToggleWishlist={toggleWishlist}
                      animDelay={i * 40}
                    />
                  ))
                ) : (
                  <div className="empty-state">
                    <span className="empty-state-emoji">◌</span>
                    <p className="empty-state-text">
                      {searchQuery ? 'No results found' : showWishlistOnly ? 'No saved items' : 'Registry Empty'}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </main>

        {/* ── QUICK VIEW MODAL ── */}
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={onAddToCart}
            wishlisted={wishlist.has(quickViewProduct.id)}
            onToggleWishlist={toggleWishlist}
          />
        )}

        {/* Close sort dropdown on outside click */}
        {sortOpen && (
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 39 }}
            onClick={() => setSortOpen(false)}
          />
        )}
      </div>
    </>
  );
};

export default ShopPage;