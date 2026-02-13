import React, { useState } from 'react';
import { ChevronRight, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setFormStatus('Inquiry transmitted successfully.');
      setFormData({ name: '', email: '', message: '' });
    } else {
      setFormStatus('Please complete all authentication fields.');
    }
  };

  return (
    <section className="min-h-screen bg-stone-950 flex flex-col items-center justify-center px-8 py-20 overflow-hidden">
      
      {/* ANTI-BLOCKING STYLE: Removes browser green/blue highlights */}
      <style>
        {`
          input:-webkit-autofill,
          textarea:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px #0c0a09 inset !important;
            -webkit-text-fill-color: #d6d3d1 !important;
            transition: background-color 5000s ease-in-out 0s;
          }
          input, textarea {
            caret-color: #d6d3d1 !important;
          }
        `}
      </style>

      <div className="w-full max-w-xl">
        <header className="mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-600 mb-4 font-medium">Communication</h2>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-stone-300 tracking-tight whitespace-nowrap">
            Send a <span className="italic text-stone-500 font-normal">Message.</span>
          </h1>
        </header>

        {formStatus && (
          <div className="mb-8 p-4 border border-stone-900 bg-stone-900/30">
            <p className="text-[9px] uppercase tracking-widest text-stone-500">{formStatus}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Name Input */}
          <div className="relative border-b border-stone-900 pb-2 group focus-within:border-stone-700 transition-colors">
            <label className="text-[9px] uppercase tracking-[0.4em] text-stone-600 block mb-2 group-focus-within:text-stone-400 transition-colors">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="YOUR NAME"
              className="w-full bg-transparent text-[13px] uppercase tracking-[0.2em] text-stone-200 outline-none placeholder:text-stone-800"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative border-b border-stone-900 pb-2 group focus-within:border-stone-700 transition-colors">
            <label className="text-[9px] uppercase tracking-[0.4em] text-stone-600 block mb-2 group-focus-within:text-stone-400 transition-colors">
              Return Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="USER@EXAMPLE.COM"
              className="w-full bg-transparent text-[13px] uppercase tracking-[0.2em] text-stone-200 outline-none placeholder:text-stone-800"
              required
            />
          </div>

          {/* Message Input */}
          <div className="relative border-b border-stone-900 pb-2 group focus-within:border-stone-700 transition-colors">
            <label className="text-[9px] uppercase tracking-[0.4em] text-stone-600 block mb-2 group-focus-within:text-stone-400 transition-colors">
              The Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="TYPE YOUR INQUIRY..."
              className="w-full bg-transparent text-[13px] uppercase tracking-[0.2em] text-stone-200 outline-none placeholder:text-stone-800 min-h-[120px] resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full group flex items-center justify-between px-10 py-5 bg-stone-900 text-stone-400 text-[10px] uppercase tracking-[0.4em] hover:bg-stone-800 hover:text-stone-100 transition-all duration-700 border border-stone-800/50"
          >
            Transmit Message
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <footer className="mt-16 pt-8 border-t border-stone-900 flex justify-between items-center">
          <span className="text-[9px] uppercase tracking-widest text-stone-600">
            Archive Support
          </span>
          <span className="text-[9px] uppercase tracking-widest text-stone-800 font-medium">
            EST. MMXXVI
          </span>
        </footer>
      </div>
    </section>
  );
};

export default Contact;