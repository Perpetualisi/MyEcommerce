import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

const images = [
  "/banner11.jpg",
  "/banner122.jpg",
  "/banner2.jpg",
  "/banner3.jpg",
  "/banner5.jpg",
  "/banner66.jpg",
  "/banner77.jpg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5500);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    /* h-[80vh] on mobile gives that full-screen feel without hiding the content below */
    <section className="relative w-full h-[75vh] md:h-[85vh] lg:h-screen overflow-hidden bg-stone-900">
      
      {/* Images Layer */}
      {images.map((img, index) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            index === currentImage ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={img}
            alt="Experience Banner"
            /* object-cover ensures the image fills the screen. 
               grayscale-[20%] gives that signature dull/premium look. 
            */
            className="w-full h-full object-cover grayscale-[20%] contrast-[1.05]"
          />
          {/* Subtle Matte Overlay for text legibility */}
          <div className="absolute inset-0 bg-stone-950/40" />
        </div>
      ))}

      {/* Content Container - Responsive Padding and Sizing */}
      <div className="absolute inset-0 z-30 flex items-center px-6 sm:px-12 md:px-20">
        <div className="max-w-3xl">
          {/* Muted Dull Header */}
          <h1 className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-4 sm:mb-6">
            Season Collection 2026
          </h1>
          
          <h2 className="text-3xl sm:text-5xl lg:text-7xl font-light tracking-tight mb-6 leading-[1.1] text-stone-200">
            Discover <br />
            <span className="font-normal italic text-stone-400">Modern Experiences</span>
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-stone-400 mb-8 sm:mb-10 max-w-xs sm:max-w-sm leading-relaxed tracking-wide font-light">
            A curated archive of creativity, technology, and intentional design.
          </p>

          <Link to="/offers">
            <button className="group flex items-center gap-4 px-8 py-3 sm:px-10 sm:py-4 bg-stone-800 text-stone-400 text-[10px] uppercase tracking-[0.3em] hover:bg-stone-700 transition-all duration-700 border border-stone-700/50 shadow-2xl">
              Explore Now
              <div className="w-6 h-px bg-stone-500 group-hover:w-10 transition-all duration-500" />
            </button>
          </Link>
        </div>
      </div>

      {/* Responsive Line Indicators - Bottom Center on Mobile, Bottom Left on Desktop */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0 flex items-center gap-3 z-40">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImage(i)}
            className="py-2"
          >
            <div className={`h-[1px] transition-all duration-700 ${
              i === currentImage ? "w-8 sm:w-12 bg-stone-300" : "w-3 sm:w-4 bg-stone-700"
            }`} />
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;      