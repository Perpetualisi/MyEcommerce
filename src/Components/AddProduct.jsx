import React, { useState, useEffect } from 'react';
import { firestore } from '../../Firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { Loader2, Plus, ArrowLeft, Check, AlertCircle, Globe } from 'lucide-react';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Digital Archive');
  const [tag, setTag] = useState('');
  const [currency, setCurrency] = useState('USD');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | success | error

  const categories = ['Digital Archive', 'Sartorial', 'Pantry Essentials', 'Living Space'];

  // Auto-reset success message
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => setStatus('idle'), 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');

    try {
      await addDoc(collection(firestore, 'products'), {
        name,
        price: Number(price),
        currency,
        description,
        imageUrl,
        category,
        categorySlug: category.toLowerCase().replace(/\s+/g, '-'),
        tag: tag || 'Standard Collection',
        createdAt: new Date(),
      });
      
      setStatus('success');
      // Reset Form
      setName(''); setPrice(''); setDescription(''); setImageUrl(''); setTag('');
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-stone-950 px-8 sm:px-16 lg:px-24 py-20 font-light">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-16 flex justify-between items-end border-b border-stone-900 pb-8">
        <div>
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-500 mb-4">Inventory</h2>
          <h1 className="text-3xl font-extralight text-stone-300 tracking-tight">Add New <span className="italic text-stone-500">Entry</span></h1>
        </div>
        <button className="text-[9px] uppercase tracking-widest text-stone-600 flex items-center gap-2 hover:text-stone-400 transition-colors">
          <ArrowLeft size={12} /> Back to Archive
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Form Layer */}
        <form onSubmit={handleSubmit} className="space-y-10">
          
          <div className="grid grid-cols-2 gap-8">
            <div className="group relative">
              <label className="text-[9px] uppercase tracking-widest text-stone-600 mb-2 block">Product Identity</label>
              <input
                type="text"
                placeholder="NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-stone-900 py-3 text-xs uppercase tracking-widest text-stone-300 outline-none focus:border-stone-600 transition-colors placeholder:text-stone-800"
                required
              />
            </div>

            <div className="group relative">
              <label className="text-[9px] uppercase tracking-widest text-stone-600 mb-2 block">Archive Tag</label>
              <input
                type="text"
                placeholder="E.G. LIMITED EDITION"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full bg-transparent border-b border-stone-900 py-3 text-xs uppercase tracking-widest text-stone-300 outline-none focus:border-stone-600 transition-colors placeholder:text-stone-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="group relative">
              <label className="text-[9px] uppercase tracking-widest text-stone-600 mb-2 block">Valuation</label>
              <div className="flex items-center gap-4 border-b border-stone-900 focus-within:border-stone-600 transition-colors">
                <select 
                  value={currency} 
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-transparent text-[10px] text-stone-500 outline-none cursor-pointer"
                >
                  <option value="USD" className="bg-stone-950">USD</option>
                  <option value="NGN" className="bg-stone-950">NGN</option>
                </select>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-transparent py-3 text-xs uppercase tracking-widest text-stone-300 outline-none placeholder:text-stone-800"
                  required
                />
              </div>
            </div>

            <div className="group relative">
              <label className="text-[9px] uppercase tracking-widest text-stone-600 mb-2 block">Department</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent border-b border-stone-900 py-3 text-[10px] uppercase tracking-widest text-stone-300 outline-none focus:border-stone-600 transition-colors appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-stone-950 text-stone-300">{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="group relative">
            <label className="text-[9px] uppercase tracking-widest text-stone-600 mb-2 block">Narrative</label>
            <textarea
              placeholder="TECHNICAL SPECIFICATIONS & STORY"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-transparent border-b border-stone-900 py-3 text-xs tracking-wide text-stone-400 outline-none focus:border-stone-600 transition-colors placeholder:text-stone-800 resize-none"
              required
            />
          </div>

          <div className="group relative">
            <label className="text-[9px] uppercase tracking-widest text-stone-600 mb-2 block">Visual Source (URL)</label>
            <input
              type="text"
              placeholder="HTTPS://IMAGE-SOURCE.COM/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-transparent border-b border-stone-900 py-3 text-[10px] uppercase tracking-widest text-stone-500 outline-none focus:border-stone-600 transition-colors placeholder:text-stone-800"
              required
            />
          </div>

          <div className="flex items-center gap-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-4 px-12 py-4 text-[10px] uppercase tracking-[0.3em] transition-all duration-500 border ${
                status === 'success' 
                ? 'bg-green-900/20 border-green-800 text-green-400' 
                : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800 hover:text-stone-200'
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={14} />
              ) : status === 'success' ? (
                <Check size={14} />
              ) : (
                <Plus size={14} />
              )}
              {status === 'success' ? 'Added to Registry' : 'Commit to Archive'}
            </button>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-500 text-[9px] uppercase tracking-widest">
                <AlertCircle size={14} /> System Error
              </div>
            )}
          </div>
        </form>

        {/* Preview Area */}
        <div className="space-y-6 sticky top-20">
          <label className="text-[9px] uppercase tracking-widest text-stone-600 block">System Preview</label>
          <div className="relative aspect-[3/4] bg-stone-900/10 border border-stone-900 flex flex-col justify-between overflow-hidden p-10 group">
            
            <div className="flex justify-between items-start z-10">
              <span className="text-[10px] text-stone-500 tracking-tighter font-serif italic">{category}</span>
              {tag && <span className="text-[8px] border border-stone-800 px-2 py-1 text-stone-600 uppercase tracking-widest">{tag}</span>}
            </div>

            <div className="absolute inset-0 flex items-center justify-center p-12">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-1000"
                  onError={() => setImageUrl('')}
                />
              ) : (
                <div className="text-stone-900 text-[8px] uppercase tracking-[1em]">Empty Space</div>
              )}
            </div>

            <div className="z-10 flex justify-between items-end border-t border-stone-900/50 pt-4">
               <h3 className="text-xs text-stone-300 uppercase tracking-widest max-w-[150px]">{name || 'ENTRY_TITLE'}</h3>
               <p className="text-xs text-stone-500 font-mono">{price ? `${currency} ${price}` : '0.00'}</p>
            </div>
          </div>
          <p className="text-[8px] text-stone-700 uppercase tracking-widest text-center italic">Live render of registry card</p>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;