import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container home-container">
      <div className="home-header">
        <h1>Proctoring Home</h1>
        <p>Welcome to the Exam Platform</p>
      </div>
      
      <div className="home-actions">
        <div className="home-card">
          <div className="home-card-icon">🖥️</div>
          <h2>Register</h2>
          <p>Create a new account</p>
          <Link to="/register" className="btn">Register</Link>
        </div>
        
        <div className="home-card">
          <div className="home-card-icon">🔐</div>
          <h2>Login</h2>
          <p>Access your account</p>
          <Link to="/login" className="btn">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;