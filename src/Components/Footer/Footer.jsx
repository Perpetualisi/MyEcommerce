import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  // Using the specific EST. MMXXVI (2026) to match your brand's timeline
  const EST_DATE = "MMXXVI";

  return (
    <footer className="bg-stone-950 text-stone-300 py-20 px-8 border-t border-stone-900">
      {/* Footer Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-8">
        
        {/* Brand Identity */}
        <div className="space-y-6">
          <h3 className="text-[10px] uppercase tracking-[0.5em] text-stone-500 font-medium">Identity</h3>
          <div className="space-y-4">
            <h4 className="text-xl font-extralight tracking-tighter">Vendo <span className="italic text-stone-600">Archive.</span></h4>
            <p className="text-[9px] uppercase tracking-[0.3em] text-stone-700 leading-relaxed max-w-[200px]">
              Curated digital essentials for the modern aesthetic.
            </p>
          </div>
        </div>

        {/* Navigation Index */}
        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.5em] text-stone-600 font-medium">Index</h4>
          <ul className="space-y-3">
            <li><Link to="/shop" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-stone-200 transition-colors duration-500">Shop</Link></li>
            <li><Link to="/about" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-stone-200 transition-colors duration-500">About</Link></li>
            <li><Link to="/contact" className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-stone-200 transition-colors duration-500">Contact</Link></li>
          </ul>
        </div>

        {/* Social Network */}
        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.5em] text-stone-600 font-medium">Network</h4>
          <div className="flex gap-6 text-stone-700">
            <a href="#" className="hover:text-stone-300 transition-colors duration-500">
              <Facebook size={16} strokeWidth={1.5} />
            </a>
            <a href="#" className="hover:text-stone-300 transition-colors duration-500">
              <Twitter size={16} strokeWidth={1.5} />
            </a>
            <a href="#" className="hover:text-stone-300 transition-colors duration-500">
              <Instagram size={16} strokeWidth={1.5} />
            </a>
          </div>
        </div>

        {/* Support Detail */}
        <div className="space-y-6">
          <h4 className="text-[10px] uppercase tracking-[0.5em] text-stone-600 font-medium">Support</h4>
          <div className="space-y-2">
            <p className="text-[9px] uppercase tracking-[0.3em] text-stone-700">
              Inquiry: <a href="mailto:info@vendor.com" className="text-stone-500 hover:text-stone-200 transition-colors underline underline-offset-4 decoration-stone-900">info@vendor.com</a>
            </p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-stone-700">
              Registry: 1.234.567.890
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-24 pt-8 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[8px] uppercase tracking-[0.6em] text-stone-800">
          © {EST_DATE} Vendo Archive. All Rights Reserved.
        </p>
        <div className="flex gap-8">
           <span className="text-[8px] uppercase tracking-[0.6em] text-stone-900">Privacy</span>
           <span className="text-[8px] uppercase tracking-[0.6em] text-stone-900">Terms</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;