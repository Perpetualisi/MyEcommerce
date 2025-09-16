import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";   // ✅ Import Link
import "./Hero.css";

const images = [
  "/banner11.jpg",
  "/banner122.jpg",
  "/banner2.jpg",
  "/banner3.jpg",
  "/banner5.jpg",
  // "/banner6.jpg",
  "/banner66.jpg",
  "/banner77.jpg",
];

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-banner">
      {/* Background Images */}
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          className={`hero-image ${index === currentImage ? "active" : ""}`}
          alt={`Hero Banner ${index + 1}`}
        />
      ))}

      {/* Overlay */}
      <div className="overlay"></div>

      {/* Content */}
      <div className="hero-content">
        <h1>Discover Modern Experiences</h1>
        <p>Explore the best of creativity, technology, and design in one place.</p>
        <Link to="/offers">
          <button className="hero-btn">Get Started</button>
        </Link>
      </div>

      {/* Indicators */}
      <div className="indicators">
        {images.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === currentImage ? "active" : ""}`}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Hero;
