import React from 'react';
import { Link } from 'react-router-dom';  
import './specialOffers.css';

const SpecialOffers = () => {
  const offers = [
    { id: 1, title: '50% Off on All Electronics', description: 'Limited time offer. Grab your favorite electronics now!' },
    { id: 2, title: 'Free Shipping on Orders Over $50', description: 'Enjoy free shipping on orders above $50. Shop now!' },
    { id: 3, title: 'BOGO on Fashion', description: 'Buy 1, get 1 free on select fashion items.' },
  ];

  return (
    <section className="special-offers">
      <h2>Special Offers & Promotions</h2>
      <div className="offers-grid">
        {offers.map((offer) => (
          <div key={offer.id} className="offer-card">
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
            <Link to="/shop" className="btn">Shop Now</Link> 
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialOffers;
