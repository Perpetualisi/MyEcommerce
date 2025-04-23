import React from 'react';
import './categories.css'; 
import { Link } from 'react-router-dom'; 

const Categories = () => {
  const categories = [
    { id: 1, name: 'Electronics', image: '/Electronics.jpg' },
    { id: 2, name: 'Fashion', image: '/fashion.jpg' },
    { id: 3, name: 'Groceries', image: '/Groceries.jpg' },
    { id: 4, name: 'Furnitures', image: '/furnitures.jpg' },
  ];

  return (
    <section className="categories">
      <h2>Shop by Categories</h2>
      <div className="category-grid">
        {categories.map((category) => (
          <div key={category.id} className="category-card">
            <img src={category.image} alt={category.name} />
            <h3>{category.name}</h3>
            <Link to={`/shop#${category.name.toLowerCase()}`} className="btn">
              Shop Now
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
