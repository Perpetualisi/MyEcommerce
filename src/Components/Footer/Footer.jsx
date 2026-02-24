import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUp, Globe, Terminal, Shield, Activity, Send, Hash } from 'lucide-react';

const Footer = () => {
  const [systemTime, setSystemTime] = useState("");
  const [email, setEmail] = useState("");
  const EST_DATE = "MMXXVI";

  // Real-time Technical Clock (EST/New York)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const options = { timeZone: 'America/New_York', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      setSystemTime(new Intl.DateTimeFormat('en-US', options).format(now));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#080705] text-[#e8e4dd] pt-40 pb-12 px-8 sm:px-16 lg:px-24 border-t border-stone-900 selection:bg-white selection:text-black">
      <div className="max-w-[1440px] mx-auto">
        
        {/* ── TOP SECTION: BRAND & NEWSLETTER INGESTION ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-20 mb-40">
          <div className="space-y-10 max-w-lg">
            <div className="flex items-center gap-4">
              <Terminal size={14} className="text-stone-700" />
              <h3 className="text-[10px] uppercase tracking-[0.8em] text-stone-600 font-black">Registry Identity</h3>
            </div>
            <div className="space-y-8">
              <h4 className="text-5xl sm:text-7xl font-extralight tracking-tighter text-white leading-none">
                Vendo <span className="italic text-stone-600 font-serif">Archive.</span>
              </h4>
              <p className="text-[11px] uppercase tracking-[0.3em] text-stone-500 leading-relaxed font-bold max-w-sm">
                Curating the intersection of high-frequency tech, artisanal cold-storage, and sculptural domesticity.
              </p>
            </div>
          </div>

          {/* Newsletter / Data Subscription */}
          <div className="w-full max-w-md space-y-6">
            <h4 className="text-[9px] uppercase tracking-[0.5em] text-stone-600 font-black">Join Transmission List</h4>
            <div className="relative group">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="EMAIL_ADDRESS@PROTOCOL.COM"
                className="w-full bg-transparent border-b border-stone-800 py-4 text-[11px] font-mono tracking-widest text-white focus:outline-none focus:border-white transition-all duration-700 uppercase"
              />
              <button className="absolute right-0 bottom-4 text-stone-500 hover:text-white transition-colors">
                <Send size={16} strokeWidth={1} />
              </button>
            </div>
            <p className="text-[8px] uppercase tracking-widest text-stone-700">Receive weekly archive digests and metadata updates.</p>
          </div>
        </div>

        {/* ── MIDDLE SECTION: SITEMAP & SYSTEM STATS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-16 mb-40">
          
          {/* Vol 1: Objects */}
          <div className="space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.6em] text-white font-black flex items-center gap-2">
              <Hash size={10} className="text-stone-700" /> Vol. I
            </h4>
            <ul className="space-y-5">
              <li><Link to="/shop" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-white transition-all hover:translate-x-1 inline-block font-bold">The Catalog</Link></li>
              <li><Link to="/shop#new" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-white transition-all hover:translate-x-1 inline-block font-bold">High-Frequency Tech</Link></li>
              <li><Link to="/shop#featured" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-white transition-all hover:translate-x-1 inline-block font-bold">Domestic Sculptures</Link></li>
            </ul>
          </div>

          {/* Vol 2: Artisan Pantry (Ice Cream) */}
          <div className="space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.6em] text-white font-black flex items-center gap-2">
              <Hash size={10} className="text-stone-700" /> Vol. II
            </h4>
            <ul className="space-y-5">
              <li><Link to="/pantry" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-white transition-all hover:translate-x-1 inline-block font-bold">Cold Storage</Link></li>
              <li><Link to="/pantry#icecream" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-white transition-all hover:translate-x-1 inline-block font-bold">Artisan Creams</Link></li>
              <li><Link to="/pantry#batch" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-white transition-all hover:translate-x-1 inline-block font-bold">Batch Logs</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-8">
            <h4 className="text-[10px] uppercase tracking-[0.6em] text-white font-black flex items-center gap-2">
              <Hash size={10} className="text-stone-700" /> Info
            </h4>
            <ul className="space-y-5">
              <li><Link to="/about" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-white transition-all hover:translate-x-1 inline-block font-bold">Manifesto</Link></li>
              <li><Link to="/contact" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-white transition-all hover:translate-x-1 inline-block font-bold">Inquiries</Link></li>
              <li><Link to="/careers" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-white transition-all hover:translate-x-1 inline-block font-bold">Career Registry</Link></li>
            </ul>
          </div>

          {/* System Telemetry */}
          <div className="col-span-2 space-y-10 border-l border-stone-900 pl-12 hidden lg:block">
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-[0.6em] text-stone-600 font-black flex items-center gap-3">
                <Activity size={12} /> System Telemetry
              </h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 font-mono text-[9px] uppercase tracking-widest">
                <div className="flex justify-between border-b border-stone-900 pb-2">
                  <span className="text-stone-700">Status</span>
                  <span className="text-green-500">Online</span>
                </div>
                <div className="flex justify-between border-b border-stone-900 pb-2">
                  <span className="text-stone-700">Region</span>
                  <span className="text-stone-400">US-EAST</span>
                </div>
                <div className="flex justify-between border-b border-stone-900 pb-2">
                  <span className="text-stone-700">Protocol</span>
                  <span className="text-stone-400">HTTPS_v3</span>
                </div>
                <div className="flex justify-between border-b border-stone-900 pb-2">
                  <span className="text-stone-700">Local Time</span>
                  <span className="text-white">{systemTime}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-stone-800">
               <Shield size={16} strokeWidth={1} />
               <span className="text-[8px] uppercase tracking-[0.4em]">Encrypted Market Transaction Protocol Active</span>
            </div>
          </div>
        </div>

        {/* ── BOTTOM SECTION: LEGAL & SURFACE LINK ── */}
        <div className="pt-16 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-12">
          
          {/* Surface Button */}
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-6 text-[9px] uppercase tracking-[0.6em] text-stone-500 hover:text-white transition-all duration-1000 order-2 md:order-1 font-black"
          >
            <div className="w-12 h-12 rounded-full border border-stone-900 flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-700">
              <ArrowUp size={14} strokeWidth={2} />
            </div>
            <span className="border-b border-transparent group-hover:border-white pb-1">Return to Surface</span>
          </button>

          <div className="flex flex-col items-center md:items-end gap-6 order-1 md:order-2">
            <div className="flex gap-10">
              {['Privacy.PDF', 'Terms.SYS', 'Cookies.LOG'].map((item) => (
                <span key={item} className="text-[8px] uppercase tracking-[0.5em] text-stone-700 hover:text-stone-400 cursor-pointer transition-colors font-black">
                  {item}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-6">
              <p className="text-[9px] font-mono uppercase tracking-[0.6em] text-stone-800">
                © {EST_DATE} VENDO_REGISTRY_USA
              </p>
              <div className="h-1 w-1 bg-stone-900 rounded-full" />
              <div className="flex items-center gap-2">
                <Globe size={10} className="text-stone-800" />
                <span className="text-[8px] uppercase tracking-[0.4em] text-stone-800">International [USD]</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse-subtle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .status-pulse {
            animation: pulse-subtle 2s infinite ease-in-out;
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;