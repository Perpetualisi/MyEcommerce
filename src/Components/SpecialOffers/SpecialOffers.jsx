import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const SpecialOffers = () => {
  const offers = [
    { id: 1, title: 'Archive Sale', subtitle: 'Electronics', description: 'Curated selection at 50% valuation.' },
    { id: 2, title: 'Complimentary Logistics', subtitle: 'Shipping', description: 'Available on all acquisitions exceeding $50.' },
    { id: 3, title: 'Fashion Pairings', subtitle: 'Collections', description: 'Buy one, receive a secondary piece complimentary.' },
  ];

  return (
    <section className="mt-24 px-6 sm:px-10 lg:px-20 py-20 bg-stone-100/50">
      
      {/* Header - Subtle and Spaced */}
      <div className="mb-16 text-center">
        <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-400 mb-4">
          Current Promotions
        </h2>
        <p className="text-3xl font-light text-stone-800 tracking-tight">
          Limited Opportunities
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex flex-col items-start text-left space-y-4 group"
          >
            {/* Category Tag */}
            <span className="text-[9px] uppercase tracking-widest text-stone-500 border-b border-stone-200 pb-1">
              {offer.subtitle}
            </span>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-xl font-normal text-stone-800 tracking-tight group-hover:text-stone-500 transition-colors">
                {offer.title}
              </h3>
              <p className="text-sm text-stone-500 font-light leading-relaxed">
                {offer.description}
              </p>
            </div>

            {/* Minimalist Link */}
            <Link
              to="/shop"
              className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-800 pt-2 border-b border-transparent hover:border-stone-800 transition-all duration-300"
            >
              Explore Now
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialOffers;