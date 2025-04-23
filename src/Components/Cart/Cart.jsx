import React, { useState } from 'react';
import './Cart.css'; 

const Cart = ({ cartItems, setCartItems }) => {
  const [itemCount, setItemCount] = useState(cartItems.length); 

  const handleCheckout = () => {
    alert('Payment integration coming soon!');
    
    
    setCartItems([]);
    
  
    setItemCount(0);
    
  
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      
      {itemCount === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.name} — {item.price}
              </li>
            ))}
          </ul>
          <button className="btn checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
      
      
      {itemCount > 0 && (
        <div className="cart-notification">
          <p style={{ color: 'red' }}>Items in cart: {itemCount}</p>
        </div>
      )}
    </div>
  );
};

export default Cart;
