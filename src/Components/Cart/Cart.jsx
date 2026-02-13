import React from 'react';
import { Trash2, ArrowRight, ShoppingBag, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const itemCount = cartItems.length;
  
  // Robust price calculation
  const totalPrice = cartItems.reduce((acc, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
      : item.price;
    return acc + (price || 0);
  }, 0);

  const handleRemoveItem = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
  };

  const handleCheckout = () => {
    if (itemCount === 0) return;
    
    // Simulate a premium processing state
    const confirmAcquisition = window.confirm('Proceed with the acquisition of these archived objects?');
    if (confirmAcquisition) {
      setCartItems([]);
      alert('Transmission successful. Your selection has been archived for delivery.');
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 sm:px-12 lg:px-24 selection:bg-stone-900 selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Editorial Header */}
        <header className="mb-20 border-b border-stone-100 pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-bold">
              Current Manifest
            </h2>
            <h1 className="text-4xl sm:text-5xl font-extralight text-stone-900 tracking-tighter leading-none">
              Your <span className="font-serif italic text-stone-400">Collection.</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold">
              {itemCount.toString().padStart(2, '0')} Objects Queued
            </p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-300 mt-1 italic">VND-ACC-2026</p>
          </div>
        </header>

        {itemCount === 0 ? (
          <div className="py-32 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex justify-center">
              <ShoppingBag size={40} strokeWidth={0.5} className="text-stone-200" />
            </div>
            <div className="space-y-2">
              <p className="text-stone-400 font-light italic text-sm">Your archive is currently devoid of selections.</p>
              <p className="text-[9px] uppercase tracking-[0.4em] text-stone-300">Awaiting your curation</p>
            </div>
            <button 
              onClick={() => navigate('/shop')}
              className="group text-[10px] uppercase tracking-[0.5em] text-stone-900 border-b border-stone-900 pb-2 hover:text-stone-400 hover:border-stone-400 transition-all duration-500"
            >
              Return to Gallery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* List of Objects */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex justify-between text-[8px] uppercase tracking-[0.4em] text-stone-300 mb-6 font-bold px-2">
                <span>Object Details</span>
                <span>Valuation</span>
              </div>
              <ul className="divide-y divide-stone-50 border-t border-stone-50">
                {cartItems.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="py-8 group flex justify-between items-start gap-4">
                    <div className="flex gap-6 items-start">
                      {/* Technical Thumbnail */}
                      <div className="w-20 h-24 bg-stone-50 overflow-hidden flex-shrink-0">
                        <img 
                          src={item.image || item.imageURL} 
                          alt={item.name} 
                          className="w-full h-full object-contain p-2 mix-blend-multiply opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0" 
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-[11px] uppercase tracking-[0.2em] text-stone-900 font-bold group-hover:text-stone-500 transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-[9px] text-stone-400 uppercase tracking-widest font-light">
                          REF: {item.id ? item.id.slice(0, 8).toUpperCase() : '00X-TEMP'}
                        </p>
                        <button 
                          onClick={() => handleRemoveItem(index)}
                          className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-stone-300 hover:text-red-800 transition-colors pt-4"
                        >
                          <Trash2 size={10} /> Discard Item
                        </button>
                      </div>
                    </div>
                    
                    <span className="text-xs font-light text-stone-900 tracking-tight">
                      {typeof item.price === 'number' ? `₦${item.price.toLocaleString()}` : item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Acquisition Summary Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-stone-50 p-8 lg:p-12 space-y-10 sticky top-32">
                <div className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.5em] text-stone-900 font-bold border-b border-stone-200 pb-4">
                    Summary of Acquisition
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                      <span className="text-stone-400">Subtotal</span>
                      <span className="text-stone-900 font-medium">₦{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                      <span className="text-stone-400">Archival Logistics</span>
                      <span className="text-stone-900 font-medium italic">Calculated at Step II</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-200">
                  <div className="flex justify-between items-baseline mb-8">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-stone-900 font-bold">Total Valuation</span>
                    <span className="text-2xl font-extralight text-stone-900 tracking-tighter">
                      ₦{totalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-stone-100 p-4 mb-8">
                    <div className="flex gap-3 items-start">
                      <Package size={14} className="text-stone-400 mt-0.5" strokeWidth={1} />
                      <p className="text-[9px] text-stone-500 uppercase tracking-widest leading-relaxed">
                        Authorized Vendo Archive shipments include certificates of authenticity and technical specs.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="group w-full bg-stone-950 text-white py-6 flex items-center justify-center gap-4 hover:bg-stone-800 transition-all duration-700 shadow-xl shadow-stone-100"
                  >
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Initiate Acquisition</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                  
                  <div className="mt-8 text-center">
                    <p className="text-[8px] uppercase tracking-[0.3em] text-stone-300">
                      SECURE 256-BIT ENCRYPTED TRANSMISSION
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;