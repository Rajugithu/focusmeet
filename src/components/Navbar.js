import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Style/Navbar.css';

const Navbar = ({ isLoggedIn }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu visibility

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen); // Toggle the menu open/close
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h1>FocusMeet</h1>
      </div>

      {/* Hamburger Menu Icon */}
      <div className="hamburger-menu" onClick={handleMenuToggle}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Navigation Links */}
      <ul className={`navLinks ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/feedback">Feed Back</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="profile-circle">
            <Link to="/profile" className="profile-btn">
              <img src="https://via.placeholder.com/40" alt="Profile" />
            </Link>
          </div>
        ) : (
          <>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
