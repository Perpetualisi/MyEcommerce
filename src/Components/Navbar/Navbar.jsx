import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ cartItemCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo" onClick={closeMenus}>Vendo</Link>
      </div>

      <div className="navbar-icons">
        <button className="search-btn" onClick={() => setIsSearchOpen(true)}>🔍</button>

        <Link to="/cart" className="cart-link" onClick={closeMenus}>
          🛒
          {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
        </Link>

        <button className="menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? '❌' : '☰'}
        </button>
      </div>

      {isMenuOpen && (
        <ul className="navbar-links">
          <li><Link to="/" onClick={closeMenus}>Home</Link></li>
          <li><Link to="/featured" onClick={closeMenus}>Featured</Link></li>
          <li><Link to="/offers" onClick={closeMenus}>Offers</Link></li>
          <li><Link to="/categories" onClick={closeMenus}>Shop</Link></li>
          <li><Link to="/about" onClick={closeMenus}>About</Link></li>
          <li><Link to="/contact" onClick={closeMenus}>Contact</Link></li>
          <li className="navbar-account">
            <button onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}>Account</button>
            {isAccountMenuOpen && (
              <ul className="account-dropdown">
                <li><Link to="/login" onClick={closeMenus}>Login</Link></li>
                <li><Link to="/signup" onClick={closeMenus}>Sign Up</Link></li>
              </ul>
            )}
          </li>
        </ul>
      )}

      {isSearchOpen && (
        <div className="search-overlay">
          <div className="search-container">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                autoFocus
              />
              <button type="submit">🔍</button>
            </form>
            <button className="cancel-search" onClick={() => setIsSearchOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
