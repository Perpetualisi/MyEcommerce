import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, Mail } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeInterest, setActiveInterest] = useState('General');

  const interests = ['General', 'Tech', 'Home', 'Pantry'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section id="correspondence" className="bg-white px-6 sm:px-16 lg:px-24 py-32 border-t border-stone-100 selection:bg-stone-900 selection:text-white">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-20">
        
        {/* Editorial Side */}
        <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="flex items-center gap-4">
            <Mail size={12} className="text-stone-900" strokeWidth={1.5} />
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-bold">
              Dispatch Registry
            </h2>
          </div>
          
          <h3 className="text-4xl sm:text-6xl font-extralight text-stone-900 tracking-tighter leading-none">
            Join the <br />
            <span className="font-serif italic text-stone-400">Vendo Archive.</span>
          </h3>

          <div className="max-w-sm space-y-6">
            <p className="text-stone-500 text-sm leading-relaxed font-light tracking-wide">
              Secure priority access to curated digital tech drops, artisan pantry restocks, and sculptural furniture releases.
            </p>
            
            {/* Interest Selection - Premium Detail */}
            <div className="flex flex-wrap gap-4 pt-4">
              {interests.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveInterest(item)}
                  className={`text-[9px] uppercase tracking-[0.3em] pb-1 border-b transition-all duration-500 ${
                    activeInterest === item 
                    ? 'border-stone-900 text-stone-900' 
                    : 'border-transparent text-stone-300 hover:text-stone-500'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactional Side */}
        <div className="w-full lg:w-1/2 max-w-md">
          {isSubscribed ? (
            <div className="bg-stone-50 p-12 border border-stone-100 animate-in fade-in zoom-in-95 duration-1000">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm">
                  <ShieldCheck size={20} className="text-stone-900" strokeWidth={1} />
                </div>
                <div className="space-y-2">
                  <p className="text-[11px] uppercase tracking-[0.4em] font-bold text-stone-900">Identity Confirmed</p>
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest leading-relaxed">
                    Welcome to the 2026 Archive. Your first dispatch is currently being prepared for transmission.
                  </p>
                </div>
                <button 
                  onClick={() => setIsSubscribed(false)}
                  className="text-[9px] uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 underline underline-offset-4 decoration-stone-200 transition-all"
                >
                  Register another email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative group pt-10">
              <div className="relative">
                <label className="text-[9px] uppercase tracking-[0.5em] text-stone-400 block mb-6 font-semibold">
                  Electronic Mail Address
                </label>
                <div className="relative border-b border-stone-200 pb-4 transition-all duration-700 focus-within:border-stone-900">
                  <input
                    type="email"
                    placeholder="CLIENT@ARCHIVE.COM"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent text-[13px] uppercase tracking-[0.2em] text-stone-900 outline-none placeholder:text-stone-100"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 bottom-4 text-stone-900 flex items-center gap-4 group/btn"
                  >
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold opacity-0 group-focus-within:opacity-100 transition-all duration-700 translate-x-4 group-focus-within:translate-x-0">
                      Transmit
                    </span>
                    <div className="p-2 border border-stone-900 rounded-full group-hover/btn:bg-stone-950 group-hover/btn:text-white transition-all duration-500">
                      <ArrowRight size={14} strokeWidth={1.5} />
                    </div>
                  </button>
                </div>
              </div>

              {/* Status & Privacy */}
              <div className="mt-12 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="flex-1 h-px bg-stone-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-stone-900 -translate-x-full group-focus-within:animate-progress" />
                  </div>
                  <span className="text-[8px] uppercase tracking-[0.4em] text-stone-300">Identity Secure</span>
                </div>

                <p className="text-[9px] text-stone-400 uppercase tracking-[0.2em] leading-relaxed max-w-xs font-light">
                  By registering, you acknowledge the <span className="text-stone-900 underline underline-offset-4 cursor-pointer hover:text-stone-400 transition-colors">VENDO privacy manifest</span>. No frequent spam; only significant updates.
                </p>
              </div>
            </form>
          )}
        </div>

      </div>

      <style>
        {`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0%); }
          }
          .animate-progress {
            animation: progress 2s cubic-bezier(0.65, 0, 0.35, 1) forwards;
          }
        `}
      </style>
    </section>
  );
};

export default Newsletter;