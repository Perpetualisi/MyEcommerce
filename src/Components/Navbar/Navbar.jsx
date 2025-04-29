import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ cartItemCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAccountMenu = () => setIsAccountMenuOpen(!isAccountMenuOpen);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleLinkClick = () => {
    setIsMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/" onClick={handleLinkClick}>Vendo</Link>
        </div>
      </div>

      <div className="navbar-search">
        <button onClick={() => setIsSearchOpen(true)}>🔍</button>
      </div>

      <div className="navbar-cart">
        <Link to="/cart" onClick={handleLinkClick}>
          🛒
          {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
        </Link>
      </div>

      <div className="navbar-menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? '❌' : '☰'}
      </div>

      {isMenuOpen && (
        <ul className="navbar-links">
          <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
          <li><Link to="/featured" onClick={handleLinkClick}>Featured Products</Link></li>
          <li><Link to="/offers" onClick={handleLinkClick}>Special Offers</Link></li>
          <li><Link to="/categories" onClick={handleLinkClick}>Shop</Link></li>
          <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
          <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
          <li className="navbar-account">
            <button onClick={toggleAccountMenu}>Account</button>
            {isAccountMenuOpen && (
              <ul className="account-dropdown">
                <li><Link to="/login" onClick={handleLinkClick}>Login</Link></li>
                <li><Link to="/signup" onClick={handleLinkClick}>Sign Up</Link></li>
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
                onChange={handleSearchChange}
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
