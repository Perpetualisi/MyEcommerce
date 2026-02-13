import React, { useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';

const ShopPage = ({ products, onAddToCart }) => {
  const categories = ['Electronics', 'Fashion', 'Groceries', 'Furniture'];

  useEffect(() => {
    const sectionId = window.location.hash;
    if (sectionId) {
      setTimeout(() => {
        const element = document.querySelector(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="bg-stone-50 min-h-screen mt-16 px-6 sm:px-10 lg:px-20 py-12">
      
      {/* Editorial Page Title */}
      <header className="max-w-4xl mb-20">
        <h2 className="text-xs uppercase tracking-[0.4em] text-stone-400 mb-4">
          The Full Collection
        </h2>
        <h1 className="text-3xl sm:text-5xl font-light text-stone-800 tracking-tight leading-tight">
          Modern living, <br /> 
          <span className="italic font-serif">refined for every space.</span>
        </h1>
      </header>

      {/* Subtle Category Quick-Links */}
      <nav className="flex flex-wrap gap-8 mb-16 border-b border-stone-200 pb-6">
        {categories.map((cat) => (
          <a
            key={cat}
            href={`#${cat.toLowerCase()}`}
            className="text-[10px] uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
          >
            {cat}
          </a>
        ))}
      </nav>

      {/* Sections */}
      {categories.map((category) => (
        <section
          key={category}
          id={category.toLowerCase()}
          className="mb-24 scroll-mt-24"
        >
          {/* Category Header */}
          <div className="flex items-center gap-4 mb-10">
            <h3 className="text-sm uppercase tracking-[0.2em] font-medium text-stone-800">
              {category}
            </h3>
            <div className="h-px flex-1 bg-stone-200"></div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products
              .filter((product) => product.category === category)
              .map((product) => (
                <div key={product.id} className="group">
                  {/* Image wrapper with Matte Filter */}
                  <div className="relative aspect-square overflow-hidden bg-stone-200 mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Minimalist Quick Add (Desktop Hover) */}
                    <button
                      onClick={() => onAddToCart(product)}
                      className="absolute inset-x-0 bottom-0 bg-stone-900/10 backdrop-blur-md text-white py-3 text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      Add to Collection
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1 px-1">
                    <h4 className="text-xs uppercase tracking-widest text-stone-800 font-medium">
                      {product.name}
                    </h4>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-stone-500 font-light">
                        ${product.price}
                      </p>
                      <button 
                         onClick={() => onAddToCart(product)}
                         className="md:hidden text-stone-400 active:text-stone-900"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ShopPage;