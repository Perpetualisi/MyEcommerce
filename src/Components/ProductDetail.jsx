import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetail = ({ products, onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <p className="p-8 text-center text-lg font-medium">
        Product not found!
      </p>
    );
  }

  const handleAddToCart = () => {
    onAddToCart(product);
    console.log(`${product.name} added to cart!`);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 sm:p-8 text-center">
        
        {/* Product Image */}
        <img
          src={
            product.image ||
            `https://via.placeholder.com/300?text=${product.name}`
          }
          alt={product.name}
          className="w-full max-w-xs mx-auto rounded-lg object-cover mb-6"
        />

        {/* Product Name */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          {product.name}
        </h2>

        {/* Category */}
        <p className="text-gray-600 mb-2">
          <span className="font-semibold">Category:</span> {product.category}
        </p>

        {/* Price */}
        <p className="text-xl font-semibold text-gray-800 mb-4">
          ₦{product.price}
        </p>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          <span className="font-semibold">Description:</span>{' '}
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md text-base font-medium transition duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
