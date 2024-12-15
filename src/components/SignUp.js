import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';  
import './Style/Form.css';
import Navbar from './Navbar';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    userType: 'Student', // Default to Student
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
      setFormData({ username: '', email: '', password: '', userType: 'Student' });
      setErrors({});
    } catch (error) {
      setErrors({ server: 'Failed to register user. Please try again.' });
    }
  };

  const handleGoogleLogin = (response) => {
    console.log('Google login successful!', response);
  };

  return (
    <div className="signup-container">
      <div className="info-section">
        <h2>Welcome to FocusMeet</h2>
        <p>
          Sign up today and enjoy the benefits of productivity and efficiency.
        </p>
      </div>
      <div className="form-section">
        <h2>Sign Up</h2>
        {success && <p className="success">{success}</p>}
        {errors.server && <p className="error">{errors.server}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userType">Sign up as:</label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
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

          <div className="google-signup">
            <GoogleLogin 
              onSuccess={handleGoogleLogin} 
              onError={() => console.log('Google login failed')}
            />
          </div>
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
