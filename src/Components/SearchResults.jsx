import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, Plus, ArrowUpRight } from 'lucide-react';

const SearchResults = ({ allProducts = [], onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  // Synchronize internal state with URL params
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  // Debounced URL update to prevent lag during rapid typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams(searchTerm ? { q: searchTerm } : {}, { replace: true });
    }, 400);

    setLoading(true);
    const loadTimer = setTimeout(() => setLoading(false), 600);

    return () => {
      clearTimeout(handler);
      clearTimeout(loadTimer);
    };
  }, [searchTerm, setSearchParams]);

  // Memoized categories for performance
  const categories = useMemo(() => [
    'All', 
    ...new Set(allProducts.map(p => p.category).filter(Boolean))
  ], [allProducts]);

  // Memoized filtering for heavy archives
  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const name = product.name?.toLowerCase() || '';
      const matchesSearch = name.includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allProducts, searchTerm, selectedCategory]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  return (
    <div className="bg-white min-h-screen pt-32 px-8 sm:px-16 lg:px-24 pb-32 selection:bg-stone-900 selection:text-white">
      
      {/* Editorial Search Header */}
      <header className="max-w-4xl mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 mb-8 font-black">
          Archive Search / US Hub
        </h2>
        <div className="relative group max-w-2xl">
          <input
            type="text"
            className="w-full bg-transparent border-b border-stone-100 py-8 text-3xl sm:text-6xl font-extralight text-stone-900 focus:outline-none focus:border-stone-900 transition-all duration-700 placeholder:text-stone-100 font-serif italic"
            placeholder="Search the collection..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Search 
            className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-700 ${searchTerm ? 'text-stone-900 scale-110' : 'text-stone-200'}`} 
            size={32} 
            strokeWidth={1}
          />
        </div>
      </header>

      {/* Refined Category Filter */}
      <nav className="flex flex-wrap gap-x-10 gap-y-4 mb-20 border-b border-stone-50 pb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`text-[10px] uppercase tracking-[0.4em] transition-all duration-500 relative py-2 font-bold ${
              selectedCategory === category ? 'text-stone-900' : 'text-stone-300 hover:text-stone-500'
            }`}
          >
            {category}
            {selectedCategory === category && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-stone-900 animate-in fade-in slide-in-from-left-4" />
            )}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="animate-spin text-stone-200 mb-6" size={24} strokeWidth={1} />
          <p className="text-[9px] uppercase tracking-[0.5em] text-stone-400 font-bold">Indexing 2026 Archive</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-40 text-center animate-in fade-in duration-700">
          <p className="text-stone-400 font-serif italic text-2xl">
            "No objects match your current inquiry."
          </p>
          <button 
            onClick={() => {setSearchTerm(''); setSearchParams({});}}
            className="mt-8 text-[10px] uppercase tracking-[0.5em] text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-400 hover:border-stone-400 transition-colors font-bold"
          >
            Reset Query
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id || index} 
              className="group flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-1000"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Product Frame */}
              <div className="aspect-[4/5] bg-[#fafaf9] overflow-hidden mb-8 relative border border-stone-50 transition-all duration-700">
                <img 
                  src={product.image || product.imageURL || '/placeholder.jpg'} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-4 mix-blend-multiply opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out"
                />
                
                {/* Product Reference Badge */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                   <span className="text-[8px] bg-white px-2 py-1 uppercase tracking-tighter text-stone-400 border border-stone-100 font-mono">
                     REF: {String(product.id || '0000').slice(0, 8).toUpperCase()}
                   </span>
                </div>

                {/* Quick Add Overlay */}
                <button
                  onClick={() => onAddToCart(product)}
                  className="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-md py-5 flex items-center justify-center gap-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 border-t border-stone-100 shadow-2xl"
                >
                  <Plus size={14} strokeWidth={2} className="text-stone-900" />
                  <span className="text-[9px] uppercase tracking-[0.4em] text-stone-900 font-black">Add to Acquisition</span>
                </button>
              </div>

              {/* Text Info */}
              <div className="space-y-3 px-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-[12px] uppercase tracking-[0.1em] text-stone-900 font-black leading-tight max-w-[70%]">
                    {product.name}
                  </h3>
                  <span className="text-[12px] text-stone-900 font-light tracking-tight">
                    {typeof product.price === 'number' 
                      ? `$${product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}` 
                      : product.price}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-stone-400 uppercase tracking-[0.3em] italic font-medium">
                    {product.category}
                  </span>
                  <ArrowUpRight size={12} className="text-stone-200 group-hover:text-stone-900 transition-colors" />
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