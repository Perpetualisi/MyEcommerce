import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Search, Plus, ArrowUpDown, X, History, ChevronDown,
  Heart, Grid3X3, LayoutList, SlidersHorizontal,
  Eye, ShoppingBag, ArrowUpRight, Tag
} from 'lucide-react';

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .sr-root { font-family: 'Overpass Mono', monospace; background: #080705; color: #e8e4dd; min-height: 100vh; }
  .sr-wrap { max-width: 1440px; margin: 0 auto; padding: 120px 6vw 120px; }
  @media (max-width: 480px) { .sr-wrap { padding: 90px 5vw 80px; } }

  /* HEADER */
  .sr-header { margin-bottom: 48px; }
  .sr-header-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 36px; }
  .sr-eyebrow { display: flex; align-items: center; gap: 14px; }
  .sr-eyebrow-line { width: 28px; height: 1px; background: #C9A96E; }
  .sr-eyebrow-text { font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(255,255,255,0.28); }

  /* Recent searches */
  .sr-recent { display: none; align-items: center; gap: 12px; flex-wrap: wrap; }
  @media (min-width: 640px) { .sr-recent { display: flex; } }
  .sr-recent-label { font-size: 7.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.18); display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
  .sr-recent-chip { display: flex; align-items: center; border: 1px solid rgba(255,255,255,0.07); overflow: hidden; }
  .sr-recent-btn { font-size: 8px; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(255,255,255,0.3); background: none; border: none; cursor: pointer; font-family: 'Overpass Mono', monospace; transition: color 0.25s, background 0.2s; padding: 6px 10px; }
  .sr-recent-btn:hover { color: #C9A96E; background: rgba(201,169,110,0.06); }
  .sr-recent-del { padding: 6px 7px; background: none; border: none; border-left: 1px solid rgba(255,255,255,0.07); cursor: pointer; color: rgba(255,255,255,0.18); transition: color 0.2s; display: flex; align-items: center; }
  .sr-recent-del:hover { color: rgba(255,255,255,0.7); }

  /* Search input */
  .sr-input-wrap { position: relative; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .sr-input { width: 100%; background: none; border: none; outline: none; font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; font-size: clamp(36px,6vw,86px); color: #fff; caret-color: #C9A96E; letter-spacing: -0.01em; line-height: 1.1; }
  .sr-input::placeholder { color: rgba(255,255,255,0.1); }
  .sr-input-icon { position: absolute; right: 0; top: 50%; transform: translateY(-60%); color: rgba(255,255,255,0.15); pointer-events: none; transition: color 0.3s; }
  .sr-input-wrap:focus-within .sr-input-icon { color: #C9A96E; }
  .sr-clear-btn { position: absolute; right: 44px; top: 50%; transform: translateY(-60%); background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.2); transition: color 0.25s; display: flex; align-items: center; }
  .sr-clear-btn:hover { color: rgba(255,255,255,0.7); }

  /* TOOLBAR */
  .sr-toolbar { display: flex; flex-direction: column; gap: 14px; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
  @media (min-width: 768px) { .sr-toolbar { flex-direction: row; align-items: center; justify-content: space-between; } }
  .sr-cats { display: flex; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
  .sr-cats::-webkit-scrollbar { display: none; }
  .sr-cat-btn { padding: 10px 0; margin-right: 24px; font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.25); background: none; border: none; cursor: pointer; position: relative; transition: color 0.3s; white-space: nowrap; flex-shrink: 0; }
  .sr-cat-btn:hover { color: rgba(255,255,255,0.7); }
  .sr-cat-btn.active { color: #fff; }
  .sr-cat-btn.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px; background: #C9A96E; }
  .sr-toolbar-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

  /* Price filter */
  .sr-price-btn { display: flex; align-items: center; gap: 7px; padding: 9px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: rgba(255,255,255,0.4); font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.2s, color 0.2s; }
  .sr-price-btn:hover { background: rgba(255,255,255,0.07); color: #fff; }
  .sr-price-btn.active { border-color: rgba(201,169,110,0.4); color: #C9A96E; background: rgba(201,169,110,0.05); }
  .sr-price-panel { padding: 20px 0 24px; border-bottom: 1px solid rgba(255,255,255,0.05); animation: ddIn 0.25s ease; }
  .sr-price-label { font-size: 8px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.25); margin-bottom: 16px; display: flex; justify-content: space-between; }
  .sr-price-val { color: #C9A96E; }
  .sr-range { width: 100%; appearance: none; -webkit-appearance: none; height: 1px; background: rgba(255,255,255,0.1); outline: none; cursor: pointer; }
  .sr-range::-webkit-slider-thumb { appearance: none; -webkit-appearance: none; width: 14px; height: 14px; background: #C9A96E; cursor: pointer; border: none; }
  .sr-range::-moz-range-thumb { width: 14px; height: 14px; background: #C9A96E; cursor: pointer; border: none; border-radius: 0; }

  /* Sort */
  .sr-sort-wrap { position: relative; }
  .sr-sort-btn { display: flex; align-items: center; gap: 8px; padding: 9px 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: rgba(255,255,255,0.4); font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; white-space: nowrap; transition: background 0.2s, color 0.2s; }
  .sr-sort-btn:hover, .sr-sort-btn.open { background: rgba(255,255,255,0.07); color: #fff; border-color: rgba(255,255,255,0.13); }
  .sr-sort-dropdown { position: absolute; top: calc(100% + 4px); right: 0; background: #141210; border: 1px solid rgba(255,255,255,0.08); min-width: 200px; z-index: 30; box-shadow: 0 20px 50px rgba(0,0,0,0.5); animation: ddIn 0.2s cubic-bezier(0.16,1,0.3,1); }
  @keyframes ddIn { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:translateY(0); } }
  .sr-sort-opt { display: block; width: 100%; padding: 12px 16px; font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.38); background: none; border: none; cursor: pointer; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.2s, color 0.2s; }
  .sr-sort-opt:last-child { border-bottom: none; }
  .sr-sort-opt:hover { background: rgba(255,255,255,0.04); color: #fff; }
  .sr-sort-opt.selected { color: #C9A96E; }

  /* View toggle */
  .sr-view-toggle { display: flex; border: 1px solid rgba(255,255,255,0.07); }
  .sr-view-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.25); transition: background 0.2s, color 0.2s; }
  .sr-view-btn:first-child { border-right: 1px solid rgba(255,255,255,0.07); }
  .sr-view-btn:hover { color: rgba(255,255,255,0.7); }
  .sr-view-btn.active { background: rgba(255,255,255,0.05); color: #fff; }

  /* Wishlist button */
  .sr-wishlist-btn { display: flex; align-items: center; gap: 7px; padding: 9px 14px; background: none; border: 1px solid rgba(255,255,255,0.07); color: rgba(255,255,255,0.3); font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.35em; text-transform: uppercase; cursor: pointer; transition: border-color 0.3s, color 0.3s; }
  .sr-wishlist-btn.has { border-color: rgba(232,112,112,0.3); color: #e87070; }
  .sr-wishlist-btn:hover { border-color: rgba(232,112,112,0.5); color: #e87070; }
  .sr-wl-count { background: #e87070; color: #fff; font-size: 7px; padding: 2px 5px; min-width: 16px; text-align: center; }

  /* META ROW */
  .sr-meta-row { display: flex; align-items: center; justify-content: space-between; padding: 20px 0; border-bottom: 1px solid rgba(255,255,255,0.04); margin-bottom: 40px; flex-wrap: wrap; gap: 12px; }
  .sr-meta { display: flex; align-items: center; gap: 14px; }
  .sr-meta-line { width: 28px; height: 1px; background: rgba(255,255,255,0.1); }
  .sr-meta-text { font-size: 8px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.22); }
  .sr-meta-count { color: #C9A96E; }
  .sr-active-filters { display: flex; gap: 6px; flex-wrap: wrap; }
  .sr-filter-chip { display: flex; align-items: center; gap: 6px; padding: 5px 10px; border: 1px solid rgba(201,169,110,0.25); font-size: 7.5px; letter-spacing: 0.35em; text-transform: uppercase; color: #C9A96E; background: rgba(201,169,110,0.06); }
  .sr-filter-chip button { background: none; border: none; cursor: pointer; color: rgba(201,169,110,0.5); display: flex; align-items: center; transition: color 0.2s; }
  .sr-filter-chip button:hover { color: #C9A96E; }
  .sr-clear-all { font-size: 8px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,0.2); background: none; border: none; cursor: pointer; font-family: 'Overpass Mono', monospace; transition: color 0.3s; white-space: nowrap; }
  .sr-clear-all:hover { color: rgba(255,255,255,0.7); }

  /* SKELETON */
  .sr-skel-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; }
  @media (max-width: 1100px) { .sr-skel-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 768px)  { .sr-skel-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px)  { .sr-skel-grid { grid-template-columns: 1fr; } }
  .sr-skel-card { display: flex; flex-direction: column; gap: 10px; }
  .skel { background: linear-gradient(90deg,rgba(255,255,255,0.04) 25%,rgba(255,255,255,0.08) 50%,rgba(255,255,255,0.04) 75%); background-size: 400% 100%; animation: shimmer 1.6s ease infinite; }
  @keyframes shimmer { 0% { background-position:100% 0; } 100% { background-position:-100% 0; } }
  .skel-img { aspect-ratio: 4/5; }
  .skel-line { height: 10px; }
  .skel-short { width: 55%; }
  .skel-long { width: 80%; }

  /* GRID */
  .sr-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; }
  @media (max-width: 1100px) { .sr-grid { grid-template-columns: repeat(3,1fr); } }
  @media (max-width: 768px)  { .sr-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 480px)  { .sr-grid { grid-template-columns: 1fr; } }

  /* LIST VIEW */
  .sr-list { display: flex; flex-direction: column; gap: 2px; }
  .sr-list-item { display: grid; grid-template-columns: 90px 1fr auto; gap: 20px; background: #0d0b09; padding: 16px 20px; align-items: center; transition: background 0.25s; opacity: 0; transform: translateY(8px); }
  .sr-list-item.in { animation: cardIn 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .sr-list-item:hover { background: #111008; }
  .sr-list-img { aspect-ratio: 3/4; overflow: hidden; background: #111008; }
  .sr-list-img img { width: 100%; height: 100%; object-fit: cover; }
  .sr-list-cat { font-size: 7.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.22); margin-bottom: 5px; }
  .sr-list-name { font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.75); margin-bottom: 8px; line-height: 1.4; }
  .sr-list-price { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; }
  .sr-list-actions { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
  .sr-list-btn { padding: 9px 14px; background: none; border: 1px solid rgba(255,255,255,0.07); color: rgba(255,255,255,0.35); font-family: 'Overpass Mono', monospace; font-size: 7.5px; letter-spacing: 0.38em; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: border-color 0.25s, color 0.25s; }
  .sr-list-btn:hover { border-color: rgba(255,255,255,0.25); color: #fff; }
  .sr-list-btn.add:hover { border-color: #C9A96E; color: #C9A96E; }
  .sr-list-btn.wished { color: #e87070; border-color: rgba(232,112,112,0.25); }
  @media (max-width: 600px) { .sr-list-item { grid-template-columns: 72px 1fr; } .sr-list-actions { grid-column: 1/-1; } }

  /* GRID CARD */
  .sr-card { position: relative; display: flex; flex-direction: column; background: #0d0b09; opacity: 0; transform: translateY(14px); transition: background 0.3s; }
  .sr-card.in { animation: cardIn 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  @keyframes cardIn { to { opacity:1; transform:translateY(0); } }
  .sr-card:hover { background: #111008; }
  .sr-card-img-wrap { position: relative; aspect-ratio: 4/5; overflow: hidden; background: #111008; cursor: pointer; }
  .sr-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94); }
  .sr-card:hover .sr-card-img { transform: scale(1.07); }
  .sr-card-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: space-between; padding: 14px; opacity: 0; transition: opacity 0.3s; }
  .sr-card:hover .sr-card-overlay { opacity: 1; }
  .sr-overlay-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .sr-cat-pill { font-size: 7.5px; letter-spacing: 0.4em; text-transform: uppercase; padding: 5px 10px; background: #C9A96E; color: #080705; }
  .sr-overlay-icons { display: flex; gap: 6px; }
  .sr-icon-btn { width: 34px; height: 34px; background: rgba(8,7,5,0.85); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,0.55); transition: background 0.2s, color 0.2s; }
  .sr-icon-btn:hover { background: rgba(20,18,14,0.98); color: #fff; }
  .sr-icon-btn.wished { color: #e87070; border-color: rgba(232,112,112,0.3); }
  .sr-overlay-bottom { display: flex; flex-direction: column; gap: 6px; }
  .sr-add-btn { width: 100%; padding: 11px; background: #C9A96E; border: none; color: #080705; font-family: 'Overpass Mono', monospace; font-size: 7.5px; letter-spacing: 0.4em; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; transform: translateY(8px); transition: transform 0.3s ease 0.04s, background 0.2s; }
  .sr-card:hover .sr-add-btn { transform: translateY(0); }
  .sr-add-btn:hover { background: #d4b87a; }
  .sr-quick-btn { width: 100%; padding: 9px; background: rgba(8,7,5,0.85); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.55); font-family: 'Overpass Mono', monospace; font-size: 7px; letter-spacing: 0.4em; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; transform: translateY(8px); transition: transform 0.3s ease 0.08s, color 0.2s; }
  .sr-card:hover .sr-quick-btn { transform: translateY(0); }
  .sr-quick-btn:hover { color: #fff; }
  .sr-card-info { padding: 16px 18px 18px; border-top: 1px solid rgba(255,255,255,0.04); display: flex; flex-direction: column; gap: 10px; }
  .sr-card-name { font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; color: rgba(255,255,255,0.72); line-height: 1.5; }
  .sr-card-bottom { display: flex; justify-content: space-between; align-items: center; }
  .sr-card-price { font-size: 11px; font-weight: 600; color: #fff; letter-spacing: 0.04em; }
  .sr-card-dept { font-size: 7.5px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.18); }
  .sr-mobile-add { display: none; width: 100%; padding: 13px; background: rgba(255,255,255,0.04); border: none; border-top: 1px solid rgba(255,255,255,0.04); color: rgba(255,255,255,0.45); font-family: 'Overpass Mono', monospace; font-size: 8px; letter-spacing: 0.35em; text-transform: uppercase; cursor: pointer; align-items: center; justify-content: center; gap: 8px; transition: background 0.2s, color 0.2s; }
  .sr-mobile-add:active { background: rgba(201,169,110,0.1); color: #C9A96E; }
  @media (max-width: 768px) { .sr-mobile-add { display: flex; } .sr-card-overlay { display: none; } }

  /* QUICK VIEW */
  .qv-backdrop { position: fixed; inset: 0; background: rgba(4,3,2,0.88); backdrop-filter: blur(16px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; animation: bkIn 0.25s ease; }
  @keyframes bkIn { from { opacity:0; } to { opacity:1; } }
  .qv-panel { background: #0f0d0a; border: 1px solid rgba(255,255,255,0.08); max-width: 820px; width: 100%; display: grid; grid-template-columns: 1fr 1fr; max-height: 90vh; animation: panelUp 0.4s cubic-bezier(0.16,1,0.3,1); overflow: hidden; }
  @media (max-width: 640px) { .qv-panel { grid-template-columns: 1fr; overflow-y: auto; max-height: 85vh; } }
  @keyframes panelUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  .qv-img-col { position: relative; aspect-ratio: 3/4; overflow: hidden; background: #111008; }
  @media (max-width: 640px) { .qv-img-col { aspect-ratio: 4/3; } }
  .qv-img { width: 100%; height: 100%; object-fit: cover; }
  .qv-close-btn { position: absolute; top: 14px; right: 14px; background: rgba(8,7,5,0.85); border: 1px solid rgba(255,255,255,0.1); width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: rgba(255,255,255,0.5); transition: color 0.2s; }
  .qv-close-btn:hover { color: #fff; }
  .qv-info-col { padding: 36px 32px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
  .qv-cat { font-size: 8px; letter-spacing: 0.55em; text-transform: uppercase; color: #C9A96E; }
  .qv-name { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; font-size: clamp(22px,3vw,36px); color: #fff; line-height: 1.1; }
  .qv-price { font-size: 18px; font-weight: 600; color: #fff; }
  .qv-divider { height: 1px; background: rgba(255,255,255,0.06); }
  .qv-meta { display: flex; flex-direction: column; gap: 10px; }
  .qv-meta-row { display: flex; justify-content: space-between; }
  .qv-meta-label { font-size: 8px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,0.22); }
  .qv-meta-val { font-size: 8.5px; letter-spacing: 0.2em; color: rgba(255,255,255,0.65); }
  .qv-meta-val.ok { color: #7EBF7A; }
  .qv-actions { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }
  .qv-add-btn { width: 100%; padding: 16px; background: #C9A96E; border: none; font-family: 'Overpass Mono', monospace; font-size: 9px; letter-spacing: 0.5em; text-transform: uppercase; color: #080705; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: background 0.2s; }
  .qv-add-btn:hover { background: #d4b87a; }
  .qv-view-btn { width: 100%; padding: 14px; background: transparent; border: 1px solid rgba(255,255,255,0.08); font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.35); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: border-color 0.3s, color 0.3s; }
  .qv-view-btn:hover { border-color: rgba(255,255,255,0.2); color: rgba(255,255,255,0.75); }
  .qv-wish-btn { width: 100%; padding: 12px; background: transparent; border: 1px solid rgba(255,255,255,0.07); font-family: 'Overpass Mono', monospace; font-size: 8px; letter-spacing: 0.4em; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; color: rgba(255,255,255,0.28); transition: color 0.3s, border-color 0.3s; }
  .qv-wish-btn.on { color: #e87070; border-color: rgba(232,112,112,0.3); }
  .qv-wish-btn:hover { color: #e87070; border-color: rgba(232,112,112,0.3); }

  /* WISHLIST SIDEBAR */
  .wl-panel { position: fixed; top: 80px; right: 0; bottom: 0; z-index: 70; width: 320px; background: #0f0d0a; border-left: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; transform: translateX(100%); transition: transform 0.4s cubic-bezier(0.16,1,0.3,1); box-shadow: -20px 0 50px rgba(0,0,0,0.4); }
  .wl-panel.open { transform: translateX(0); }
  @media (max-width: 480px) { .wl-panel { width: 100vw; top: 0; } }
  .wl-header { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; }
  .wl-title { font-size: 9px; letter-spacing: 0.5em; text-transform: uppercase; color: rgba(255,255,255,0.6); }
  .wl-close { background: none; border: none; color: rgba(255,255,255,0.3); cursor: pointer; padding: 4px; transition: color 0.2s; }
  .wl-close:hover { color: #fff; }
  .wl-items { flex: 1; overflow-y: auto; }
  .wl-item { display: grid; grid-template-columns: 60px 1fr auto; gap: 14px; padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.04); align-items: center; }
  .wl-item-img { aspect-ratio: 3/4; overflow: hidden; background: #111008; }
  .wl-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .wl-item-name { font-size: 8.5px; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.6); line-height: 1.45; margin-bottom: 5px; }
  .wl-item-price { font-size: 10px; font-weight: 600; color: #fff; }
  .wl-item-btns { display: flex; flex-direction: column; gap: 6px; }
  .wl-item-add { padding: 7px 10px; background: #C9A96E; border: none; font-family: 'Overpass Mono', monospace; font-size: 7px; letter-spacing: 0.4em; text-transform: uppercase; color: #080705; cursor: pointer; transition: background 0.2s; }
  .wl-item-add:hover { background: #d4b87a; }
  .wl-item-rm { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.2); padding: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.2s; }
  .wl-item-rm:hover { color: rgba(255,255,255,0.7); }
  .wl-empty { padding: 60px 24px; text-align: center; font-size: 8.5px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,0.2); }

  /* EMPTY STATE */
  .sr-empty { padding: 100px 0; display: flex; flex-direction: column; align-items: center; gap: 24px; text-align: center; }
  .sr-empty-title { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; font-size: clamp(22px,3vw,36px); color: rgba(255,255,255,0.3); }
  .sr-empty-sub { font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.18); }
  .sr-empty-btn { padding: 14px 32px; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.35); font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.4em; text-transform: uppercase; background: none; cursor: pointer; transition: border-color 0.3s, color 0.3s; }
  .sr-empty-btn:hover { border-color: #C9A96E; color: #C9A96E; }

  /* Keyboard hint */
  .sr-kbd { position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%); background: rgba(15,13,10,0.95); border: 1px solid rgba(255,255,255,0.08); padding: 10px 18px; font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.25); display: flex; gap: 16px; pointer-events: none; animation: bkIn 0.3s ease; z-index: 60; }
  kbd { background: rgba(255,255,255,0.07); padding: 2px 6px; color: rgba(255,255,255,0.45); font-family: 'Overpass Mono', monospace; }
`;

const SORT_OPTIONS = [
  { id: 'newest',     label: 'Latest Ingested' },
  { id: 'price-asc',  label: 'Price: Low → High' },
  { id: 'price-desc', label: 'Price: High → Low' },
  { id: 'alpha',      label: 'Name: A → Z' },
];
const MAX_PRICE = 2500;
const fmt = (p) => `$${Number(p).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

/* ═══════════════════════════════════════════════
   QUICK VIEW MODAL
═══════════════════════════════════════════════ */
const QuickView = ({ product, onClose, onAddToCart, wished, onToggleWish }) => {
  const navigate = useNavigate();
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  const img = product.imageURL || product.image || '';
  return (
    <div className="qv-backdrop" onClick={onClose}>
      <div className="qv-panel" onClick={e => e.stopPropagation()}>
        <div className="qv-img-col">
          <img className="qv-img" src={img} alt={product.name} onError={e => { e.target.style.opacity = 0.04; }} />
          <button className="qv-close-btn" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="qv-info-col">
          <span className="qv-cat">{product.category}</span>
          <h2 className="qv-name">{product.name}</h2>
          <span className="qv-price">{fmt(product.price)}</span>
          <div className="qv-divider" />
          <div className="qv-meta">
            <div className="qv-meta-row">
              <span className="qv-meta-label">Status</span>
              <span className="qv-meta-val ok">● In Stock</span>
            </div>
            <div className="qv-meta-row">
              <span className="qv-meta-label">Reference</span>
              <span className="qv-meta-val">{String(product.id).padStart(4,'0').toUpperCase()}</span>
            </div>
            <div className="qv-meta-row">
              <span className="qv-meta-label">Category</span>
              <span className="qv-meta-val">{product.category}</span>
            </div>
          </div>
          <div className="qv-actions">
            <button className="qv-add-btn" onClick={() => { onAddToCart(product); onClose(); }}>
              <ShoppingBag size={13} strokeWidth={1.5} /> Add to Bag
            </button>
            <button className="qv-view-btn" onClick={() => { navigate(`/product/${product.id}`); onClose(); }}>
              Full Detail <ArrowUpRight size={12} />
            </button>
            <button className={`qv-wish-btn${wished ? ' on' : ''}`} onClick={() => onToggleWish(product)}>
              <Heart size={12} fill={wished ? '#e87070' : 'none'} strokeWidth={1.5} />
              {wished ? 'Saved to Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════
   PRODUCT CARD
═══════════════════════════════════════════════ */
const ProductCard = ({ product, onAddToCart, animDelay, visible, wished, onToggleWish, onQuickView }) => {
  const img = product.imageURL || product.image || '';
  return (
    <div className={`sr-card${visible ? ' in' : ''}`} style={{ animationDelay:`${animDelay}ms` }}>
      <div className="sr-card-img-wrap" onClick={() => onQuickView(product)}>
        <img className="sr-card-img" src={img} alt={product.name} onError={e => { e.target.style.opacity = 0.05; }} />
        <div className="sr-card-overlay">
          <div className="sr-overlay-top">
            <span className="sr-cat-pill">{product.category || 'Item'}</span>
            <div className="sr-overlay-icons">
              <button className={`sr-icon-btn${wished ? ' wished' : ''}`} onClick={e => { e.stopPropagation(); onToggleWish(product); }}>
                <Heart size={12} fill={wished ? '#e87070' : 'none'} strokeWidth={1.5} />
              </button>
            </div>
          </div>
          <div className="sr-overlay-bottom">
            <button className="sr-add-btn" onClick={e => { e.stopPropagation(); onAddToCart(product); }}>
              <Plus size={10} /> Add to Bag
            </button>
            <button className="sr-quick-btn" onClick={e => { e.stopPropagation(); onQuickView(product); }}>
              <Eye size={10} /> Quick View
            </button>
          </div>
        </div>
      </div>
      <div className="sr-card-info">
        <p className="sr-card-name">{product.name}</p>
        <div className="sr-card-bottom">
          <span className="sr-card-price">{fmt(product.price)}</span>
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
   MAIN
═══════════════════════════════════════════════ */
const SearchResults = ({ allProducts = [], onAddToCart = () => {} }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm]     = useState(searchParams.get('query') || searchParams.get('q') || '');
  const [selectedCat, setSelectedCat]   = useState('All');
  const [sortBy, setSortBy]             = useState('newest');
  const [sortOpen, setSortOpen]         = useState(false);
  const [viewMode, setViewMode]         = useState('grid');
  const [priceMax, setPriceMax]         = useState(MAX_PRICE);
  const [showPrice, setShowPrice]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [quickView, setQuickView]       = useState(null);
  const [wishlist, setWishlist]         = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showKbd, setShowKbd]           = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recent_inquiries') || '[]'); } catch { return []; }
  });
  const inputRef = useRef(null);

  /* Keyboard shortcuts */
  useEffect(() => {
    const h = (e) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') { e.preventDefault(); inputRef.current?.focus(); }
      if (e.key === 'Escape') { setQuickView(null); setShowWishlist(false); setSortOpen(false); setShowPrice(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  /* Show kbd hint on mount, fade after 4s */
  useEffect(() => { setShowKbd(true); const t = setTimeout(() => setShowKbd(false), 4000); return () => clearTimeout(t); }, []);

  /* Sync URL ← state */
  useEffect(() => {
    const t = setTimeout(() => {
      setSearchParams(searchTerm.trim() ? { query: searchTerm.trim() } : {}, { replace: true });
      if (searchTerm.trim().length > 2) {
        const next = [searchTerm.trim(), ...recentSearches.filter(s => s !== searchTerm.trim())].slice(0, 5);
        setRecentSearches(next);
        try { localStorage.setItem('recent_inquiries', JSON.stringify(next)); } catch {}
      }
    }, 420);
    return () => clearTimeout(t);
  }, [searchTerm]);

  /* Sync state ← URL */
  useEffect(() => {
    const q = searchParams.get('query') || searchParams.get('q') || '';
    setSearchTerm(q);
  }, [searchParams]);

  /* Debounce load */
  useEffect(() => {
    setLoading(true); setCardsVisible(false);
    const t = setTimeout(() => { setLoading(false); setTimeout(() => setCardsVisible(true), 60); }, 480);
    return () => clearTimeout(t);
  }, [searchTerm, selectedCat, sortBy, priceMax]);

  const categories = useMemo(() => ['All', ...new Set(allProducts.map(p => p.category).filter(Boolean))], [allProducts]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    let list = allProducts.filter(p => {
      const matchQ = !q || p.name?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q);
      const matchC = selectedCat === 'All' || p.category === selectedCat;
      const matchP = Number(p.price) <= priceMax;
      return matchQ && matchC && matchP;
    });
    switch (sortBy) {
      case 'price-asc':  return [...list].sort((a,b) => Number(a.price) - Number(b.price));
      case 'price-desc': return [...list].sort((a,b) => Number(b.price) - Number(a.price));
      case 'alpha':      return [...list].sort((a,b) => (a.name||'').localeCompare(b.name||''));
      default: return list;
    }
  }, [allProducts, searchTerm, selectedCat, sortBy, priceMax]);

  const wishlistItems = useMemo(() => allProducts.filter(p => wishlist.includes(p.id)), [wishlist, allProducts]);

  const clearAll = useCallback(() => {
    setSearchTerm(''); setSelectedCat('All'); setPriceMax(MAX_PRICE);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const toggleWish = useCallback((product) => {
    setWishlist(prev => prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]);
  }, []);

  const removeRecent = (s) => {
    const next = recentSearches.filter(r => r !== s);
    setRecentSearches(next);
    try { localStorage.setItem('recent_inquiries', JSON.stringify(next)); } catch {}
  };

  const hasFilters = selectedCat !== 'All' || priceMax < MAX_PRICE;
  const currentSort = SORT_OPTIONS.find(o => o.id === sortBy);

  return (
    <>
      <style>{STYLES}</style>

      {/* Wishlist drawer */}
      <div className={`wl-panel${showWishlist ? ' open' : ''}`}>
        <div className="wl-header">
          <span className="wl-title">Wishlist · {wishlist.length}</span>
          <button className="wl-close" onClick={() => setShowWishlist(false)}><X size={14} /></button>
        </div>
        <div className="wl-items">
          {wishlistItems.length === 0
            ? <div className="wl-empty">No items saved yet.</div>
            : wishlistItems.map(p => (
              <div key={p.id} className="wl-item">
                <div className="wl-item-img"><img src={p.imageURL || p.image || ''} alt={p.name} onError={e => { e.target.style.opacity = 0.04; }} /></div>
                <div>
                  <p className="wl-item-name">{p.name}</p>
                  <p className="wl-item-price">{fmt(p.price)}</p>
                </div>
                <div className="wl-item-btns">
                  <button className="wl-item-add" onClick={() => onAddToCart(p)}>Add</button>
                  <button className="wl-item-rm" onClick={() => toggleWish(p)}><X size={10} /></button>
                </div>
              </div>
            ))
          }
        </div>
      </div>

      <div className="sr-root">
        <div className="sr-wrap">

          {/* HEADER */}
          <div className="sr-header">
            <div className="sr-header-top">
              <div className="sr-eyebrow">
                <div className="sr-eyebrow-line" />
                <span className="sr-eyebrow-text">Registry Index · 2026</span>
              </div>
              {recentSearches.length > 0 && (
                <div className="sr-recent">
                  <span className="sr-recent-label"><History size={10} /> Recent</span>
                  {recentSearches.map(s => (
                    <div key={s} className="sr-recent-chip">
                      <button className="sr-recent-btn" onClick={() => setSearchTerm(s)}>{s}</button>
                      <button className="sr-recent-del" onClick={() => removeRecent(s)}><X size={8} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="sr-input-wrap">
              <input ref={inputRef} autoFocus className="sr-input" type="text" placeholder="Search the archive..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              {searchTerm && <button className="sr-clear-btn" onClick={() => setSearchTerm('')}><X size={18} strokeWidth={1.5} /></button>}
              <Search size={28} strokeWidth={1.2} className="sr-input-icon" />
            </div>
          </div>

          {/* TOOLBAR */}
          <div className="sr-toolbar">
            <div className="sr-cats">
              {categories.map(cat => (
                <button key={cat} className={`sr-cat-btn${selectedCat === cat ? ' active' : ''}`} onClick={() => setSelectedCat(cat)}>{cat}</button>
              ))}
            </div>
            <div className="sr-toolbar-right">
              {/* Price */}
              <button className={`sr-price-btn${showPrice || priceMax < MAX_PRICE ? ' active' : ''}`} onClick={() => setShowPrice(v => !v)}>
                <SlidersHorizontal size={11} />
                {priceMax < MAX_PRICE ? `≤ ${fmt(priceMax)}` : 'Price'}
              </button>
              {/* Wishlist */}
              <button className={`sr-wishlist-btn${wishlist.length > 0 ? ' has' : ''}`} onClick={() => setShowWishlist(v => !v)}>
                <Heart size={11} fill={wishlist.length > 0 ? '#e87070' : 'none'} strokeWidth={1.5} />
                {wishlist.length > 0 && <span className="sr-wl-count">{wishlist.length}</span>}
              </button>
              {/* Sort */}
              <div className="sr-sort-wrap">
                <button className={`sr-sort-btn${sortOpen ? ' open' : ''}`} onClick={() => setSortOpen(v => !v)}>
                  <ArrowUpDown size={11} /> {currentSort?.label}
                  <ChevronDown size={10} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {sortOpen && (
                  <div className="sr-sort-dropdown">
                    {SORT_OPTIONS.map(o => (
                      <button key={o.id} className={`sr-sort-opt${sortBy === o.id ? ' selected' : ''}`}
                        onClick={() => { setSortBy(o.id); setSortOpen(false); }}>{o.label}</button>
                    ))}
                  </div>
                )}
              </div>
              {/* View toggle */}
              <div className="sr-view-toggle">
                <button className={`sr-view-btn${viewMode === 'grid' ? ' active' : ''}`} onClick={() => setViewMode('grid')} title="Grid"><Grid3X3 size={12} /></button>
                <button className={`sr-view-btn${viewMode === 'list' ? ' active' : ''}`} onClick={() => setViewMode('list')} title="List"><LayoutList size={12} /></button>
              </div>
            </div>
          </div>

          {/* Price panel */}
          {showPrice && (
            <div className="sr-price-panel">
              <p className="sr-price-label">Price Range <span className="sr-price-val">{fmt(0)} — {fmt(priceMax)}</span></p>
              <input type="range" className="sr-range" min={0} max={MAX_PRICE} step={50} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} />
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
                <span style={{ fontSize:8, letterSpacing:'0.3em', color:'rgba(255,255,255,0.2)' }}>$0</span>
                <span style={{ fontSize:8, letterSpacing:'0.3em', color:'rgba(255,255,255,0.2)' }}>{fmt(MAX_PRICE)}</span>
              </div>
            </div>
          )}

          {/* Meta */}
          {!loading && (
            <div className="sr-meta-row">
              <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
                <div className="sr-meta">
                  <div className="sr-meta-line" />
                  <span className="sr-meta-text">
                    <span className="sr-meta-count">{filtered.length}</span> result{filtered.length !== 1 ? 's' : ''}
                    {searchTerm && <> for "<em style={{ fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', color:'rgba(255,255,255,0.5)' }}>{searchTerm}</em>"</>}
                  </span>
                </div>
                {hasFilters && (
                  <div className="sr-active-filters">
                    {selectedCat !== 'All' && (
                      <span className="sr-filter-chip"><Tag size={9} />{selectedCat}<button onClick={() => setSelectedCat('All')}><X size={9} /></button></span>
                    )}
                    {priceMax < MAX_PRICE && (
                      <span className="sr-filter-chip">≤ {fmt(priceMax)}<button onClick={() => setPriceMax(MAX_PRICE)}><X size={9} /></button></span>
                    )}
                  </div>
                )}
              </div>
              {hasFilters && <button className="sr-clear-all" onClick={clearAll}>Clear All</button>}
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="sr-skel-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="sr-skel-card">
                  <div className="skel skel-img" style={{ animationDelay:`${i*60}ms` }} />
                  <div className="skel skel-line skel-long" style={{ animationDelay:`${i*60+80}ms` }} />
                  <div className="skel skel-line skel-short" style={{ animationDelay:`${i*60+140}ms` }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="sr-empty">
              <p className="sr-empty-title">{searchTerm ? `No results for "${searchTerm}"` : 'No objects match your filter.'}</p>
              <p className="sr-empty-sub">Try a different search or clear the filter</p>
              <button className="sr-empty-btn" onClick={clearAll}>Clear Archive Filter</button>
            </div>
          ) : viewMode === 'list' ? (
            <div className="sr-list">
              {filtered.map((p, i) => {
                const isWished = wishlist.includes(p.id);
                return (
                  <div key={p.id || i} className={`sr-list-item${cardsVisible ? ' in' : ''}`} style={{ animationDelay:`${Math.min(i*35,350)}ms` }}>
                    <div className="sr-list-img"><img src={p.imageURL || p.image || ''} alt={p.name} onError={e => { e.target.style.opacity = 0.05; }} /></div>
                    <div>
                      <p className="sr-list-cat">{p.category}</p>
                      <p className="sr-list-name">{p.name}</p>
                      <p className="sr-list-price">{fmt(p.price)}</p>
                    </div>
                    <div className="sr-list-actions">
                      <button className="sr-list-btn" onClick={() => setQuickView(p)}><Eye size={11} /> View</button>
                      <button className="sr-list-btn add" onClick={() => onAddToCart(p)}><Plus size={11} /> Add</button>
                      <button className={`sr-list-btn${isWished ? ' wished' : ''}`} onClick={() => toggleWish(p)}>
                        <Heart size={11} fill={isWished ? '#e87070' : 'none'} strokeWidth={1.5} style={{ color: isWished ? '#e87070' : 'inherit' }} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="sr-grid">
              {filtered.map((p, i) => (
                <ProductCard
                  key={p.id || i}
                  product={p}
                  onAddToCart={onAddToCart}
                  animDelay={Math.min(i * 45, 400)}
                  visible={cardsVisible}
                  wished={wishlist.includes(p.id)}
                  onToggleWish={toggleWish}
                  onQuickView={setQuickView}
                />
              ))}
            </div>
          )}
        </div>

        {sortOpen && <div style={{ position:'fixed', inset:0, zIndex:29 }} onClick={() => setSortOpen(false)} />}
      </div>

      {/* Quick View */}
      {quickView && (
        <QuickView
          product={quickView}
          onClose={() => setQuickView(null)}
          onAddToCart={onAddToCart}
          wished={wishlist.includes(quickView.id)}
          onToggleWish={toggleWish}
        />
      )}

      {/* Keyboard hint */}
      {showKbd && (
        <div className="sr-kbd">
          <span><kbd>/</kbd> Focus search</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      )}
    </>
  );
};

export default SearchResults;