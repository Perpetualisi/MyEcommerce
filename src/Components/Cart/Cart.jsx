import React, { useState, useEffect, useRef } from 'react';
import {
  Trash2, ArrowUpRight, ShoppingBag, Plus, Minus,
  ShieldCheck, Heart, Tag, MessageSquare, Package,
  Clock, Truck, ChevronDown, ChevronUp, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Overpass+Mono:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cart-root {
    font-family: 'Overpass Mono', monospace;
    background: #080705;
    color: #e8e4dd;
    min-height: 100vh;
    padding: 120px 6vw 100px;
  }

  .cart-inner { max-width: 1200px; margin: 0 auto; }

  /* ── HEADER ── */
  .cart-header {
    display: flex; flex-direction: column; gap: 24px;
    padding-bottom: 44px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 56px;
  }
  @media (min-width: 640px) {
    .cart-header { flex-direction: row; align-items: flex-end; justify-content: space-between; }
  }
  .cart-eyebrow { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .cart-eyebrow-line { width: 26px; height: 1px; background: #C9A96E; }
  .cart-eyebrow-text { font-size: 9px; letter-spacing: 0.55em; text-transform: uppercase; color: rgba(255,255,255,0.28); }
  .cart-title { font-size: clamp(32px,4.5vw,68px); font-weight: 300; letter-spacing: -0.025em; line-height: 1.05; color: #fff; }
  .cart-title em { font-family: 'Cormorant Garamond', serif; font-style: italic; color: rgba(255,255,255,0.4); }
  .cart-header-meta { text-align: right; }
  .cart-count-big { font-size: 9px; letter-spacing: 0.5em; text-transform: uppercase; color: rgba(255,255,255,0.75); }
  .cart-count-sub { font-size: 8px; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(255,255,255,0.2); margin-top: 6px; font-style: italic; }

  /* ── EMPTY STATE ── */
  .cart-empty {
    padding: 100px 0; display: flex; flex-direction: column;
    align-items: center; gap: 20px; text-align: center;
    animation: cartFade 0.5s ease;
  }
  @keyframes cartFade { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  .cart-empty-icon { color: rgba(255,255,255,0.1); }
  .cart-empty-title { font-size: 11px; letter-spacing: 0.5em; text-transform: uppercase; color: rgba(255,255,255,0.25); }
  .cart-empty-sub { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 16px; color: rgba(255,255,255,0.25); }
  .cart-empty-btn {
    margin-top: 12px; padding: 14px 32px;
    border: 1px solid rgba(255,255,255,0.12); background: none;
    font-family: 'Overpass Mono', monospace; font-size: 8.5px;
    letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.4); cursor: pointer;
    transition: border-color 0.3s, color 0.3s;
  }
  .cart-empty-btn:hover { border-color: #C9A96E; color: #C9A96E; }

  /* ── LAYOUT ── */
  .cart-layout { display: grid; grid-template-columns: 1fr 380px; gap: 2px; align-items: start; }
  @media (max-width: 1000px) { .cart-layout { grid-template-columns: 1fr; } }

  /* ── ITEM LIST ── */
  .cart-list-header {
    display: flex; justify-content: space-between;
    font-size: 8px; letter-spacing: 0.4em; text-transform: uppercase;
    color: rgba(255,255,255,0.22); padding: 0 0 14px;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 2px;
  }
  .cart-items { display: flex; flex-direction: column; gap: 2px; }

  /* ── LINE ITEM ── */
  .cart-item {
    background: #0d0b09; padding: 24px 20px;
    display: grid; grid-template-columns: 88px 1fr auto;
    gap: 20px; align-items: start;
    animation: itemIn 0.4s ease both;
    transition: background 0.25s;
    position: relative;
  }
  @keyframes itemIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .cart-item:hover { background: #111008; }
  .cart-item.removing { animation: itemOut 0.35s ease both; }
  @keyframes itemOut { to { opacity:0; transform:translateX(-16px); height:0; padding:0; overflow:hidden; } }

  /* Thumb */
  .cart-item-thumb {
    aspect-ratio: 3/4; overflow: hidden; background: #111008;
    cursor: pointer;
  }
  .cart-item-thumb img {
    width: 100%; height: 100%; object-fit: cover;
    transition: transform 0.7s ease;
  }
  .cart-item:hover .cart-item-thumb img { transform: scale(1.06); }

  /* Info */
  .cart-item-info { display: flex; flex-direction: column; gap: 10px; }
  .cart-item-cat { font-size: 7.5px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.22); }
  .cart-item-name {
    font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase;
    color: rgba(255,255,255,0.8); line-height: 1.5; cursor: pointer;
    transition: color 0.3s;
  }
  .cart-item-name:hover { color: #fff; }
  .cart-item-ref { font-size: 7.5px; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(255,255,255,0.18); }

  /* Qty */
  .cart-qty {
    display: inline-flex; align-items: center;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
  }
  .cart-qty-btn {
    width: 30px; height: 30px; background: none; border: none;
    color: rgba(255,255,255,0.4); cursor: pointer; display: flex;
    align-items: center; justify-content: center;
    transition: color 0.2s, background 0.2s;
  }
  .cart-qty-btn:hover { color: #fff; background: rgba(255,255,255,0.06); }
  .cart-qty-num {
    width: 36px; text-align: center;
    font-size: 10px; letter-spacing: 0.1em;
    color: rgba(255,255,255,0.75); border-left: 1px solid rgba(255,255,255,0.06); border-right: 1px solid rgba(255,255,255,0.06);
    line-height: 30px;
  }

  /* Item actions */
  .cart-item-actions { display: flex; gap: 14px; margin-top: 4px; }
  .cart-item-action-btn {
    display: flex; align-items: center; gap: 6px;
    font-size: 7.5px; letter-spacing: 0.4em; text-transform: uppercase;
    color: rgba(255,255,255,0.22); background: none; border: none;
    font-family: 'Overpass Mono', monospace; cursor: pointer;
    transition: color 0.25s;
  }
  .cart-item-action-btn:hover { color: rgba(255,255,255,0.7); }
  .cart-item-action-btn.remove:hover { color: #e87070; }
  .cart-item-action-btn.save:hover { color: #e87070; }

  /* Price col */
  .cart-item-price-col { text-align: right; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
  .cart-item-price { font-size: 12px; font-weight: 600; color: #fff; letter-spacing: 0.03em; }
  .cart-item-unit-price { font-size: 7.5px; letter-spacing: 0.3em; color: rgba(255,255,255,0.2); }

  /* Mobile */
  @media (max-width: 520px) {
    .cart-item { grid-template-columns: 72px 1fr; }
    .cart-item-price-col { grid-column: 1/-1; flex-direction: row; justify-content: space-between; align-items: center; }
  }

  /* ── SAVED FOR LATER ── */
  .saved-section { margin-top: 2px; }
  .saved-toggle {
    width: 100%; padding: 16px 20px; background: #0a0805;
    border: none; border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: space-between;
    font-family: 'Overpass Mono', monospace; font-size: 8.5px;
    letter-spacing: 0.4em; text-transform: uppercase;
    color: rgba(255,255,255,0.35); cursor: pointer;
    transition: color 0.3s, background 0.3s;
  }
  .saved-toggle:hover { color: rgba(255,255,255,0.7); background: #0d0b09; }
  .saved-items { display: flex; flex-direction: column; gap: 2px; }
  .saved-item {
    background: #0a0805; padding: 16px 20px;
    display: grid; grid-template-columns: 56px 1fr auto;
    gap: 16px; align-items: center;
  }
  .saved-item-thumb { aspect-ratio: 3/4; overflow: hidden; }
  .saved-item-thumb img { width: 100%; height: 100%; object-fit: cover; opacity: 0.7; }
  .saved-item-name { font-size: 9px; letter-spacing: 0.04em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
  .saved-item-price { font-size: 9px; font-weight: 600; color: rgba(255,255,255,0.4); }
  .saved-item-btn {
    font-size: 7.5px; letter-spacing: 0.38em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); background: none; border: 1px solid rgba(255,255,255,0.07);
    padding: 8px 12px; cursor: pointer; font-family: 'Overpass Mono', monospace;
    transition: border-color 0.3s, color 0.3s;
  }
  .saved-item-btn:hover { border-color: #C9A96E; color: #C9A96E; }

  /* ── ORDER NOTES ── */
  .notes-section { margin-top: 2px; }
  .notes-toggle {
    width: 100%; padding: 16px 20px; background: #0d0b09;
    border: none; display: flex; align-items: center; justify-content: space-between;
    font-family: 'Overpass Mono', monospace; font-size: 8.5px;
    letter-spacing: 0.4em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); cursor: pointer;
    transition: color 0.3s;
  }
  .notes-toggle:hover { color: rgba(255,255,255,0.65); }
  .notes-body { background: #0d0b09; padding: 0 20px 20px; }
  .notes-textarea {
    width: 100%; background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07); color: #e8e4dd;
    font-family: 'Overpass Mono', monospace; font-size: 9px;
    letter-spacing: 0.05em; padding: 14px 16px; resize: none;
    min-height: 90px; outline: none; line-height: 1.9;
    transition: border-color 0.3s;
  }
  .notes-textarea::placeholder { color: rgba(255,255,255,0.18); }
  .notes-textarea:focus { border-color: rgba(201,169,110,0.35); }

  /* ── SIDEBAR ── */
  .cart-sidebar { background: #0d0b09; position: sticky; top: 140px; }
  @media (max-width: 1000px) { .cart-sidebar { position: static; } }

  .sidebar-section { padding: 28px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .sidebar-section:last-child { border-bottom: none; }
  .sidebar-label {
    font-size: 8px; letter-spacing: 0.55em; text-transform: uppercase;
    color: rgba(255,255,255,0.28); display: block; margin-bottom: 18px;
  }

  /* Promo code */
  .promo-row { display: flex; gap: 2px; }
  .promo-input {
    flex: 1; background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08); color: #e8e4dd;
    font-family: 'Overpass Mono', monospace; font-size: 9px;
    letter-spacing: 0.15em; text-transform: uppercase; padding: 10px 12px; outline: none;
    transition: border-color 0.3s;
  }
  .promo-input::placeholder { color: rgba(255,255,255,0.18); letter-spacing: 0.3em; }
  .promo-input:focus { border-color: rgba(201,169,110,0.4); }
  .promo-apply {
    padding: 10px 16px; background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.5);
    font-family: 'Overpass Mono', monospace; font-size: 8px;
    letter-spacing: 0.35em; text-transform: uppercase; cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .promo-apply:hover { background: rgba(255,255,255,0.1); color: #fff; }
  .promo-success { font-size: 8px; letter-spacing: 0.3em; color: #7EBF7A; margin-top: 8px; display: flex; align-items: center; gap: 6px; }
  .promo-error { font-size: 8px; letter-spacing: 0.3em; color: #e87070; margin-top: 8px; }

  /* Cost breakdown */
  .cost-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .cost-label { font-size: 8.5px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
  .cost-val { font-size: 9px; letter-spacing: 0.1em; color: rgba(255,255,255,0.65); }
  .cost-val.free { color: #7EBF7A; }
  .cost-val.discount { color: #7EBF7A; }
  .cost-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 16px 0; }
  .cost-total-row { display: flex; justify-content: space-between; align-items: baseline; }
  .cost-total-label { font-size: 9px; letter-spacing: 0.45em; text-transform: uppercase; color: rgba(255,255,255,0.65); }
  .cost-total-val { font-size: clamp(22px,2.5vw,30px); font-weight: 600; color: #fff; letter-spacing: -0.01em; }

  /* Delivery estimate */
  .delivery-bar {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 14px; background: rgba(201,169,110,0.07);
    border: 1px solid rgba(201,169,110,0.15); margin-top: 16px;
  }
  .delivery-bar-text { font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.45); line-height: 1.6; }
  .delivery-bar-text strong { color: #C9A96E; display: block; margin-bottom: 2px; }

  /* Checkout btn */
  .checkout-btn {
    width: 100%; padding: 20px;
    background: #C9A96E; border: none; color: #080705;
    font-family: 'Overpass Mono', monospace; font-size: 9px;
    letter-spacing: 0.5em; text-transform: uppercase; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    transition: background 0.25s;
  }
  .checkout-btn:hover { background: #d4b87a; }
  .checkout-btn:disabled { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.2); cursor: not-allowed; }
  .checkout-arrow { transition: transform 0.35s; }
  .checkout-btn:not(:disabled):hover .checkout-arrow { transform: translateX(4px) translateY(-4px); }

  /* Shop more */
  .shop-more-btn {
    width: 100%; padding: 16px;
    background: transparent; border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.3); font-family: 'Overpass Mono', monospace;
    font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase;
    cursor: pointer; transition: border-color 0.3s, color 0.3s;
  }
  .shop-more-btn:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.75); }

  /* Trust badges */
  .trust-badges { display: flex; flex-direction: column; gap: 10px; padding-top: 4px; }
  .trust-badge { display: flex; align-items: center; gap: 10px; }
  .trust-badge-text { font-size: 8px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.22); }
  .trust-badge-icon { color: rgba(255,255,255,0.18); flex-shrink: 0; }

  /* ── SUCCESS MODAL ── */
  .checkout-success-backdrop {
    position: fixed; inset: 0; background: rgba(4,3,2,0.92);
    backdrop-filter: blur(14px); z-index: 100;
    display: flex; align-items: center; justify-content: center; padding: 24px;
    animation: bkIn 0.25s ease;
  }
  @keyframes bkIn { from { opacity:0; } to { opacity:1; } }
  .checkout-success-panel {
    background: #0f0d0a; border: 1px solid rgba(255,255,255,0.08);
    max-width: 480px; width: 100%; padding: 60px 48px;
    text-align: center;
    animation: panelUp 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes panelUp { from { transform:translateY(20px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  .cs-icon { color: #7EBF7A; margin: 0 auto 28px; }
  .cs-title { font-size: 10px; letter-spacing: 0.6em; text-transform: uppercase; color: #fff; margin-bottom: 12px; }
  .cs-id { font-size: 9px; letter-spacing: 0.5em; color: #C9A96E; margin-bottom: 20px; }
  .cs-body { font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.25); line-height: 1.9; max-width: 300px; margin: 0 auto 36px; }
  .cs-btn {
    padding: 14px 32px; background: #C9A96E; border: none;
    font-family: 'Overpass Mono', monospace; font-size: 8.5px;
    letter-spacing: 0.45em; text-transform: uppercase; color: #080705;
    cursor: pointer; transition: background 0.2s;
  }
  .cs-btn:hover { background: #d4b87a; }

  @media (max-width: 480px) { .cart-root { padding: 80px 5vw 80px; } }
`;

/* ═══════════════════════════════════════════════
   VALID PROMO CODES
═══════════════════════════════════════════════ */
const PROMOS = {
  'ARCHIVE10': { label: 'ARCHIVE10', discount: 0.10, desc: '10% off' },
  'VENDO20':   { label: 'VENDO20',   discount: 0.20, desc: '20% off' },
  'SHIP2026':  { label: 'SHIP2026',  discount: 0,    freeShip: true, desc: 'Free Shipping' },
};

const SHIPPING_THRESHOLD = 150; // free above this
const SHIPPING_COST      = 18;

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const fmt = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
const imgOf = (item) => item.imageURL || item.image || item.imageUrl || '';

const deliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * 3) + 3);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

/* ═══════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════ */
const Cart = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();

  /* State */
  const [savedItems, setSavedItems]     = useState([]);
  const [showSaved, setShowSaved]       = useState(false);
  const [showNotes, setShowNotes]       = useState(false);
  const [orderNotes, setOrderNotes]     = useState('');
  const [promoCode, setPromoCode]       = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError]     = useState('');
  const [removingIdx, setRemovingIdx]   = useState(null);
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [orderId, setOrderId]           = useState('');
  const [estDelivery]                   = useState(deliveryDate);

  const itemCount = cartItems.length;

  /* Derived totals */
  const subtotal = cartItems.reduce((acc, item) => {
    const p = typeof item.price === 'string'
      ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
      : (item.price || 0);
    return acc + p * (item.quantity || 1);
  }, 0);

  const promoDiscount = appliedPromo
    ? appliedPromo.freeShip ? 0 : subtotal * appliedPromo.discount
    : 0;

  const discountedSub = subtotal - promoDiscount;
  const freeShip      = discountedSub >= SHIPPING_THRESHOLD || appliedPromo?.freeShip;
  const shipping      = freeShip ? 0 : SHIPPING_COST;
  const total         = discountedSub + shipping;

  /* Sync to localStorage */
  useEffect(() => {
    try { localStorage.setItem('archive_cart', JSON.stringify(cartItems)); } catch {}
  }, [cartItems]);

  /* Qty */
  const updateQty = (index, delta) => {
    const next = [...cartItems];
    const newQty = (next[index].quantity || 1) + delta;
    if (newQty < 1) return;
    next[index] = { ...next[index], quantity: newQty };
    setCartItems(next);
  };

  /* Remove with exit animation */
  const removeItem = (index) => {
    setRemovingIdx(index);
    setTimeout(() => {
      setCartItems(cartItems.filter((_, i) => i !== index));
      setRemovingIdx(null);
    }, 320);
  };

  /* Save for later */
  const saveForLater = (index) => {
    setSavedItems(prev => [...prev, { ...cartItems[index], quantity: 1 }]);
    removeItem(index);
    setShowSaved(true);
  };
  const moveToCart = (sIndex) => {
    setCartItems(prev => [...prev, { ...savedItems[sIndex], cartId: Date.now() }]);
    setSavedItems(prev => prev.filter((_, i) => i !== sIndex));
  };
  const removeSaved = (sIndex) => setSavedItems(prev => prev.filter((_, i) => i !== sIndex));

  /* Promo */
  const applyPromo = () => {
    const key = promoCode.trim().toUpperCase();
    if (PROMOS[key]) {
      setAppliedPromo(PROMOS[key]);
      setPromoError('');
    } else {
      setPromoError('Code not recognised in registry.');
      setAppliedPromo(null);
    }
  };
  const removePromo = () => { setAppliedPromo(null); setPromoCode(''); setPromoError(''); };

  /* Checkout */
  const handleCheckout = () => {
    if (!itemCount) return;
    const id = Math.random().toString(36).slice(2,11).toUpperCase();
    setOrderId(id);
    setCheckoutDone(true);
    setCartItems([]);
    try { localStorage.removeItem('archive_cart'); } catch {}
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="cart-root">
        <div className="cart-inner">

          {/* HEADER */}
          <header className="cart-header">
            <div>
              <div className="cart-eyebrow">
                <div className="cart-eyebrow-line" />
                <span className="cart-eyebrow-text">Current Manifest · Global Registry</span>
              </div>
              <h1 className="cart-title">Your <em>Collection.</em></h1>
            </div>
            <div className="cart-header-meta">
              <p className="cart-count-big">{String(itemCount).padStart(2,'0')} Objects Queued</p>
              <p className="cart-count-sub">NY-ARCHIVE-V.26</p>
            </div>
          </header>

          {/* EMPTY */}
          {itemCount === 0 && !checkoutDone && (
            <div className="cart-empty">
              <ShoppingBag size={48} strokeWidth={0.8} className="cart-empty-icon" />
              <p className="cart-empty-title">Archive Devoid of Selections</p>
              <p className="cart-empty-sub">Awaiting curation.</p>
              <button className="cart-empty-btn" onClick={() => navigate('/shop')}>
                Return to Archive
              </button>
            </div>
          )}

          {/* LAYOUT */}
          {itemCount > 0 && (
            <div className="cart-layout">

              {/* ── LEFT: ITEMS ── */}
              <div>
                <div className="cart-list-header">
                  <span>Registry Details</span>
                  <span>Valuation</span>
                </div>

                <div className="cart-items">
                  {cartItems.map((item, i) => {
                    const p = typeof item.price === 'string'
                      ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
                      : (item.price || 0);
                    const qty = item.quantity || 1;
                    return (
                      <div
                        key={`${item.id}-${item.cartId || i}`}
                        className={`cart-item${removingIdx === i ? ' removing' : ''}`}
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {/* Thumb */}
                        <div className="cart-item-thumb" onClick={() => navigate(`/product/${item.id}`)}>
                          <img src={imgOf(item)} alt={item.name}
                            onError={e => { e.target.style.opacity = 0.04; }} />
                        </div>

                        {/* Info */}
                        <div className="cart-item-info">
                          <span className="cart-item-cat">{item.category || 'Archive'}</span>
                          <span className="cart-item-name" onClick={() => navigate(`/product/${item.id}`)}>
                            {item.name}
                          </span>
                          <span className="cart-item-ref">REF: {String(item.id || '').slice(0,8).toUpperCase()}</span>

                          {/* Qty */}
                          <div className="cart-qty">
                            <button className="cart-qty-btn" onClick={() => updateQty(i, -1)}>
                              <Minus size={10} />
                            </button>
                            <span className="cart-qty-num">{qty}</span>
                            <button className="cart-qty-btn" onClick={() => updateQty(i, 1)}>
                              <Plus size={10} />
                            </button>
                          </div>

                          {/* Actions */}
                          <div className="cart-item-actions">
                            <button className="cart-item-action-btn save" onClick={() => saveForLater(i)}>
                              <Heart size={10} /> Save for Later
                            </button>
                            <button className="cart-item-action-btn remove" onClick={() => removeItem(i)}>
                              <Trash2 size={10} /> Remove
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="cart-item-price-col">
                          <span className="cart-item-price">{fmt(p * qty)}</span>
                          {qty > 1 && <span className="cart-item-unit-price">{fmt(p)} each</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* SAVED FOR LATER */}
                {savedItems.length > 0 && (
                  <div className="saved-section">
                    <button className="saved-toggle" onClick={() => setShowSaved(v => !v)}>
                      <span><Heart size={11} style={{ display:'inline', marginRight:8, verticalAlign:'middle' }} />Saved for Later ({savedItems.length})</span>
                      {showSaved ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                    {showSaved && (
                      <div className="saved-items">
                        {savedItems.map((s, si) => (
                          <div key={si} className="saved-item">
                            <div className="saved-item-thumb">
                              <img src={imgOf(s)} alt={s.name} onError={e => { e.target.style.opacity = 0.04; }} />
                            </div>
                            <div>
                              <p className="saved-item-name">{s.name}</p>
                              <p className="saved-item-price">{fmt(s.price)}</p>
                            </div>
                            <div style={{ display:'flex', gap:6, flexDirection:'column' }}>
                              <button className="saved-item-btn" onClick={() => moveToCart(si)}>Move to Bag</button>
                              <button className="cart-item-action-btn remove" style={{ justifyContent:'center', border:'1px solid rgba(255,255,255,0.06)', padding:'6px 10px' }} onClick={() => removeSaved(si)}>
                                <X size={9} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ORDER NOTES */}
                <div className="notes-section">
                  <button className="notes-toggle" onClick={() => setShowNotes(v => !v)}>
                    <span><MessageSquare size={11} style={{ display:'inline', marginRight:8, verticalAlign:'middle' }} />Order Notes {orderNotes && '✦'}</span>
                    {showNotes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                  {showNotes && (
                    <div className="notes-body">
                      <textarea
                        className="notes-textarea"
                        placeholder="Add special instructions, gift notes, or handling requests..."
                        value={orderNotes}
                        onChange={e => setOrderNotes(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* ── RIGHT: SIDEBAR ── */}
              <div className="cart-sidebar">

                {/* Promo */}
                <div className="sidebar-section">
                  <span className="sidebar-label"><Tag size={10} style={{ display:'inline', marginRight:6, verticalAlign:'middle' }} />Authorization Code</span>
                  {appliedPromo ? (
                    <div>
                      <div className="promo-success">
                        <ShieldCheck size={11} /> {appliedPromo.label} — {appliedPromo.desc} applied
                        <button onClick={removePromo} style={{ marginLeft:'auto', background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer' }}><X size={10} /></button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="promo-row">
                        <input className="promo-input" type="text"
                          placeholder="ENTER CODE"
                          value={promoCode}
                          onChange={e => { setPromoCode(e.target.value); setPromoError(''); }}
                          onKeyDown={e => e.key === 'Enter' && applyPromo()}
                        />
                        <button className="promo-apply" onClick={applyPromo}>Apply</button>
                      </div>
                      {promoError && <p className="promo-error">{promoError}</p>}
                      <p style={{ fontSize:'7.5px', letterSpacing:'0.3em', color:'rgba(255,255,255,0.15)', marginTop:8 }}>
                        Try: ARCHIVE10 · VENDO20 · SHIP2026
                      </p>
                    </>
                  )}
                </div>

                {/* Cost breakdown */}
                <div className="sidebar-section">
                  <span className="sidebar-label">Registry Logistics</span>
                  <div className="cost-row">
                    <span className="cost-label">Subtotal ({itemCount})</span>
                    <span className="cost-val">{fmt(subtotal)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="cost-row">
                      <span className="cost-label">Discount ({appliedPromo?.label})</span>
                      <span className="cost-val discount">−{fmt(promoDiscount)}</span>
                    </div>
                  )}
                  <div className="cost-row">
                    <span className="cost-label">Archival Shipping</span>
                    <span className={`cost-val${freeShip ? ' free' : ''}`}>
                      {freeShip ? 'Complimentary' : fmt(shipping)}
                    </span>
                  </div>
                  {!freeShip && (
                    <p style={{ fontSize:'7.5px', letterSpacing:'0.3em', color:'rgba(255,255,255,0.2)', marginTop:-4, marginBottom:8 }}>
                      Spend {fmt(SHIPPING_THRESHOLD - discountedSub)} more for free shipping
                    </p>
                  )}

                  <div className="cost-divider" />

                  <div className="cost-total-row">
                    <span className="cost-total-label">Est. Total</span>
                    <span className="cost-total-val">{fmt(total)}</span>
                  </div>

                  {/* Delivery estimate */}
                  <div className="delivery-bar">
                    <Truck size={14} style={{ color:'#C9A96E', flexShrink:0 }} />
                    <div className="delivery-bar-text">
                      <strong>Est. Arrival: {estDelivery}</strong>
                      Standard archival transit
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="sidebar-section" style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  <button className="checkout-btn" onClick={handleCheckout} disabled={!itemCount}>
                    Initiate Acquisition
                    <ArrowUpRight size={14} strokeWidth={1.5} className="checkout-arrow" />
                  </button>
                  <button className="shop-more-btn" onClick={() => navigate('/shop')}>
                    Continue Browsing
                  </button>
                </div>

                {/* Trust */}
                <div className="sidebar-section">
                  <div className="trust-badges">
                    <div className="trust-badge">
                      <ShieldCheck size={12} className="trust-badge-icon" />
                      <span className="trust-badge-text">Secured Transmission</span>
                    </div>
                    <div className="trust-badge">
                      <Package size={12} className="trust-badge-icon" />
                      <span className="trust-badge-text">Archival Packaging</span>
                    </div>
                    <div className="trust-badge">
                      <Clock size={12} className="trust-badge-icon" />
                      <span className="trust-badge-text">48h Processing</span>
                    </div>
                    <div className="trust-badge">
                      <Truck size={12} className="trust-badge-icon" />
                      <span className="trust-badge-text">190+ Countries Shipped</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── CHECKOUT SUCCESS MODAL ── */}
      {checkoutDone && (
        <div className="checkout-success-backdrop">
          <div className="checkout-success-panel">
            <Package size={48} strokeWidth={0.8} className="cs-icon" />
            <p className="cs-title">Acquisition Confirmed</p>
            <p className="cs-id">Order ID: {orderId}</p>
            <p className="cs-body">
              Your selection has been indexed in the New York Registry and queued for archival processing. Expect a dispatch confirmation within 48 hours.
            </p>
            <button className="cs-btn" onClick={() => { setCheckoutDone(false); navigate('/shop'); }}>
              Return to Archive
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;