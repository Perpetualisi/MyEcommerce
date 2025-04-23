import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      
      
      setIsSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter-content">
        <h2>Join Our Newsletter</h2>
        <p>Subscribe to get the latest updates, exclusive discounts, and more!</p>
        {isSubscribed ? (
          <p className="thank-you-message">Thank you for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
