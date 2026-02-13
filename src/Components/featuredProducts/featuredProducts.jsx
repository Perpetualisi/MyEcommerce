import React, { useState, useEffect } from 'react';
import { firestore } from '../../../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingBag, Loader2, Plus, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FeaturedProducts = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(firestore, 'featuredProducts');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        // Slight delay for a smoother transition
        setTimeout(() => setLoading(false), 800);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white space-y-6">
        <div className="relative">
          <Loader2 className="animate-spin text-stone-900" size={40} strokeWidth={1} />
          <div className="absolute inset-0 blur-xl bg-stone-200/50 -z-10 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-stone-500 font-light">Retrieving Archive</p>
          <p className="text-[8px] uppercase tracking-[0.3em] text-stone-300 mt-2 italic">Establishing secure connection...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="px-6 sm:px-12 lg:px-24 py-32 bg-white selection:bg-stone-900 selection:text-white">
      
      {/* Editorial Header */}
      <div className="max-w-[1440px] mx-auto mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-stone-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-stone-900" />
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-bold">
              Selected Works
            </h2>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extralight text-stone-900 tracking-tighter leading-none">
            Featured <br />
            <span className="font-serif italic text-stone-400 font-normal">Selection.</span>
          </h1>
        </div>
        
        <p className="max-w-xs text-[11px] uppercase tracking-widest text-stone-400 leading-relaxed font-light">
          A curated sequence of functional objects, tech essentials, and pantry staples designed for the modern 2026 archive.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
        {products.map((product) => (
          <div key={product.id} className="group relative flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            {/* Image Stage */}
            <div 
              onClick={() => navigate(`/product/${product.id}`)}
              className="relative h-[450px] w-full overflow-hidden bg-[#fafaf9] cursor-pointer group-hover:shadow-2xl group-hover:shadow-stone-100 transition-all duration-700 ease-in-out"
            >
              <img
                src={product.imageURL}
                alt={product.name}
                className="w-full h-full object-contain p-12 transition-all duration-[1.5s] ease-out group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
              />
              
              {/* Badge: Category */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="text-[8px] uppercase tracking-[0.4em] text-stone-400 bg-white/80 backdrop-blur-md px-3 py-1.5 border border-stone-100">
                  {product.category || "Item"}
                </span>
              </div>

              {/* View Details Link (Top Right) */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <ArrowUpRight size={18} strokeWidth={1} className="text-stone-400" />
              </div>

              {/* Quick Action Overlay */}
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-all duration-700 flex items-end p-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(product);
                  }}
                  className="w-full bg-stone-900 text-white py-4 text-[10px] uppercase tracking-[0.4em] opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out hover:bg-stone-800 flex items-center justify-center gap-3"
                >
                  <Plus size={14} /> Add to Collection
                </button>
              </div>
            </div>

            {/* Product Meta */}
            <div className="mt-8 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-[12px] font-bold text-stone-900 tracking-[0.2em] uppercase leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-stone-400 uppercase tracking-widest font-light">
                    Ref: {product.id.slice(0, 8).toUpperCase()}
                  </p>
                </div>
                <p className="text-sm font-light text-stone-900 tracking-tight">
                  {product.price ? `₦${Number(product.price).toLocaleString()}` : "Inquiry"}
                </p>
              </div>
              
              {/* Decorative detail */}
              <div className="pt-4 border-t border-stone-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                 <span className="text-[9px] uppercase tracking-widest text-stone-300">Limited Archive</span>
                 <div className="h-[2px] w-2 bg-stone-200 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Call to Action */}
      <div className="mt-32 text-center border-t border-stone-100 pt-20">
        <button 
          onClick={() => navigate('/shop')}
          className="group text-[11px] uppercase tracking-[0.5em] text-stone-400 hover:text-stone-900 transition-all duration-500"
        >
          View Full Archive 
          <span className="inline-block ml-4 group-hover:translate-x-2 transition-transform duration-500">→</span>
        </button>
      </div>
    </section>
  );
};

export default FeaturedProducts;