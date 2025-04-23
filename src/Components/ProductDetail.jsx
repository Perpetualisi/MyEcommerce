import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetail.css';


const ProductDetail = ({ products, onAddToCart }) => {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));
  const navigate = useNavigate();

  if (!product) {
    return <p style={{ padding: '2rem' }}>Product not found!</p>;
  }

  const handleAddToCart = () => {
    onAddToCart(product);
    console.log(`${product.name} added to cart!`);
    navigate('/cart');
  };

  return (
    <div style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center',
      border: '1px solid #ddd',
      borderRadius: '10px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    }}>
      <img
        src={product.image || `https://via.placeholder.com/300?text=${product.name}`}
        alt={product.name}
        style={{
          width: '300px',
          height: 'auto',
          marginBottom: '1rem',
          borderRadius: '10px',
        }}
      />

      <h2>{product.name}</h2>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Price:</strong> ₦{product.price}</p>
      <p style={{ marginBottom: '2rem' }}>
        <strong>Description:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </p>

      <button
        onClick={handleAddToCart}
        style={{
          padding: '1rem 2rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
          fontSize: '16px',
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;
