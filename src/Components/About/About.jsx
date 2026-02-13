import React from 'react';

const About = () => {
  return (
    <section className="bg-white px-8 sm:px-16 lg:px-24 py-32 flex flex-wrap items-center justify-between gap-16 lg:gap-32 overflow-hidden">
      
      {/* Image Container - Swapped to left for a classic editorial layout */}
      <div className="flex-1 min-w-[320px] max-w-md lg:max-w-lg animate-in fade-in slide-in-from-left-8 duration-1000">
        <div className="relative group">
          {/* Subtle background shadow element */}
          <div className="absolute -inset-4 bg-stone-50 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 -z-10" />
          
          <img
            src="/about.jpg"
            alt="The Vendo Archive"
            className="w-full h-auto object-cover grayscale-[30%] contrast-[1.05] brightness-[1.02] transition-all duration-1000 group-hover:grayscale-0"
          />
          
          {/* Minimalist Image Caption */}
          <p className="mt-4 text-[8px] uppercase tracking-[0.6em] text-stone-300">
            Internal Archive Ref. 2026—04
          </p>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-[320px] max-w-xl text-left animate-in fade-in slide-in-from-right-8 duration-1000">
        <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-400 mb-8 font-medium">
          The Narrative
        </h2>
        
        <h3 className="text-3xl sm:text-5xl font-light text-stone-900 mb-10 leading-[1.2] tracking-tight">
          Curating Quality. <br />
          <span className="italic text-stone-400 font-normal">Defining Value.</span>
        </h3>

        <div className="space-y-8 max-w-lg">
          <p className="text-stone-500 text-sm leading-[2] font-light tracking-wide">
            VENDO was established as a response to the fleeting nature of modern commerce. 
            We believe that high-quality essentials—from precision electronics to 
            intentional fashion—should be accessible without compromising on the 
            integrity of design or service.
          </p>
          
          <p className="text-stone-500 text-sm leading-[2] font-light tracking-wide">
            Our archive is a living collection, constantly evolving to bring you 
            the most significant deals on the market. We don't just sell products; 
            we curate experiences that last beyond the initial purchase.
          </p>
        </div>

        {/* Categories Grid - Clean & Muted */}
        <div className="mt-16 pt-10 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-stone-900 block mb-1">Electronics</span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-stone-400">Precision Gear</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-stone-900 block mb-1">Fashion</span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-stone-400">Timeless Wear</span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-[0.4em] text-stone-900 block mb-1">Essentials</span>
            <span className="text-[8px] uppercase tracking-[0.2em] text-stone-400">Daily Archive</span>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default About;