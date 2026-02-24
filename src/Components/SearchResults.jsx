import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, Plus, ArrowUpRight, ArrowUpDown, X, History } from 'lucide-react';

const SearchResults = ({ allProducts = [], onAddToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest | price-asc | price-desc | alpha
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent inquiries from storage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recent_inquiries') || '[]');
    setRecentSearches(saved);
  }, []);

  // Sync internal state with URL
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
  }, [searchParams]);

  // Debounced URL update and search history logging
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams(searchTerm ? { q: searchTerm } : {}, { replace: true });
      
      if (searchTerm.trim().length > 2) {
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 3);
        setRecentSearches(updated);
        localStorage.setItem('recent_inquiries', JSON.stringify(updated));
      }
    }, 500);

    setLoading(true);
    const loadTimer = setTimeout(() => setLoading(false), 700);

    return () => {
      clearTimeout(handler);
      clearTimeout(loadTimer);
    };
  }, [searchTerm, setSearchParams]);

  const categories = useMemo(() => [
    'All', 
    ...new Set(allProducts.map(p => p.category).filter(Boolean))
  ], [allProducts]);

  const filteredProducts = useMemo(() => {
    let results = allProducts.filter(product => {
      const name = product.name?.toLowerCase() || '';
      const desc = product.description?.toLowerCase() || '';
      const matchesSearch = name.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Handle Technical Sorting
    return results.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'alpha') return a.name.localeCompare(b.name);
      return 0; // default newest
    });
  }, [allProducts, searchTerm, selectedCategory, sortBy]);

  return (
    <div className="bg-white min-h-screen pt-32 px-8 sm:px-16 lg:px-24 pb-32 selection:bg-stone-900 selection:text-white font-light">
      
      {/* Editorial Search Header */}
      <header className="max-w-5xl mb-20">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-black">
            Registry Index / 2026.02
          </h2>
          {recentSearches.length > 0 && (
            <div className="hidden md:flex items-center gap-6">
              <span className="text-[8px] uppercase tracking-widest text-stone-300 flex items-center gap-2">
                <History size={10} /> Recent:
              </span>
              {recentSearches.map(s => (
                <button 
                  key={s} 
                  onClick={() => setSearchTerm(s)}
                  className="text-[9px] uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative group max-w-3xl">
          <input
            type="text"
            className="w-full bg-transparent border-b border-stone-100 py-8 text-4xl sm:text-7xl font-extralight text-stone-900 focus:outline-none focus:border-stone-900 transition-all duration-700 placeholder:text-stone-100 font-serif italic"
            placeholder="Search archive..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-stone-200 hover:text-stone-900 transition-colors"
            >
              <X size={20} strokeWidth={1} />
            </button>
          )}
          <Search 
            className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-700 ${searchTerm ? 'text-stone-900 scale-110' : 'text-stone-100'}`} 
            size={32} 
            strokeWidth={1}
          />
        </div>
      </header>

      {/* Toolbar: Category + Sort */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20 border-b border-stone-50 pb-8">
        <nav className="flex flex-wrap gap-x-8 gap-y-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-[9px] uppercase tracking-[0.4em] transition-all duration-500 relative py-2 font-bold ${
                selectedCategory === category ? 'text-stone-900' : 'text-stone-300 hover:text-stone-500'
              }`}
            >
              {category}
              {selectedCategory === category && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-stone-900" />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 border-l border-stone-100 pl-8">
          <ArrowUpDown size={12} className="text-stone-300" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-[9px] uppercase tracking-[0.3em] bg-transparent outline-none cursor-pointer font-bold text-stone-500 hover:text-stone-900 transition-colors"
          >
            <option value="newest">Latest Ingested</option>
            <option value="price-asc">Valuation: Low to High</option>
            <option value="price-desc">Valuation: High to Low</option>
            <option value="alpha">Designation: A-Z</option>
          </select>
        </div>
      </div>

      {/* Results Meta */}
      {!loading && (
        <div className="mb-12">
          <p className="text-[9px] uppercase tracking-[0.5em] text-stone-400 font-bold">
            Showing {filteredProducts.length} unique entries found for your inquiry
          </p>
        </div>
      )}

      {/* Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="animate-spin text-stone-200 mb-6" size={24} strokeWidth={1} />
          <p className="text-[9px] uppercase tracking-[0.5em] text-stone-400 font-bold">Querying Master Registry</p>
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
            Clear Archive Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-24">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id || index} 
              className="group flex flex-col animate-in fade-in slide-in-from-bottom-8 duration-1000"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="aspect-[3/4] bg-[#fafaf9] overflow-hidden mb-8 relative border border-stone-50">
                <img 
                  src={product.image || product.imageUrl || product.imageURL} 
                  alt={product.name} 
                  className="w-full h-full object-contain p-8 mix-blend-multiply transition-all duration-1000 ease-out group-hover:scale-105"
                />
                
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-700" />

                <button
                  onClick={() => onAddToCart(product)}
                  className="absolute bottom-0 left-0 w-full bg-stone-950 text-white py-6 flex items-center justify-center gap-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                >
                  <Plus size={14} />
                  <span className="text-[9px] uppercase tracking-[0.4em] font-black">Archive Object</span>
                </button>
              </div>

              <div className="space-y-4 px-1">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-[12px] uppercase tracking-widest text-stone-900 font-black leading-snug">
                    {product.name}
                  </h3>
                  <span className="text-[12px] text-stone-900 font-light font-mono">
                    {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-stone-50 pt-4">
                  <span className="text-[8px] text-stone-400 uppercase tracking-[0.3em] font-bold">
                    DEPT: {product.category}
                  </span>
                  <ArrowUpRight size={12} className="text-stone-200 group-hover:text-stone-900 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
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