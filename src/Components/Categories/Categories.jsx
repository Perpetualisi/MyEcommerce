import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    { id: 1, name: 'Electronics', image: '/Electronics.jpg' },
    { id: 2, name: 'Fashion', image: '/fashion.jpg' },
    { id: 3, name: 'Groceries', image: '/Groceries.jpg' },
    { id: 4, name: 'Furniture', image: '/furnitures.jpg' },
  ];

  return (
    <section className="mt-24 px-6 sm:px-10 lg:px-20 py-16 bg-white">
      
      {/* Editorial Header */}
      <div className="mb-12 text-left border-l border-stone-200 pl-6">
        <h2 className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-2">
          Browse by Genre
        </h2>
        <p className="text-2xl sm:text-3xl font-light text-stone-800 tracking-tight">
          Curated Departments
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/shop#${category.name.toLowerCase()}`}
            className="group block"
          >
            {/* Image Wrapper: 
                We use a fixed aspect ratio and bg-stone-50 to provide 
                a "canvas" for the full image to sit on.
            */}
            <div className="relative aspect-square overflow-hidden bg-stone-50 rounded-sm mb-6 flex items-center justify-center p-4">
              <img
                src={category.image}
                alt={category.name}
                /* object-contain: Ensures the image shows fully without cropping.
                   grayscale-0: Returns full color to the image.
                */
                className="max-w-full max-h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              />
              
              {/* Subtle hover overlay for depth */}
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/[0.02] transition-colors duration-500 pointer-events-none" />
            </div>

            {/* Label Section - Clean & Centered */}
            <div className="space-y-2 text-center">
              <h3 className="text-xs uppercase tracking-[0.3em] text-stone-800 font-medium">
                {category.name}
              </h3>
              <div className="flex justify-center">
                <div className="w-0 h-px bg-stone-400 group-hover:w-8 transition-all duration-500" />
              </div>
              <p className="text-[9px] uppercase tracking-widest text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Explore
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;