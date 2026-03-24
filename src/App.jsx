import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUp, ShoppingBag, X, ChevronRight, Sparkles, Clock, Eye } from 'lucide-react';

// Components
import Navbar           from './Components/Navbar/Navbar';
import Hero             from './Components/Hero/Hero';
import FeaturedProducts from './Components/featuredProducts/featuredProducts';
import Categories       from './Components/Categories/Categories';
import SpecialOffers    from './Components/SpecialOffers/SpecialOffers';
import About            from './Components/About/About';
import Newsletter       from './Components/Newsletter/Newsletter';
import Footer           from './Components/Footer/Footer';
import Contact          from './Components/Contact/Contact';
import SignUp           from './Components/SignUp';
import Login            from './Components/Login';
import SearchResults    from './Components/SearchResults';
import Cart             from './Components/Cart/Cart';
import ShopPage         from './Components/ShopPage/ShopPage';
import ProductDetail    from './Components/ProductDetail';

import './App.css';

const U = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

export const ALL_PRODUCTS = [
  { id: 1,  category: 'Electronics', name: 'Samsung Galaxy Tab S9',       price: 349,  imageURL: U('1516035069371-29a1b244cc32') },
  { id: 2,  category: 'Electronics', name: 'Apple iPhone 15 Pro',         price: 999,  imageURL: U('1592750651612-3ac0b0de5d26') },
  { id: 3,  category: 'Electronics', name: 'Sony WH-1000XM5',             price: 349,  imageURL: U('1505740420928-5e560c06d30e') },
  { id: 4,  category: 'Electronics', name: 'LG OLED 4K TV 55"',           price: 1299, imageURL: U('1593359677879-a4021f47b40b') },
  { id: 5,  category: 'Electronics', name: 'Apple MacBook Pro M3',        price: 2399, imageURL: U('1541807084-5c52e6a5c315') },
  { id: 6,  category: 'Electronics', name: 'Sony Alpha A7 IV',            price: 2499, imageURL: U('1516035069371-29a1b244cc32') },
  { id: 7,  category: 'Electronics', name: 'Apple AirPods Pro 2',         price: 249,  imageURL: U('1600294037681-c80ead743435') },
  { id: 8,  category: 'Electronics', name: 'iPad Pro 12.9"',              price: 1099, imageURL: U('1544244015-0df4cec9d125') },
  { id: 9,  category: 'Electronics', name: 'Dell XPS 15 Laptop',          price: 1799, imageURL: U('1496181133206-80ce9b88a853') },
  { id: 10, category: 'Electronics', name: 'Samsung 4K Monitor 32"',      price: 649,  imageURL: U('1527443224154-39470ff63bb5') },
  { id: 11, category: 'Electronics', name: 'Bose QuietComfort 45',        price: 279,  imageURL: U('1546435770-a3e426bf472b') },
  { id: 12, category: 'Electronics', name: 'GoPro Hero 12 Black',         price: 399,  imageURL: U('1502920514313-e8fc8f30a01a') },
  { id: 13, category: 'Electronics', name: 'Nintendo Switch OLED',        price: 349,  imageURL: U('1612287890020-9c4e95c00bf8') },
  { id: 14, category: 'Electronics', name: 'Kindle Paperwhite 11th Gen',  price: 139,  imageURL: U('1512499617640-c74ae3a79d37') },
  { id: 15, category: 'Electronics', name: 'Smart Home Hub',              price: 129,  imageURL: U('1558618666-fcd25c85cd64') },
  { id: 16, category: 'Fashion', name: "Levi's 501 Original Jeans",   price: 89,  imageURL: U('1542272604-787c3835535d') },
  { id: 17, category: 'Fashion', name: 'Nike Air Max 270',             price: 150, imageURL: U('1542291026-7eec264c27ff') },
  { id: 18, category: 'Fashion', name: 'Adidas Ultraboost 22',         price: 180, imageURL: U('1608231387042-66d1773d3716') },
  { id: 19, category: 'Fashion', name: 'Ray-Ban Aviator Classic',      price: 154, imageURL: U('1511499767315-a5a27ce1fb86') },
  { id: 20, category: 'Fashion', name: 'Minimalist Leather Watch',     price: 185, imageURL: U('1523275335684-37898b6baf30') },
  { id: 21, category: 'Fashion', name: 'Ivory Cashmere Sweater',       price: 220, imageURL: U('1434389677669-e08b4cac3105') },
  { id: 22, category: 'Fashion', name: 'Structured Canvas Tote',       price: 75,  imageURL: U('1548036161-65bd85c9a3a7') },
  { id: 23, category: 'Fashion', name: 'Merino Wool Overcoat',         price: 395, imageURL: U('1591047139829-d91aecb6caea') },
  { id: 24, category: 'Fashion', name: 'White Oxford Shirt',           price: 95,  imageURL: U('1596755094514-f87e34085b2c') },
  { id: 25, category: 'Fashion', name: 'Slim Chino Trousers',          price: 85,  imageURL: U('1473966968600-fa807c786ef4') },
  { id: 26, category: 'Fashion', name: 'Chelsea Leather Boots',        price: 275, imageURL: U('1638247025967-b4e38f787b76') },
  { id: 27, category: 'Fashion', name: 'Classic Linen Blazer',         price: 310, imageURL: U('1507679799987-c73779587ccf') },
  { id: 28, category: 'Fashion', name: 'Patterned Silk Scarf',         price: 65,  imageURL: U('1601924638-9c37a0aba7e0') },
  { id: 29, category: 'Fashion', name: 'Leather Bifold Wallet',        price: 55,  imageURL: U('1627123424574-3729898f7ee7') },
  { id: 30, category: 'Fashion', name: 'Structured Crossbody Bag',     price: 145, imageURL: U('1548036161-65bd85c9a3a7') },
  { id: 31, category: 'Groceries', name: 'Organic Honeycrisp Apples',   price: 6.99,  imageURL: U('1568702846914-96b305d2aaeb') },
  { id: 32, category: 'Groceries', name: 'Cold Pressed Olive Oil 500ml',price: 38,    imageURL: U('1474979266404-7eaacbcd87c5') },
  { id: 33, category: 'Groceries', name: 'Whole Bean Dark Roast 250g',  price: 26,    imageURL: U('1559056199-641a0ac8b55e') },
  { id: 34, category: 'Groceries', name: 'Artisan Sourdough Loaf',      price: 9.50,  imageURL: U('1509440159596-0249088772ff') },
  { id: 35, category: 'Groceries', name: 'Raw Wildflower Honey 350g',   price: 18,    imageURL: U('1587049352846-b0a53e0f2f1d') },
  { id: 36, category: 'Groceries', name: 'Aged Parmesan Wedge 200g',    price: 14,    imageURL: U('1486297678162-eb2a19b0a32d') },
  { id: 37, category: 'Groceries', name: 'Organic Matcha Powder 80g',   price: 22,    imageURL: U('1515823662972-da6a2e4d3002') },
  { id: 38, category: 'Groceries', name: 'Truffle Salt 100g',           price: 16,    imageURL: U('1499028344343-cd173ffc68a9') },
  { id: 39, category: 'Groceries', name: 'Medjool Dates 500g',          price: 13,    imageURL: U('1601004890849-9b04c4c4a8c3') },
  { id: 40, category: 'Groceries', name: 'Heirloom Cherry Tomatoes',    price: 7.50,  imageURL: U('1546094096-0df4cec9d125') },
  { id: 41, category: 'Groceries', name: 'Smoked Paprika & Spice Set',  price: 24,    imageURL: U('1532336259264-f7b9e476c0a2') },
  { id: 42, category: 'Groceries', name: 'Kombucha Variety 6-Pack',     price: 28,    imageURL: U('1600271886742-f049cd451bba') },
  { id: 43, category: 'Groceries', name: 'Tahini & Sesame Spread',      price: 11,    imageURL: U('1551462147-ff29053bfc14') },
  { id: 44, category: 'Groceries', name: 'Oat Granola — Dark Choc',     price: 12,    imageURL: U('1517686469429-8bdb88b9f907') },
  { id: 45, category: 'Groceries', name: 'Sun-Dried Mango Slices',      price: 8.50,  imageURL: U('1601004890849-9b04c4c4a8c3') },
  { id: 46, category: 'Furniture', name: 'Sculptural Boucle Sofa 3-Seat', price: 1850, imageURL: U('1555041469-db61197941e0') },
  { id: 47, category: 'Furniture', name: 'Solid Oak Dining Table',        price: 1200, imageURL: U('1617806118233-18e1de247200') },
  { id: 48, category: 'Furniture', name: 'Ergonomic Mesh Office Chair',   price: 489,  imageURL: U('1580480055273-228ff5388ef8') },
  { id: 49, category: 'Furniture', name: 'Sculptural Accent Chair',       price: 850,  imageURL: U('1598300042247-d088f8ab3a91') },
  { id: 50, category: 'Furniture', name: 'Oak & Brass Side Table',        price: 340,  imageURL: U('1532372320572-cda25653a26d') },
  { id: 51, category: 'Furniture', name: 'Floating Walnut Shelf Set',     price: 290,  imageURL: U('1555041469-db61197941e0') },
  { id: 52, category: 'Furniture', name: 'Smoked Glass Coffee Table',     price: 620,  imageURL: U('1493809842364-78817add7ffb') },
  { id: 53, category: 'Furniture', name: 'Linen Platform Bed Frame',      price: 980,  imageURL: U('1505693416388-ac5ce068fe85') },
  { id: 54, category: 'Furniture', name: 'Rattan Lounge Chair',           price: 460,  imageURL: U('1598300042247-d088f8ab3a91') },
  { id: 55, category: 'Furniture', name: 'Brass Floor Lamp Arc',          price: 385,  imageURL: U('1507473885765-e6ed057f782c') },
  { id: 56, category: 'Furniture', name: 'Terrazzo Planter Large',        price: 95,   imageURL: U('1485955900006-10f4d324d411') },
  { id: 57, category: 'Furniture', name: 'Abstract Canvas 90×120cm',      price: 420,  imageURL: U('1541961017774-22349e4a1262') },
  { id: 58, category: 'Furniture', name: 'Handwoven Wool Rug 200×300',    price: 740,  imageURL: U('1506439773649-6e0eb8cfb237') },
  { id: 59, category: 'Furniture', name: 'Modular Bookshelf System',      price: 560,  imageURL: U('1555041469-db61197941e0') },
  { id: 60, category: 'Furniture', name: 'Ceramic Table Lamp',            price: 175,  imageURL: U('1507473885765-e6ed057f782c') },
];

