import React, { useEffect, useState, useMemo } from 'react';
import { ShoppingBag, Plus, ArrowUpRight, Filter } from 'lucide-react';

const ShopPage = ({ products = [], onAddToCart }) => {
  const departments = useMemo(() => [
    { 
      id: 'digital-archive', 
      label: 'Digital Archive', 
      count: products.filter(p => {
        const cat = p.category?.toLowerCase() || '';
        return cat.includes('tech') || cat.includes('electr') || cat.includes('gadget');
      }).length 
    },
    { 
      id: 'sartorial', 
      label: 'Sartorial', 
      count: products.filter(p => p.category?.toLowerCase().includes('fashion') || p.category?.toLowerCase().includes('retail')).length 
    },
    { 
      id: 'pantry-essentials', 
      label: 'Pantry Essentials', 
      count: products.filter(p => p.category?.toLowerCase().includes('grocer') || p.category?.toLowerCase().includes('food') || p.category?.toLowerCase().includes('pantry')).length 
    },
    { 
      id: 'living-space', 
      label: 'Living Space', 
      count: products.filter(p => p.category?.toLowerCase().includes('furnit') || p.category?.toLowerCase().includes('interior')).length 
    },
  ], [products]);

  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setActiveTab(hash);
        const element = document.getElementById(hash);
        if (element) {
          const yOffset = -120;
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 selection:bg-stone-900 selection:text-white">
      
      <header className="px-6 sm:px-12 lg:px-24 max-w-[1440px] mx-auto mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-stone-100 pb-12">
          <div className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-bold">
              Global Archive / USD
            </h2>
            <h1 className="text-4xl sm:text-6xl font-light text-stone-900 tracking-tighter leading-none">
              High-Definition <span className="font-serif italic text-stone-400">Curations.</span>
            </h1>
          </div>
          <p className="max-w-[280px] text-[10px] uppercase tracking-[0.2em] text-stone-500 leading-relaxed font-normal">
            International inventory curated for technical brilliance and vibrant character. All prices in USD.
          </p>
        </div>
      </header>

      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-stone-100 mb-16 px-6 sm:px-12 lg:px-24">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between py-6 overflow-x-auto no-scrollbar">
          <div className="flex gap-10">
            {departments.map((dept) => (
              <a
                key={dept.id}
                href={`#${dept.id}`}
                className={`group flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] transition-all duration-300 whitespace-nowrap ${
                  activeTab === dept.id ? 'text-stone-900 font-bold underline underline-offset-8' : 'text-stone-400 hover:text-stone-900'
                }`}
              >
                <span className={`text-[8px] font-mono ${activeTab === dept.id ? 'text-stone-900' : 'text-stone-300'}`}>
                   {dept.count.toString().padStart(2, '0')}
                </span>
                {dept.label}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-stone-400 border border-stone-100 px-3 py-1 rounded-full">
             <Filter size={10} strokeWidth={2} />
             <span className="text-[8px] uppercase tracking-widest font-bold">Market: USA</span>
          </div>
        </div>
      </nav>

      <main className="px-6 sm:px-12 lg:px-24 max-w-[1440px] mx-auto">
        {departments.map((dept) => {
          const filteredItems = products.filter((p) => {
            const cat = p.category?.toLowerCase() || '';
            if (dept.id === 'digital-archive') return cat.includes('tech') || cat.includes('electr') || cat.includes('gadget');
            if (dept.id === 'sartorial') return cat.includes('fashion') || cat.includes('retail');
            if (dept.id === 'pantry-essentials') return cat.includes('grocer') || cat.includes('food') || cat.includes('pantry');
            if (dept.id === 'living-space') return cat.includes('furnit') || cat.includes('interior');
            return false;
          });

          return (
            <section key={dept.id} id={dept.id} className="mb-32 scroll-mt-32">
              <div className="flex items-center gap-6 mb-16">
                <h3 className="text-[11px] uppercase tracking-[0.5em] font-black text-stone-900 pl-0 py-1">
                  {dept.label}
                </h3>
                <div className="h-px flex-1 bg-stone-100"></div>
              </div>

              {filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
                  {filteredItems.map((product) => (
                    <div key={product.id} className="group relative flex flex-col">
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#f9f9f9] mb-6 rounded-sm border border-stone-50">
                        <img
                          src={product.imageURL || product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-6 mix-blend-multiply transition-all duration-700 group-hover:scale-110 saturate-[1.1] contrast-[1.05]"
                        />
                        
                        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/[0.02] transition-all duration-500 flex flex-col justify-between p-6">
                          <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                             <ArrowUpRight size={18} className="text-stone-900" strokeWidth={1.5} />
                          </div>
                          <button
                            onClick={() => onAddToCart(product)}
                            className="w-full bg-stone-900 text-white py-4 text-[9px] uppercase tracking-[0.4em] font-bold opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out flex items-center justify-center gap-2 hover:bg-stone-800 shadow-xl"
                          >
                            <Plus size={14} strokeWidth={2} /> Add to Bag
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-[12px] uppercase tracking-tight text-stone-900 font-bold leading-tight max-w-[70%]">
                            {product.name}
                          </h4>
                          {/* CURRENCY UPDATE: Changed to $ and used en-US locale */}
                          <p className="text-[12px] text-stone-900 font-black">
                             ${Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
                          <span className="text-[9px] uppercase tracking-wider text-stone-400 font-mono">
                            REF: {product.id ? String(product.id).slice(0, 8).toUpperCase() : '000-X'}
                          </span>
                          <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 bg-stone-900 rounded-full" />
                             <span className="text-[8px] uppercase tracking-widest text-stone-500 font-bold italic">Available</span>
                          </div>
                        </div>
                      </div>

                      <button 
                         onClick={() => onAddToCart(product)}
                         className="md:hidden mt-4 flex items-center justify-center gap-2 bg-stone-900 text-white py-4 text-[10px] uppercase tracking-widest font-bold active:scale-95 transition-transform"
                      >
                         <ShoppingBag size={14} /> Add to Bag
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-stone-100">
                  <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 font-bold">Registry Empty</p>
                </div>
              )}
            </section>
          );
        })}
      </main>
    </div>
  );
};

export default ShopPage;