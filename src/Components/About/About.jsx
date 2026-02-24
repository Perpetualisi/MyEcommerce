import React from 'react';
import { ArrowRight, Terminal, Box, Compass, Cpu } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="bg-[#080705] text-[#e8e4dd] px-6 sm:px-16 lg:px-24 py-32 md:py-56 flex flex-wrap items-center justify-between gap-12 lg:gap-32 overflow-hidden relative">
      
      {/* ── BACKGROUND ACCENT (TECHNICAL) ── */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#0c0a09] -z-10 translate-x-1/4 skew-x-12 opacity-50" />

      {/* ── IMAGE SECTION ── */}
      <div className="flex-1 min-w-[300px] max-w-md lg:max-w-xl animate-in fade-in slide-in-from-left-10 duration-1000">
        <div className="relative">
          {/* Large Registry Index Background */}
          <span className="absolute -top-16 -left-10 text-[180px] font-black text-white/[0.02] select-none z-0 font-mono">
            01
          </span>
          
          <div className="relative z-10 group overflow-hidden bg-stone-900 aspect-[4/5] border border-stone-800">
            <img
              src="https://images.pexels.com/photos/447592/pexels-photo-447592.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="The Vendo Concept Space"
              className="w-full h-full object-cover grayscale opacity-60 contrast-125 transition-all duration-[2500ms] group-hover:scale-110 group-hover:grayscale-0 group-hover:opacity-100"
              loading="lazy"
            />
            
            {/* Overlay Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
          </div>

          {/* Floating Data Badge */}
          <div className="absolute -bottom-10 -right-6 bg-[#171512] border border-stone-800 p-8 shadow-2xl hidden md:block animate-in zoom-in duration-1000 delay-500">
            <div className="flex items-center gap-3 mb-4">
              <Terminal size={12} className="text-stone-500" />
              <span className="text-[8px] font-mono uppercase tracking-[0.4em] text-stone-500">System Log</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.5em] text-white font-black mb-1">
              EST. Q1—MMXXVI
            </p>
            <p className="text-[9px] font-mono text-stone-600">
              LOC: US-NY-HUB // 40.7128° N
            </p>
          </div>
        </div>
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="flex-1 min-w-[320px] max-w-xl animate-in fade-in slide-in-from-right-10 duration-1000">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-12 h-[1px] bg-stone-700" />
          <h2 className="text-[10px] uppercase tracking-[0.8em] text-stone-500 font-bold">
            The Narrative
          </h2>
        </div>
        
        <h3 className="text-5xl sm:text-7xl font-extralight text-white mb-12 leading-[1.05] tracking-tighter">
          Intentional living <br />
          <span className="font-serif italic text-stone-500">re-indexed.</span>
        </h3>

        <div className="space-y-10 max-w-lg">
          <p className="text-stone-400 text-sm md:text-base leading-[1.9] font-light tracking-wide italic font-serif">
            "The world has enough products, but it suffers from a lack of curation."
          </p>
          
          <p className="text-stone-500 text-sm md:text-base leading-[1.9] font-light tracking-wide">
            VENDO functions as a bridge between high-frequency innovation and timeless utility. We ingest objects that balance form with industrial function, ensuring your registry of daily essentials—whether digital, wearable, or domestic—is optimized for the modern era.
          </p>
        </div>

        {/* ── TECHNICAL CATEGORIES (GRID) ── */}
        <div className="mt-20 pt-16 border-t border-stone-900 grid grid-cols-2 gap-y-12 gap-x-8">
          {[
            { label: 'Technical Gear', icon: Cpu },
            { label: 'Domestic Objects', icon: Box },
            { label: 'Artisan Goods', icon: Compass },
            { label: 'Core Attire', icon: Box }
          ].map((item, idx) => (
            <div key={idx} className="group cursor-crosshair flex items-start gap-4">
              <item.icon size={14} className="text-stone-700 mt-1 group-hover:text-white transition-colors" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-stone-300 mb-2 transition-all group-hover:translate-x-1 font-black">
                  {item.label}
                </p>
                <div className="h-[1px] w-4 bg-stone-800 group-hover:w-12 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* ── CALL TO ACTION ── */}
        <div className="mt-20 flex items-center gap-8">
          <button className="flex items-center gap-4 text-[10px] uppercase tracking-[0.6em] text-white group">
            <span className="border-b border-white/20 pb-2 group-hover:border-white transition-all">
              Execute Manifesto
            </span>
            <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
          </button>
          
          <div className="hidden sm:block h-[1px] flex-1 bg-stone-900" />
        </div>
      </div>
    </section>
  );
};

export default About;