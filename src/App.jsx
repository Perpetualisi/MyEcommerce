import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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

/* ══════════════════════════════════════════════
   CDN BASE — Unsplash (all free, no auth)
══════════════════════════════════════════════ */
const U = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`;

/* ══════════════════════════════════════════════
   GLOBAL PRODUCT CATALOGUE  (60 products)
══════════════════════════════════════════════ */
export const ALL_PRODUCTS = [

  /* ─── ELECTRONICS (15) ─────────────────────── */
  { id: 1,  category: 'Electronics', name: 'Samsung Galaxy Tab S9',       price: 349,  imageURL: U('1516035069371-29a1b244cc32') },
  { id: 2,  category: 'Electronics', name: 'Apple iPhone 15 Pro',         price: 999,  imageURL: ('/electronics/Apple-iPhone-15-Pro.jpg') },
  { id: 3,  category: 'Electronics', name: 'Sony WH-1000XM5',             price: 349,  imageURL: U('1505740420928-5e560c06d30e') },
  { id: 4,  category: 'Electronics', name: 'LG OLED 4K TV 55"',           price: 1299, imageURL: ('/electronics/LG-OLED.jpg') },
  { id: 5,  category: 'Electronics', name: 'Apple MacBook Pro M3',        price: 2399, imageURL: ('/electronics/Apple-MacBook-Pro-M3.jpg') },
  { id: 6,  category: 'Electronics', name: 'Sony Alpha A7 IV',            price: 2499, imageURL: U('1516035069371-29a1b244cc32') },
  { id: 7,  category: 'Electronics', name: 'Apple AirPods Pro 2',         price: 249,  imageURL: ('/electronics/Apple-AirPods-Pro-2.jpg') },
  { id: 8,  category: 'Electronics', name: 'iPad Pro 12.9"',              price: 1099, imageURL: ('/electronics/iPad-Pro-12.9.jpg') },
  { id: 9,  category: 'Electronics', name: 'Dell XPS 15 Laptop',          price: 1799, imageURL: U('1496181133206-80ce9b88a853') },
  { id: 10, category: 'Electronics', name: 'Samsung 4K Monitor 32"',      price: 649,  imageURL: ('/electronics/Samsung-4K-Monitor-32.jpg') },
  { id: 11, category: 'Electronics', name: 'Bose QuietComfort 45',        price: 279,  imageURL: U('1546435770-a3e426bf472b') },
  { id: 12, category: 'Electronics', name: 'GoPro Hero 12 Black',         price: 399,  imageURL: ('/electronics/GoPro-Hero-12-Black.jpg') },
  { id: 13, category: 'Electronics', name: 'Nintendo Switch OLED',        price: 349,  imageURL: ('/electronics/Nintendo-Switch-OLED.jpg') },
  { id: 14, category: 'Electronics', name: 'Kindle Paperwhite 11th Gen',  price: 139,  imageURL: ('/electronics/Kindle-Paperwhite-11th-Gen.jpg') },
  { id: 15, category: 'Electronics', name: 'Smart Home Hub',              price: 129,  imageURL: ('/electronics/Smart-Home-Hub.jpg') },

  /* ─── FASHION (15) ─────────────────────────── */
  { id: 16, category: 'Fashion', name: "Levi's 501 Original Jeans",   price: 89,  imageURL: U('1542272604-787c3835535d') },
  { id: 17, category: 'Fashion', name: 'Nike Air Max 270',             price: 150, imageURL: U('1542291026-7eec264c27ff') },
  { id: 18, category: 'Fashion', name: 'Adidas Ultraboost 22',         price: 180, imageURL: ('/fashion/Adidas-Ultraboost-22.jpg') },
  { id: 19, category: 'Fashion', name: 'Ray-Ban Aviator Classic',      price: 154, imageURL: ('/fashion/Ray-Ban-Aviator-Classic.jpg') },
  { id: 20, category: 'Fashion', name: 'Minimalist Leather Watch',     price: 185, imageURL: U('1523275335684-37898b6baf30') },
  { id: 21, category: 'Fashion', name: 'Ivory Cashmere Sweater',       price: 220, imageURL: U('1434389677669-e08b4cac3105') },
  { id: 22, category: 'Fashion', name: 'Structured Canvas Tote',       price: 75,  imageURL: ('/fashion/Structured-Canvas-Tote.jpg') },
  { id: 23, category: 'Fashion', name: 'Merino Wool Overcoat',         price: 395, imageURL: U('1591047139829-d91aecb6caea') },
  { id: 24, category: 'Fashion', name: 'White Oxford Shirt',           price: 95,  imageURL: U('1596755094514-f87e34085b2c') },
  { id: 25, category: 'Fashion', name: 'Slim Chino Trousers',          price: 85,  imageURL: ('/fashion/Slim-Chino-Trousers.png') },
  { id: 26, category: 'Fashion', name: 'Chelsea Leather Boots',        price: 275, imageURL: ('/fashion/Chelsea-Leather-Boots.jpg') },
  { id: 27, category: 'Fashion', name: 'Classic Linen Blazer',         price: 310, imageURL: U('1507679799987-c73779587ccf') },
  { id: 28, category: 'Fashion', name: 'Patterned Silk Scarf',         price: 65,  imageURL: ('/fashion/Patterned-Silk-Scarf.jpg') },
  { id: 29, category: 'Fashion', name: 'Leather Bifold Wallet',        price: 55,  imageURL: ('/fashion/Leather-Bifold-Wallet.jpg') },
  { id: 30, category: 'Fashion', name: 'Structured Crossbody Bag',     price: 145, imageURL: ('/fashion/Structured-Crossbody-Bag.jpg') },

  /* ─── GROCERIES (15) ───────────────────────── */
  { id: 31, category: 'Groceries', name: 'Organic Honeycrisp Apples',   price: 6.99,  imageURL: U('1568702846914-96b305d2aaeb') },
  { id: 32, category: 'Groceries', name: 'Cold Pressed Olive Oil 500ml',price: 38,    imageURL: U('1474979266404-7eaacbcd87c5') },
  { id: 33, category: 'Groceries', name: 'Whole Bean Dark Roast 250g',  price: 26,    imageURL: U('1559056199-641a0ac8b55e') },
  { id: 34, category: 'Groceries', name: 'Artisan Sourdough Loaf',      price: 9.50,  imageURL: U('1509440159596-0249088772ff') },
  { id: 35, category: 'Groceries', name: 'Raw Wildflower Honey 350g',   price: 18,    imageURL: ('/Groceries/Raw-Wildflower-Honey-350g.jpg') },
  { id: 36, category: 'Groceries', name: 'Aged Parmesan Wedge 200g',    price: 14,    imageURL: U('1486297678162-eb2a19b0a32d') },
  { id: 37, category: 'Groceries', name: 'Organic Matcha Powder 80g',   price: 22,    imageURL: ('/Groceries/Organic-Matcha-Powder-80g.jpg') },
  { id: 38, category: 'Groceries', name: 'Truffle Salt 100g',           price: 16,    imageURL: ('/Groceries/Truffle-Salt-100g.jpg') },
  { id: 39, category: 'Groceries', name: 'Medjool Dates 500g',          price: 13,    imageURL: ('/Groceries/Medjool-Dates-500g.jpg') },
  { id: 40, category: 'Groceries', name: 'Heirloom Cherry Tomatoes',    price: 7.50,  imageURL: ('/Groceries/Heirloom-Cherry-Tomatoes.jpg') },
  { id: 41, category: 'Groceries', name: 'Smoked Paprika & Spice Set',  price: 24,    imageURL: ('/Groceries/Smoked-Paprika-&-Spice-Set.jpg') },
  { id: 42, category: 'Groceries', name: 'Kombucha Variety 6-Pack',     price: 28,    imageURL: ('/Groceries/Kombucha-Variety-6-Pack.jpg') },
  { id: 43, category: 'Groceries', name: 'Tahini & Sesame Spread',      price: 11,    imageURL: ('/Groceries/Tahini-&-Sesame-Spread.jpg') },
  { id: 44, category: 'Groceries', name: 'Oat Granola — Dark Choc',     price: 12,    imageURL: ('/Groceries/Oat-Granola — Dark-Choc.jpg') },
  { id: 45, category: 'Groceries', name: 'Sun-Dried Mango Slices',      price: 8.50,  imageURL: ('/Groceries/Sun-Dried-Mango-Slices.jpg') },

  /* ─── FURNITURE (15) ───────────────────────── */
  { id: 46, category: 'Furniture', name: 'Sculptural Boucle Sofa 3-Seat', price: 1850, imageURL: ('/Furniture/Sculptural-Boucle-Sofa-3-Seat.jpg') },
  { id: 47, category: 'Furniture', name: 'Solid Oak Dining Table',        price: 1200, imageURL: U('1617806118233-18e1de247200') },
  { id: 48, category: 'Furniture', name: 'Ergonomic Mesh Office Chair',   price: 489,  imageURL: U('1580480055273-228ff5388ef8') },
  { id: 49, category: 'Furniture', name: 'Sculptural Accent Chair',       price: 850,  imageURL: U('1598300042247-d088f8ab3a91') },
  { id: 50, category: 'Furniture', name: 'Oak & Brass Side Table',        price: 340,  imageURL: U('1532372320572-cda25653a26d') },
  { id: 51, category: 'Furniture', name: 'Floating Walnut Shelf Set',     price: 290,  imageURL: ('/Furniture/Floating-Walnut-Shelf-Set.jpg') },
  { id: 52, category: 'Furniture', name: 'Smoked Glass Coffee Table',     price: 620,  imageURL: ('/Furniture/Smoked-Glass-Coffee-Table.jpg') },
  { id: 53, category: 'Furniture', name: 'Linen Platform Bed Frame',      price: 980,  imageURL: U('1505693416388-ac5ce068fe85') },
  { id: 54, category: 'Furniture', name: 'Rattan Lounge Chair',           price: 460,  imageURL: U('1598300042247-d088f8ab3a91') },
  { id: 55, category: 'Furniture', name: 'Brass Floor Lamp Arc',          price: 385,  imageURL: U('1507473885765-e6ed057f782c') },
  { id: 56, category: 'Furniture', name: 'Terrazzo Planter Large',        price: 95,   imageURL: U('1485955900006-10f4d324d411') },
  { id: 57, category: 'Furniture', name: 'Abstract Canvas 90×120cm',      price: 420,  imageURL: U('1541961017774-22349e4a1262') },
  { id: 58, category: 'Furniture', name: 'Handwoven Wool Rug 200×300',    price: 740,  imageURL: ('/Furniture/Handwoven-Wool-Rug-200×300.jpg') },
  { id: 59, category: 'Furniture', name: 'Modular Bookshelf System',      price: 560,  imageURL: ('/Furniture/Modular-Bookshelf-System.jpg') },
  { id: 60, category: 'Furniture', name: 'Ceramic Table Lamp',            price: 175,  imageURL: U('1507473885765-e6ed057f782c') },
];

/* ══════════════════════════════════════════════
   SCROLL TO TOP
══════════════════════════════════════════════ */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
};

/* ══════════════════════════════════════════════
   NAVIGATION GUARD
══════════════════════════════════════════════ */
const NAV_GUARD_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@400&display=swap');
  .ng-bar {
    position: sticky; top: 80px; z-index: 40;
    background: rgba(8,7,5,0.96);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .ng-inner {
    max-width: 1440px; margin: 0 auto;
    padding: 0 6vw; height: 48px;
    display: flex; align-items: center;
  }
  .ng-link {
    display: inline-flex; align-items: center; gap: 10px;
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); text-decoration: none;
    transition: color 0.3s;
  }
  .ng-link:hover { color: rgba(255,255,255,0.75); }
  .ng-link:hover .ng-arrow { transform: translateX(-3px); }
  .ng-arrow { transition: transform 0.3s; }
  .ng-sep { width: 1px; height: 14px; background: rgba(255,255,255,0.08); margin: 0 16px; }
  .ng-crumb {
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px; letter-spacing: 0.35em; text-transform: uppercase;
    color: rgba(255,255,255,0.45);
  }
`;

