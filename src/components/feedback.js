import React, { useState } from 'react';
import './Style/feedback.css';
import Navbar from './Navbar'; 

const FeedBack = () => {
    const isLoggedIn = true;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
        rating: '',
        feedbackCategory: '',
        subscribe: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        setFormData({
            name: '',
            email: '',
            message: '',
            rating: '',
            feedbackCategory: '',
            subscribe: false
        });
    };

    return (
        <div className="feedback-container">
            {/* Render Navbar and pass the isLoggedIn prop */}
            <Navbar isLoggedIn={isLoggedIn} />
            <h1 className="welcome-text">We Value Your Feedback</h1>
            <form className="feedback-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        placeholder="Enter your name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        placeholder="Enter your email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Feedback:</label>
                    <textarea 
                        id="message" 
                        name="message" 
                        rows="5" 
                        placeholder="Enter your feedback" 
                        value={formData.message} 
                        onChange={handleChange} 
                        required
                    ></textarea>
                </div>

                {/* Rating Section */}
                <div className="Feed-form-group">
                    <label>Rate Your Experience:</label>
                    <div>
                        {[1, 2, 3, 4, 5].map((ratingValue) => (
                            <label key={ratingValue} className="rating-label">
                                <input
                                    type="radio"
                                    name="rating"
                                    value={ratingValue}
                                    checked={formData.rating === String(ratingValue)}
                                    onChange={handleChange}
                                />
                                {ratingValue}
                            </label>
                        ))}
                    </div>
                </div>
                <button type="submit" className="submit-button">Submit Feedback</button>
            </form>
        </div>
    );
};

export default FeedBack;
