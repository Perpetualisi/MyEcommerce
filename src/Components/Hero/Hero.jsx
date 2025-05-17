import React, { useEffect, useState } from 'react';
import './Hero.css';

const images = [
  '/banner1.jpg',
  '/banner2.jpg',
  '/banner3.jpg',
  '/banner4.jpg',
  '/banner5.jpg',
  '/banner6.jpg',
  '/banner7.jpg',
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-banner">
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          className={`hero-image ${index === currentImage ? 'active' : ''}`}
          alt=""
        />
      ))}
    </section>
  );
};

export default Hero;
