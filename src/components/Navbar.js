import React from 'react';
import { Link } from 'react-router-dom';
import './Style/Navbar.css';

const Navbar = ({ isLoggedIn }) => {
    return (
        <nav className='navbar'>
            <div className='logo'>
                <h1>FocusMeet</h1>
            </div>
            <ul className='navLinks'>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/contact">Feed Back</Link></li>
            </ul>

            <div className='auth-buttons'>
                {/* Conditionally render the profile button if logged in */}
                {isLoggedIn ? (
                    <div className="profile-circle">
                        <Link to="/profile" className="profile-btn">
                            {/* Add an image inside the profile circle */}
                            <img 
                                src="https://via.placeholder.com/40" 
                                alt="Profile"
                            />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Only show login and signup buttons if not logged in */}
                        <Link to="/signup" className="signup-btn">Sign Up</Link>
                        <Link to="/login" className="login-btn">Login</Link>
                    </>
                )}
            </div>
            
        </nav>
    );
};

export default Navbar;
