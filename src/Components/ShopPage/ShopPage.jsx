import React, { useEffect } from 'react';
import './ShopPage.css';

const ShopPage = ({ products, onAddToCart }) => {
  const categories = ['Electronics', 'Fashion', 'Groceries', 'Furniture'];

  useEffect(() => {
    const sectionId = window.location.hash; 
    if (sectionId) {
      
      setTimeout(() => {
        const element = document.querySelector(sectionId); 
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' }); 
        }
      }, 100); 
    }
  }, []); 

  return (
    <div className="shop-page">
      <h2>Welcome to Our Shop</h2>

      {categories.map((category) => (
        <div
          key={category}
          id={category.toLowerCase()} 
          className="category-section"
        >
          <h3>{category}</h3>
          <div className="products-grid">
            {products
              .filter((product) => product.category === category)
              .map((product) => (
                <div key={product.id} className="product-card">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image" 
                  />
                  <h4>{product.name}</h4>
                  <p>{product.price}</p>
                  <button onClick={() => onAddToCart(product)}>Add to Cart</button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShopPage;
