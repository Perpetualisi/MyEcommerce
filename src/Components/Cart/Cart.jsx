import React from 'react';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

const Cart = ({ cartItems, setCartItems }) => {
  // Derived state for the number of objects in the collection
  const itemCount = cartItems.length;
  
  // Calculate total price by cleaning currency strings or using numbers
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

    // 1. Notify the user
    alert('Thank you for your selection. Your order is being processed.');
    
    // 2. Clear the cart (This fulfills your request)
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-28 pb-20 px-6 sm:px-10">
      <div className="max-w-2xl mx-auto">
        
        {/* Minimalist Header */}
        <header className="mb-12 border-b border-stone-200 pb-6 flex justify-between items-end">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.4em] text-stone-400 mb-2">
              Review Selection
            </h2>
            <h1 className="text-3xl font-light text-stone-800 tracking-tight">Your Cart</h1>
          </div>
          <p className="text-xs uppercase tracking-widest text-stone-400">
            {itemCount} {itemCount === 1 ? 'Object' : 'Objects'}
          </p>
        </header>

        {itemCount === 0 ? (
          <div className="py-20 text-center space-y-6 animate-in fade-in duration-700">
            <p className="text-stone-400 font-light italic">Your collection is currently empty.</p>
            <button 
              onClick={() => window.history.back()}
              className="text-[10px] uppercase tracking-widest text-stone-800 border-b border-stone-800 pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors"
            >
              Return to Gallery
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ul className="divide-y divide-stone-100">
              {cartItems.map((item, index) => (
                <li key={`${item.id}-${index}`} className="py-6 flex justify-between items-center group">
                  <div className="flex gap-4 items-center">
                    {/* Matte Thumbnail */}
                    <div className="w-14 h-14 bg-stone-200 rounded-sm overflow-hidden">
                       <img 
                        src={item.image || item.imageURL} 
                        alt={item.name} 
                        className="w-full h-full object-cover grayscale opacity-80" 
                       />
                    </div>
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-stone-800 font-medium">
                        {item.name}
                      </h3>
                      <p className="text-[10px] text-stone-400 uppercase tracking-tighter">
                        {item.category || 'Curated Item'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <span className="text-sm font-light text-stone-600">
                      {typeof item.price === 'number' ? `₦${item.price.toLocaleString()}` : item.price}
                    </span>
                    <button 
                      onClick={() => handleRemoveItem(index)}
                      className="text-stone-300 hover:text-stone-800 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Checkout Summary */}
            <div className="pt-6 border-t border-stone-200 space-y-6">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400">Total Valuation</span>
                <span className="text-xl font-light text-stone-800">
                  ₦{totalPrice.toLocaleString()}
                </span>
              </div>

              <p className="text-[10px] text-stone-400 italic leading-relaxed max-w-xs">
                Logistics and acquisition taxes are finalized during the next phase.
              </p>

              <button
                onClick={handleCheckout}
                className="w-full bg-stone-800 text-stone-100 py-4 flex items-center justify-center gap-3 group hover:bg-stone-900 transition-all duration-500"
              >
                <span className="text-xs uppercase tracking-[0.3em]">Complete Acquisition</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;