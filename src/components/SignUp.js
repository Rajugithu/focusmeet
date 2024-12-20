import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './Style/Form.css';
import Navbar from './Navbar';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.username) formErrors.username = 'Name is required';
    if (!formData.email) formErrors.email = 'Email is required';
    if (!formData.password) formErrors.password = 'Password is required';
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/SignUp', formData);
      setSuccess('User registered successfully!');
      setFormData({ username: '', email: '', password: '' });
      setErrors({});
    } catch (error) {
      setErrors({ server: 'Failed to register user. Please try again.' });
    }
  };

  const handleGoogleLogin = async (response) => {
    console.log('Google Login Response:', response);
  
    // Ensure the Google Sign-In response contains the credential
    if (!response || !response.credential) {
      console.error('Google credential is missing');
      setErrors({ server: 'Google login failed. Please try again.' });
      return;
    }
  
    try {
      // Decode the Google JWT token to extract user details
      const decoded = jwtDecode(response.credential);
      console.log('Decoded Google JWT:', decoded);
  
      // Prepare the user data payload to send to the backend
      const googleUserData = {
        username: decoded.name, // Extracted from Google JWT
        email: decoded.email,   // Extracted from Google JWT
        password: decoded.sub,  // Using the unique Google user ID as the "password"
      };
  
      // API request to backend for sign-up or login
      const backendResponse = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/SignUp`, 
        googleUserData
      );
  
      // Handle backend response
      console.log('Backend Response:', backendResponse.data);
      if (backendResponse.data.success) {
        // If sign-up or login is successful
        setSuccess('Google Sign-Up successful! Welcome to FocusMeet.');
        setErrors({});
      } else {
        // If backend returns an error
        setErrors({ server: backendResponse.data.message || 'Failed to register Google user. Please try again.' });
      }
    } catch (error) {
      // Handle errors during API request or decoding
      console.error('Google login error:', error.response?.data || error.message);
      setErrors({ server: 'Failed to authenticate with Google. Please try again.' });
    }
  };

  return (
    <div className="signup-container">
      <div className="info-section">
        <h2>Welcome to FocusMeet</h2>
        <p>
          Experience seamless task management with our innovative platform. Sign up today
          and enjoy the benefits of productivity and efficiency.
        </p>
      </div>
      <div className="form-section">
        <h2>Sign Up</h2>
        {success && <p className="success">{success}</p>}
        {errors.server && <p className="error">{errors.server}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Name:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="error">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <button type="submit" className="signUp-btn">Sign Up</button>

          {/* Google login */}
          <div className="google-signup">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log('Google login failed')}
            />
          </div>

          {/* Already have an account */}
          <div className="already-account">
            <p>
              Already have an account?{' '}
              <a href="/login" className="login-link">Log in</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
