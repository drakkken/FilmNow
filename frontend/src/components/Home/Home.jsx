import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Welcome to Movie Booking</h1>
        <p>Book your favorite movies with ease</p>
        <Link to="/movies" className="cta-button">
          Browse Movies
        </Link>
      </div>
      <div className="features-section">
        <div className="feature">
          <h3>Easy Booking</h3>
          <p>Book your tickets in just a few clicks</p>
        </div>
        <div className="feature">
          <h3>Wide Selection</h3>
          <p>Choose from our extensive movie collection</p>
        </div>
        <div className="feature">
          <h3>Secure Payment</h3>
          <p>Safe and secure payment processing</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 