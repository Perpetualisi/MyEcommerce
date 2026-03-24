import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, User, ChevronDown, ArrowRight } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@300;400;600&family=Cormorant+Garamond:ital,wght@1,300&display=swap');

  .nb-root {
    font-family: 'Overpass Mono', monospace;
    /* sticky — handled by #site-header in App.jsx */
    position: relative;
    width: 100%;
    height: 64px;
    background: #000;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: height 0.4s cubic-bezier(0.16,1,0.3,1),
                border-color 0.4s ease,
                background 0.4s ease;
    z-index: 1;
  }

  /* When user scrolls: tighten height + add blur */
  .nb-root.scrolled {
    height: 56px;
    background: rgba(0,0,0,0.97);
    backdrop-filter: blur(32px) saturate(180%);
    -webkit-backdrop-filter: blur(32px) saturate(180%);
    border-bottom-color: rgba(255,255,255,0.07);
    box-shadow: 0 1px 0 rgba(255,255,255,0.03);
  }

  .nb-inner {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 clamp(24px, 5vw, 80px);
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  /* ── LOGO ── */
  .nb-logo {
    text-decoration: none;
    display: flex; flex-direction: column; gap: 3px;
    flex-shrink: 0;
  }
  .nb-logo-name {
    font-size: 13px; font-weight: 600;
    letter-spacing: 0.5em; color: #fff;
    text-transform: uppercase; line-height: 1;
    transition: letter-spacing 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .nb-logo:hover .nb-logo-name { letter-spacing: 0.62em; }
  .nb-logo-sub {
    font-family: 'Cormorant Garamond', serif;
    font-style: italic; font-size: 9px;
    letter-spacing: 0.3em; text-transform: uppercase;
    color: rgba(255,255,255,0.22); line-height: 1;
    transition: color 0.3s;
  }
  .nb-logo:hover .nb-logo-sub { color: rgba(255,255,255,0.4); }

  /* ── NAV LINKS ── */
  .nb-links {
    display: none; align-items: center;
    gap: 36px; list-style: none;
  }
  @media (min-width: 1024px) { .nb-links { display: flex; } }

  .nb-link {
    font-size: 8px; letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(255,255,255,0.28); text-decoration: none;
    position: relative; padding-bottom: 3px;
    transition: color 0.3s ease; white-space: nowrap;
  }
  .nb-link::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; width: 0; height: 1px;
    background: #fff;
    transition: width 0.4s cubic-bezier(0.16,1,0.3,1);
  }
  .nb-link:hover { color: rgba(255,255,255,0.85); }
  .nb-link:hover::after { width: 100%; }
  .nb-link.active { color: #fff; }
  .nb-link.active::after { width: 100%; }

  /* ── ACTIONS ── */
  .nb-actions {
    display: flex; align-items: center;
    gap: 2px; flex-shrink: 0;
  }

  .nb-icon-btn {
    width: 40px; height: 40px;
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,0.32);
    background: none; border: none; cursor: pointer;
    transition: color 0.25s ease, background 0.25s ease;
    position: relative; text-decoration: none;
  }
  .nb-icon-btn:hover { color: #fff; background: rgba(255,255,255,0.04); }

  .nb-cart-badge {
    position: absolute; top: 6px; right: 5px;
    min-width: 15px; height: 15px;
    background: #fff; color: #000;
    font-size: 7px; font-weight: 600;
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px; line-height: 1;
  }

  .nb-divider {
    width: 1px; height: 16px;
    background: rgba(255,255,255,0.07);
    margin: 0 6px;
  }

  /* ── ACCOUNT DROPDOWN ── */
  .nb-account-wrap { position: relative; display: none; }
  @media (min-width: 768px) { .nb-account-wrap { display: block; } }

  .nb-account-btn {
    display: flex; align-items: center; gap: 6px;
    height: 40px; padding: 0 10px;
    color: rgba(255,255,255,0.32);
    background: none; border: none; cursor: pointer;
    font-family: 'Overpass Mono', monospace;
    font-size: 8px; letter-spacing: 0.4em; text-transform: uppercase;
    transition: color 0.25s, background 0.25s;
  }
  .nb-account-btn:hover { color: #fff; background: rgba(255,255,255,0.04); }

  .nb-dropdown {
    position: absolute; top: calc(100% + 6px); right: 0;
    background: #000;
    border: 1px solid rgba(255,255,255,0.08);
    min-width: 180px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.03);
    animation: ddIn 0.22s cubic-bezier(0.16,1,0.3,1);
    overflow: hidden;
  }
  @keyframes ddIn {
    from { opacity:0; transform:translateY(-8px) scale(0.98); }
    to   { opacity:1; transform:translateY(0) scale(1); }
  }

  .nb-dropdown-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 18px;
    font-size: 8px; letter-spacing: 0.4em; text-transform: uppercase;
    color: rgba(255,255,255,0.28); text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.2s, color 0.2s, padding-left 0.3s;
  }
  .nb-dropdown-item:last-child { border-bottom: none; }
  .nb-dropdown-item:hover { background: rgba(255,255,255,0.04); color: #fff; padding-left: 22px; }
  .nb-dropdown-arrow { opacity: 0; transform: translateX(-4px); transition: opacity 0.2s, transform 0.2s; }
  .nb-dropdown-item:hover .nb-dropdown-arrow { opacity: 1; transform: translateX(0); }

  /* ── MOBILE TOGGLE ── */
  .nb-mobile-toggle {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px;
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,0.38);
    transition: color 0.25s, background 0.25s;
  }
  .nb-mobile-toggle:hover { color: #fff; background: rgba(255,255,255,0.04); }
  @media (min-width: 1024px) { .nb-mobile-toggle { display: none; } }

  /* ── MOBILE DRAWER ── */
  .nb-drawer-backdrop {
    position: fixed; inset: 0; z-index: 48;
    background: rgba(0,0,0,0.88);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    animation: bkIn 0.3s ease;
  }
  @keyframes bkIn { from { opacity:0; } to { opacity:1; } }

  .nb-drawer {
    position: fixed; top: 0; right: 0; bottom: 0;
    width: min(360px, 90vw);
    background: #000;
    border-left: 1px solid rgba(255,255,255,0.06);
    z-index: 49;
    display: flex; flex-direction: column;
    animation: drawerIn 0.38s cubic-bezier(0.16,1,0.3,1);
    overflow-y: auto;
  }
  @keyframes drawerIn { from { transform: translateX(100%); } to { transform: translateX(0); } }

  .nb-drawer-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 28px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .nb-drawer-logo {
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.5em; color: #fff;
    text-transform: uppercase; text-decoration: none;
    transition: letter-spacing 0.4s;
  }
  .nb-drawer-logo:hover { letter-spacing: 0.62em; }

  .nb-drawer-close {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: rgba(255,255,255,0.32);
    transition: background 0.2s, color 0.2s;
  }
  .nb-drawer-close:hover { background: rgba(255,255,255,0.07); color: #fff; }

  .nb-drawer-nav {
    padding: 16px 28px 28px;
    display: flex; flex-direction: column;
    flex: 1; list-style: none;
  }

  .nb-drawer-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 0;
    font-size: 9px; letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(255,255,255,0.25); text-decoration: none;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: color 0.25s, padding-left 0.3s ease;
  }
  .nb-drawer-link:hover { color: rgba(255,255,255,0.75); padding-left: 6px; }
  .nb-drawer-link.active { color: #fff; }

  .nb-drawer-indicator {
    width: 16px; height: 1px;
    background: rgba(255,255,255,0.1);
    transition: background 0.3s, width 0.3s;
  }
  .nb-drawer-link.active .nb-drawer-indicator { background: #fff; width: 24px; }
  .nb-drawer-link:hover .nb-drawer-indicator { background: rgba(255,255,255,0.35); }

  .nb-drawer-footer {
    padding: 24px 28px 40px;
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex; flex-direction: column; gap: 10px;
  }
  .nb-drawer-auth {
    display: block; padding: 13px 0;
    font-size: 8px; letter-spacing: 0.45em; text-transform: uppercase;
    color: rgba(255,255,255,0.22); text-decoration: none;
    transition: color 0.25s;
  }
  .nb-drawer-auth:hover { color: rgba(255,255,255,0.7); }

  .nb-drawer-auth-primary {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    padding: 15px;
    background: #fff; color: #000;
    font-family: 'Overpass Mono', monospace;
    font-size: 8px; letter-spacing: 0.5em; text-transform: uppercase;
    text-decoration: none;
    transition: background 0.25s, gap 0.3s;
  }
  .nb-drawer-auth-primary:hover { background: rgba(255,255,255,0.88); gap: 14px; }

  /* ── SEARCH OVERLAY ── */
  .nb-search-overlay {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.97);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: flex-start;
    padding: clamp(80px, 15vh, 140px) clamp(24px, 6vw, 80px) 0;
    animation: bkIn 0.2s ease;
  }

  .nb-search-eyebrow {
    font-size: 7px; letter-spacing: 0.6em; text-transform: uppercase;
    color: rgba(255,255,255,0.15); margin-bottom: 32px;
    animation: ddIn 0.3s cubic-bezier(0.16,1,0.3,1);
  }

  .nb-search-box {
    width: 100%; max-width: 700px;
    border-bottom: 1px solid rgba(255,255,255,0.12);
    display: flex; align-items: center; gap: 20px;
    padding-bottom: 20px;
    animation: ddIn 0.35s cubic-bezier(0.16,1,0.3,1);
  }

  .nb-search-input {
    flex: 1; background: none; border: none; outline: none;
    font-family: 'Overpass Mono', monospace;
    font-size: clamp(22px, 4vw, 40px);
    font-weight: 300; letter-spacing: -0.01em;
    color: #fff; caret-color: rgba(255,255,255,0.5);
  }
  .nb-search-input::placeholder { color: rgba(255,255,255,0.08); }

  .nb-search-hint {
    margin-top: 20px;
    font-size: 7.5px; letter-spacing: 0.5em; text-transform: uppercase;
    color: rgba(255,255,255,0.12);
    width: 100%; max-width: 700px;
    display: flex; justify-content: space-between;
    animation: ddIn 0.4s cubic-bezier(0.16,1,0.3,1);
  }

  .nb-search-close-area { position: absolute; inset: 0; z-index: -1; }

  .nb-key {
    display: inline-flex; align-items: center; justify-content: center;
    padding: 2px 6px;
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 7px; letter-spacing: 0.1em;
    color: rgba(255,255,255,0.2);
    margin-right: 4px;
  }
`;

const Navbar = ({ cartItemCount = 0, onCartClick }) => {
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [searchOpen,  setSearchOpen]  = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
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

  useEffect(() => {
    setMenuOpen(false); setSearchOpen(false); setAccountOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || searchOpen) ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (!accountOpen) return;
    const h = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [accountOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const h = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery(''); setSearchOpen(false);
  };

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

      <nav className={`nb-root${scrolled ? ' scrolled' : ''}`}>
        <div className="nb-inner">

          <Link to="/" className="nb-logo" onClick={handleHomeClick}>
            <span className="nb-logo-name">Vendo</span>
            <span className="nb-logo-sub">Universal Archive</span>
          </Link>

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

          <div className="nb-actions">
            <button className="nb-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={16} strokeWidth={1.5} />
            </button>

            {onCartClick ? (
              <button className="nb-icon-btn" onClick={onCartClick} aria-label="Cart">
                <ShoppingBag size={16} strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="nb-cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
                )}
              </button>
            ) : (
              <Link to="/cart" className="nb-icon-btn" aria-label="Cart">
                <ShoppingBag size={16} strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="nb-cart-badge">{cartItemCount > 99 ? '99+' : cartItemCount}</span>
                )}
              </Link>
            )}

            <div className="nb-divider" />

            <div className="nb-account-wrap" ref={accountRef}>
              <button className="nb-account-btn" onClick={() => setAccountOpen(v => !v)} aria-label="Account">
                <User size={15} strokeWidth={1.5} />
                <ChevronDown size={9} style={{
                  transform: accountOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
                }} />
              </button>
              {accountOpen && (
                <div className="nb-dropdown">
                  {[
                    { label: 'Login',      path: '/login' },
                    { label: 'Sign Up',    path: '/signup' },
                    { label: 'My Account', path: '/account' },
                    { label: 'Orders',     path: '/orders' },
                  ].map(item => (
                    <Link key={item.path} to={item.path} className="nb-dropdown-item">
                      {item.label}
                      <ArrowRight size={9} strokeWidth={1.5} className="nb-dropdown-arrow" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button className="nb-mobile-toggle" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              {menuOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      {menuOpen && (
        <>
          <div className="nb-drawer-backdrop" onClick={() => setMenuOpen(false)} />
          <div className="nb-drawer">
            <div className="nb-drawer-header">
              <Link to="/" className="nb-drawer-logo"
                onClick={(e) => { setMenuOpen(false); handleHomeClick(e); }}>
                Vendo
              </Link>
              <button className="nb-drawer-close" onClick={() => setMenuOpen(false)}>
                <X size={13} strokeWidth={1.5} />
              </button>
            </div>
            <ul className="nb-drawer-nav">
              {navLinks.map((link, i) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`nb-drawer-link${isActive(link.path) ? ' active' : ''}`}
                    onClick={(e) => { setMenuOpen(false); if (link.path === '/') handleHomeClick(e); }}
                  >
                    {link.name}
                    <span className="nb-drawer-indicator" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="nb-drawer-footer">
              <Link to="/login" className="nb-drawer-auth" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="nb-drawer-auth-primary" onClick={() => setMenuOpen(false)}>
                Create Account
                <ArrowRight size={10} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </>
      )}

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div className="nb-search-overlay">
          <div className="nb-search-close-area" onClick={() => setSearchOpen(false)} />
          <p className="nb-search-eyebrow">Search the Archive</p>
          <div style={{ width:'100%', maxWidth:700, display:'flex', flexDirection:'column', alignItems:'stretch', position:'relative', zIndex:1 }}>
            <form onSubmit={handleSearch} className="nb-search-box">
              <Search size={18} style={{ color:'rgba(255,255,255,0.18)', flexShrink:0 }} strokeWidth={1.5} />
              <input
                autoFocus
                className="nb-search-input"
                type="text"
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setSearchOpen(false)}
                style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.22)', display:'flex', alignItems:'center', transition:'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}
              >
                <X size={17} strokeWidth={1.5} />
              </button>
            </form>
            <div className="nb-search-hint">
              <span><span className="nb-key">↵</span> to search</span>
              <span><span className="nb-key">Esc</span> to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;