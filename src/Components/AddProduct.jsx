import React, { useState } from 'react';
import { firestore } from '../../Firebase'; 
import { collection, addDoc } from 'firebase/firestore';
import { Loader2, Plus, ArrowLeft } from 'lucide-react';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(firestore, 'products'), {
        name,
        price: Number(price), // Storing as a number for better data handling
        description,
        imageUrl,
        createdAt: new Date(),
      });
      alert('Archive Updated Successfully');
      setName(''); setPrice(''); setDescription(''); setImageUrl('');
    } catch (error) {
      console.error('Error:', error);
      alert('Update Failed');
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
            <label className="text-[9px] uppercase tracking-widest text-stone-600 mb-2 block">Valuation</label>
            <input
              type="number"
              placeholder="PRICE (USD/NGN)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent border-b border-stone-900 py-3 text-xs uppercase tracking-widest text-stone-300 outline-none focus:border-stone-600 transition-colors placeholder:text-stone-800"
              required
            />
          </div>

          <div className="group relative">
            <label className="text-[9px] uppercase tracking-widest text-stone-600 mb-2 block">Narrative</label>
            <textarea
              placeholder="DESCRIPTION"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-transparent border-b border-stone-900 py-3 text-xs tracking-wide text-stone-400 outline-none focus:border-stone-600 transition-colors placeholder:text-stone-800 resize-none"
              required
            />
          </div>

          <div className="group relative">
            <label className="text-[9px] uppercase tracking-widest text-stone-600 mb-2 block">Visual Source</label>
            <input
              type="text"
              placeholder="IMAGE URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-transparent border-b border-stone-900 py-3 text-[10px] uppercase tracking-widest text-stone-500 outline-none focus:border-stone-600 transition-colors placeholder:text-stone-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-4 px-12 py-4 bg-stone-900 text-stone-400 text-[10px] uppercase tracking-[0.3em] hover:bg-stone-800 hover:text-stone-200 transition-all duration-500 border border-stone-800"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
            Commit to Archive
          </button>
        </form>

        {/* Preview Area - Ensures image shows fully */}
        <div className="space-y-6">
          <label className="text-[9px] uppercase tracking-widest text-stone-600 block">Visual Preview</label>
          <div className="aspect-square bg-stone-900/20 border border-stone-900 flex items-center justify-center overflow-hidden p-8 group">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-full object-contain grayscale-[30%] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              />
            ) : (
              <div className="text-stone-800 text-[10px] uppercase tracking-[0.4em]">No Visual Selected</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProduct;