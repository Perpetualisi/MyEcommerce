import React, { useState, useEffect } from 'react';
import { firestore } from '../../../Firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import './featuredProducts.css'; 

const FeaturedProducts = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]); 

  
  useEffect(() => {

    const fetchProducts = async () => {
      const productsCollection = collection(firestore, 'featuredProducts'); 
      const productSnapshot = await getDocs(productsCollection); 
     const productList = productSnapshot.docs.map(doc => doc.data()); 

      console.log(productList); 

      
      productList.forEach(product => {
        console.log('Product Price:', product.price); 
      });

      setProducts(productList); 
    };

    fetchProducts(); 
  }, []); 

  return (
    <section className="featured-products">
      <h2>Featured Products</h2>
      <div className="product-grid">
        {products.map((product, index) => (
          <div key={index} className="product-card">
            <img src={product.imageURL} alt={product.name} /> 
            <h3>{product.name}</h3>
            
            <p style={{ fontWeight: 'bold', color: 'green' }}>
              {product.price ? product.price : "Price not available"}
            </p>
            
            <button className="btn" onClick={() => onAddToCart(product)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
