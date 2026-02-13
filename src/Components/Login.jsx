import React, { useState } from 'react';
import { auth } from '../../Firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; 
import { Loader2, Eye, EyeOff, ArrowRight, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate(); 

  // Replaced with a more "Studio/Concept" oriented visual
  const LOGIN_IMAGE_CDN = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1200&auto=format&fit=crop";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true); 

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false); 
      navigate('/'); 
    } catch (error) {
      setLoading(false); 
      // Specific error mapping for premium UX
      const errorMap = {
        'auth/user-not-found': 'Identity not recognized in our archive.',
        'auth/wrong-password': 'Security key mismatch. Access denied.',
        'auth/too-many-requests': 'Security lockout: Too many attempts. Try later.',
      };
      setError(errorMap[error.code] || "Authentication failed. Verify credentials."); 
    }
  };

  return (
    <section className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden selection:bg-stone-900 selection:text-white">
      
      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center px-8 sm:px-16 lg:px-24 py-20 bg-white">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-1000">
          
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={12} className="text-stone-900" strokeWidth={1.5} />
              <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-400 font-medium">Gateway</h2>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extralight text-stone-900 tracking-tighter leading-tight">
              Access your <br />
              <span className="font-serif italic text-stone-400">Archive.</span>
            </h1>
          </header>

          {error && (
            <div className="mb-8 p-5 bg-stone-50 border-l border-stone-900 animate-in fade-in slide-in-from-left-2 duration-500">
              <p className="text-[9px] uppercase tracking-widest text-stone-600 font-bold leading-relaxed">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-12" autoComplete="off">
            {/* Identity Field */}
            <div className="relative border-b border-stone-100 pb-2 group focus-within:border-stone-900 transition-all duration-700">
              <label className="text-[9px] uppercase tracking-[0.4em] text-stone-400 block mb-3 group-focus-within:text-stone-900 transition-colors">
                Identity (Email)
              </label>
              <input
                type="email"
                placeholder="USER@ARCHIVE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[12px] uppercase tracking-[0.15em] text-stone-900 outline-none placeholder:text-stone-100"
                required
              />
            </div>

            {/* Security Field */}
            <div className="relative border-b border-stone-100 pb-2 group focus-within:border-stone-900 transition-all duration-700">
              <div className="flex justify-between items-center mb-3">
                <label className="text-[9px] uppercase tracking-[0.4em] text-stone-400 group-focus-within:text-stone-900 transition-colors">
                  Security Key
                </label>
                <button type="button" className="text-[8px] uppercase tracking-widest text-stone-300 hover:text-stone-900 transition-colors">
                  Forgot Key?
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-[12px] tracking-[0.4em] text-stone-900 outline-none placeholder:text-stone-100 pr-10"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-stone-300 hover:text-stone-900 transition-colors p-1"
              >
                {showPassword ? <EyeOff size={14} strokeWidth={1.5} /> : <Eye size={14} strokeWidth={1.5} />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full group relative overflow-hidden flex items-center justify-between px-10 py-6 bg-stone-950 text-white text-[10px] uppercase tracking-[0.4em] hover:bg-stone-800 disabled:bg-stone-50 disabled:text-stone-300 transition-all duration-700 shadow-2xl shadow-stone-200"
            >
              {loading ? (
                <span className="flex items-center gap-3 lowercase italic tracking-normal opacity-70">
                  authenticating <Loader2 size={14} className="animate-spin" />
                </span>
              ) : (
                <>
                  <span className="relative z-10">Enter Archive</span>
                  <ArrowRight size={14} strokeWidth={1.5} className="relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-24 pt-10 border-t border-stone-50 flex justify-between items-center">
            <Link to="/signup" className="text-[9px] uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-all underline underline-offset-8 decoration-stone-100 hover:decoration-stone-900">
              New Membership
            </Link>
            <span className="text-[9px] uppercase tracking-[0.5em] text-stone-200 select-none">
              EST. MMXXVI
            </span>
          </footer>
        </div>
      </div>

      {/* Visual Side */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 bg-[#fafaf9] items-center justify-center border-l border-stone-100 p-12 lg:p-32">
        <div className="relative w-full h-full group">
          {/* Animated Border Frame */}
          <div className="absolute inset-0 border border-stone-200 -m-6 group-hover:m-0 transition-all duration-[1.5s] ease-out" />
          
          <div className="relative w-full h-full overflow-hidden bg-stone-200 aspect-[3/4]">
            <img 
              src={LOGIN_IMAGE_CDN} 
              alt="Archive Vault" 
              className="w-full h-full object-cover grayscale opacity-90 transition-all duration-[3s] group-hover:scale-110 group-hover:grayscale-0"
            />
            {/* Minimalist Overlay Label */}
            <div className="absolute top-8 left-8">
              <p className="text-[8px] uppercase tracking-[0.8em] text-white mix-blend-difference vertical-text">RESTRICTED</p>
            </div>
          </div>
          
          <div className="absolute -bottom-12 -left-12 max-w-[180px] hidden lg:block">
            <p className="text-[8px] leading-relaxed text-stone-400 uppercase tracking-widest font-light">
              Authorized access only. Every session is logged within the VENDO digital ledger.
            </p>
          </div>
        </div>
      </div>

      <style>
        {`
          .vertical-text {
             writing-mode: vertical-rl;
          }
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
            -webkit-text-fill-color: #1c1917 !important;
          }
          input::-ms-reveal,
          input::-ms-clear {
            display: none;
          }
        `}
      </style>
    </section>
  );
};

export default Login;