import React from 'react';

const About = () => {
  return (
    <section className="mt-24 px-8 sm:px-16 lg:px-24 py-24 bg-stone-950 flex flex-wrap items-center justify-between gap-12 lg:gap-24">
      
      {/* Text Content - Focused on dull, muted tones */}
      <div className="flex-1 min-w-[300px] max-w-xl text-left order-2 md:order-1">
        <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-500 mb-8">
          Our Mission
        </h2>
        
        <h3 className="text-3xl sm:text-4xl font-light text-stone-300 mb-8 leading-[1.3] tracking-tight">
          Quality Essentials. <br />
          <span className="italic text-stone-500 font-normal">Unbeatable Value.</span>
        </h3>

        <div className="space-y-8">
          <p className="text-stone-500 text-sm leading-[1.8] font-light tracking-wide">
            Welcome to our eCommerce store, where you'll find the best deals on a wide variety 
            of products. Our mission is to provide our customers with high-quality items at 
            affordable prices, with excellent customer service. Whether you're looking for 
            electronics, fashion, or groceries, we have everything you need right here.
          </p>
          
          <p className="text-stone-500 text-sm leading-[1.8] font-light tracking-wide">
            Our team is dedicated to offering an outstanding shopping experience. We're always 
            looking for new products to add to our collection, and we’re committed to 
            bringing you the best deals on the market.
          </p>
        </div>

        {/* Muted Decorative Element */}
        <div className="mt-12 pt-8 border-t border-stone-900 flex items-center gap-6">
          <span className="text-[9px] uppercase tracking-[0.4em] text-stone-600">
            Electronics
          </span>
          <div className="w-1 h-1 rounded-full bg-stone-800" />
          <span className="text-[9px] uppercase tracking-[0.4em] text-stone-600">
            Fashion
          </span>
          <div className="w-1 h-1 rounded-full bg-stone-800" />
          <span className="text-[9px] uppercase tracking-[0.4em] text-stone-600">
            Groceries
          </span>
        </div>
      </div>

      {/* Image Container - Showing image fully */}
      <div className="flex-1 min-w-[300px] max-w-md lg:max-w-lg order-1 md:order-2">
        <div className="relative p-2 bg-stone-900/20 border border-stone-900/50">
          <img
            src="/about.jpg"
            alt="Store Interior"
            /* w-full h-auto: ensures the image is not stretched 
               grayscale-[40%]: maintains the dull, sophisticated color profile
            */
            className="w-full h-auto object-contain grayscale-[40%] contrast-[1.1] brightness-[0.8] transition-all duration-700 hover:grayscale-0 hover:brightness-100"
          />
        </div>
      </div>
      
    </section>
  );
};

export default About;