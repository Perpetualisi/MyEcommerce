import React from 'react';

const About = () => {
  return (
    <section id="about" className="bg-white px-6 sm:px-16 lg:px-24 py-24 md:py-40 flex flex-wrap items-center justify-between gap-12 lg:gap-24 overflow-hidden">
      
      {/* Image Container */}
      <div className="flex-1 min-w-[300px] max-w-md lg:max-w-xl animate-in fade-in slide-in-from-left-10 duration-1000">
        <div className="relative">
          {/* Decorative Archive Number */}
          <span className="absolute -top-10 -left-6 text-[120px] font-light text-stone-50 select-none z-0">
            01
          </span>
          
          <div className="relative z-10 group overflow-hidden bg-stone-100 aspect-[4/5]">
            <img
              src="https://images.pexels.com/photos/447592/pexels-photo-447592.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="The Vendo Concept Space"
              className="w-full h-full object-cover grayscale-[40%] contrast-[1.1] transition-all duration-[2000ms] group-hover:scale-105 group-hover:grayscale-0"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent opacity-60" />
          </div>

          {/* Floating Ref Label */}
          <div className="absolute bottom-6 -right-4 bg-white p-6 shadow-xl hidden md:block animate-in zoom-in duration-1000 delay-500">
            <p className="text-[9px] uppercase tracking-[0.5em] text-stone-900 font-bold mb-1">
              Established
            </p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-stone-400">
              Ref: Q1—MMXXVI
            </p>
          </div>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex-1 min-w-[320px] max-w-xl animate-in fade-in slide-in-from-right-10 duration-1000">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-10 h-px bg-stone-900" />
          <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-500 font-semibold">
            The Narrative
          </h2>
        </div>
        
        <h3 className="text-4xl sm:text-6xl font-extralight text-stone-900 mb-10 leading-[1.1] tracking-tighter">
          Intentional living <br />
          <span className="font-serif italic text-stone-400">simplified.</span>
        </h3>

        <div className="space-y-8">
          <p className="text-stone-500 text-sm md:text-base leading-[1.8] font-light tracking-wide">
            VENDO was born from a simple observation: the world has enough products, but not enough <span className="text-stone-900 font-normal border-b border-stone-200">curation</span>. We bridge the gap between the artisan sourdough, the mid-century chair, and the silicon chip.
          </p>
          
          <p className="text-stone-500 text-sm md:text-base leading-[1.8] font-light tracking-wide">
            Our archive isn't a catalog; it's a selection. We source objects that balance utility with beauty, ensuring your daily essentials—whether edible, wearable, or digital—elevate your standard of living.
          </p>
        </div>

        {/* Categories Breakdown */}
        <div className="mt-16 pt-12 border-t border-stone-100 grid grid-cols-2 gap-y-10 gap-x-4">
          <div className="group cursor-default">
            <p className="text-[10px] uppercase tracking-[0.4em] text-stone-900 mb-2 transition-colors group-hover:text-stone-400">
              Tech & Gear
            </p>
            <div className="h-px w-8 bg-stone-200 group-hover:w-16 transition-all duration-500" />
          </div>
          <div className="group cursor-default">
            <p className="text-[10px] uppercase tracking-[0.4em] text-stone-900 mb-2 transition-colors group-hover:text-stone-400">
              Living & Home
            </p>
            <div className="h-px w-8 bg-stone-200 group-hover:w-16 transition-all duration-500" />
          </div>
          <div className="group cursor-default">
            <p className="text-[10px] uppercase tracking-[0.4em] text-stone-900 mb-2 transition-colors group-hover:text-stone-400">
              Artisan Pantry
            </p>
            <div className="h-px w-8 bg-stone-200 group-hover:w-16 transition-all duration-500" />
          </div>
          <div className="group cursor-default">
            <p className="text-[10px] uppercase tracking-[0.4em] text-stone-900 mb-2 transition-colors group-hover:text-stone-400">
              Curated Attire
            </p>
            <div className="h-px w-8 bg-stone-200 group-hover:w-16 transition-all duration-500" />
          </div>
        </div>

        {/* Call to Action Link */}
        <div className="mt-16">
          <button className="text-[10px] uppercase tracking-[0.4em] text-stone-900 border-b border-stone-900 pb-2 hover:text-stone-400 hover:border-stone-400 transition-all duration-300">
            Read our Manifesto
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;