import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const App = () => {
  const [cart, setCart] = useState([]); 

  const handleAddToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    console.log(`${product.name} added to cart!`);
  };

  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
    console.log(`Product removed from cart`);
  };

  const handleClearCart = () => {
    setCart([]);
    console.log("Cart cleared");
  };

  const handleCheckout = () => {
    alert('Checkout process (payment) coming soon!');
    handleClearCart(); 
  };

  const allProducts = [
    { id: 1, category: 'Electronics', name: 'Samsung Galaxy Tab', price: '$349', image: '/electronics/samsungtab.jpg' },
    { id: 2, category: 'Electronics', name: 'Apple iPhone 15', price: '$999', image: '/electronics/AppleiPhone15.jpg' },
    { id: 3, category: 'Electronics', name: 'Sony Headphones', price: '$199', image: '/electronics/sonyheadphones.jpg' },
    { id: 4, category: 'Electronics', name: 'LG 4K TV', price: '$799', image: '/electronics/LG4KTV.jpg' },
    { id: 5, category: 'Electronics', name: 'Apple MacBook Pro', price: '$2,399', image: '/electronics/AppleMacBookPro.jpg' },
    { id: 6, category: 'Fashion', name: 'Levi\'s Jeans', price: '$59', image: '/fashion/LeviJeans.jpg' },
    { id: 7, category: 'Fashion', name: 'Nike Sneakers', price: '$120', image: '/fashion/NikeSneakers.jpg' },
    { id: 8, category: 'Fashion', name: 'Adidas Hoodie', price: '$55', image: '/fashion/AdidasHoodie.jpg' },
    { id: 9, category: 'Fashion', name: 'Gucci Watch', price: '$800', image: '/fashion/GucciWatch.jpg' },
    { id: 10, category: 'Fashion', name: 'Ray-Ban Sunglasses', price: '$150', image: '/fashion/Sunglasses.jpg' },
    { id: 11, category: 'Groceries', name: 'Organic Apples', price: '$4.99', image: '/Groceries/apples.jpg' },
    { id: 12, category: 'Groceries', name: 'Fresh Milk', price: '$1.99', image: '/Groceries/milk.jpg' },
    { id: 13, category: 'Groceries', name: 'Brown Bread', price: '$2.49', image: '/Groceries/bread.jpg' },
    { id: 14, category: 'Groceries', name: 'Eggs (Dozen)', price: '$2.99', image: '/Groceries/eggs.jpg' },
    { id: 15, category: 'Groceries', name: 'Bananas', price: '$1.49', image: '/Groceries/bananas.jpg' },
    { id: 16, category: 'Furniture', name: 'Modern Sofa', price: '$499', image: '/Furniture/sofa.jpg' },
    { id: 17, category: 'Furniture', name: 'Wooden Dining Table', price: '$799', image: '/Furniture/diningtable.jpg' },
    { id: 18, category: 'Furniture', name: 'Office Chair', price: '$129', image: '/Furniture/chair.jpg' },
    { id: 19, category: 'Furniture', name: 'Queen Size Bed', price: '$1,199', image: '/Furniture/bed.jpg' },
    { id: 20, category: 'Furniture', name: 'Bookshelf', price: '$199', image: '/Furniture/bookshef.jpg' },
  ];

  return (
    <Router>
      <div> 
        <Navbar cartItemCount={cart.length} />
        
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <FeaturedProducts onAddToCart={handleAddToCart} />
                <Categories />
                <SpecialOffers />
                <About />
                <Contact />
                <Newsletter />
                <Footer />
              </>
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
            element={<Cart cartItems={cart} handleRemoveFromCart={handleRemoveFromCart} handleClearCart={handleClearCart} handleCheckout={handleCheckout} />}
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
