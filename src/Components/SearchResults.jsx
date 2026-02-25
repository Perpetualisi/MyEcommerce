import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, ArrowUpDown, X, History, ChevronDown, Heart, Eye } from 'lucide-react';

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sr-root {
    font-family: 'Overpass Mono', monospace;
    background: #080705;
    color: #e8e4dd;
    min-height: 100vh;
  }

  /* ── PAGE WRAPPER ── */
  .sr-wrap {
    max-width: 1440px;
    margin: 0 auto;
    padding: 120px 6vw 120px;
  }

  /* ── HEADER ── */
  .sr-header { margin-bottom: 56px; }

  .sr-header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 40px;
  }

  .sr-eyebrow {
    display: flex; align-items: center; gap: 14px;
  }
  .sr-eyebrow-line { width: 28px; height: 1px; background: #C9A96E; }
  .sr-eyebrow-text {
    font-size: 9px; letter-spacing: 0.55em;
    text-transform: uppercase; color: rgba(255,255,255,0.28);
  }

  .sr-recent {
    display: none;
    align-items: center; gap: 16px;
  }
  @media (min-width: 640px) { .sr-recent { display: flex; } }
  .sr-recent-label {
    font-size: 7.5px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.18);
    display: flex; align-items: center; gap: 7px;
  }
  .sr-recent-btn {
    font-size: 8px; letter-spacing: 0.38em; text-transform: uppercase;
    color: rgba(255,255,255,0.28);
    background: none; border: none; cursor: pointer;
    font-family: 'Overpass Mono', monospace;
    transition: color 0.25s;
    padding: 4px 8px;
    border: 1px solid rgba(255,255,255,0.06);
  }
  .sr-recent-btn:hover { color: #C9A96E; border-color: rgba(201,169,110,0.3); }

  /* ── SEARCH INPUT ── */
  .sr-input-wrap {
    position: relative;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 0;
  }
  .sr-input {
    width: 100%;
    background: none; border: none; outline: none;
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-weight: 300;
    font-size: clamp(36px, 6vw, 86px);
    color: #fff;
    caret-color: #C9A96E;
    letter-spacing: -0.01em;
    line-height: 1.1;
  }
  .sr-input::placeholder { color: rgba(255,255,255,0.1); }
  .sr-input-icon {
    position: absolute; right: 0; top: 50%;
    transform: translateY(-60%);
    color: rgba(255,255,255,0.15);
    pointer-events: none;
    transition: color 0.3s;
  }
  .sr-input-wrap:focus-within .sr-input-icon { color: #C9A96E; }
  .sr-clear-btn {
    position: absolute; right: 44px; top: 50%;
    transform: translateY(-60%);
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.2);
    transition: color 0.25s;
    display: flex; align-items: center;
  }
  .sr-clear-btn:hover { color: rgba(255,255,255,0.7); }

  /* ── TOOLBAR ── */
  .sr-toolbar {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 24px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    margin-bottom: 48px;
  }
  @media (min-width: 768px) {
    .sr-toolbar { flex-direction: row; align-items: center; justify-content: space-between; }
  }

  /* Categories */
  .sr-cats {
    display: flex; flex-wrap: wrap; gap: 0;
    overflow-x: auto; scrollbar-width: none;
  }
  .sr-cats::-webkit-scrollbar { display: none; }
  .sr-cat-btn {
    padding: 10px 0; margin-right: 24px;
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    background: none; border: none; cursor: pointer;
    position: relative;
    transition: color 0.3s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .sr-cat-btn:hover { color: rgba(255,255,255,0.7); }
  .sr-cat-btn.active { color: #fff; }
  .sr-cat-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px; background: #C9A96E;
  }

  /* Sort */
  .sr-sort-wrap { position: relative; flex-shrink: 0; }
  .sr-sort-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 16px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.4);
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px; letter-spacing: 0.3em; text-transform: uppercase;
    cursor: pointer; white-space: nowrap;
    transition: background 0.2s, color 0.2s;
  }
  .sr-sort-btn:hover, .sr-sort-btn.open {
    background: rgba(255,255,255,0.07); color: #fff;
    border-color: rgba(255,255,255,0.13);
  }
  .sr-sort-dropdown {
    position: absolute; top: calc(100% + 4px); right: 0;
    background: #141210;
    border: 1px solid rgba(255,255,255,0.08);
    min-width: 200px; z-index: 30;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    animation: ddIn 0.2s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes ddIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
  .sr-sort-opt {
    display: block; width: 100%;
    padding: 12px 16px;
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px; letter-spacing: 0.25em; text-transform: uppercase;
    color: rgba(255,255,255,0.38);
    background: none; border: none; cursor: pointer; text-align: left;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.2s, color 0.2s;
  }
  .sr-sort-opt:last-child { border-bottom: none; }
  .sr-sort-opt:hover { background: rgba(255,255,255,0.04); color: #fff; }
  .sr-sort-opt.selected { color: #C9A96E; }

  /* ── RESULTS META ── */
  .sr-meta {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 40px;
  }
  .sr-meta-line { width: 28px; height: 1px; background: rgba(255,255,255,0.1); }
  .sr-meta-text {
    font-size: 8px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.22);
  }
  .sr-meta-count { color: #C9A96E; }

  /* ── SKELETON ── */
  .sr-skel-grid {
    display: grid;
    grid-template-columns: repeat(4,1fr); gap: 2px;
  }
  @media (max-width: 1100px) { .sr-skel-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 768px)  { .sr-skel-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px)  { .sr-skel-grid { grid-template-columns: 1fr; } }
  .sr-skel-card { display: flex; flex-direction: column; gap: 10px; }
  .skel {
    background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
    background-size: 400% 100%;
    animation: shimmer 1.6s ease infinite;
  }
  @keyframes shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
  .skel-img   { aspect-ratio: 4/5; }
  .skel-line  { height: 10px; }
  .skel-short { width: 55%; }
  .skel-long  { width: 80%; }

  /* ── PRODUCT GRID ── */
  .sr-grid {
    display: grid;
    grid-template-columns: repeat(4,1fr); gap: 2px;
  }
  @media (max-width: 1100px) { .sr-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 768px)  { .sr-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px)  { .sr-grid { grid-template-columns: 1fr; } }

  /* ── PRODUCT CARD ── */
  .sr-card {
    position: relative; display: flex; flex-direction: column;
    background: #0d0b09;
    opacity: 0; transform: translateY(14px);
    transition: background 0.3s;
  }
  .sr-card.in { animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes cardIn { to { opacity: 1; transform: translateY(0); } }
  .sr-card:hover { background: #111008; }

  .sr-card-img-wrap {
    position: relative; aspect-ratio: 4/5;
    overflow: hidden; background: #111008; cursor: pointer;
  }
  .sr-card-img {
    width: 100%; height: 100%; object-fit: contain; padding: 24px;
    transition: transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94);
  }
  .sr-card:hover .sr-card-img { transform: scale(1.07); }

  .sr-card-overlay {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    justify-content: space-between; padding: 14px;
    opacity: 0; transition: opacity 0.3s;
  }
  .sr-card:hover .sr-card-overlay { opacity: 1; }

  .sr-overlay-top {
    display: flex; justify-content: space-between; align-items: flex-start;
  }
  .sr-cat-pill {
    font-size: 7.5px; letter-spacing: 0.4em; text-transform: uppercase;
    padding: 5px 10px; background: #C9A96E; color: #080705;
  }
  .sr-overlay-icons { display: flex; gap: 6px; }

  .sr-icon-btn {
    width: 34px; height: 34px;
    background: rgba(8,7,5,0.85); backdrop-filter: blur(8px);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: rgba(255,255,255,0.55);
    transition: background 0.2s, color 0.2s;
  }
  .sr-icon-btn:hover { background: rgba(20,18,14,0.98); color: #fff; }
  .sr-icon-btn.wished { color: #e87070; border-color: rgba(232,112,112,0.3); }

  .sr-overlay-bottom { display: flex; flex-direction: column; gap: 6px; }
  .sr-add-btn {
    width: 100%; padding: 11px;
    background: #C9A96E; border: none;
    color: #080705; font-family: 'Overpass Mono', monospace;
    font-size: 7.5px; letter-spacing: 0.4em; text-transform: uppercase;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px;
    transform: translateY(8px);
    transition: transform 0.3s ease 0.04s, background 0.2s;
  }
  .sr-card:hover .sr-add-btn { transform: translateY(0); }
  .sr-add-btn:hover { background: #d4b87a; }

  .sr-card-info {
    padding: 16px 18px 18px;
    border-top: 1px solid rgba(255,255,255,0.04);
    display: flex; flex-direction: column; gap: 10px;
  }
  .sr-card-name {
    font-size: 10px; letter-spacing: 0.05em;
    text-transform: uppercase; color: rgba(255,255,255,0.72); line-height: 1.5;
  }
  .sr-card-bottom { display: flex; justify-content: space-between; align-items: center; }
  .sr-card-price { font-size: 11px; font-weight: 600; color: #fff; letter-spacing: 0.04em; }
  .sr-card-dept { font-size: 7.5px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.18); }

  .sr-mobile-add {
    display: none; width: 100%; padding: 13px;
    background: rgba(255,255,255,0.04);
    border: none; border-top: 1px solid rgba(255,255,255,0.04);
    color: rgba(255,255,255,0.45); font-family: 'Overpass Mono', monospace;
    font-size: 8px; letter-spacing: 0.35em; text-transform: uppercase;
    cursor: pointer; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.2s, color 0.2s;
  }
  .sr-mobile-add:active { background: rgba(201,169,110,0.1); color: #C9A96E; }
  @media (max-width: 768px) {
    .sr-mobile-add { display: flex; }
    .sr-card-overlay { display: none; }
  }

  /* ── EMPTY STATE ── */
  .sr-empty {
    padding: 100px 0;
    display: flex; flex-direction: column;
    align-items: center; gap: 24px; text-align: center;
  }
  .sr-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-weight: 300;
    font-size: clamp(22px, 3vw, 36px);
    color: rgba(255,255,255,0.3);
  }
  .sr-empty-sub {
    font-size: 8.5px; letter-spacing: 0.45em;
    text-transform: uppercase; color: rgba(255,255,255,0.18);
  }
  .sr-empty-btn {
    padding: 14px 32px;
    border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.35);
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px; letter-spacing: 0.4em; text-transform: uppercase;
    background: none; cursor: pointer;
    transition: border-color 0.3s, color 0.3s;
  }
  .sr-empty-btn:hover { border-color: #C9A96E; color: #C9A96E; }

  /* Mobile padding */
  @media (max-width: 480px) { .sr-wrap { padding: 90px 5vw 80px; } }
`;

const SORT_OPTIONS = [
  { id: 'newest',     label: 'Latest Ingested' },
  { id: 'price-asc',  label: 'Price: Low → High' },
  { id: 'price-desc', label: 'Price: High → Low' },
  { id: 'alpha',      label: 'Name: A → Z' },
];

/* ═══════════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════════ */
const ProductCard = ({ product, onAddToCart, animDelay, visible }) => {
  const [wished, setWished] = useState(false);

  const img = product.image || product.imageUrl || product.imageURL;
  const price = typeof product.price === 'number'
    ? `$${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    : product.price;

  return (
    <div className={`sr-card${visible ? ' in' : ''}`} style={{ animationDelay: `${animDelay}ms` }}>
      <div className="sr-card-img-wrap">
        <img className="sr-card-img" src={img} alt={product.name}
          onError={e => { e.target.style.opacity = 0.05; }} />

        <div className="sr-card-overlay">
          <div className="sr-overlay-top">
            <span className="sr-cat-pill">{product.category || 'Item'}</span>
            <div className="sr-overlay-icons">
              <button
                className={`sr-icon-btn${wished ? ' wished' : ''}`}
                onClick={e => { e.stopPropagation(); setWished(v => !v); }}
              >
                <Heart size={12} fill={wished ? '#e87070' : 'none'} strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div className="sr-overlay-bottom">
            <button className="sr-add-btn" onClick={() => onAddToCart(product)}>
              <Plus size={10} /> Add to Bag
            </button>
          </div>
        </div>
      </div>

      <div className="sr-card-info">
        <p className="sr-card-name">{product.name}</p>
        <div className="sr-card-bottom">
          <span className="sr-card-price">{price}</span>
          <span className="sr-card-dept">{product.category}</span>
        </div>
      </div>

      <button className="sr-mobile-add" onClick={() => onAddToCart(product)}>
        <Plus size={12} /> Add to Bag
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
const SearchResults = ({ allProducts = [], onAddToCart = () => {} }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm]     = useState(searchParams.get('query') || searchParams.get('q') || '');
  const [selectedCat, setSelectedCat]   = useState('All');
  const [sortBy, setSortBy]             = useState('newest');
  const [sortOpen, setSortOpen]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recent_inquiries') || '[]'); } catch { return []; }
  });

  // Sync URL ← state
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchParams(searchTerm.trim() ? { query: searchTerm.trim() } : {}, { replace: true });
      if (searchTerm.trim().length > 2) {
        const updated = [searchTerm.trim(), ...recentSearches.filter(s => s !== searchTerm.trim())].slice(0, 4);
        setRecentSearches(updated);
        try { localStorage.setItem('recent_inquiries', JSON.stringify(updated)); } catch {}
      }
    }, 420);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Sync state ← URL
  useEffect(() => {
    const q = searchParams.get('query') || searchParams.get('q') || '';
    setSearchTerm(q);
  }, [searchParams]);

  // Debounced loading + card reveal
  useEffect(() => {
    setLoading(true);
    setCardsVisible(false);
    const t = setTimeout(() => {
      setLoading(false);
      setTimeout(() => setCardsVisible(true), 60);
    }, 520);
    return () => clearTimeout(t);
  }, [searchTerm, selectedCat, sortBy]);

  const categories = useMemo(() => [
    'All', ...new Set(allProducts.map(p => p.category).filter(Boolean))
  ], [allProducts]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    let list = allProducts.filter(p => {
      const matchQ = !q ||
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q);
      const matchC = selectedCat === 'All' || p.category === selectedCat;
      return matchQ && matchC;
    });
    switch (sortBy) {
      case 'price-asc':  return [...list].sort((a,b) => Number(a.price) - Number(b.price));
      case 'price-desc': return [...list].sort((a,b) => Number(b.price) - Number(a.price));
      case 'alpha':      return [...list].sort((a,b) => (a.name||'').localeCompare(b.name||''));
      default:           return list;
    }
  }, [allProducts, searchTerm, selectedCat, sortBy]);

  const clearAll = useCallback(() => {
    setSearchTerm('');
    setSelectedCat('All');
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const currentSort = SORT_OPTIONS.find(o => o.id === sortBy);

  return (
    <>
      <style>{STYLES}</style>
      <div className="sr-root">
        <div className="sr-wrap">

          {/* ── HEADER ── */}
          <div className="sr-header">
            <div className="sr-header-top">
              <div className="sr-eyebrow">
                <div className="sr-eyebrow-line" />
                <span className="sr-eyebrow-text">Registry Index · 2026</span>
              </div>

              {recentSearches.length > 0 && (
                <div className="sr-recent">
                  <span className="sr-recent-label">
                    <History size={10} /> Recent
                  </span>
                  {recentSearches.map(s => (
                    <button key={s} className="sr-recent-btn" onClick={() => setSearchTerm(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Big search input */}
            <div className="sr-input-wrap">
              <input
                autoFocus
                className="sr-input"
                type="text"
                placeholder="Search the archive..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="sr-clear-btn" onClick={() => setSearchTerm('')}>
                  <X size={18} strokeWidth={1.5} />
                </button>
              )}
              <Search size={28} strokeWidth={1.2} className="sr-input-icon" />
            </div>
          </div>

          {/* ── TOOLBAR ── */}
          <div className="sr-toolbar">
            {/* Category tabs */}
            <div className="sr-cats">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`sr-cat-btn${selectedCat === cat ? ' active' : ''}`}
                  onClick={() => setSelectedCat(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="sr-sort-wrap">
              <button
                className={`sr-sort-btn${sortOpen ? ' open' : ''}`}
                onClick={() => setSortOpen(v => !v)}
              >
                <ArrowUpDown size={11} />
                {currentSort?.label}
                <ChevronDown size={10} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              {sortOpen && (
                <div className="sr-sort-dropdown">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      className={`sr-sort-opt${sortBy === opt.id ? ' selected' : ''}`}
                      onClick={() => { setSortBy(opt.id); setSortOpen(false); }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── RESULTS META ── */}
          {!loading && (
            <div className="sr-meta">
              <div className="sr-meta-line" />
              <span className="sr-meta-text">
                <span className="sr-meta-count">{filtered.length}</span>
                {' '}result{filtered.length !== 1 ? 's' : ''} found
                {searchTerm && <> for "<em style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>{searchTerm}</em>"</>}
              </span>
            </div>
          )}

          {/* ── CONTENT ── */}
          {loading ? (
            /* Skeleton */
            <div className="sr-skel-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="sr-skel-card">
                  <div className="skel skel-img" style={{ animationDelay: `${i * 60}ms` }} />
                  <div className="skel skel-line skel-long" style={{ animationDelay: `${i * 60 + 80}ms` }} />
                  <div className="skel skel-line skel-short" style={{ animationDelay: `${i * 60 + 140}ms` }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            /* Empty */
            <div className="sr-empty">
              <p className="sr-empty-title">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : 'No objects match your filter.'}
              </p>
              <p className="sr-empty-sub">Try a different search or clear the filter</p>
              <button className="sr-empty-btn" onClick={clearAll}>
                Clear Archive Filter
              </button>
            </div>
          ) : (
            /* Products */
            <div className="sr-grid">
              {filtered.map((product, i) => (
                <ProductCard
                  key={product.id || i}
                  product={product}
                  onAddToCart={onAddToCart}
                  animDelay={Math.min(i * 45, 400)}
                  visible={cardsVisible}
                />
              ))}
            </div>
          )}
        </div>

        {/* Close sort on outside click */}
        {sortOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 29 }} onClick={() => setSortOpen(false)} />
        )}
      </div>
    </>
  );
};

export default SearchResults;