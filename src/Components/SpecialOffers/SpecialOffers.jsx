import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const SpecialOffers = () => {
  const offers = [
    { 
      id: 1, 
      title: 'Digital Archive Sale', 
      subtitle: 'Electronics', 
      description: 'Acquire precision technology at 50% valuation for a limited period.',
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 2, 
      title: 'Artisan Pantry Bundle', 
      subtitle: 'Groceries', 
      description: 'Complimentary cold-pressed oil with any pantry curation over $75.',
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=800&auto=format&fit=crop'
    },
    { 
      id: 3, 
      title: 'Living Space Pairing', 
      subtitle: 'Furniture', 
      description: 'Secondary accent piece complimentary with any sculptural seating.',
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop'
    },
  ];

  return (
    <section id="offers" className="mt-32 px-6 sm:px-16 lg:px-24 py-32 bg-[#fafaf9] border-y border-stone-100">
      
      {/* Header - Editorial Style */}
      <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={12} className="text-stone-400" />
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-semibold">
              Seasonal Opportunities
            </h2>
          </div>
          <p className="text-4xl md:text-5xl font-extralight text-stone-900 tracking-tighter leading-tight">
            Curated <span className="font-serif italic text-stone-400">Exclusives.</span>
          </p>
        </div>
        <p className="text-xs text-stone-400 uppercase tracking-widest max-w-[200px] leading-relaxed md:text-right">
          Intentional value for the discerning collector.
        </p>
      </div>

      <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="group flex flex-col space-y-6"
          >
            {/* Visual Representation */}
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
              <img 
                src={offer.image} 
                alt={offer.title} 
                className="w-full h-full object-cover grayscale transition-all duration-[1.5s] ease-out group-hover:grayscale-0 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-700" />
            </div>

            {/* Content Area */}
            <div className="flex flex-col items-start space-y-4">
              <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400">
                {offer.subtitle}
              </span>

              <div className="space-y-3">
                <h3 className="text-xl font-light text-stone-900 tracking-tight group-hover:translate-x-1 transition-transform duration-500">
                  {offer.title}
                </h3>
                <p className="text-sm text-stone-500 font-light leading-relaxed max-w-xs">
                  {offer.description}
                </p>
              </div>

              {/* Functional CTA */}
              <Link
                to="/shop"
                className="group/link relative flex items-center gap-4 pt-4"
              >
                <span className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold">
                  View Offer
                </span>
                <div className="relative w-8 h-px bg-stone-300 overflow-hidden">
                  <div className="absolute inset-0 bg-stone-900 -translate-x-full group-hover/link:translate-x-0 transition-transform duration-500" />
                </div>
                <ArrowRight size={12} className="text-stone-900 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-500" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Logistics Banner - Minimalist */}
      <div className="mt-32 p-12 border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div>
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-stone-900 font-bold mb-2">Universal Logistics</h4>
          <p className="text-xs text-stone-500 font-light tracking-wide">Complimentary global transit on all acquisitions exceeding $150 valuation.</p>
        </div>
        <Link to="/shipping-policy" className="text-[9px] uppercase tracking-[0.3em] py-3 px-8 border border-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-500">
          Learn More
        </Link>
      </div>

    </section>
  );
};

export default SpecialOffers;