import React, { useState } from 'react';

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
    <section className="mt-24 px-8 sm:px-16 lg:px-24 py-20 bg-stone-950 border-t border-b border-stone-900">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Text Content - Dull Ash Tones */}
        <div className="flex-1 text-left">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-500 mb-4">
            The Digest
          </h2>
          <h3 className="text-2xl sm:text-3xl font-light text-stone-300 tracking-tight leading-tight">
            Stay in the <span className="italic text-stone-500">Archive.</span>
          </h3>
          <p className="mt-4 text-stone-500 text-xs sm:text-sm font-light tracking-wide max-w-xs">
            Subscribe to receive curated updates, exclusive arrivals, and modern insights.
          </p>
        </div>

        {/* Form Layer */}
        <div className="w-full md:w-auto flex-1 max-w-md">
          {isSubscribed ? (
            <div className="flex items-center gap-4 text-stone-400 animate-pulse">
              <div className="w-8 h-px bg-stone-600" />
              <p className="text-[10px] uppercase tracking-widest">Subscription Confirmed</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative group">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent border-b border-stone-800 p-4 pb-2 text-[10px] uppercase tracking-[0.2em] text-stone-300 outline-none transition-colors focus:border-stone-500 placeholder:text-stone-700"
              />
              <button
                type="submit"
                className="absolute right-0 bottom-2 text-stone-500 hover:text-stone-200 text-[10px] uppercase tracking-[0.3em] transition-all duration-500 flex items-center gap-2"
              >
                Join
                <div className="w-4 h-px bg-stone-700 group-hover:w-8 transition-all" />
              </button>
            </form>
          )}
          <p className="mt-6 text-[8px] text-stone-700 uppercase tracking-widest leading-relaxed">
            By subscribing, you agree to our <span className="underline cursor-pointer">Privacy Policy</span>. 
            No spam, only curated content.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Newsletter;