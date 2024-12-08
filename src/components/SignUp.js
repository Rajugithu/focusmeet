import React, { useState } from 'react';
import axios from 'axios';
import './Style/Form.css';  // Assuming you have a CSS file for styling

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validate the form before submission
  const validateForm = () => {
    let formErrors = {};
    if (!formData.username) formErrors.username = 'Username is required'; // Fixed typo
    if (!formData.email) formErrors.email = 'Email is required';
    if (!formData.password) formErrors.password = 'Password is required';
    return formErrors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    console.log("Signup button clicked"); // Debugging: Check if the button works
    e.preventDefault();  // Prevents page refresh

    // Validate the form
    const validationErrors = validateForm();
    
    // If validation fails, set error state and stop
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Make a POST request to the signup API endpoint
      const response = await axios.post('http://localhost:5000/api/SignUp', formData);
      
      console.log(response.data); // Log the response from the server

      // If successful, set the success message and clear the form
      setSuccess('User registered successfully!');
      setFormData({ username: '', email: '', password: '' }); // Clear the form
      setErrors({});  // Clear any previous errors
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with an error
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something else went wrong in setting up the request
        console.error('Error', error.message);
      }

      // Optionally, set an error message to show in the UI
      setErrors({ server: 'Failed to register user. Please try again.' });
    }
  };

  return (
    <div className="signup-form">
      <h2>Sign Up</h2>
      {success && <p className="success">{success}</p>}
      {errors.server && <p className="error">{errors.server}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label> {/* Updated to match id */}
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="error">{errors.username}</p>} {/* Fixed error reference */}
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

        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
