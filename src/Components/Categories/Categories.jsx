import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Categories = () => {
  const categories = [
    { 
      id: '01', 
      name: 'Digital Archive', 
      tag: 'Tech & Gadgets',
      // Path matches the Electronics category in your inventory
      path: '/shop#electronics',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop' 
    },
    { 
      id: '02', 
      name: 'Sartorial', 
      tag: 'Premium Fashion',
      // Path matches the Fashion category in your inventory
      path: '/shop#fashion',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop' 
    },
    { 
      id: '03', 
      name: 'Pantry Essentials', 
      tag: 'Artisan Groceries',
      // Path matches the Groceries category in your inventory
      path: '/shop#groceries',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop' 
    },
    { 
      id: '04', 
      name: 'Living Space', 
      tag: 'Sculptural Furniture',
      // Path matches the Furniture category in your inventory
      path: '/shop#furniture',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1200&auto=format&fit=crop' 
    },
  ];

  return (
    <section className="px-6 sm:px-12 lg:px-24 py-32 bg-white selection:bg-stone-900 selection:text-white">
      
      {/* Editorial Header */}
      <div className="max-w-[1440px] mx-auto mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-px bg-stone-900" />
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-bold">
              Index
            </h2>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extralight text-stone-900 tracking-tighter leading-none">
            Browse by <br />
            <span className="font-serif italic text-stone-400 font-normal">Department.</span>
          </h1>
        </div>
        <p className="max-w-[240px] text-[10px] uppercase tracking-[0.2em] text-stone-400 leading-relaxed font-light">
          Systematic navigation through our curated multi-sector archive.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.path}
            className="group block relative"
          >
            {/* Visual Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-stone-50 mb-8">
              {/* Category Number Overlay */}
              <div className="absolute top-6 left-6 z-10">
                <span className="text-[10px] font-medium text-stone-900 bg-white px-2 py-1 tracking-widest">
                  {category.id}
                </span>
              </div>

              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s] ease-out"
              />
              
              {/* Minimalist Hover Info */}
              <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-white/50 flex items-center justify-center text-white backdrop-blur-sm">
                  <ArrowRight size={18} strokeWidth={1} />
                </div>
              </div>
            </div>

            {/* Typography Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] uppercase tracking-[0.4em] text-stone-900 font-bold group-hover:tracking-[0.5em] transition-all duration-500">
                  {category.name}
                </h3>
              </div>
              
              <div className="flex items-center gap-4">
                <p className="text-[9px] uppercase tracking-[0.2em] text-stone-400 font-light">
                  {category.tag}
                </p>
                <div className="flex-1 h-px bg-stone-100 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;