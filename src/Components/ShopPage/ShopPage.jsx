import React, { useEffect, useState } from 'react';
import { ShoppingBag, Plus, ArrowUpRight, Filter } from 'lucide-react';

const ShopPage = ({ products, onAddToCart }) => {
  // Mapping the display categories to the backend naming convention
  const departments = [
    { id: 'digital-archive', label: 'Digital Archive', count: products.filter(p => p.category?.toLowerCase().includes('tech') || p.category === 'Electronics').length },
    { id: 'sartorial', label: 'Sartorial', count: products.filter(p => p.category?.toLowerCase().includes('fashion')).length },
    { id: 'pantry-essentials', label: 'Pantry Essentials', count: products.filter(p => p.category?.toLowerCase().includes('grocer')).length },
    { id: 'living-space', label: 'Living Space', count: products.filter(p => p.category?.toLowerCase().includes('furnit')).length },
  ];

  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 selection:bg-stone-900 selection:text-white">
      
      {/* Page Header */}
      <header className="px-6 sm:px-12 lg:px-24 max-w-[1440px] mx-auto mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-stone-100 pb-12">
          <div className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-bold">
              Full Inventory
            </h2>
            <h1 className="text-4xl sm:text-6xl font-extralight text-stone-900 tracking-tighter leading-none">
              The <span className="font-serif italic text-stone-400">Complete Archive.</span>
            </h1>
          </div>
          <p className="max-w-[280px] text-[10px] uppercase tracking-[0.2em] text-stone-400 leading-relaxed font-light">
            An exhaustive collection of objects curated for functional longevity and aesthetic permanence.
          </p>
        </div>
      </header>

      {/* Sticky Navigation Index */}
      <nav className="sticky top-20 z-30 bg-white/80 backdrop-blur-md border-b border-stone-50 mb-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between py-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-10">
            {departments.map((dept) => (
              <a
                key={dept.id}
                href={`#${dept.id}`}
                className={`group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] transition-all duration-500 ${
                  activeTab === dept.id ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <span className="text-[8px] text-stone-300 group-hover:text-stone-900 transition-colors">
                   {dept.count.toString().padStart(2, '0')}
                </span>
                {dept.label}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-stone-300 cursor-not-allowed">
             <Filter size={12} />
             <span className="text-[9px] uppercase tracking-widest">Sort by Registry</span>
          </div>
        </div>
      </nav>

      {/* Archive Sections */}
      <main className="px-6 sm:px-12 lg:px-24 max-w-[1440px] mx-auto">
        {departments.map((dept) => (
          <section
            key={dept.id}
            id={dept.id}
            className="mb-32 scroll-mt-40"
          >
            {/* Category Marker */}
            <div className="flex items-center gap-6 mb-16">
              <h3 className="text-[11px] uppercase tracking-[0.5em] font-bold text-stone-900 bg-stone-50 px-4 py-2">
                {dept.label}
              </h3>
              <div className="h-px flex-1 bg-stone-100"></div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
              {products
                .filter((p) => {
                   const cat = p.category?.toLowerCase() || '';
                   if (dept.id === 'digital-archive') return cat.includes('tech') || cat === 'electronics';
                   if (dept.id === 'sartorial') return cat.includes('fashion');
                   if (dept.id === 'pantry-essentials') return cat.includes('grocer');
                   if (dept.id === 'living-space') return cat.includes('furnit');
                   return false;
                })
                .map((product) => (
                  <div key={product.id} className="group relative flex flex-col">
                    {/* Image Stage */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#fafaf9] mb-6">
                      <img
                        src={product.imageURL || product.image}
                        alt={product.name}
                        className="w-full h-full object-contain p-8 mix-blend-multiply transition-all duration-1000 group-hover:scale-110"
                      />
                      
                      {/* Interaction Overlay */}
                      <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-all duration-700 flex flex-col justify-between p-6">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                           <ArrowUpRight size={18} className="text-stone-400" strokeWidth={1} />
                        </div>
                        <button
                          onClick={() => onAddToCart(product)}
                          className="w-full bg-stone-950 text-white py-4 text-[9px] uppercase tracking-[0.4em] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out flex items-center justify-center gap-2"
                        >
                          <Plus size={14} /> Add to Collection
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="text-[11px] uppercase tracking-[0.2em] text-stone-900 font-bold leading-tight max-w-[70%]">
                          {product.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-light">
                           ₦{Number(product.price).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-stone-50 pt-3">
                        <span className="text-[8px] uppercase tracking-[0.2em] text-stone-300">
                          ID: {product.id.slice(0, 8).toUpperCase()}
                        </span>
                        <div className="flex items-center gap-2">
                           <div className="w-1 h-1 bg-stone-200 rounded-full" />
                           <span className="text-[8px] uppercase tracking-widest text-stone-400 italic">Available</span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Only: Quick Bag */}
                    <button 
                       onClick={() => onAddToCart(product)}
                       className="md:hidden mt-4 flex items-center justify-center gap-2 border border-stone-100 py-3 text-[9px] uppercase tracking-widest text-stone-500 active:bg-stone-50"
                    >
                       <ShoppingBag size={12} /> Quick Add
                    </button>
                  </div>
                ))}
            </div>
            
            {/* Empty State for Category */}
            {products.filter(p => p.category?.toLowerCase().includes(dept.id.split('-')[0])).length === 0 && (
              <div className="h-40 flex items-center justify-center border border-dashed border-stone-100">
                <p className="text-[10px] uppercase tracking-widest text-stone-300 italic">No entries currently listed in this volume.</p>
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
};

export default ShopPage;