/* ══════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════ */
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');

  /* ── SITE HEADER (banner + navbar as one sticky unit) ── */
  #site-header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: #000;
  }

  /* ── SCROLL TO TOP FAB ── */
  .stt-btn {
    position: fixed; bottom: 32px; right: 32px; z-index: 90;
    width: 48px; height: 48px;
    background: rgba(255,255,255,0.06);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.5);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    opacity: 0; transform: translateY(16px);
    transition: opacity 0.4s ease, transform 0.4s ease, background 0.3s, border-color 0.3s;
    pointer-events: none;
  }
  .stt-btn.visible { opacity: 1; transform: translateY(0); pointer-events: all; }
  .stt-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); color: #fff; }
  .stt-btn:active { transform: translateY(2px); }

  /* ── PAGE PROGRESS BAR ── */
  .pg-bar {
    position: fixed; top: 0; left: 0; z-index: 200;
    height: 1px; background: #fff;
    transform-origin: left;
    transition: transform 0.08s linear;
    pointer-events: none;
  }

  /* ── TOAST NOTIFICATIONS ── */
  .toast-stack {
    position: fixed; bottom: 96px; right: 32px; z-index: 100;
    display: flex; flex-direction: column-reverse; gap: 8px;
    pointer-events: none;
  }
  .toast {
    font-family: 'Overpass Mono', monospace;
    background: #0a0a0a;
    border: 1px solid rgba(255,255,255,0.08);
    color: #e8e4dd;
    padding: 14px 18px;
    min-width: 260px; max-width: 340px;
    display: flex; align-items: center; gap: 12px;
    pointer-events: all;
    box-shadow: 0 16px 48px rgba(0,0,0,0.8);
    animation: toastIn 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .toast.exit { animation: toastOut 0.35s ease forwards; }
  @keyframes toastIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes toastOut { to { opacity:0; transform:translateX(20px); } }
  .toast-icon { flex-shrink: 0; }
  .toast-body { flex: 1; }
  .toast-title { font-size: 8.5px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,0.75); margin-bottom: 4px; }
  .toast-msg { font-size: 9px; letter-spacing: 0.08em; color: rgba(255,255,255,0.35); line-height: 1.5; }
  .toast-close { background: none; border: none; color: rgba(255,255,255,0.2); cursor: pointer; padding: 2px; flex-shrink: 0; transition: color 0.2s; }
  .toast-close:hover { color: rgba(255,255,255,0.7); }
  .toast-bar { position: absolute; bottom: 0; left: 0; height: 1px; background: #fff; animation: toastProgress linear forwards; }
  @keyframes toastProgress { from { width:100%; } to { width:0%; } }

  /* ── MINI CART ── */
  .mini-cart-backdrop {
    position: fixed; inset: 0; z-index: 80; pointer-events: none;
  }
  .mini-cart-backdrop.open { pointer-events: all; }
  .mini-cart {
    position: fixed; top: 0; right: 0; bottom: 0; z-index: 85;
    width: 380px; overflow-y: auto;
    background: #000;
    border-left: 1px solid rgba(255,255,255,0.06);
    transform: translateX(100%);
    transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
    box-shadow: -24px 0 60px rgba(0,0,0,0.8);
  }
  .mini-cart.open { transform: translateX(0); }
  @media (max-width: 480px) { .mini-cart { width: 100vw; } }
  .mini-cart-header {
    padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; background: #000; z-index: 1;
  }
  .mc-title { font-family: 'Overpass Mono', monospace; font-size: 9px; letter-spacing: 0.5em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
  .mc-count { font-family: 'Overpass Mono', monospace; font-size: 8px; letter-spacing: 0.3em; color: rgba(255,255,255,0.3); }
  .mc-close { background: none; border: none; color: rgba(255,255,255,0.25); cursor: pointer; padding: 4px; transition: color 0.2s; }
  .mc-close:hover { color: #fff; }
  .mc-items { padding: 0; }
  .mc-item { display: grid; grid-template-columns: 64px 1fr auto; gap: 14px; padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.04); align-items: start; }
  .mc-item-img { aspect-ratio: 3/4; overflow: hidden; background: #0a0a0a; }
  .mc-item-img img { width: 100%; height: 100%; object-fit: cover; }
  .mc-item-cat { font-family: 'Overpass Mono', monospace; font-size: 7px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.18); margin-bottom: 5px; }
  .mc-item-name { font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.55); line-height: 1.45; margin-bottom: 8px; }
  .mc-item-qty { font-family: 'Overpass Mono', monospace; font-size: 7.5px; letter-spacing: 0.3em; color: rgba(255,255,255,0.2); }
  .mc-item-price { font-family: 'Overpass Mono', monospace; font-size: 10px; font-weight: 600; color: #fff; white-space: nowrap; }
  .mc-footer { padding: 20px 24px; border-top: 1px solid rgba(255,255,255,0.05); position: sticky; bottom: 0; background: #000; }
  .mc-total-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; }
  .mc-total-label { font-family: 'Overpass Mono', monospace; font-size: 8px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
  .mc-total-val { font-family: 'Overpass Mono', monospace; font-size: 18px; font-weight: 600; color: #fff; }
  .mc-cta { display: block; width: 100%; padding: 16px; background: #fff; border: none; font-family: 'Overpass Mono', monospace; font-size: 9px; letter-spacing: 0.5em; text-transform: uppercase; color: #000; cursor: pointer; text-align: center; text-decoration: none; transition: background 0.2s; }
  .mc-cta:hover { background: rgba(255,255,255,0.88); }
  .mc-shop { display: block; width: 100%; padding: 12px; background: transparent; border: 1px solid rgba(255,255,255,0.08); font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.25); cursor: pointer; text-align: center; text-decoration: none; margin-top: 8px; transition: border-color 0.3s, color 0.3s; }
  .mc-shop:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.7); }
  .mc-empty { padding: 60px 24px; text-align: center; font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.18); }

  /* ── ANNOUNCEMENT BANNER ── */
  .ann-bar {
    background: #000;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    color: rgba(255,255,255,0.45);
    padding: 9px 6vw;
    display: flex; align-items: center; justify-content: center; gap: 16px;
    position: relative;
  }
  .ann-text {
    font-family: 'Overpass Mono', monospace;
    font-size: 8px; letter-spacing: 0.45em; text-transform: uppercase;
    text-align: center;
  }
  .ann-text strong { color: rgba(255,255,255,0.7); }
  .ann-text a { color: rgba(255,255,255,0.5); text-decoration: underline; text-underline-offset: 3px; }
  .ann-close { position: absolute; right: 20px; background: none; border: none; color: rgba(255,255,255,0.2); cursor: pointer; padding: 4px; transition: color 0.2s; }
  .ann-close:hover { color: rgba(255,255,255,0.7); }

  /* ── RECENTLY VIEWED ── */
  .rv-root { background: #000; padding: 80px 6vw; border-top: 1px solid rgba(255,255,255,0.04); }
  .rv-inner { max-width: 1440px; margin: 0 auto; }
  .rv-header { display: flex; align-items: center; gap: 14px; margin-bottom: 32px; }
  .rv-header-line { width: 28px; height: 1px; background: rgba(255,255,255,0.12); }
  .rv-header-text { font-family: 'Overpass Mono', monospace; font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(255,255,255,0.22); }
  .rv-strip { display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; }
  .rv-strip::-webkit-scrollbar { display: none; }
  .rv-card { flex-shrink: 0; width: 160px; background: #0a0a0a; cursor: pointer; transition: background 0.25s; }
  .rv-card:hover { background: #111; }
  .rv-card-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; transition: transform 0.6s ease; }
  .rv-card:hover .rv-card-img { transform: scale(1.04); }
  .rv-card-img-wrap { overflow: hidden; }
  .rv-card-info { padding: 10px 12px; }
  .rv-card-name { font-family: 'Overpass Mono', monospace; font-size: 8px; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.4); line-height: 1.5; margin-bottom: 6px; }
  .rv-card-price { font-family: 'Overpass Mono', monospace; font-size: 9px; font-weight: 600; color: rgba(255,255,255,0.6); }

  /* ── NAV GUARD ── */
  .ng-bar {
    position: sticky; top: 0; z-index: 40;
    background: rgba(0,0,0,0.97);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .ng-inner { max-width: 1440px; margin: 0 auto; padding: 0 6vw; height: 48px; display: flex; align-items: center; }
  .ng-link { display: inline-flex; align-items: center; gap: 10px; font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.22); text-decoration: none; transition: color 0.3s; }
  .ng-link:hover { color: rgba(255,255,255,0.7); }
  .ng-link:hover .ng-arrow { transform: translateX(-3px); }
  .ng-arrow { transition: transform 0.3s; }
  .ng-sep { width: 1px; height: 14px; background: rgba(255,255,255,0.07); margin: 0 16px; }
  .ng-crumb { font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(255,255,255,0.4); }

  /* ── HOME SECTIONS ── */
  .tr-root { background: #000; padding: 80px 0; border-top: 1px solid rgba(255,255,255,0.04); }
  .tr-header { max-width: 1440px; margin: 0 auto; padding: 0 6vw; display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 40px; }
  .tr-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
  .tr-eyebrow-line { width: 28px; height: 1px; background: rgba(255,255,255,0.2); }
  .tr-eyebrow-text { font-family: 'Overpass Mono', monospace; font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(255,255,255,0.22); }
  .tr-title { font-family: 'Overpass Mono', monospace; font-size: clamp(22px,3vw,40px); font-weight: 300; color: #fff; letter-spacing: -0.02em; }
  .tr-title em { font-family: 'Cormorant Garamond', serif; font-style: italic; color: rgba(255,255,255,0.35); }
  .tr-view-all { font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,0.25); text-decoration: none; display: flex; align-items: center; gap: 8px; transition: color 0.3s; }
  .tr-view-all:hover { color: #fff; }
  .tr-strip { padding: 0 6vw; display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; }
  .tr-strip::-webkit-scrollbar { display: none; }
  .tr-card { flex-shrink: 0; width: clamp(180px,20vw,240px); background: #0a0a0a; cursor: pointer; transition: background 0.3s; }
  .tr-card:hover { background: #111; }
  .tr-card-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; transition: transform 0.8s ease; }
  .tr-card:hover .tr-card-img { transform: scale(1.05); }
  .tr-card-img-wrap { overflow: hidden; position: relative; }
  .tr-rank-badge { position: absolute; top: 12px; left: 12px; font-family: 'Overpass Mono', monospace; font-size: 7px; letter-spacing: 0.3em; color: rgba(255,255,255,0.5); background: rgba(0,0,0,0.85); border: 1px solid rgba(255,255,255,0.1); padding: 4px 8px; }
  .tr-card-info { padding: 14px 16px; }
  .tr-card-name { font-family: 'Overpass Mono', monospace; font-size: 9px; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.55); line-height: 1.45; margin-bottom: 8px; }
  .tr-card-price { font-family: 'Overpass Mono', monospace; font-size: 10px; font-weight: 600; color: #fff; }

  .bv-root { background: #000; padding: 72px 6vw; border-top: 1px solid rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.04); }
  .bv-grid { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(255,255,255,0.04); }
  @media (max-width: 768px) { .bv-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 400px) { .bv-grid { grid-template-columns: 1fr; } }
  .bv-item { padding: 36px 28px; background: #000; display: flex; flex-direction: column; gap: 14px; }
  .bv-icon { font-size: 24px; opacity: 0.6; }
  .bv-stat { font-family: 'Overpass Mono', monospace; font-size: clamp(28px,3vw,42px); font-weight: 600; color: #fff; letter-spacing: -0.02em; }
  .bv-label { font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.22); line-height: 1.7; }

  .lk-root { background: #000; padding: 100px 6vw; border-top: 1px solid rgba(255,255,255,0.04); }
  .lk-inner { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 1px; }
  @media (max-width: 768px) { .lk-inner { grid-template-columns: 1fr; } }
  .lk-img-wrap { position: relative; aspect-ratio: 4/5; overflow: hidden; background: #0a0a0a; }
  .lk-img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s ease; }
  .lk-img-wrap:hover .lk-img { transform: scale(1.04); }
  .lk-img-label { position: absolute; bottom: 20px; left: 20px; font-family: 'Overpass Mono', monospace; font-size: 8px; letter-spacing: 0.5em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
  .lk-info { background: #0a0a0a; padding: clamp(40px,5vw,80px); display: flex; flex-direction: column; justify-content: center; gap: 28px; }
  .lk-eyebrow { font-family: 'Overpass Mono', monospace; font-size: 8px; letter-spacing: 0.6em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
  .lk-title { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; font-size: clamp(36px,4vw,64px); color: #fff; letter-spacing: -0.01em; line-height: 1.1; }
  .lk-body { font-family: 'Overpass Mono', monospace; font-size: 10px; line-height: 2; color: rgba(255,255,255,0.25); letter-spacing: 0.03em; max-width: 360px; }
  .lk-cta { display: inline-flex; align-items: center; gap: 14px; text-decoration: none; font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.35); transition: color 0.3s; }
  .lk-cta:hover { color: #fff; }
  .lk-cta-line { width: 32px; height: 1px; background: currentColor; transition: width 0.3s; }
  .lk-cta:hover .lk-cta-line { width: 52px; }

  .na-root { background: #000; padding: 100px 6vw; border-top: 1px solid rgba(255,255,255,0.04); }
  .na-inner { max-width: 1440px; margin: 0 auto; }
  .na-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 48px; flex-wrap: wrap; gap: 16px; }
  .na-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
  .na-eyebrow-line { width: 28px; height: 1px; background: rgba(255,255,255,0.2); }
  .na-eyebrow-text { font-family: 'Overpass Mono', monospace; font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(255,255,255,0.22); }
  .na-title { font-family: 'Overpass Mono', monospace; font-size: clamp(22px,3vw,40px); font-weight: 300; color: #fff; letter-spacing: -0.02em; }
  .na-title em { font-family: 'Cormorant Garamond', serif; font-style: italic; color: rgba(255,255,255,0.35); }
  .na-link { font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,0.25); text-decoration: none; transition: color 0.3s; display: flex; align-items: center; gap: 8px; }
  .na-link:hover { color: #fff; }
  .na-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(255,255,255,0.04); }
  @media (max-width: 900px) { .na-grid { grid-template-columns: repeat(2,1fr); } }
  .na-card { background: #000; display: flex; flex-direction: column; cursor: pointer; transition: background 0.25s; }
  .na-card:hover { background: #0a0a0a; }
  .na-card-img-wrap { position: relative; aspect-ratio: 3/4; overflow: hidden; }
  .na-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.9s ease; }
  .na-card:hover .na-card-img { transform: scale(1.06); }
  .na-new-badge { position: absolute; top: 14px; left: 14px; font-family: 'Overpass Mono', monospace; font-size: 7px; letter-spacing: 0.4em; text-transform: uppercase; background: #fff; color: #000; padding: 4px 9px; }
  .na-card-info { padding: 16px 18px 20px; border-top: 1px solid rgba(255,255,255,0.04); }
  .na-card-cat { font-family: 'Overpass Mono', monospace; font-size: 7.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.18); margin-bottom: 8px; }
  .na-card-name { font-family: 'Overpass Mono', monospace; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.65); line-height: 1.45; margin-bottom: 10px; }
  .na-card-price { font-family: 'Overpass Mono', monospace; font-size: 11px; font-weight: 600; color: #fff; }
`;

/* ══════════════════════════════════════════════
   SCROLL TO TOP FAB
══════════════════════════════════════════════ */
const ScrollToTopFAB = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      className={`stt-btn${visible ? ' visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
    >
      <ArrowUp size={16} strokeWidth={1.5} />
    </button>
  );
};

/* ══════════════════════════════════════════════
   PAGE PROGRESS BAR
══════════════════════════════════════════════ */
const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const pct = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
      setProgress(isNaN(pct) ? 0 : pct);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="pg-bar" style={{ width: '100%', transform: `scaleX(${progress})` }} />
  );
};

/* ══════════════════════════════════════════════
   TOAST SYSTEM
══════════════════════════════════════════════ */
let _addToast = null;
export const addToast = (title, msg, duration = 3800) => _addToast?.(title, msg, duration);

const ToastStack = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    _addToast = (title, msg, duration) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, title, msg, duration, exiting: false }]);
      setTimeout(() => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
      }, duration);
    };
    return () => { _addToast = null; };
  }, []);
  const dismiss = (id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 350);
  };
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast${t.exiting ? ' exit' : ''}`} style={{ position: 'relative', overflow: 'hidden' }}>
          <Sparkles size={13} className="toast-icon" style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
          <div className="toast-body">
            <p className="toast-title">{t.title}</p>
            <p className="toast-msg">{t.msg}</p>
          </div>
          <button className="toast-close" onClick={() => dismiss(t.id)}><X size={11} /></button>
          <div className="toast-bar" style={{ animationDuration: `${t.duration}ms` }} />
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════════
   ANNOUNCEMENT BANNER
══════════════════════════════════════════════ */
const AnnouncementBanner = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="ann-bar">
      <span className="ann-text">
        ✦ Free archival shipping on orders over $150 — use code <strong>SHIP2026</strong> at checkout ✦
      </span>
      <button className="ann-close" onClick={() => setVisible(false)} aria-label="Close">
        <X size={12} />
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════
   MINI CART PREVIEW
══════════════════════════════════════════════ */
const MiniCart = ({ cart, open, onClose }) => {
  const total = cart.reduce((acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1), 0);
  const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const imgOf = (p) => p.imageURL || p.image || '';
  return (
    <>
      <div
        className={`mini-cart-backdrop${open ? ' open' : ''}`}
        onClick={onClose}
        style={{ background: open ? 'rgba(0,0,0,0.5)' : 'transparent', transition: 'background 0.3s' }}
      />
      <div className={`mini-cart${open ? ' open' : ''}`}>
        <div className="mini-cart-header">
          <span className="mc-title">Your Bag</span>
          <span className="mc-count">{cart.length} {cart.length === 1 ? 'item' : 'items'}</span>
          <button className="mc-close" onClick={onClose}><X size={14} /></button>
        </div>
        {cart.length === 0 ? (
          <div className="mc-empty">Archive awaiting curation.</div>
        ) : (
          <>
            <div className="mc-items">
              {cart.slice(-6).reverse().map((item, i) => (
                <div key={`${item.id}-${i}`} className="mc-item">
                  <div className="mc-item-img">
                    <img src={imgOf(item)} alt={item.name} onError={e => { e.target.style.opacity = 0.05; }} />
                  </div>
                  <div>
                    <p className="mc-item-cat">{item.category}</p>
                    <p className="mc-item-name">{item.name}</p>
                    <p className="mc-item-qty">Qty: {item.quantity || 1}</p>
                  </div>
                  <span className="mc-item-price">{fmt((Number(item.price) || 0) * (item.quantity || 1))}</span>
                </div>
              ))}
            </div>
            <div className="mc-footer">
              <div className="mc-total-row">
                <span className="mc-total-label">Subtotal</span>
                <span className="mc-total-val">{fmt(total)}</span>
              </div>
              <Link className="mc-cta" to="/cart" onClick={onClose}>Proceed to Checkout</Link>
              <Link className="mc-shop" to="/shop" onClick={onClose}>Continue Browsing</Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

/* ══════════════════════════════════════════════
   RECENTLY VIEWED
══════════════════════════════════════════════ */
export const trackView = (() => {
  let _cb = null;
  const subscribe = (cb) => { _cb = cb; };
  const track = (product) => _cb?.(product);
  return { track, subscribe };
})();

const RecentlyViewed = ({ onAddToCart }) => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    trackView.subscribe((product) => {
      setItems(prev => [product, ...prev.filter(p => p.id !== product.id)].slice(0, 8));
    });
  }, []);
  if (items.length < 2) return null;
  return (
    <section className="rv-root">
      <div className="rv-inner">
        <div className="rv-header">
          <Clock size={13} style={{ color: 'rgba(255,255,255,0.18)' }} />
          <div className="rv-header-line" />
          <span className="rv-header-text">Recently Viewed</span>
        </div>
        <div className="rv-strip">
          {items.map(p => (
            <div key={p.id} className="rv-card" onClick={() => navigate(`/product/${p.id}`)}>
              <div className="rv-card-img-wrap">
                <img className="rv-card-img" src={p.imageURL || p.image || ''} alt={p.name}
                  onError={e => { e.target.style.opacity = 0.04; }} />
              </div>
              <div className="rv-card-info">
                <p className="rv-card-name">{p.name}</p>
                <p className="rv-card-price">${Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════
   SCROLL TO TOP ON ROUTE CHANGE
══════════════════════════════════════════════ */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
};

/* ══════════════════════════════════════════════
   NAVIGATION GUARD
══════════════════════════════════════════════ */
const ROUTE_LABELS = {
  '/shop': 'Shop', '/featured': 'Featured', '/offers': 'Offers',
  '/about': 'About', '/contact': 'Contact', '/cart': 'Cart',
  '/search': 'Search', '/login': 'Login', '/signup': 'Sign Up',
  '/categories': 'Categories',
};

const NavigationGuard = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;
  const isProduct = location.pathname.startsWith('/product/');
  const label = isProduct ? 'Product Detail' : ROUTE_LABELS[location.pathname] || 'Archive';
  return (
    <div className="ng-bar">
      <div className="ng-inner">
        <Link to="/" className="ng-link">
          <ArrowLeft size={13} strokeWidth={1.5} className="ng-arrow" />
          Return to Archive
        </Link>
        <span className="ng-sep" />
        <span className="ng-crumb">{label}</span>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════
   HOME SECTIONS
══════════════════════════════════════════════ */
const TRENDING_IDS    = [2, 20, 5, 49, 33, 18, 7, 52];
const NEW_ARRIVAL_IDS = [7, 21, 55, 37, 26, 60, 45, 30];

const TrendingSection = ({ products, onAddToCart }) => {
  const items = TRENDING_IDS.map(id => products.find(p => p.id === id)).filter(Boolean);
  return (
    <section className="tr-root">
      <div className="tr-header">
        <div>
          <div className="tr-eyebrow">
            <div className="tr-eyebrow-line" />
            <span className="tr-eyebrow-text">Most Acquired · 2026</span>
          </div>
          <h2 className="tr-title">Trending <em>Now.</em></h2>
        </div>
        <Link to="/shop" className="tr-view-all">View All <ChevronRight size={11} /></Link>
      </div>
      <div className="tr-strip">
        {items.map((p, i) => (
          <div key={p.id} className="tr-card" onClick={() => onAddToCart(p)}>
            <div className="tr-card-img-wrap">
              <img className="tr-card-img" src={p.imageURL} alt={p.name} onError={e => { e.target.style.opacity = 0.05; }} />
              <span className="tr-rank-badge">#{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="tr-card-info">
              <p className="tr-card-name">{p.name}</p>
              <p className="tr-card-price">${Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const VALUES = [
  { icon: '🌍', stat: '190+', label: 'Countries\nShipped To' },
  { icon: '⚡', stat: '48h',  label: 'Average\nDelivery Time' },
  { icon: '✦',  stat: '60',   label: 'Curated\nProducts' },
  { icon: '★',  stat: '4.9',  label: 'Average\nCustomer Rating' },
];

const BrandValues = () => (
  <section className="bv-root">
    <div className="bv-grid">
      {VALUES.map((v, i) => (
        <div key={i} className="bv-item">
          <span className="bv-icon">{v.icon}</span>
          <span className="bv-stat">{v.stat}</span>
          <span className="bv-label" style={{ whiteSpace: 'pre-line' }}>{v.label}</span>
        </div>
      ))}
    </div>
  </section>
);

const LookbookSection = () => (
  <section className="lk-root">
    <div className="lk-inner">
      <div className="lk-img-wrap">
        <img className="lk-img" src={U('1507679799987-c73779587ccf')} alt="2026 Lookbook" />
        <span className="lk-img-label">S/S 2026 Editorial</span>
      </div>
      <div className="lk-info">
        <span className="lk-eyebrow">The 2026 Lookbook</span>
        <h2 className="lk-title">Dressing for<br />the Archive.</h2>
        <p className="lk-body">
          A deliberate sequence of objects chosen for endurance over novelty.
          Each piece earns its place through form, material honesty,
          and the quiet confidence of lasting design.
        </p>
        <Link to="/shop?category=Fashion" className="lk-cta">
          Explore Fashion
          <span className="lk-cta-line" />
        </Link>
      </div>
    </div>
  </section>
);

const NewArrivals = ({ products, onAddToCart }) => {
  const items = NEW_ARRIVAL_IDS.map(id => products.find(p => p.id === id)).filter(Boolean);
  return (
    <section className="na-root">
      <div className="na-inner">
        <div className="na-header">
          <div>
            <div className="na-eyebrow">
              <div className="na-eyebrow-line" />
              <span className="na-eyebrow-text">Just Arrived · Feb 2026</span>
            </div>
            <h2 className="na-title">New <em>Arrivals.</em></h2>
          </div>
          <Link to="/shop" className="na-link">Shop All <ChevronRight size={11} /></Link>
        </div>
        <div className="na-grid">
          {items.map(p => (
            <div key={p.id} className="na-card" onClick={() => onAddToCart(p)}>
              <div className="na-card-img-wrap">
                <img className="na-card-img" src={p.imageURL} alt={p.name} onError={e => { e.target.style.opacity = 0.05; }} />
                <span className="na-new-badge">New</span>
              </div>
              <div className="na-card-info">
                <p className="na-card-cat">{p.category}</p>
                <p className="na-card-name">{p.name}</p>
                <p className="na-card-price">${Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ══════════════════════════════════════════════
   APP
══════════════════════════════════════════════ */
const App = () => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('archive_cart') || '[]'); }
    catch { return []; }
  });
  const [miniCartOpen, setMiniCartOpen] = useState(false);
  const prevCartLen = useRef(cart.length);

  useEffect(() => {
    try { localStorage.setItem('archive_cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  useEffect(() => {
    if (cart.length > prevCartLen.current) {
      const newest = cart[cart.length - 1];
      setMiniCartOpen(true);
      addToast('Added to Bag', newest?.name || 'Item added successfully');
    }
    prevCartLen.current = cart.length;
  }, [cart.length]);

  const handleAddToCart = useCallback((product) => {
    setCart(prev => [...prev, { ...product, quantity: 1, cartId: Date.now() }]);
  }, []);

  const handleGlobalClick = (e) => {
    const link = e.target.closest('a');
    if (link?.getAttribute('href') === '/' && window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Router>
      <style>{GLOBAL_STYLES}</style>
      <ScrollToTop />
      <ProgressBar />
      <ToastStack />
      <ScrollToTopFAB />

      <div
        onClickCapture={handleGlobalClick}
        style={{ background: '#000', minHeight: '100vh', overflowX: 'hidden' }}
      >
        {/*
          ── SITE HEADER ──────────────────────────────────────────────
          AnnouncementBanner + Navbar wrapped in a single sticky block.
          The entire header sticks as one unit — no gap, no overlap.
          When the banner is dismissed the navbar moves up naturally.
        ──────────────────────────────────────────────────────────────*/}
        <div id="site-header">
          <AnnouncementBanner />
          <Navbar cartItemCount={cart.length} onCartClick={() => setMiniCartOpen(v => !v)} />
        </div>

        <NavigationGuard />
        <MiniCart cart={cart} open={miniCartOpen} onClose={() => setMiniCartOpen(false)} />

        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <BrandValues />
              <FeaturedProducts onAddToCart={handleAddToCart} products={ALL_PRODUCTS} />
              <TrendingSection products={ALL_PRODUCTS} onAddToCart={handleAddToCart} />
              <LookbookSection />
              <NewArrivals products={ALL_PRODUCTS} onAddToCart={handleAddToCart} />
              <SpecialOffers />
              <Categories />
              <RecentlyViewed onAddToCart={handleAddToCart} />
              <About />
              <Contact />
              <Newsletter />
              <Footer />
            </main>
          } />
          <Route path="/about"       element={<About />} />
          <Route path="/contact"     element={<Contact />} />
          <Route path="/categories"  element={<Categories />} />
          <Route path="/offers"      element={<SpecialOffers />} />
          <Route path="/signup"      element={<SignUp />} />
          <Route path="/login"       element={<Login />} />
          <Route path="/featured"    element={<FeaturedProducts onAddToCart={handleAddToCart} products={ALL_PRODUCTS} />} />
          <Route path="/search"      element={<SearchResults allProducts={ALL_PRODUCTS} onAddToCart={handleAddToCart} />} />
          <Route path="/cart"        element={<Cart cartItems={cart} setCartItems={setCart} />} />
          <Route path="/shop"        element={<ShopPage products={ALL_PRODUCTS} onAddToCart={handleAddToCart} />} />
          <Route path="/product/:id" element={<ProductDetail products={ALL_PRODUCTS} onAddToCart={handleAddToCart} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;