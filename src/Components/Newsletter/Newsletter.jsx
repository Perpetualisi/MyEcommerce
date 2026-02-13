import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="bg-white px-8 sm:px-16 lg:px-24 py-32 border-t border-stone-100">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16 lg:gap-24">
        
        {/* Text Content */}
        <div className="flex-1 text-left animate-in fade-in duration-1000">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-400 mb-6 font-medium">
            Correspondence
          </h2>
          <h3 className="text-3xl sm:text-4xl font-light text-stone-900 tracking-tight leading-[1.2]">
            Join the <br />
            <span className="italic text-stone-400">Vendo Archive.</span>
          </h3>
          <p className="mt-6 text-stone-500 text-xs sm:text-sm font-light tracking-wide max-w-xs leading-relaxed">
            Receive curated notifications regarding new arrivals, seasonal edits, and private archive sales.
          </p>
        </div>

        {/* Form Layer */}
        <div className="w-full md:w-auto flex-1 max-w-md pt-4">
          {isSubscribed ? (
            <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-700">
              <div className="flex items-center gap-3 text-stone-900">
                <div className="w-8 h-8 rounded-full border border-stone-100 flex items-center justify-center">
                  <Check size={14} strokeWidth={1.5} />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-medium">Access Granted</p>
              </div>
              <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-relaxed">
                Check your inbox for a welcome transmission.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative group">
              <div className="relative border-b border-stone-200 pb-2 transition-all duration-700 focus-within:border-stone-900">
                <input
                  type="email"
                  placeholder="ENTER EMAIL ADDRESS"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent p-2 pl-0 text-[11px] uppercase tracking-[0.25em] text-stone-900 outline-none placeholder:text-stone-200 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-0 bottom-2 text-stone-400 hover:text-stone-900 transition-all duration-500 flex items-center gap-3 group/btn"
                >
                  <span className="text-[9px] uppercase tracking-[0.4em]">Submit</span>
                  <ArrowRight size={14} strokeWidth={1.5} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="mt-8 space-y-4">
                <p className="text-[8px] text-stone-300 uppercase tracking-[0.2em] leading-relaxed">
                  By joining, you consent to our <span className="text-stone-500 underline underline-offset-4 cursor-pointer hover:text-stone-900 transition-colors">Digital Privacy Terms</span>.
                </p>
                
                {/* Visual Status Indicator */}
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[1px] w-4 bg-stone-100 group-focus-within:bg-stone-200 transition-colors duration-1000" />
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};

export default Newsletter;