import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';

const SearchResults = ({ allProducts = [], onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTerm = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  // Sync state with URL search params
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400);
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
    <div className="bg-stone-50 min-h-screen pt-28 px-6 sm:px-10 lg:px-20 pb-20">
      
      {/* Editorial Header */}
      <header className="max-w-2xl mb-12">
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-4">
          Inventory Search
        </h2>
        <div className="relative group">
          <input
            type="text"
            className="w-full bg-transparent border-b border-stone-200 py-4 text-2xl sm:text-4xl font-light text-stone-800 focus:outline-none focus:border-stone-800 transition-colors placeholder:text-stone-200"
            placeholder="Type to find..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-stone-300" size={24} />
        </div>
      </header>

      {/* Subtle Category Chips */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-1.5 text-[10px] uppercase tracking-widest transition-all duration-300 rounded-full border ${
              selectedCategory === category
                ? 'bg-stone-800 text-stone-100 border-stone-800'
                : 'bg-transparent text-stone-400 border-stone-200 hover:border-stone-400 hover:text-stone-600'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 animate-pulse">
          <Loader2 className="animate-spin text-stone-200 mb-4" size={32} />
          <p className="text-[10px] uppercase tracking-widest text-stone-300">Consulting Archive</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 border-t border-stone-100">
          <p className="text-stone-400 font-light italic text-lg text-center">
            "No objects match your current inquiry."
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col">
              {/* Image with Dull/Matte Filter */}
              <div className="aspect-[3/4] bg-stone-200 overflow-hidden mb-4 relative">
                <img 
                  src={product.image || product.imageURL} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale-[30%] opacity-90 group-hover:scale-105 transition-transform duration-1000"
                />
                <button
                  onClick={() => onAddToCart(product)}
                  className="absolute inset-x-0 bottom-0 bg-stone-900/10 backdrop-blur-md text-stone-100 py-3 text-[10px] uppercase tracking-[0.2em] translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                >
                  Add to Cart
                </button>
              </div>

              {/* Minimalist Info */}
              <div className="flex justify-between items-baseline px-1">
                <h3 className="text-xs uppercase tracking-widest text-stone-800 font-medium truncate pr-4">
                  {product.name}
                </h3>
                <span className="text-sm text-stone-500 font-light">
                  {product.price}
                </span>
              </div>
              <p className="text-[10px] text-stone-400 uppercase tracking-tighter mt-1">
                {product.category}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;