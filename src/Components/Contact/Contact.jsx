import React, { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle2, Globe, Clock3, Terminal, ShieldCheck } from 'lucide-react';

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
    
    // Simulate Encrypted Transmission Handshake
    setTimeout(() => {
      setIsSent(true);
      setIsSubmitting(false);
      setFormData({ name: '', email: '', category: 'General', message: '' });
      setTimeout(() => setIsSent(false), 8000);
    }, 2400);
  };

  return (
    <section className="min-h-screen bg-[#080705] text-[#e8e4dd] flex flex-col lg:flex-row selection:bg-[#e8e4dd] selection:text-[#080705] font-sans">
      
      {/* ── LEFT COLUMN: ARCHIVAL CONTEXT ── */}
      <div className="lg:w-5/12 bg-[#0c0a09] p-8 sm:p-16 lg:p-24 flex flex-col justify-between border-r border-stone-900 relative overflow-hidden">
        {/* Decorative Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        
        <div className="space-y-16 animate-in fade-in slide-in-from-left-8 duration-1000 z-10">
          <header className="space-y-6">
            <div className="flex items-center gap-4">
              <Terminal size={14} className="text-stone-700" />
              <h2 className="text-[10px] uppercase tracking-[0.6em] text-stone-500 font-black">
                COMMS_ARCHIVE // US-EST
              </h2>
            </div>
            <h1 className="text-5xl sm:text-7xl font-extralight text-white tracking-tighter leading-[1.0] transition-all">
              Initiate <br />
              <span className="font-serif italic text-stone-500">Correspondence.</span>
            </h1>
          </header>

          <div className="space-y-10 max-w-sm">
            <p className="text-stone-500 text-sm leading-relaxed font-light tracking-wide italic font-serif">
              "Every transmission is a permanent record in our domestic registry."
            </p>
            
            <p className="text-stone-600 text-[11px] uppercase tracking-[0.2em] leading-relaxed">
              Our New York hub processes inquiries regarding technical specifications, archive sourcing, and logistical routing for global fulfillment.
            </p>
            
            <div className="space-y-6 pt-6 border-t border-stone-900">
              <div className="flex items-center gap-4 group">
                <Globe size={14} className="text-stone-800 group-hover:text-white transition-colors" />
                <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold">Global Relay Active</span>
              </div>
              <div className="flex items-center gap-4 group">
                <Clock3 size={14} className="text-stone-800 group-hover:text-white transition-colors" />
                <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold">EST Protocol: 0900—1800</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 lg:mt-0 opacity-30">
          <p className="text-[8px] font-mono uppercase tracking-[0.5em]">VENDO_SYSTEM_v2.0.26 // ENCRYPTED</p>
        </div>
      </div>

      {/* ── RIGHT COLUMN: TRANSMISSION TERMINAL ── */}
      <div className="lg:w-7/12 p-8 sm:p-16 lg:p-24 flex items-center justify-center bg-[#080705]">
        <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {isSent ? (
            <div className="text-center py-24 space-y-8 animate-in zoom-in-95 duration-700 border border-stone-900 bg-[#0c0a09]/50 p-12">
              <div className="relative inline-block">
                <CheckCircle2 size={56} strokeWidth={1} className="text-white" />
                <div className="absolute inset-0 blur-xl bg-white/10 animate-pulse" />
              </div>
              <div className="space-y-3">
                <h3 className="text-[12px] uppercase tracking-[0.6em] font-black text-white">Transmission Successful</h3>
                <p className="text-[10px] text-stone-500 font-mono tracking-widest uppercase">Packet ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p className="text-[10px] text-stone-600 uppercase tracking-widest leading-relaxed mt-4 max-w-xs mx-auto">
                  Your inquiry has been indexed in the New York Registry. Expect a manual response.
                </p>
              </div>
              <button 
                onClick={() => setIsSent(false)}
                className="text-[9px] uppercase tracking-[0.4em] text-stone-500 hover:text-white transition-all pt-12 font-black border-b border-stone-900 hover:border-white pb-2"
              >
                New Correspondence
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Identity */}
                <div className="relative border-b border-stone-800 pb-4 group focus-within:border-white transition-all duration-700">
                  <label className="text-[9px] uppercase tracking-[0.5em] text-stone-600 block mb-4 font-black">Identity</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="REQUIRED"
                    className="w-full bg-transparent text-[11px] font-mono tracking-[0.2em] text-white outline-none placeholder:text-stone-900 uppercase"
                    required
                  />
                </div>
                {/* Mail */}
                <div className="relative border-b border-stone-800 pb-4 group focus-within:border-white transition-all duration-700">
                  <label className="text-[9px] uppercase tracking-[0.5em] text-stone-600 block mb-4 font-black">Electronic Mail</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="ARCHIVE@RELAY.IO"
                    className="w-full bg-transparent text-[11px] font-mono tracking-[0.2em] text-white outline-none placeholder:text-stone-900 uppercase"
                    required
                  />
                </div>
              </div>

              {/* Department Selector */}
              <div className="space-y-6">
                <label className="text-[9px] uppercase tracking-[0.5em] text-stone-600 block font-black">Departmental Routing</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                      className={`px-6 py-4 text-[9px] uppercase tracking-[0.3em] border transition-all duration-500 font-bold flex items-center justify-between ${
                        formData.category === cat 
                        ? 'bg-white border-white text-black' 
                        : 'border-stone-900 text-stone-600 hover:border-stone-700'
                      }`}
                    >
                      {cat}
                      {formData.category === cat && <ShieldCheck size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="relative border-b border-stone-800 pb-4 group focus-within:border-white transition-all duration-700">
                <label className="text-[9px] uppercase tracking-[0.5em] text-stone-600 block mb-4 font-black">Inquiry Payload</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="PROVIDE SUFFICIENT DATA..."
                  className="w-full bg-transparent text-[12px] tracking-[0.1em] text-white outline-none placeholder:text-stone-900 min-h-[150px] resize-none leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group w-full flex items-center justify-between px-12 py-8 bg-white text-black text-[10px] uppercase tracking-[0.6em] font-black hover:bg-stone-200 disabled:bg-stone-900 disabled:text-stone-700 transition-all duration-1000 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-6 font-mono lowercase italic tracking-normal">
                    syncing_packets... <Loader2 size={14} className="animate-spin text-black" />
                  </span>
                ) : (
                  <>
                    Transmit Packet
                    <ArrowRight size={14} className="group-hover:translate-x-3 transition-transform duration-700" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Metadata */}
          <div className="mt-24 grid grid-cols-2 gap-12 text-[8px] font-mono uppercase tracking-[0.4em] text-stone-700 border-t border-stone-900 pt-10">
              <div className="space-y-2">
                <p className="text-stone-500 font-black mb-4">Registry HQ // 01</p>
                <p>401 Broadway, Suite 22</p>
                <p>SoHo, New York — 10013</p>
              </div>
              <div className="text-right space-y-2">
                <p className="text-stone-500 font-black mb-4">Digital Archives</p>
                <p className="hover:text-white cursor-crosshair transition-colors">Instagram.Index</p>
                <p className="hover:text-white cursor-crosshair transition-colors">Pinterest.Archive</p>
              </div>
          </div>
        </div>
      </div>

      <style>
        {`
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #080705 inset !important;
            -webkit-text-fill-color: #e8e4dd !important;
          }
        `}
      </style>
    </section>
  );
};

export default Contact;