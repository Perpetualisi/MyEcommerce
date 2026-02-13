import React, { useState } from 'react';
import { auth } from '../../Firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; 
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate(); 

  const placeholderImg = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop";

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
      setError("Authentication failed. Access denied."); 
    }
  };

  return (
    <section className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden">
      
      {/* Form Side (Left) */}
      <div className="flex-1 flex items-center justify-center px-8 sm:px-16 lg:px-24 py-20 bg-white">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <header className="mb-12">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-400 mb-4 font-medium">Gateway</h2>
            <h1 className="text-3xl sm:text-4xl font-light text-stone-900 tracking-tight">
              Access your <span className="italic text-stone-400 font-normal">Archive.</span>
            </h1>
          </header>

          {error && (
            <div className="mb-8 p-4 bg-stone-50 border-l-2 border-stone-900">
              <p className="text-[9px] uppercase tracking-widest text-stone-600 font-medium">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-10" autoComplete="off">
            {/* Identity Input */}
            <div className="relative border-b border-stone-100 pb-2 group focus-within:border-stone-900 transition-all duration-500">
              <label className="text-[9px] uppercase tracking-[0.4em] text-stone-400 block mb-2 group-focus-within:text-stone-900 transition-colors">
                Identity
              </label>
              <input
                type="email"
                placeholder="EMAIL@DOMAIN.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[13px] uppercase tracking-[0.1em] text-stone-900 outline-none placeholder:text-stone-200"
                required
              />
            </div>

            {/* Security Input */}
            <div className="relative border-b border-stone-100 pb-2 group focus-within:border-stone-900 transition-all duration-500">
              <label className="text-[9px] uppercase tracking-[0.4em] text-stone-400 block mb-2 group-focus-within:text-stone-900 transition-colors">
                Security
              </label>
              <input
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-[13px] tracking-[0.3em] text-stone-900 outline-none placeholder:text-stone-200 pr-10"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-3 text-stone-300 hover:text-stone-900 transition-colors z-20"
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full group flex items-center justify-between px-10 py-5 bg-stone-950 text-white text-[10px] uppercase tracking-[0.4em] hover:bg-stone-800 disabled:bg-stone-100 disabled:text-stone-400 transition-all duration-700"
            >
              {loading ? (
                <span className="flex items-center gap-3 italic lowercase tracking-normal">
                  Authenticating <Loader2 size={14} className="animate-spin" />
                </span>
              ) : (
                <>
                  Enter Archive
                  <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-500" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-20 pt-8 border-t border-stone-50 flex justify-between items-center">
            <Link to="/signup" className="text-[9px] uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors underline underline-offset-4 decoration-stone-100 hover:decoration-stone-900">
              New Membership
            </Link>
            <span className="text-[9px] uppercase tracking-widest text-stone-300 font-medium">
              EST. MMXXVI
            </span>
          </footer>
        </div>
      </div>

      {/* Visual Side (Right) - Editorial Image */}
      <div className="hidden md:flex md:w-1/2 bg-stone-50 items-center justify-center border-l border-stone-100 p-12 lg:p-24">
        <div className="relative w-full h-full max-w-sm aspect-[3/4] group">
          <div className="absolute inset-0 border border-stone-200 -m-4 group-hover:m-0 transition-all duration-1000" />
          <img 
            src={placeholderImg} 
            alt="Authentication Visual" 
            className="w-full h-full object-cover grayscale contrast-[1.1] brightness-[1.05]"
          />
          <div className="absolute top-6 right-6 text-white mix-blend-difference">
            <p className="text-[8px] uppercase tracking-[0.5em] opacity-70">Secured Access</p>
          </div>
        </div>
      </div>

      <style>
        {`
          input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
            -webkit-text-fill-color: #1c1917 !important;
          }
          input::-webkit-credentials-auto-fill-button {
            visibility: hidden !important;
            display: none !important;
          }
        `}
      </style>
    </section>
  );
};

export default Login;