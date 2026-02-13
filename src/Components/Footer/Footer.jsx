import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, ArrowUp, Globe } from 'lucide-react';

const Footer = () => {
  const EST_DATE = "MMXXVI";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-32 pb-12 px-8 sm:px-16 lg:px-24 border-t border-stone-900 selection:bg-stone-100 selection:text-stone-950">
      <div className="max-w-[1440px] mx-auto">
        
        {/* Top Section: Brand & Action */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-32">
          <div className="space-y-8 max-w-sm">
            <h3 className="text-[10px] uppercase tracking-[0.8em] text-stone-600 font-bold">Identity</h3>
            <div className="space-y-6">
              <h4 className="text-4xl font-extralight tracking-tighter text-white">
                Vendo <span className="italic text-stone-500 font-serif">Archive.</span>
              </h4>
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 leading-relaxed font-light">
                Curating the intersection of digital utility, sartorial excellence, and sculptural living.
              </p>
            </div>
          </div>

          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-4 text-[9px] uppercase tracking-[0.5em] text-stone-500 hover:text-white transition-all duration-700"
          >
            <span className="pb-1 border-b border-stone-800 group-hover:border-white">Back to surface</span>
            <div className="w-10 h-10 rounded-full border border-stone-900 flex items-center justify-center group-hover:bg-white group-hover:text-stone-950 transition-all duration-700">
              <ArrowUp size={14} strokeWidth={1.5} />
            </div>
          </button>
        </div>

        {/* Middle Section: Sitemap */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-8 mb-32">
          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.5em] text-stone-700 font-bold">Volume I</h4>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-white transition-colors">Catalog</Link></li>
              <li><Link to="/shop#new" className="text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-white transition-colors">Latest Arrivals</Link></li>
              <li><Link to="/shop#featured" className="text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-white transition-colors">Featured Objects</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.5em] text-stone-700 font-bold">Volume II</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-white transition-colors">Our Ethos</Link></li>
              <li><Link to="/contact" className="text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-white transition-colors">Inquiries</Link></li>
              <li><Link to="/careers" className="text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-white transition-colors">Registry</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.5em] text-stone-700 font-bold">Network</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-white transition-colors flex items-center gap-2 italic">Instagram</a></li>
              <li><a href="#" className="text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-white transition-colors flex items-center gap-2 italic">Twitter / X</a></li>
              <li><a href="#" className="text-[9px] uppercase tracking-[0.3em] text-stone-500 hover:text-white transition-colors flex items-center gap-2 italic">Pinterest</a></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] uppercase tracking-[0.5em] text-stone-700 font-bold">Locale</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-stone-500">
                <Globe size={12} strokeWidth={1} />
                <span className="text-[9px] uppercase tracking-[0.3em]">Lagos Hub [6.4550° N]</span>
              </div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-stone-700 leading-loose">
                Authorized digital vendor <br />
                for the 2026 Archive protocol.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal & Fine Print */}
        <div className="pt-12 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-6 order-2 md:order-1">
            <p className="text-[8px] uppercase tracking-[0.5em] text-stone-800 font-medium">
              © {EST_DATE} VENDO ARCHIVE
            </p>
            <div className="h-1 w-1 bg-stone-900 rounded-full" />
            <span className="text-[8px] uppercase tracking-[0.5em] text-stone-800">Designed for 2026</span>
          </div>

          <div className="flex gap-10 order-1 md:order-2">
            {['Privacy Manifest', 'Terms of Access', 'Cookies'].map((item) => (
              <span key={item} className="text-[8px] uppercase tracking-[0.4em] text-stone-700 hover:text-stone-400 cursor-pointer transition-colors">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;