import React, { useState } from 'react';
import { auth } from '../../Firebase'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; 
import './AuthForm.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      
      await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
      alert('Sign-up successful!');
      navigate('/login'); 
    } catch (error) {
      setLoading(false);
      setError(error.message); 
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Sign Up</h2>
      {error && <p className="error-message">{error}</p>} 
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'} 
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="show-password">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)} 
          />
          <span>Show Password</span>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Signing Up...' : 'Sign Up'} 
        </button>
      </form>
    </div>
  );
};

export default SignUp;
