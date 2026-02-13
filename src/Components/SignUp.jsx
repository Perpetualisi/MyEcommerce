import React, { useState } from 'react';
import { auth } from '../../Firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; 
import { Loader2, Eye, EyeOff, ChevronRight } from 'lucide-react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate(); 

  const ARCHIVE_IMAGE_CDN = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); 

    if (password.length < 6) {
      setError("Security requirement: Minimum 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
      navigate('/login'); 
    } catch (err) {
      setLoading(false);
      const errorMap = {
        'auth/email-already-in-use': 'This identity is already archived. Try logging in.',
        'auth/invalid-email': 'The email format is unrecognized.',
        'auth/weak-password': 'The security key is too weak.',
        'auth/network-request-failed': 'Connection lost. Check your signal.',
      };
      setError(errorMap[err.code] || "Registration failed. Please verify your details."); 
    }
  };

  return (
    <section className="min-h-screen bg-stone-950 flex flex-col md:flex-row overflow-hidden">
      
      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center px-8 sm:px-16 lg:px-24 py-20 order-2 md:order-1">
        <div className="w-full max-w-xl">
          <header className="mb-12">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-600 mb-4 font-medium">Archive Membership</h2>
            {/* Title on a straight line */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-stone-300 tracking-tight whitespace-nowrap">
              Create your <span className="italic text-stone-500 font-normal">Identity.</span>
            </h1>
          </header>

          {error && (
            <div className="mb-8 p-4 border border-stone-900 bg-red-900/10 border-l-red-900 border-l-2">
              <p className="text-[9px] uppercase tracking-widest text-red-500/80 font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-12" autoComplete="off">
            {/* Email Input */}
            <div className="relative border-b border-stone-900 pb-2 group focus-within:border-stone-700 transition-colors">
              <label className="text-[9px] uppercase tracking-[0.4em] text-stone-600 block mb-2 group-focus-within:text-stone-400 transition-colors">
                Email Address
              </label>
              <input
                type="email"
                autoComplete="off"
                placeholder="USER@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[13px] uppercase tracking-[0.2em] text-stone-200 outline-none placeholder:text-stone-800"
                required
              />
            </div>

            {/* Security Key Input - Green Eye Fixed */}
            <div className="relative border-b border-stone-900 pb-2 group focus-within:border-stone-700 transition-colors">
              <label className="text-[9px] uppercase tracking-[0.4em] text-stone-600 block mb-2 group-focus-within:text-stone-400 transition-colors">
                Security Key
              </label>
              <input
                type={showPassword ? 'text' : 'password'} 
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-[13px] tracking-[0.3em] text-stone-200 outline-none placeholder:text-stone-800 pr-10"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-stone-700 hover:text-stone-400 transition-colors z-20"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full group flex items-center justify-between px-10 py-5 bg-stone-900 text-stone-400 text-[10px] uppercase tracking-[0.4em] hover:bg-stone-800 hover:text-stone-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-700 border border-stone-800/50"
            >
              {loading ? (
                <span className="flex items-center gap-2 italic lowercase tracking-normal text-stone-500">
                  Initializing...
                  <Loader2 size={14} className="animate-spin" />
                </span>
              ) : (
                <>
                  Register
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-16 pt-8 border-t border-stone-900 flex justify-between items-center">
            <Link to="/login" className="text-[9px] uppercase tracking-widest text-stone-600 hover:text-stone-300 transition-colors">
              Existing Member?
            </Link>
            <span className="text-[9px] uppercase tracking-widest text-stone-800 font-medium">
              EST. MMXXVI
            </span>
          </footer>
        </div>
      </div>

      {/* Visual Side */}
      <div className="hidden md:flex md:w-1/2 bg-[#050505] items-center justify-center border-l border-stone-900 order-1 md:order-2">
        <div className="w-full h-full flex items-center justify-center p-12 lg:p-32">
          <div className="w-full max-w-sm aspect-[3/4] overflow-hidden grayscale opacity-20 relative border border-stone-900/50">
             <img 
              src={ARCHIVE_IMAGE_CDN} 
              alt="Membership Visual" 
              className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
          </div>
        </div>
      </div>

      {/* CRITICAL CSS OVERRIDES */}
      <style>
        {`
          /* 1. Kills the browser's forced 'green' eye icon */
          input::-webkit-credentials-auto-fill-button {
            visibility: hidden !important;
            display: none !important;
            pointer-events: none !important;
          }

          /* 2. Forces browser to stay dark even on password suggestions */
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0px 1000px #0c0a09 inset !important;
            -webkit-text-fill-color: #d6d3d1 !important;
          }

          /* 3. General cleanup for Edge and Chrome */
          input::-ms-reveal,
          input::-ms-clear {
            display: none;
          }
        `}
      </style>

    </section>
  );
};

export default SignUp;