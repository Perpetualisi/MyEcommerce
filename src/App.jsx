import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; 

// Components
import Navbar from './Components/Navbar/Navbar';
import Hero from './Components/Hero/Hero';
import FeaturedProducts from './Components/featuredProducts/featuredProducts';
import Categories from './Components/Categories/Categories';
import SpecialOffers from './Components/SpecialOffers/SpecialOffers';
import About from './Components/About/About';
import Newsletter from './Components/Newsletter/Newsletter';
import Footer from './Components/Footer/Footer';
import Contact from './Components/Contact/Contact';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import SearchResults from './Components/SearchResults';
import Cart from './Components/Cart/Cart';
import ShopPage from './Components/ShopPage/ShopPage';
import ProductDetail from './Components/ProductDetail'; 

import './App.css'; 

/**
 * ScrollToTop Component
 * Ensures that whenever the route changes, the window scrolls to the top.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

/**
 * NavigationGuard Component
 * Standardizes the "Return to Archive" navigation for all sub-routes.
 */
const NavigationGuard = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <div className="w-full bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] sticky top-[64px] z-40">
      <div className="max-w-7xl mx-auto px-8 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all duration-500 group font-mono"
        >
          <div className="overflow-hidden w-4 flex items-center">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
          </div>
          Return to Archive
        </Link>
      </div>
    </div>
  );
};

const App = () => {
  // Initialize cart from LocalStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('archive_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Sync cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('archive_cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, { ...product, cartId: Date.now() }]);
  };

  /**
   * Global Click Handler for Home Scrolling
   * This intercepts clicks on links to "/" and scrolls up if already home.
   */
  const handleGlobalClick = (e) => {
    const link = e.target.closest('a');
    if (
      link && 
      link.getAttribute('href') === '/' && 
      window.location.pathname === '/'
    ) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const allProducts = [
    // --- ELECTRONICS ---
    { id: 1, category: 'Electronics', name: 'Samsung Galaxy Tab', price: '349', image: '/electronics/samsungtab.jpg' },
    { id: 2, category: 'Electronics', name: 'Apple iPhone 15', price: '999', image: '/electronics/AppleiPhone15.jpg' },
    { id: 3, category: 'Electronics', name: 'Sony Headphones', price: '199', image: '/electronics/sonyheadphone.jpg' },
    { id: 4, category: 'Electronics', name: 'LG 4K TV', price: '799', image: '/electronics/LG4KTV.jpg' },
    { id: 5, category: 'Electronics', name: 'Apple MacBook Pro', price: '2399', image: '/electronics/AppleMacBookPro.jpg' },
    { id: 21, category: 'Electronics', name: 'Alpha Mirrorless Camera', price: '2100', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1200' },
    { id: 22, category: 'Electronics', name: 'Studio Monitoring Headphones', price: '299', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200' },

    // --- FASHION ---
    { id: 6, category: 'Fashion', name: "Levi's Jeans", price: '59', image: '/fashion/LeviJeans.jpg' },
    { id: 7, category: 'Fashion', name: 'Nike Sneakers', price: '120', image: '/fashion/NikeSneakers.jpg' },
    { id: 8, category: 'Fashion', name: 'Adidas Hoodie', price: '55', image: '/fashion/AdidasHoodie.jpg' },
    { id: 9, category: 'Fashion', name: 'Gucci Watch', price: '800', image: '/fashion/GucciWatch.jpg' },
    { id: 10, category: 'Fashion', name: 'Ray-Ban Sunglasses', price: '150', image: '/fashion/Sunglasses.jpg' },
    { id: 23, category: 'Fashion', name: 'Minimalist Leather Watch', price: '185', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200' },
    { id: 26, category: 'Fashion', name: 'Ivory Knit Sweater', price: '110', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=1200' },

    // --- GROCERIES ---
    { id: 11, category: 'Groceries', name: 'Organic Apples', price: '4.99', image: '/Groceries/apples.jpg' },
    { id: 12, category: 'Groceries', name: 'Fresh Milk', price: '1.99', image: '/Groceries/milk.jpg' },
    { id: 13, category: 'Groceries', name: 'Brown Bread', price: '2.49', image: '/Groceries/bread.jpg' },
    { id: 29, category: 'Groceries', name: 'Cold Pressed Olive Oil', price: '38', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=1200' },
    { id: 32, category: 'Groceries', name: 'Whole Bean Dark Roast', price: '26', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=1200' },

    // --- FURNITURE ---
    { id: 16, category: 'Furniture', name: 'Modern Sofa', price: '499', image: '/Furniture/sofa.jpg' },
    { id: 17, category: 'Furniture', name: 'Wooden Dining Table', price: '799', image: '/Furniture/diningtable.jpg' },
    { id: 18, category: 'Furniture', name: 'Office Chair', price: '129', image: '/Furniture/chair.jpg' },
    { id: 24, category: 'Furniture', name: 'Sculptural Accent Chair', price: '850', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=1200' },
    { id: 27, category: 'Furniture', name: 'Oak Side Table', price: '240', image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=1200' }
  ];

  return (
    <Router>
      <ScrollToTop />
      {/* Container with Global Click listener to handle "Home" scroll logic */}
      <div 
        onClickCapture={handleGlobalClick}
        className="bg-[var(--bg-primary)] min-h-screen font-sans antialiased text-[var(--text-main)] selection:bg-[var(--text-main)] selection:text-[var(--bg-primary)] overflow-x-hidden"
      > 
        
        <Navbar cartItemCount={cart.length} />
        <NavigationGuard />
        
        <Routes>
          <Route
            path="/"
            element={
              <main className="animate-entry">
                <Hero />
                <div className="max-w-7xl mx-auto px-6 space-y-32">
                  <FeaturedProducts onAddToCart={handleAddToCart} />
                  <Categories />
                  <SpecialOffers />
                  <About />
                  <Contact />
                  <Newsletter />
                </div>
                <Footer />
              </main>
            }
          />

          <Route path="/about" element={<About />} />
          <Route path="/featured" element={<FeaturedProducts onAddToCart={handleAddToCart} />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/offers" element={<SpecialOffers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/search"
            element={<SearchResults allProducts={allProducts} onAddToCart={handleAddToCart} />}
          />

          <Route
            path="/cart"
            element={<Cart cartItems={cart} setCartItems={setCart} />}
          />

          <Route
            path="/shop"
            element={<ShopPage products={allProducts} onAddToCart={handleAddToCart} />}
          />

          <Route
            path="/product/:id"
            element={<ProductDetail products={allProducts} onAddToCart={handleAddToCart} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;