const ROUTE_LABELS = {
  '/shop':       'Shop',
  '/featured':   'Featured',
  '/offers':     'Offers',
  '/about':      'About',
  '/contact':    'Contact',
  '/cart':       'Cart',
  '/search':     'Search',
  '/login':      'Login',
  '/signup':     'Sign Up',
  '/categories': 'Categories',
};

const NavigationGuard = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;
  const isProduct = location.pathname.startsWith('/product/');
  const label = isProduct ? 'Product' : ROUTE_LABELS[location.pathname] || 'Archive';
  return (
    <>
      <style>{NAV_GUARD_STYLES}</style>
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
    </>
  );
};

/* ══════════════════════════════════════════════
   NEW INLINE SECTIONS
══════════════════════════════════════════════ */

/* ── TRENDING SECTION ─────────────────────────
   Horizontal scroll strip of 8 trending items  */
const TRENDING_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300&family=Overpass+Mono:wght@400;600&display=swap');
  .tr-root { background: #080705; padding: 80px 0; border-top: 1px solid rgba(255,255,255,0.05); }
  .tr-header {
    max-width: 1440px; margin: 0 auto; padding: 0 6vw;
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 40px;
  }
  .tr-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
  .tr-eyebrow-line { width: 28px; height: 1px; background: #C9A96E; }
  .tr-eyebrow-text { font-family: 'Overpass Mono', monospace; font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(255,255,255,0.28); }
  .tr-title { font-family: 'Overpass Mono', monospace; font-size: clamp(22px,3vw,40px); font-weight: 300; color: #fff; letter-spacing: -0.02em; }
  .tr-title em { font-family: 'Cormorant Garamond', serif; font-style: italic; color: rgba(255,255,255,0.4); }
  .tr-view-all { font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.3s; }
  .tr-view-all:hover { color: #C9A96E; }
  .tr-strip { padding: 0 6vw; display: flex; gap: 2px; overflow-x: auto; scrollbar-width: none; }
  .tr-strip::-webkit-scrollbar { display: none; }
  .tr-card { flex-shrink: 0; width: clamp(180px,20vw,240px); background: #0d0b09; cursor: pointer; transition: background 0.3s; }
  .tr-card:hover { background: #111008; }
  .tr-card-img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; transition: transform 0.8s ease; }
  .tr-card:hover .tr-card-img { transform: scale(1.05); }
  .tr-card-img-wrap { overflow: hidden; }
  .tr-card-info { padding: 14px 16px; }
  .tr-card-name { font-family: 'Overpass Mono', monospace; font-size: 9px; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.65); line-height: 1.45; margin-bottom: 8px; }
  .tr-card-price { font-family: 'Overpass Mono', monospace; font-size: 10px; font-weight: 600; color: #fff; }
  .tr-rank { display: inline-block; font-family: 'Overpass Mono', monospace; font-size: 7px; letter-spacing: 0.3em; color: #C9A96E; margin-bottom: 6px; }
`;

const TRENDING_IDS = [2, 20, 5, 49, 33, 18, 7, 52];

const TrendingSection = ({ products, onAddToCart }) => {
  const items = TRENDING_IDS.map(id => products.find(p => p.id === id)).filter(Boolean);
  return (
    <>
      <style>{TRENDING_STYLES}</style>
      <section className="tr-root">
        <div className="tr-header">
          <div>
            <div className="tr-eyebrow">
              <div className="tr-eyebrow-line" />
              <span className="tr-eyebrow-text">Most Acquired · 2026</span>
            </div>
            <h2 className="tr-title">Trending <em>Now.</em></h2>
          </div>
          <Link to="/shop" className="tr-view-all">View All →</Link>
        </div>
        <div className="tr-strip">
          {items.map((p, i) => (
            <div key={p.id} className="tr-card" onClick={() => onAddToCart(p)}>
              <div className="tr-card-img-wrap">
                <img className="tr-card-img" src={p.imageURL} alt={p.name} onError={e => { e.target.style.opacity = 0.05; }} />
              </div>
              <div className="tr-card-info">
                <span className="tr-rank">#{String(i + 1).padStart(2, '0')}</span>
                <p className="tr-card-name">{p.name}</p>
                <p className="tr-card-price">${Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

/* ── BRAND VALUES STRIP ───────────────────────
   4-column icon + stat row                    */
const VALUES_STYLES = `
  .bv-root { background: #0a0805; padding: 72px 6vw; border-top: 1px solid rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.04); }
  .bv-grid { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; }
  @media (max-width: 768px) { .bv-grid { grid-template-columns: repeat(2,1fr); } }
  @media (max-width: 400px) { .bv-grid { grid-template-columns: 1fr; } }
  .bv-item { padding: 36px 28px; background: #0d0b09; display: flex; flex-direction: column; gap: 14px; }
  .bv-icon { font-size: 28px; }
  .bv-stat { font-family: 'Overpass Mono', monospace; font-size: clamp(28px,3vw,42px); font-weight: 600; color: #C9A96E; letter-spacing: -0.02em; }
  .bv-label { font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.28); line-height: 1.7; }
`;

const VALUES = [
  { icon: '🌍', stat: '190+', label: 'Countries\nShipped To' },
  { icon: '⚡', stat: '48h',  label: 'Average\nDelivery Time' },
  { icon: '✦',  stat: '60',   label: 'Curated\nProducts' },
  { icon: '★',  stat: '4.9',  label: 'Average\nCustomer Rating' },
];

const BrandValues = () => (
  <>
    <style>{VALUES_STYLES}</style>
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
  </>
);

/* ── LOOKBOOK EDITORIAL SECTION ───────────────
   Full-bleed 2-column editorial feature       */
const LOOK_STYLES = `
  .lk-root { background: #080705; padding: 100px 6vw; border-top: 1px solid rgba(255,255,255,0.05); }
  .lk-inner { max-width: 1440px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
  @media (max-width: 768px) { .lk-inner { grid-template-columns: 1fr; } }
  .lk-img-wrap { position: relative; aspect-ratio: 4/5; overflow: hidden; background: #0d0b09; }
  .lk-img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s ease; }
  .lk-img-wrap:hover .lk-img { transform: scale(1.04); }
  .lk-img-label { position: absolute; bottom: 20px; left: 20px; font-family: 'Overpass Mono', monospace; font-size: 8px; letter-spacing: 0.5em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
  .lk-info { background: #0d0b09; padding: clamp(40px,5vw,80px); display: flex; flex-direction: column; justify-content: center; gap: 28px; }
  .lk-eyebrow { font-family: 'Overpass Mono', monospace; font-size: 8px; letter-spacing: 0.6em; text-transform: uppercase; color: #C9A96E; }
  .lk-title { font-family: 'Cormorant Garamond', serif; font-style: italic; font-weight: 300; font-size: clamp(36px,4vw,64px); color: #fff; letter-spacing: -0.01em; line-height: 1.1; }
  .lk-body { font-family: 'Overpass Mono', monospace; font-size: 10px; line-height: 2; color: rgba(255,255,255,0.3); letter-spacing: 0.03em; max-width: 360px; }
  .lk-cta { display: inline-flex; align-items: center; gap: 14px; text-decoration: none; font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.4); transition: color 0.3s; }
  .lk-cta:hover { color: #C9A96E; }
  .lk-cta-line { width: 32px; height: 1px; background: currentColor; transition: width 0.3s; }
  .lk-cta:hover .lk-cta-line { width: 52px; }
`;

const LookbookSection = () => (
  <>
    <style>{LOOK_STYLES}</style>
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
            Each piece in the 2026 collection earns its place through form,
            material honesty, and the quiet confidence of lasting design.
          </p>
          <Link to="/shop?category=Fashion" className="lk-cta">
            Explore Fashion
            <span className="lk-cta-line" />
          </Link>
        </div>
      </div>
    </section>
  </>
);

/* ── NEW ARRIVALS GRID ────────────────────────
   2×4 grid, one per category                 */
const NA_STYLES = `
  .na-root { background: #080705; padding: 100px 6vw; border-top: 1px solid rgba(255,255,255,0.05); }
  .na-inner { max-width: 1440px; margin: 0 auto; }
  .na-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 48px; flex-wrap: wrap; gap: 16px; }
  .na-eyebrow { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
  .na-eyebrow-line { width: 28px; height: 1px; background: #C9A96E; }
  .na-eyebrow-text { font-family: 'Overpass Mono', monospace; font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(255,255,255,0.28); }
  .na-title { font-family: 'Overpass Mono', monospace; font-size: clamp(22px,3vw,40px); font-weight: 300; color: #fff; letter-spacing: -0.02em; }
  .na-title em { font-family: 'Cormorant Garamond', serif; font-style: italic; color: rgba(255,255,255,0.4); }
  .na-link { font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.4em; text-transform: uppercase; color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.3s; }
  .na-link:hover { color: #C9A96E; }
  .na-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; }
  @media (max-width: 900px) { .na-grid { grid-template-columns: repeat(2,1fr); } }
  .na-card { background: #0d0b09; display: flex; flex-direction: column; }
  .na-card-img-wrap { position: relative; aspect-ratio: 3/4; overflow: hidden; }
  .na-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.9s ease; }
  .na-card:hover .na-card-img { transform: scale(1.06); }
  .na-new-badge { position: absolute; top: 14px; left: 14px; font-family: 'Overpass Mono', monospace; font-size: 7px; letter-spacing: 0.4em; text-transform: uppercase; background: #C9A96E; color: #080705; padding: 4px 9px; }
  .na-card-info { padding: 16px 18px 20px; border-top: 1px solid rgba(255,255,255,0.04); }
  .na-card-cat { font-family: 'Overpass Mono', monospace; font-size: 7.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.22); margin-bottom: 8px; }
  .na-card-name { font-family: 'Overpass Mono', monospace; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.72); line-height: 1.45; margin-bottom: 10px; }
  .na-card-price { font-family: 'Overpass Mono', monospace; font-size: 11px; font-weight: 600; color: #fff; }
`;

const NEW_ARRIVAL_IDS = [7, 21, 55, 37, 26, 60, 45, 30];

const NewArrivals = ({ products, onAddToCart }) => {
  const items = NEW_ARRIVAL_IDS.map(id => products.find(p => p.id === id)).filter(Boolean);
  return (
    <>
      <style>{NA_STYLES}</style>
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
            <Link to="/shop" className="na-link">Shop All →</Link>
          </div>
          <div className="na-grid">
            {items.map(p => (
              <div key={p.id} className="na-card" onClick={() => onAddToCart(p)} style={{ cursor: 'pointer' }}>
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
    </>
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

  useEffect(() => {
    try { localStorage.setItem('archive_cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  const handleAddToCart = (product) => {
    setCart(prev => [...prev, { ...product, cartId: Date.now() }]);
  };

  const handleGlobalClick = (e) => {
    const link = e.target.closest('a');
    if (link?.getAttribute('href') === '/' && window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Router>
      <ScrollToTop />
      <div
        onClickCapture={handleGlobalClick}
        style={{ background: '#080705', minHeight: '100vh', overflowX: 'hidden' }}
      >
        <Navbar cartItemCount={cart.length} />
        <NavigationGuard />

        <Routes>

          {/* ── HOME ── */}
          <Route
            path="/"
            element={
              <main>
                <Hero />
                <BrandValues />
                <FeaturedProducts onAddToCart={handleAddToCart} />
                <TrendingSection products={ALL_PRODUCTS} onAddToCart={handleAddToCart} />
                <LookbookSection />
                <NewArrivals products={ALL_PRODUCTS} onAddToCart={handleAddToCart} />
                <SpecialOffers />
                <Categories />
                <About />
                <Contact />
                <Newsletter />
                <Footer />
              </main>
            }
          />

          {/* ── SUB PAGES ── */}
          <Route path="/about"      element={<About />} />
          <Route path="/contact"    element={<Contact />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/offers"     element={<SpecialOffers />} />
          <Route path="/signup"     element={<SignUp />} />
          <Route path="/login"      element={<Login />} />

          <Route path="/featured"
            element={<FeaturedProducts onAddToCart={handleAddToCart} />}
          />
          <Route path="/search"
            element={<SearchResults allProducts={ALL_PRODUCTS} onAddToCart={handleAddToCart} />}
          />
          <Route path="/cart"
            element={<Cart cartItems={cart} setCartItems={setCart} />}
          />
          <Route path="/shop"
            element={<ShopPage products={ALL_PRODUCTS} onAddToCart={handleAddToCart} />}
          />
          <Route path="/product/:id"
            element={<ProductDetail products={ALL_PRODUCTS} onAddToCart={handleAddToCart} />}
          />

        </Routes>
      </div>
    </Router>
  );
};

export default App;