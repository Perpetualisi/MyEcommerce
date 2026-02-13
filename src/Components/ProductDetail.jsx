import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, ChevronRight, ShieldCheck, Truck } from 'lucide-react';

const ProductDetail = ({ products, onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-4">Error 404</p>
          <h2 className="text-2xl font-light text-stone-900 mb-8">Object not found in archive.</h2>
          <button onClick={() => navigate('/shop')} className="text-[10px] uppercase tracking-[0.2em] border-b border-stone-900 pb-1">Return to Shop</button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    onAddToCart(product);
    
    // Smooth transition to cart after a brief "success" state
    setTimeout(() => {
      navigate('/cart');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-12 text-[9px] uppercase tracking-[0.3em] text-stone-400">
          <span className="cursor-pointer hover:text-stone-900" onClick={() => navigate('/shop')}>Archive</span>
          <ChevronRight size={10} />
          <span className="cursor-pointer hover:text-stone-900" onClick={() => navigate('/shop')}>{product.category}</span>
          <ChevronRight size={10} />
          <span className="text-stone-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* Left Column: Studio Imagery */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="bg-stone-50 aspect-[4/5] md:aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover grayscale-[20%] contrast-[1.05] hover:scale-105 transition-transform duration-[2s] ease-out"
              />
            </div>
            {/* Minimalist Grid for secondary views (if you add them later) */}
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-stone-50 aspect-square hidden md:block opacity-50"></div>
               <div className="bg-stone-50 aspect-square hidden md:block opacity-50"></div>
            </div>
          </div>

          {/* Right Column: Product Narrative */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-32 h-fit">
            <div className="space-y-10">
              
              <header className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-extralight tracking-tighter text-stone-900 leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-4">
                  <p className="text-2xl font-light text-stone-600">
                    ${product.price}
                  </p>
                  <span className="text-[10px] uppercase tracking-widest text-stone-400">Tax Incl.</span>
                </div>
              </header>

              <div className="space-y-6">
                <h2 className="text-[10px] uppercase tracking-[0.4em] text-stone-900 font-bold">Provenance & Specifications</h2>
                <p className="text-stone-500 text-sm leading-relaxed font-light tracking-wide">
                  A carefully selected entry in our 2026 archive. This {product.category.toLowerCase()} piece represents the intersection of functional necessity and refined aesthetic. Designed for longevity and daily utility.
                </p>
              </div>

              {/* Action Area */}
              <div className="space-y-4 pt-6">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`w-full group relative overflow-hidden py-5 px-8 text-[11px] uppercase tracking-[0.4em] transition-all duration-700 
                    ${isAdding ? 'bg-stone-200 text-stone-500' : 'bg-stone-900 text-white hover:bg-stone-800 shadow-xl'}`}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isAdding ? 'Adding to Collection...' : 'Add to Archive'}
                    {!isAdding && <ShoppingBag size={14} className="group-hover:translate-x-1 transition-transform" />}
                  </span>
                </button>
              </div>

              {/* Trust/Service Grid */}
              <div className="pt-12 border-t border-stone-100 grid grid-cols-1 gap-6">
                <div className="flex items-start gap-4">
                  <Truck size={18} className="text-stone-400 mt-1" />
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold">Global Logistics</h4>
                    <p className="text-[11px] text-stone-500 font-light mt-1">Insured white-glove delivery within 4-7 business days.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <ShieldCheck size={18} className="text-stone-400 mt-1" />
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold">Archive Guarantee</h4>
                    <p className="text-[11px] text-stone-500 font-light mt-1">2-year certified coverage for electronics and furnishings.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      
      {/* Recommended Section Spacing */}
      <div className="h-32"></div>
    </div>
  );
};

export default ProductDetail;