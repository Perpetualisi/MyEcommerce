import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User, ChevronDown } from 'lucide-react';

const Navbar = ({ cartItemCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsAccountOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isSearchOpen ? 'hidden' : 'unset';
  }, [isSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Featured', path: '/featured' },
    { name: 'Offers', path: '/offers' },
    { name: 'Shop', path: '/categories' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-50/90 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        
        {/* Logo - Softened from blue to a deep stone gray */}
        <Link to="/" className="text-xl font-light tracking-[0.2em] text-stone-800">
          VENDO
        </Link>

        {/* Desktop Navigation - Muted text with subtle hover */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
            aria-label="Search"
          >
            <Search size={18} strokeWidth={1.5} />
          </button>

          <Link to="/cart" className="p-2 text-stone-600 hover:text-stone-900 transition-colors relative">
            <ShoppingCart size={18} strokeWidth={1.5} />
            {cartItemCount > 0 && (
              <span className="absolute top-1 right-0 bg-stone-800 text-stone-100 text-[9px] h-4 w-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-stone-600"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Account Dropdown */}
          <div className="hidden md:block relative">
            <button 
              onClick={() => setIsAccountOpen(!isAccountOpen)}
              className="flex items-center gap-1 p-2 text-stone-600 hover:text-stone-900"
            >
              <User size={18} strokeWidth={1.5} />
              <ChevronDown size={12} className={`transition-transform duration-500 ${isAccountOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-stone-50 border border-stone-200 rounded-sm shadow-sm py-2 animate-in fade-in slide-in-from-top-1">
                <Link to="/login" className="block px-4 py-2 text-xs uppercase tracking-widest text-stone-600 hover:bg-stone-100">Login</Link>
                <Link to="/signup" className="block px-4 py-2 text-xs uppercase tracking-widest text-stone-600 hover:bg-stone-100">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Muted Slide-down */}
      {isMenuOpen && (
        <div className="md:hidden bg-stone-50 border-b border-stone-200 py-6 px-8 space-y-6">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className="block text-xs uppercase tracking-[0.2em] text-stone-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-4 border-t border-stone-200">
            <Link to="/login" className="text-xs uppercase tracking-widest text-stone-500">Login</Link>
            <Link to="/signup" className="text-xs uppercase tracking-widest text-stone-800 font-bold">Sign Up</Link>
          </div>
        </div>
      )}

      {/* Search Overlay - Using the same matte aesthetic */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-[100] flex items-start justify-center pt-24 px-6">
          <div className="bg-stone-50 w-full max-w-xl border border-stone-200 p-6 animate-in fade-in zoom-in duration-500">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-4">
              <Search size={20} className="text-stone-400" />
              <input
                autoFocus
                type="text"
                placeholder="SEARCH COLLECTION..."
                className="flex-1 py-2 text-sm tracking-widest bg-transparent outline-none uppercase text-stone-800 placeholder:text-stone-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setIsSearchOpen(false)}>
                <X size={20} className="text-stone-400 hover:text-stone-800" />
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;