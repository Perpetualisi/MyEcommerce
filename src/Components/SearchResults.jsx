import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = ({ allProducts, onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTerm = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedCategory]);

  const categories = ['All', ...new Set(allProducts.map(product => product.category))];

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSearchChange = (e) => {
    const newTerm = e.target.value;
    setSearchTerm(newTerm);
    setSearchParams(newTerm ? { q: newTerm } : {});
  };

  return (
    <div className="search-results">
      <h2>Search Products</h2>

      <input
        type="text"
        className="search-input"
        placeholder="Search for a product..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={selectedCategory === category ? 'active' : ''}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : filteredProducts.length === 0 ? (
        <p className="no-results">No products found.</p>
      ) : (
        <div className="results-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button onClick={() => onAddToCart(product)} className="add-btn">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
