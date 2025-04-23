import React from 'react';
import './about.css';

const About = () => {
  return (
    <section className="about">
      <div className="about-content">
        <h2>About Our Store</h2>
        <p>
          Welcome to our eCommerce store, where you'll find the best deals on a wide variety of products. Our mission is to provide our customers with high-quality items at affordable prices, with excellent customer service. Whether you're looking for electronics, fashion, or groceries, we have everything you need right here.
        </p>
        <p>
          Our team is dedicated to offering an outstanding shopping experience. We're always looking for new products to add to our collection, and we’re committed to bringing you the best deals on the market.
        </p>
      </div>
      <div className="about-image">
        <img src="/about.jpg" alt="About Us" />
      </div>
    </section>
  );
};

export default About;
