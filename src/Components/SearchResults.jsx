import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Loader2, Plus } from 'lucide-react';

const SearchResults = ({ allProducts = [], onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTerm = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timeout);
  }, [searchTerm, selectedCategory]);

  const categories = ['All', ...new Set(allProducts.map(p => p.category))];

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
    <div className="bg-white min-h-screen pt-32 px-8 sm:px-16 lg:px-24 pb-32">
      
      {/* Editorial Search Header */}
      <header className="max-w-4xl mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-400 mb-6 font-medium">
          Archive Search / 01
        </h2>
        <div className="relative group max-w-2xl">
          <input
            type="text"
            className="w-full bg-transparent border-b border-stone-100 py-6 text-3xl sm:text-5xl font-light text-stone-900 focus:outline-none focus:border-stone-900 transition-all duration-700 placeholder:text-stone-100 italic"
            placeholder="Search the collection..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search 
            className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-700 ${searchTerm ? 'text-stone-900 scale-110' : 'text-stone-200'}`} 
            size={28} 
            strokeWidth={1}
          />
        </div>
      </header>

      {/* Refined Category Filter */}
      <nav className="flex flex-wrap gap-x-8 gap-y-4 mb-20 border-b border-stone-50 pb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`text-[10px] uppercase tracking-[0.3em] transition-all duration-500 relative py-2 ${
              selectedCategory === category
                ? 'text-stone-900'
                : 'text-stone-300 hover:text-stone-600'
            }`}
          >
            {category}
            {selectedCategory === category && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-stone-900 animate-in fade-in slide-in-from-left-2" />
            )}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="animate-spin text-stone-200 mb-6" size={24} strokeWidth={1} />
          <p className="text-[9px] uppercase tracking-[0.5em] text-stone-400">Indexing Archive</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-40 text-center animate-in fade-in duration-700">
          <p className="text-stone-400 font-light italic text-xl">
            "No objects match your current inquiry."
          </p>
          <button 
            onClick={() => {setSearchTerm(''); setSearchParams({});}}
            className="mt-6 text-[10px] uppercase tracking-widest text-stone-900 border-b border-stone-900 pb-1"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="group flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-1000"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Product Frame */}
              <div className="aspect-[3/4] bg-stone-50 overflow-hidden mb-6 relative border border-transparent group-hover:border-stone-100 transition-all duration-700">
                <img 
                  src={product.image || product.imageURL} 
                  alt={product.name} 
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                />
                
                {/* Subtle Quick Add */}
                <button
                  onClick={() => onAddToCart(product)}
                  className="absolute bottom-0 left-0 w-full bg-white/90 backdrop-blur-sm py-4 flex items-center justify-center gap-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                >
                  <Plus size={14} strokeWidth={1.5} className="text-stone-900" />
                  <span className="text-[9px] uppercase tracking-[0.3em] text-stone-900 font-medium">Add to Cart</span>
                </button>
              </div>

              {/* Text Info */}
              <div className="space-y-2 px-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-[11px] uppercase tracking-[0.2em] text-stone-900 font-medium leading-relaxed">
                    {product.name}
                  </h3>
                  <span className="text-[11px] text-stone-400 font-light tracking-wider">
                    ${product.price}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] text-stone-300 uppercase tracking-widest italic">
                    {product.category}
                  </span>
                  <div className="h-[1px] flex-1 bg-stone-50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;