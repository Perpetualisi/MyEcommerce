import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// Components
import Navbar          from './Components/Navbar/Navbar';
import Hero            from './Components/Hero/Hero';
import FeaturedProducts from './Components/featuredProducts/featuredProducts';
import Categories      from './Components/Categories/Categories';
import SpecialOffers   from './Components/SpecialOffers/SpecialOffers';
import About           from './Components/About/About';
import Newsletter      from './Components/Newsletter/Newsletter';
import Footer          from './Components/Footer/Footer';
import Contact         from './Components/Contact/Contact';
import SignUp          from './Components/SignUp';
import Login           from './Components/Login';
import SearchResults   from './Components/SearchResults';
import Cart            from './Components/Cart/Cart';
import ShopPage        from './Components/ShopPage/ShopPage';
import ProductDetail   from './Components/ProductDetail';

import './App.css';

/* ══════════════════════════════════════════════
   GLOBAL PRODUCT CATALOGUE
══════════════════════════════════════════════ */
const ALL_PRODUCTS = [
  // ELECTRONICS
  { id: 1,  category: 'Electronics', name: 'Samsung Galaxy Tab',           price: 349,  imageURL: '/electronics/samsungtab.jpg' },
  { id: 2,  category: 'Electronics', name: 'Apple iPhone 15',              price: 999,  imageURL: '/electronics/AppleiPhone15.jpg' },
  { id: 3,  category: 'Electronics', name: 'Sony Headphones',              price: 199,  imageURL: '/electronics/sonyheadphone.jpg' },
  { id: 4,  category: 'Electronics', name: 'LG 4K TV',                    price: 799,  imageURL: '/electronics/LG4KTV.jpg' },
  { id: 5,  category: 'Electronics', name: 'Apple MacBook Pro',            price: 2399, imageURL: '/electronics/AppleMacBookPro.jpg' },
  { id: 21, category: 'Electronics', name: 'Alpha Mirrorless Camera',      price: 2100, imageURL: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200' },
  { id: 22, category: 'Electronics', name: 'Studio Monitoring Headphones', price: 299,  imageURL: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200' },

  // FASHION
  { id: 6,  category: 'Fashion', name: "Levi's Jeans",          price: 59,  imageURL: '/fashion/LeviJeans.jpg' },
  { id: 7,  category: 'Fashion', name: 'Nike Sneakers',          price: 120, imageURL: '/fashion/NikeSneakers.jpg' },
  { id: 8,  category: 'Fashion', name: 'Adidas Hoodie',          price: 55,  imageURL: '/fashion/AdidasHoodie.jpg' },
  { id: 9,  category: 'Fashion', name: 'Gucci Watch',            price: 800, imageURL: '/fashion/GucciWatch.jpg' },
  { id: 10, category: 'Fashion', name: 'Ray-Ban Sunglasses',     price: 150, imageURL: '/fashion/Sunglasses.jpg' },
  { id: 23, category: 'Fashion', name: 'Minimalist Leather Watch', price: 185, imageURL: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200' },
  { id: 26, category: 'Fashion', name: 'Ivory Knit Sweater',     price: 110, imageURL: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1200' },

  // GROCERIES
  { id: 11, category: 'Groceries', name: 'Organic Apples',        price: 4.99, imageURL: '/Groceries/apples.jpg' },
  { id: 12, category: 'Groceries', name: 'Fresh Milk',            price: 1.99, imageURL: '/Groceries/milk.jpg' },
  { id: 13, category: 'Groceries', name: 'Brown Bread',           price: 2.49, imageURL: '/Groceries/bread.jpg' },
  { id: 29, category: 'Groceries', name: 'Cold Pressed Olive Oil', price: 38,  imageURL: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1200' },
  { id: 32, category: 'Groceries', name: 'Whole Bean Dark Roast', price: 26,   imageURL: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=1200' },

  // FURNITURE
  { id: 16, category: 'Furniture', name: 'Modern Sofa',             price: 499, imageURL: '/Furniture/sofa.jpg' },
  { id: 17, category: 'Furniture', name: 'Wooden Dining Table',     price: 799, imageURL: '/Furniture/diningtable.jpg' },
  { id: 18, category: 'Furniture', name: 'Office Chair',            price: 129, imageURL: '/Furniture/chair.jpg' },
  { id: 24, category: 'Furniture', name: 'Sculptural Accent Chair', price: 850, imageURL: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1200' },
  { id: 27, category: 'Furniture', name: 'Oak Side Table',          price: 240, imageURL: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200' },
];

/* ══════════════════════════════════════════════
   SCROLL TO TOP ON ROUTE CHANGE
══════════════════════════════════════════════ */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

/* ══════════════════════════════════════════════
   NAVIGATION GUARD — "Return to Archive" bar
   shown on all sub-routes, hidden on "/"
══════════════════════════════════════════════ */
const NAV_GUARD_STYLES = `
  .ng-bar {
    position: sticky;
    top: 80px;
    z-index: 40;
    background: rgba(8,7,5,0.95);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: top 0.3s ease;
  }
  .ng-inner {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 6vw;
    height: 48px;
    display: flex;
    align-items: center;
  }
  .ng-link {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-family: 'Overpass Mono', monospace;
    font-size: 8.5px;
    letter-spacing: 0.45em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.25);
    text-decoration: none;
    transition: color 0.3s;
  }
  .ng-link:hover { color: rgba(255,255,255,0.75); }
  .ng-link:hover .ng-arrow { transform: translateX(-3px); }
  .ng-arrow { transition: transform 0.3s; }
  .ng-sep {
    width: 1px; height: 14px;
    background: rgba(255,255,255,0.08);
    margin: 0 16px;
  }
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
  const label = isProduct
    ? 'Product'
    : ROUTE_LABELS[location.pathname] || 'Archive';

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
   APP
══════════════════════════════════════════════ */
const App = () => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('archive_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Persist cart
  useEffect(() => {
    try { localStorage.setItem('archive_cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  const handleAddToCart = (product) => {
    setCart(prev => [...prev, { ...product, cartId: Date.now() }]);
  };

  // Smooth scroll-to-top when clicking logo/home link while already on "/"
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
                <FeaturedProducts onAddToCart={handleAddToCart} />
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

          <Route
            path="/featured"
            element={<FeaturedProducts onAddToCart={handleAddToCart} />}
          />

          <Route
            path="/search"
            element={<SearchResults allProducts={ALL_PRODUCTS} onAddToCart={handleAddToCart} />}
          />

          <Route
            path="/cart"
            element={<Cart cartItems={cart} setCartItems={setCart} />}
          />

          <Route
            path="/shop"
            element={<ShopPage products={ALL_PRODUCTS} onAddToCart={handleAddToCart} />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetail products={ALL_PRODUCTS} onAddToCart={handleAddToCart} />}
          />

        </Routes>
      </div>
    </Router>
  );
};

export default App;