import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      setFormStatus('Inquiry transmitted successfully.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
      
      // Clear status after 5 seconds
      setTimeout(() => setFormStatus(''), 5000);
    }, 1500);
  };

  return (
    <section className="min-h-screen bg-white flex flex-col items-center justify-center px-8 py-32">
      
      {/* Custom Styles for Input Autofill and Focus */}
      <style>
        {`
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
            -webkit-text-fill-color: #1c1917 !important;
          }
          .custom-focus:focus-within label {
            transform: translateY(-4px);
            color: #1c1917;
          }
        `}
      </style>

      <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <header className="mb-16">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-400 mb-4 font-medium">
            Contact Archive
          </h2>
          <h1 className="text-3xl sm:text-4xl font-light text-stone-900 tracking-tight leading-tight">
            Have a question? <br />
            <span className="italic text-stone-400 font-normal text-2xl sm:text-3xl">Send us a message.</span>
          </h1>
        </header>

        {formStatus && (
          <div className="mb-10 p-5 bg-stone-50 border border-stone-100">
            <p className="text-[10px] uppercase tracking-widest text-stone-600 font-medium">
              {formStatus}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Name Input */}
          <div className="custom-focus relative border-b border-stone-100 pb-2 transition-all duration-500 focus-within:border-stone-900">
            <label className="text-[9px] uppercase tracking-[0.4em] text-stone-400 block mb-3 transition-all duration-500">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="YOUR IDENTITY"
              className="w-full bg-transparent text-sm tracking-[0.1em] text-stone-900 outline-none placeholder:text-stone-200"
              required
            />
          </div>

          {/* Email Input */}
          <div className="custom-focus relative border-b border-stone-100 pb-2 transition-all duration-500 focus-within:border-stone-900">
            <label className="text-[9px] uppercase tracking-[0.4em] text-stone-400 block mb-3 transition-all duration-500">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="EMAIL@DOMAIN.COM"
              className="w-full bg-transparent text-sm tracking-[0.1em] text-stone-900 outline-none placeholder:text-stone-200"
              required
            />
          </div>

          {/* Message Input */}
          <div className="custom-focus relative border-b border-stone-100 pb-2 transition-all duration-500 focus-within:border-stone-900">
            <label className="text-[9px] uppercase tracking-[0.4em] text-stone-400 block mb-3 transition-all duration-500">
              Your Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="HOW CAN WE ASSIST YOU?"
              className="w-full bg-transparent text-sm tracking-[0.1em] text-stone-900 outline-none placeholder:text-stone-200 min-h-[100px] resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group w-full flex items-center justify-between px-10 py-5 bg-stone-950 text-white text-[10px] uppercase tracking-[0.4em] hover:bg-stone-800 disabled:bg-stone-100 disabled:text-stone-400 transition-all duration-700"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                <Loader2 size={14} className="animate-spin" /> Transmitting...
              </span>
            ) : (
              <>
                Send Message
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-500" />
              </>
            )}
          </button>
        </form>

        <footer className="mt-20 pt-10 border-t border-stone-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">General Inquiries</p>
            <p className="text-[10px] uppercase tracking-widest text-stone-900 font-medium">support@vendoarchive.com</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Response Time</p>
            <p className="text-[10px] uppercase tracking-widest text-stone-900 font-medium">24 — 48 Hours</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Contact;