import React, { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle2, Globe, Clock3 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', category: 'General', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const categories = ['General', 'Technical Support', 'Archive Acquisitions', 'Pantry Logistics'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate Encrypted Transmission
    setTimeout(() => {
      setIsSent(true);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', category: 'General', message: '' });
      
      setTimeout(() => setIsSent(false), 8000);
    }, 2000);
  };

  return (
    <section className="min-h-screen bg-white flex flex-col lg:flex-row selection:bg-stone-900 selection:text-white">
      
      {/* Left Column: Contextual Info */}
      <div className="lg:w-5/12 bg-stone-50 p-8 sm:p-16 lg:p-24 flex flex-col justify-between border-r border-stone-100">
        <div className="space-y-12 animate-in fade-in slide-in-from-left-6 duration-1000">
          <header>
            <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-400 mb-6 font-bold">
              Communication Archive / US
            </h2>
            <h1 className="text-4xl sm:text-6xl font-extralight text-stone-900 tracking-tighter leading-[1.1]">
              Initiate a <br />
              <span className="font-serif italic text-stone-400">Correspondence.</span>
            </h1>
          </header>

          <div className="space-y-8 max-w-sm">
            <p className="text-stone-500 text-sm leading-relaxed font-light tracking-wide">
              Whether you are inquiring about a specific gadget, tracking an artisan pantry shipment, or seeking interior consultation, our US-based team is available for global assistance.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 group">
                <Globe size={14} className="text-stone-300 group-hover:text-stone-900 transition-colors" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold">Domestic & Global Support</span>
              </div>
              <div className="flex items-center gap-4 group">
                <Clock3 size={14} className="text-stone-300 group-hover:text-stone-900 transition-colors" />
                {/* Updated to US Timezone */}
                <span className="text-[10px] uppercase tracking-[0.3em] text-stone-900 font-bold">EST Response Protocol</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 lg:mt-0">
          <p className="text-[8px] uppercase tracking-[0.5em] text-stone-300">EST. MMXXVI — VENDO CURATION USA</p>
        </div>
      </div>

      {/* Right Column: Interaction Form */}
      <div className="lg:w-7/12 p-8 sm:p-16 lg:p-24 flex items-center justify-center">
        <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {isSent ? (
            <div className="text-center py-20 space-y-6 animate-in zoom-in-95 duration-700">
              <CheckCircle2 size={48} strokeWidth={1} className="mx-auto text-stone-900" />
              <div className="space-y-2">
                <h3 className="text-[11px] uppercase tracking-[0.5em] font-bold text-stone-900">Transmission Successful</h3>
                <p className="text-xs text-stone-500 font-light tracking-widest uppercase">Your inquiry has been archived in our New York hub.</p>
              </div>
              <button 
                onClick={() => setIsSent(false)}
                className="text-[9px] uppercase tracking-[0.4em] text-stone-400 hover:text-stone-900 transition-colors pt-8 font-bold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Name */}
                <div className="relative border-b border-stone-100 pb-2 group focus-within:border-stone-900 transition-all duration-500">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-stone-400 block mb-3 font-bold">Full Identity</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="NAME SURNAME"
                    className="w-full bg-transparent text-[12px] tracking-[0.1em] text-stone-900 outline-none placeholder:text-stone-100"
                    required
                  />
                </div>
                {/* Email */}
                <div className="relative border-b border-stone-100 pb-2 group focus-within:border-stone-900 transition-all duration-500">
                  <label className="text-[9px] uppercase tracking-[0.4em] text-stone-400 block mb-3 font-bold">Electronic Mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="EMAIL@ARCHIVE.COM"
                    className="w-full bg-transparent text-[12px] tracking-[0.1em] text-stone-900 outline-none placeholder:text-stone-100"
                    required
                  />
                </div>
              </div>

              {/* Subject Selector */}
              <div className="space-y-4">
                <label className="text-[9px] uppercase tracking-[0.4em] text-stone-400 block font-bold">Archive Department</label>
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                      className={`px-4 py-2 text-[9px] uppercase tracking-widest border transition-all duration-500 font-bold ${
                        formData.category === cat 
                        ? 'bg-stone-900 border-stone-900 text-white' 
                        : 'border-stone-100 text-stone-400 hover:border-stone-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="relative border-b border-stone-100 pb-2 group focus-within:border-stone-900 transition-all duration-500">
                <label className="text-[9px] uppercase tracking-[0.4em] text-stone-400 block mb-3 font-bold">Inquiry Details</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="PROVIDE SUFFICIENT DETAIL FOR OUR US TEAM"
                  className="w-full bg-transparent text-[12px] tracking-[0.1em] text-stone-900 outline-none placeholder:text-stone-100 min-h-[120px] resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full flex items-center justify-between px-10 py-6 bg-stone-950 text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-stone-800 disabled:bg-stone-100 disabled:text-stone-400 transition-all duration-700 shadow-2xl shadow-stone-200"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-4 italic lowercase tracking-normal">
                    Syncing with US Hub <Loader2 size={14} className="animate-spin" />
                  </span>
                ) : (
                  <>
                    Transmit Correspondence
                    <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-500" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-20 grid grid-cols-2 gap-8 text-[9px] uppercase tracking-[0.3em] text-stone-400">
              <div>
                <p className="mb-2 text-stone-900 font-bold underline underline-offset-4">New York HQ</p>
                <p>401 Broadway, Suite 22</p>
                <p>SoHo, NY — 10013</p>
              </div>
              <div className="text-right">
                <p className="mb-2 text-stone-900 font-bold">Social Archive</p>
                <p className="hover:text-stone-900 cursor-pointer">Instagram</p>
                <p className="hover:text-stone-900 cursor-pointer">Pinterest</p>
              </div>
          </div>
        </div>
      </div>

      <style>
        {`
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
            -webkit-text-fill-color: #1c1917 !important;
          }
        `}
      </style>
    </section>
  );
};

export default Contact;