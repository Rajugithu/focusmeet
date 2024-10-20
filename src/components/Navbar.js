import React from 'react';
import { Link } from 'react-router-dom';
import './Style/Navbar.css';

const Navbar = () => {
    return (
        <nav className='navbar'>
            <div className='logo'>
                <h1>Welcome to FocusMeet</h1>
            </div>
            <ul className='navLinks'>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>

            <div className='auth-buttons'>
                <Link to="/signup" className="signup-btn">Sign Up</Link>
                <Link to="/login" className="login-btn">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
