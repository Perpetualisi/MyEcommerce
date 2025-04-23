import React, { useEffect, useState } from 'react';
import './Hero.css';

const images = [
  '/banner11.jpg',
  '/banner2.jpg',
  '/banner3.jpg',
  '/banner4.jpg',
  '/banner5.jpg',
  '/banner6.jpg',
  '/banner7.jpg',
  '/banner8.jpg',
  '/banner9.jpg',
  '/banner10.jpg',

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
    <section 
      className="hero-banner"
      style={{ backgroundImage: `url(${images[currentImage]})` }}
    >
      
    </section>
  );
};

export default Hero;
