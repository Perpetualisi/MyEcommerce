import React, { useEffect } from 'react';
import { Trash2, ArrowRight, ShoppingBag, Package, Plus, Minus, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const itemCount = cartItems.length;

  // Sync to LocalStorage whenever items change
  useEffect(() => {
    localStorage.setItem('archive_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Robust price calculation supporting both NGN and USD patterns
  const totalPrice = cartItems.reduce((acc, item) => {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^0-9.]/g, '')) 
      : item.price;
    // Assume quantity of 1 if not specified
    const qty = item.quantity || 1;
    return acc + ((price || 0) * qty);
  }, 0);

  const updateQuantity = (index, delta) => {
    const updatedCart = [...cartItems];
    const newQty = (updatedCart[index].quantity || 1) + delta;
    
    if (newQty > 0) {
      updatedCart[index].quantity = newQty;
      setCartItems(updatedCart);
    }
  };

  const handleRemoveItem = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
  };

  const handleCheckout = () => {
    if (itemCount === 0) return;
    const confirmAcquisition = window.confirm('Proceed with the acquisition of these archived objects?');
    if (confirmAcquisition) {
      setCartItems([]);
      localStorage.removeItem('archive_cart');
      alert('Transmission successful. Your selection has been archived for processing.');
      navigate('/shop');
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-6 sm:px-12 lg:px-24 selection:bg-stone-900 selection:text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Editorial Header */}
        <header className="mb-20 border-b border-stone-100 pb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 font-bold">
              Current Manifest / Global Registry
            </h2>
            <h1 className="text-4xl sm:text-5xl font-extralight text-stone-900 tracking-tighter leading-none">
              Your <span className="font-serif italic text-stone-400">Collection.</span>
            </h1>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold">
              {itemCount.toString().padStart(2, '0')} Objects Queued
            </p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-stone-300 mt-1 italic font-bold">NY-ARCHIVE-V.26</p>
          </div>
        </header>

        {itemCount === 0 ? (
          <div className="py-32 text-center space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex justify-center">
              <ShoppingBag size={40} strokeWidth={0.5} className="text-stone-200" />
            </div>
            <div className="space-y-2">
              <p className="text-stone-400 font-light italic text-sm">Your archive is currently devoid of selections.</p>
              <p className="text-[9px] uppercase tracking-[0.4em] text-stone-300">Awaiting curation</p>
            </div>
            <button 
              onClick={() => navigate('/shop')}
              className="group text-[10px] uppercase tracking-[0.5em] text-stone-900 border-b border-stone-900 pb-2 hover:text-stone-400 hover:border-stone-400 transition-all duration-500 font-bold"
            >
              Return to Gallery
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            
            {/* List of Objects */}
            <div className="lg:col-span-7 space-y-2">
              <div className="flex justify-between text-[8px] uppercase tracking-[0.4em] text-stone-300 mb-6 font-bold px-2 border-b border-stone-50 pb-4">
                <span>Registry Details</span>
                <span>Valuation</span>
              </div>
              <ul className="divide-y divide-stone-50">
                {cartItems.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="py-8 group flex justify-between items-start gap-4 transition-all duration-500 hover:bg-stone-50/30 px-2">
                    <div className="flex gap-6 items-start">
                      <div className="w-24 h-28 bg-[#fafaf9] overflow-hidden flex-shrink-0 border border-stone-50 relative">
                        <img 
                          src={item.image || item.imageUrl || item.imageURL} 
                          alt={item.name} 
                          className="w-full h-full object-contain p-2 mix-blend-multiply transition-all duration-700 group-hover:scale-110" 
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-[11px] uppercase tracking-[0.2em] text-stone-900 font-bold">
                            {item.name}
                          </h3>
                          <p className="text-[8px] text-stone-400 uppercase tracking-widest font-mono mt-1">
                            REF: {item.id ? String(item.id).toUpperCase() : 'ENTRY-00X'}
                          </p>
                        </div>

                        {/* Quantity Controller */}
                        <div className="flex items-center border border-stone-100 w-fit bg-white">
                          <button onClick={() => updateQuantity(index, -1)} className="p-2 hover:bg-stone-50 transition-colors">
                            <Minus size={10} />
                          </button>
                          <span className="text-[10px] px-4 font-mono">{item.quantity || 1}</span>
                          <button onClick={() => updateQuantity(index, 1)} className="p-2 hover:bg-stone-50 transition-colors">
                            <Plus size={10} />
                          </button>
                        </div>

                        <button 
                          onClick={() => handleRemoveItem(index)}
                          className="flex items-center gap-2 text-[8px] uppercase tracking-widest text-stone-300 hover:text-red-900 transition-colors font-bold"
                        >
                          <Trash2 size={10} /> Remove Entry
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-xs font-black text-stone-900 tracking-tight">
                        ${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Acquisition Summary Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-stone-50 p-8 lg:p-12 space-y-10 sticky top-32 border border-stone-100">
                <div className="space-y-6">
                  <h4 className="text-[10px] uppercase tracking-[0.5em] text-stone-900 font-bold border-b border-stone-200 pb-4">
                    Registry Logistics
                  </h4>
                  
                  {/* Promo Section */}
                  <div className="space-y-2">
                    <label className="text-[8px] uppercase tracking-widest text-stone-400 font-bold">Authorization Code</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="ENTER CODE"
                        className="flex-1 bg-white border border-stone-200 px-4 py-2 text-[10px] uppercase tracking-widest outline-none focus:border-stone-900 transition-colors placeholder:text-stone-200"
                      />
                      <button className="px-4 py-2 bg-stone-900 text-white text-[8px] uppercase tracking-widest font-bold">Apply</button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                      <span className="text-stone-400 font-medium">Subtotal</span>
                      <span className="text-stone-900 font-bold">${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
                      <span className="text-stone-400 font-medium">Archival Shipping</span>
                      <span className="text-stone-500 italic">Calculated at Step II</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-stone-200">
                  <div className="flex justify-between items-baseline mb-10">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-stone-900 font-bold">Est. Total</span>
                    <span className="text-3xl font-black text-stone-900 tracking-tighter">
                      ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="group w-full bg-stone-950 text-white py-6 flex items-center justify-center gap-4 hover:bg-stone-800 transition-all duration-700 shadow-2xl shadow-stone-200 mb-6"
                  >
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Initiate Acquisition</span>
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </button>

                  <div className="flex items-center gap-3 justify-center text-stone-400">
                    <ShieldCheck size={14} strokeWidth={1} />
                    <p className="text-[8px] uppercase tracking-widest font-bold">Verified Secured Transmission</p>
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