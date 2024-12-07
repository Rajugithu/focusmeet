import React, { useState } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';
import './Style/Login.css';
import Navbar from './Navbar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            if (response.status === 200) {
                // Store token in localStorage or sessionStorage
                // localStorage.setItem('authToken', response.data.token);
                setIsLoggedIn(true); // Set login state to true
            }
        } catch (err) {
            if (err.response) {
                setError(err.response?.data?.message || 'Invalid email or password');
            } else if (err.request) {
                setError('Network error. Please try again later.');
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    if (isLoggedIn) {
        return <Navigate to="/home" />;
    }

    return (
        <div className="login-container">
            <div className="info-section">
                <h2>Welcome to FocusMeet</h2>
                <p>Sign in to manage your tasks and stay productive. Experience seamless workflow management on our platform.</p>
            </div>
            <div className="form-section">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <a href="/signup" className="signup-link">Don't have an account? Sign up</a>
            </div>
        </div>
    );
};

export default Login;
