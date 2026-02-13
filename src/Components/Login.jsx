import React, { useState } from 'react';
import { auth } from '../../Firebase'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom'; 
import { Loader2, Eye, EyeOff, ChevronRight } from 'lucide-react';

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
      setError("Authentication failed. Please verify credentials."); 
    }
  };

  return (
    <section className="min-h-screen bg-stone-950 flex flex-col md:flex-row overflow-hidden">
      
      {/* CSS Override: Kills the green browser UI and forced highlights */}
      <style>
        {`
          input:-webkit-autofill,
          input:-webkit-autofill:hover, 
          input:-webkit-autofill:focus,
          input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0px 1000px #0c0a09 inset !important;
            -webkit-text-fill-color: #d6d3d1 !important;
            caret-color: #d6d3d1 !important;
            transition: background-color 5000s ease-in-out 0s;
          }

          input::-webkit-credentials-auto-fill-button {
            visibility: hidden !important;
            display: none !important;
            pointer-events: none !important;
          }
        `}
      </style>

      {/* Visual Side (Left) */}
      <div className="hidden md:flex md:w-1/2 bg-[#050505] items-center justify-center p-12 lg:p-24 border-r border-stone-900">
        <div className="w-full max-w-sm aspect-[3/4] overflow-hidden grayscale opacity-20 relative border border-stone-900/50">
           <img 
            src={placeholderImg} 
            alt="Authentication Visual" 
            className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="flex-1 flex items-center justify-center px-8 sm:px-16 lg:px-24 py-20">
        <div className="w-full max-w-xl">
          <header className="mb-12">
            <h2 className="text-[10px] uppercase tracking-[0.5em] text-stone-600 mb-4 font-medium">Gateway</h2>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extralight text-stone-300 tracking-tight whitespace-nowrap">
              Enter the <span className="italic text-stone-500 font-normal">Login.</span>
            </h1>
          </header>

          {error && (
            <div className="mb-8 p-4 border border-stone-900 bg-stone-900/30">
              <p className="text-[9px] uppercase tracking-widest text-stone-500">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-12" autoComplete="off">
            {/* Identity Input */}
            <div className="relative border-b border-stone-900 pb-2 group focus-within:border-stone-700 transition-colors">
              <label className="text-[9px] uppercase tracking-[0.4em] text-stone-600 block mb-2 group-focus-within:text-stone-400 transition-colors">
                Identity
              </label>
              <input
                type="email"
                placeholder="EMAIL@ARCHIVE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-[13px] uppercase tracking-[0.2em] text-stone-200 outline-none placeholder:text-stone-800"
                required
              />
            </div>

            {/* Security Input */}
            <div className="relative border-b border-stone-900 pb-2 group focus-within:border-stone-700 transition-colors">
              <label className="text-[9px] uppercase tracking-[0.4em] text-stone-600 block mb-2 group-focus-within:text-stone-400 transition-colors">
                Security
              </label>
              <input
                type={showPassword ? 'text' : 'password'} 
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
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full group flex items-center justify-between px-10 py-5 bg-stone-900 text-stone-400 text-[10px] uppercase tracking-[0.4em] hover:bg-stone-800 hover:text-stone-100 transition-all duration-700 border border-stone-800/50"
            >
              {loading ? (
                <span className="flex items-center gap-2 italic lowercase tracking-normal text-stone-500">Authenticating...</span>
              ) : (
                <>
                  Authenticate
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
              {loading && <Loader2 size={14} className="animate-spin" />}
            </button>
          </form>

          <footer className="mt-16 pt-8 border-t border-stone-900 flex justify-between items-center">
            <Link to="/signup" className="text-[9px] uppercase tracking-widest text-stone-600 hover:text-stone-300 transition-colors">
              Create Account
            </Link>
            <span className="text-[9px] uppercase tracking-widest text-stone-800 font-medium">
              EST. MMXXVI
            </span>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default Login;