import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, User, ChevronDown } from 'lucide-react';

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@300;400;600&display=swap');

  .nb-root {
    font-family: 'Overpass Mono', monospace;
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 50;
    height: 80px;
    transition: background 0.4s ease, border-color 0.4s ease, height 0.3s ease;
  }
  .nb-root.scrolled {
    height: 64px;
    background: rgba(8,7,5,0.97);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .nb-root.top {
    background: rgba(8,7,5,0.6);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .nb-inner {
    max-width: 1440px; margin: 0 auto; padding: 0 6vw;
    height: 100%; display: flex; align-items: center;
    justify-content: space-between; gap: 32px;
  }

  /* LOGO */
  .nb-logo { text-decoration: none; display: flex; flex-direction: column; gap: 2px; flex-shrink: 0; }
  .nb-logo-name { font-size: 15px; font-weight: 600; letter-spacing: 0.4em; color: #fff; text-transform: uppercase; line-height: 1; }
  .nb-logo-sub { font-size: 7px; letter-spacing: 0.45em; text-transform: uppercase; color: #C9A96E; line-height: 1; }

  /* NAV LINKS */
  .nb-links { display: none; align-items: center; gap: 32px; list-style: none; }
  @media (min-width: 1024px) { .nb-links { display: flex; } }
  .nb-link {
    font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.38); text-decoration: none;
    position: relative; padding-bottom: 2px; transition: color 0.3s; white-space: nowrap;
  }
  .nb-link::after {
    content: ''; position: absolute; bottom: -1px; left: 0; right: 100%;
    height: 1px; background: #C9A96E;
    transition: right 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .nb-link:hover { color: rgba(255,255,255,0.9); }
  .nb-link:hover::after, .nb-link.active::after { right: 0; }
  .nb-link.active { color: #fff; }

  /* ACTIONS */
  .nb-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
  .nb-icon-btn {
    width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.4); background: none; border: none; cursor: pointer;
    transition: color 0.25s; position: relative; text-decoration: none;
  }
  .nb-icon-btn:hover { color: rgba(255,255,255,0.9); }
  .nb-cart-badge {
    position: absolute; top: 5px; right: 4px;
    min-width: 16px; height: 16px; background: #C9A96E; color: #080705;
    font-size: 7.5px; font-weight: 600; letter-spacing: 0;
    display: flex; align-items: center; justify-content: center;
    border-radius: 0; padding: 0 3px;
  }

  /* Account dropdown */
  .nb-account-wrap { position: relative; display: none; }
  @media (min-width: 768px) { .nb-account-wrap { display: block; } }
  .nb-account-btn {
    display: flex; align-items: center; gap: 5px;
    width: auto; padding: 0 8px; height: 38px;
    color: rgba(255,255,255,0.4); background: none; border: none; cursor: pointer;
    font-family: 'Overpass Mono', monospace; font-size: 8px; letter-spacing: 0.3em;
    text-transform: uppercase; transition: color 0.25s;
  }
  .nb-account-btn:hover { color: rgba(255,255,255,0.9); }
  .nb-dropdown {
    position: absolute; top: calc(100% + 8px); right: 0;
    background: #111009; border: 1px solid rgba(255,255,255,0.08);
    min-width: 172px; box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    animation: ddIn 0.2s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes ddIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .nb-dropdown-item {
    display: block; padding: 13px 18px; font-size: 8px; letter-spacing: 0.4em;
    text-transform: uppercase; color: rgba(255,255,255,0.38); text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.04); transition: background 0.2s, color 0.2s;
  }
  .nb-dropdown-item:last-child { border-bottom: none; }
  .nb-dropdown-item:hover { background: rgba(201,169,110,0.07); color: #C9A96E; }

  .nb-divider { width: 1px; height: 18px; background: rgba(255,255,255,0.07); margin: 0 4px; }

  /* Mobile toggle */
  .nb-mobile-toggle {
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.5); transition: color 0.25s;
  }
  .nb-mobile-toggle:hover { color: #fff; }
  @media (min-width: 1024px) { .nb-mobile-toggle { display: none; } }

  /* MOBILE DRAWER */
  .nb-drawer-backdrop {
    position: fixed; inset: 0; z-index: 48;
    background: rgba(4,3,2,0.7); backdrop-filter: blur(8px);
    animation: bkIn 0.25s ease;
  }
  @keyframes bkIn { from { opacity:0; } to { opacity:1; } }
  .nb-drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: min(340px, 88vw); background: #0d0b09;
    border-left: 1px solid rgba(255,255,255,0.07);
    z-index: 49; display: flex; flex-direction: column;
    animation: drawerIn 0.32s cubic-bezier(0.16,1,0.3,1); overflow-y: auto;
  }
  @keyframes drawerIn { from { transform:translateX(100%); } to { transform:translateX(0); } }
  .nb-drawer-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 28px 24px; border-bottom: 1px solid rgba(255,255,255,0.06);
  }
  .nb-drawer-logo {
    font-size: 13px; font-weight: 600; letter-spacing: 0.4em; color: #fff;
    text-transform: uppercase; text-decoration: none;
  }
  .nb-drawer-close {
    width: 36px; height: 36px; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: rgba(255,255,255,0.45); transition: background 0.2s, color 0.2s;
  }
  .nb-drawer-close:hover { background: rgba(255,255,255,0.09); color: #fff; }
  .nb-drawer-nav { padding: 32px 28px; display: flex; flex-direction: column; gap: 0; flex: 1; list-style: none; }
  .nb-drawer-link {
    display: flex; align-items: center; justify-content: space-between; padding: 16px 0;
    font-size: 10px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.38); text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.04); transition: color 0.25s;
  }
  .nb-drawer-link:hover, .nb-drawer-link.active { color: #fff; }
  .nb-drawer-link.active .nb-drawer-dot { background: #C9A96E; }
  .nb-drawer-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(255,255,255,0.15); transition: background 0.3s; }
  .nb-drawer-footer { padding: 24px 28px 36px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 10px; }
  .nb-drawer-auth {
    display: block; padding: 13px 0; font-size: 8.5px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.3); text-decoration: none; transition: color 0.25s;
  }
  .nb-drawer-auth:hover { color: rgba(255,255,255,0.8); }
  .nb-drawer-auth-primary {
    display: block; padding: 14px; background: #C9A96E; color: #080705;
    font-family: 'Overpass Mono', monospace; font-size: 8.5px; letter-spacing: 0.45em;
    text-transform: uppercase; text-decoration: none; text-align: center; transition: background 0.2s;
  }
  .nb-drawer-auth-primary:hover { background: #d4b87a; }

  /* SEARCH OVERLAY */
  .nb-search-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(4,3,2,0.92); backdrop-filter: blur(20px);
    display: flex; align-items: flex-start; justify-content: center;
    padding-top: 120px; padding-left: 6vw; padding-right: 6vw;
    animation: bkIn 0.2s ease;
  }
  .nb-search-box {
    width: 100%; max-width: 680px;
    border-bottom: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; gap: 20px; padding-bottom: 20px;
    animation: ddIn 0.3s cubic-bezier(0.16,1,0.3,1);
  }
  .nb-search-input {
    flex: 1; background: none; border: none; outline: none;
    font-family: 'Overpass Mono', monospace;
    font-size: clamp(18px,3vw,32px); font-weight: 300;
    letter-spacing: 0.04em; color: #fff; caret-color: #C9A96E;
  }
  .nb-search-input::placeholder { color: rgba(255,255,255,0.15); }
  .nb-search-hint {
    margin-top: 24px; font-size: 8px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.18); text-align: center; width: 100%; max-width: 680px;
  }
  .nb-search-close-area { position: absolute; inset: 0; z-index: -1; }
`;

/* ═══════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════ */
const Navbar = ({ cartItemCount = 0, onCartClick }) => {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate   = useNavigate();
  const location   = useLocation();
  const accountRef = useRef(null);

  const navLinks = [
    { name: 'Home',     path: '/' },
    { name: 'Shop',     path: '/shop' },
    { name: 'Featured', path: '/featured' },
    { name: 'Offers',   path: '/offers' },
    { name: 'About',    path: '/about' },
    { name: 'Contact',  path: '/contact' },
  ];

  // Close panels on route change
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setAccountOpen(false);
  }, [location]);

  // Navbar shrink on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when drawer/search open
  useEffect(() => {
    document.body.style.overflow = (menuOpen || searchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, searchOpen]);

  // Close account on outside click
  useEffect(() => {
    if (!accountOpen) return;
    const h = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [accountOpen]);

  // Search submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery('');
    setSearchOpen(false);
  };

  /* ── THE FIX ──────────────────────────────────────────────────────────
     When the user is already on '/', React Router won't re-render or
     fire ScrollToTop. We intercept the click, cancel navigation, and
     manually smooth-scroll to the top instead.
  ──────────────────────────────────────────────────────────────────── */
  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <style>{STYLES}</style>

      <nav className={`nb-root ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="nb-inner">

          {/* ── LOGO ── scroll to top if already home */}
          <Link to="/" className="nb-logo" onClick={handleHomeClick}>
            <span className="nb-logo-name">Vendo</span>
            <span className="nb-logo-sub">Universal Archive</span>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <ul className="nb-links">
            {navLinks.map(link => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nb-link${isActive(link.path) ? ' active' : ''}`}
                  onClick={link.path === '/' ? handleHomeClick : undefined}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* ── ACTIONS ── */}
          <div className="nb-actions">

            {/* Search */}
            <button className="nb-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={17} strokeWidth={1.5} />
            </button>

            {/* Cart — mini-cart toggle if prop provided, else navigate */}
            {onCartClick ? (
              <button className="nb-icon-btn" onClick={onCartClick} aria-label="Cart">
                <ShoppingBag size={17} strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="nb-cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
                )}
              </button>
            ) : (
              <Link to="/cart" className="nb-icon-btn" aria-label="Cart">
                <ShoppingBag size={17} strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="nb-cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
                )}
              </Link>
            )}

            <div className="nb-divider" />

            {/* Account dropdown — desktop */}
            <div className="nb-account-wrap" ref={accountRef}>
              <button
                className="nb-account-btn"
                onClick={() => setAccountOpen(v => !v)}
                aria-label="Account"
              >
                <User size={16} strokeWidth={1.5} />
                <ChevronDown
                  size={10}
                  style={{ transform: accountOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
                />
              </button>
              {accountOpen && (
                <div className="nb-dropdown">
                  <Link to="/login"   className="nb-dropdown-item">Login</Link>
                  <Link to="/signup"  className="nb-dropdown-item">Sign Up</Link>
                  <Link to="/account" className="nb-dropdown-item">My Account</Link>
                  <Link to="/orders"  className="nb-dropdown-item">Orders</Link>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="nb-mobile-toggle"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={19} strokeWidth={1.5} /> : <Menu size={19} strokeWidth={1.5} />}
            </button>

          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER ── */}
      {menuOpen && (
        <>
          <div className="nb-drawer-backdrop" onClick={() => setMenuOpen(false)} />
          <div className="nb-drawer">
            <div className="nb-drawer-header">
              {/* Drawer Vendo logo — closes menu AND scrolls to top if on home */}
              <Link
                to="/"
                className="nb-drawer-logo"
                onClick={(e) => { setMenuOpen(false); handleHomeClick(e); }}
              >
                Vendo
              </Link>
              <button className="nb-drawer-close" onClick={() => setMenuOpen(false)}>
                <X size={14} strokeWidth={1.5} />
              </button>
            </div>

            <ul className="nb-drawer-nav">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`nb-drawer-link${isActive(link.path) ? ' active' : ''}`}
                    onClick={(e) => {
                      setMenuOpen(false);
                      /* Home link in drawer also scrolls to top if already there */
                      if (link.path === '/') handleHomeClick(e);
                    }}
                  >
                    {link.name}
                    <span className="nb-drawer-dot" />
                  </Link>
                </li>
              ))}
            </ul>

            <div className="nb-drawer-footer">
              <Link to="/login"  className="nb-drawer-auth"         onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="nb-drawer-auth-primary" onClick={() => setMenuOpen(false)}>Create Account</Link>
            </div>
          </div>
        </>
      )}

      {/* ── SEARCH OVERLAY ── */}
      {searchOpen && (
        <div className="nb-search-overlay">
          <div className="nb-search-close-area" onClick={() => setSearchOpen(false)} />
          <div style={{ width:'100%', maxWidth:680, display:'flex', flexDirection:'column', alignItems:'stretch', position:'relative', zIndex:1 }}>
            <form onSubmit={handleSearch} className="nb-search-box">
              <Search size={20} style={{ color:'rgba(255,255,255,0.25)', flexShrink:0 }} strokeWidth={1.5} />
              <input
                autoFocus
                className="nb-search-input"
                type="text"
                placeholder="Search the archive..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)', display:'flex', alignItems:'center' }}
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </form>
            <p className="nb-search-hint">Press Enter to search · Esc to close</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;