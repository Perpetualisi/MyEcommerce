import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ cartItemCount }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleAccountMenu = () => setIsAccountMenuOpen(!isAccountMenuOpen);
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleLinkClick = () => setIsMenuOpen(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">MyEcommerce</Link>
      </div>

      {/* Cart icon positioned outside the menu */}
      <div className="navbar-cart-mobile">
        <Link to="/cart" onClick={handleLinkClick}>
          🛒
          {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
        </Link>
      </div>

      <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
        <li><Link to="/featured" onClick={handleLinkClick}>FeaturedProducts</Link></li>
        <li><Link to="/offers" onClick={handleLinkClick}>SpecialOffers</Link></li>
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

      <div className="navbar-search">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search for products..."
          />
          <button type="submit">🔍</button>
        </form>
      </div>

      <div className="navbar-menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? '❌' : '☰'}
      </div>
    </nav>
  );
};

export default Navbar;
