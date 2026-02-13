import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

// Diversity of Products: Tech, Interior, Food, and Lifestyle
const images = [
  "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2000&auto=format&fit=crop", // Furniture/Interior
  "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000&auto=format&fit=crop", // Electronics/Tech
  "https://images.unsplash.com/photo-1476224203421-9ac39bdd3327?q=80&w=2000&auto=format&fit=crop", // Gourmet Food/Groceries
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop", // Fashion/Retail
  "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2000&auto=format&fit=crop", // Modern Gadgets
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(nextSlide, 5000); 
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative w-full h-[80vh] md:h-screen overflow-hidden bg-stone-950">
      
      {/* Background Layer */}
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === currentImage ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={img}
            alt="Category Showcase"
            className={`w-full h-full object-cover grayscale-[15%] contrast-[1.05] transition-transform duration-[8000ms] ease-out ${
              index === currentImage ? "scale-105" : "scale-100"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/40 to-transparent" />
        </div>
      ))}

      {/* Content Container */}
      <div className="absolute inset-0 z-30 flex items-center px-6 sm:px-12 md:px-24">
        <div className={`max-w-3xl transition-all duration-1000 delay-300 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          <h1 className="text-[10px] uppercase tracking-[0.5em] text-stone-400 mb-6">
            Universal Archive / 2026 Edition
          </h1>
          
          <h2 className="text-4xl sm:text-6xl lg:text-8xl font-light tracking-tight mb-8 leading-[1.1] text-white">
            Everything for <br />
            <span className="font-serif italic text-stone-300">Modern Living.</span>
          </h2>

          <p className="text-sm md:text-base text-stone-400 mb-10 max-w-md leading-relaxed tracking-wide font-light">
            From essential tech and artisan groceries to curated furniture and slow-fashion. An intentional selection for every aspect of your day.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/shop">
              <button className="px-8 py-4 bg-white text-black text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-stone-200 transition-colors">
                Browse Collection
              </button>
            </Link>
            <Link to="/categories">
              <button className="px-8 py-4 border border-stone-500 text-white text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                View Categories
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 right-10 flex gap-2 z-40">
        {images.map((_, i) => (
          <div 
            key={i}
            className={`h-1 transition-all duration-500 ${i === currentImage ? "w-12 bg-white" : "w-4 bg-stone-700"}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;