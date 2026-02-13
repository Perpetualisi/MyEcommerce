import React, { useState, useEffect } from 'react';
import { firestore } from '../../../Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShoppingBag, Loader2, Plus } from 'lucide-react';

const FeaturedProducts = ({ onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-stone-200 mb-4" size={32} />
        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-300">Loading Archive</p>
      </div>
    );
  }

  return (
    <section className="mt-20 px-6 sm:px-10 lg:px-20 py-16 bg-white">
      
      {/* Editorial Header */}
      <div className="mb-16 text-left border-l border-stone-200 pl-6">
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-2">
          Selected Works
        </h2>
        <p className="text-2xl sm:text-3xl font-light text-stone-800 tracking-tight">
          Featured Selection
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-10 gap-y-16">
        {products.map((product) => (
          <div key={product.id} className="group relative flex flex-col">
            
            {/* Image Container:
                - h-80: Fixed height for grid alignment
                - object-contain: Shows FULL image without cropping
                - bg-stone-50: A light canvas for the image to sit on
            */}
            <div className="relative h-80 w-full overflow-hidden bg-stone-50 rounded-sm mb-6 flex items-center justify-center p-6">
              <img
                src={product.imageURL}
                alt={product.name}
                className="max-w-full max-h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Subtle hover overlay with Quick Add */}
              <div className="absolute inset-0 bg-stone-900/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <button
                  onClick={() => onAddToCart(product)}
                  className="bg-stone-800 text-stone-100 px-6 py-3 text-[10px] uppercase tracking-[0.2em] shadow-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex items-center gap-2"
                >
                  <Plus size={14} /> Quick Add
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[11px] font-medium text-stone-800 tracking-[0.15em] uppercase truncate pr-4">
                  {product.name}
                </h3>
                <span className="text-xs font-light text-stone-500">
                  {product.price ? `₦${Number(product.price).toLocaleString()}` : "—"}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="h-px w-4 bg-stone-200" />
                <p className="text-[9px] text-stone-400 uppercase tracking-widest italic">
                  {product.category || "General Collection"}
                </p>
              </div>
            </div>
            
            {/* Mobile Touch Target */}
            <button
              onClick={() => onAddToCart(product)}
              className="md:hidden mt-6 w-full border border-stone-100 py-3 text-[10px] uppercase tracking-widest text-stone-500 flex items-center justify-center gap-2 active:bg-stone-50"
            >
              <ShoppingBag size={14} /> Add to Bag
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;