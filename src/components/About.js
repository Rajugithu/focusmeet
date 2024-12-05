import React from 'react';
import Navbar from './Navbar'; 
import './Style/about.css';

const About = () => {
    return (
        <div className="about-container">
            <Navbar isLoggedIn={false} /> {/* Pass isLoggedIn as false */}
            
            <div className="about-layout">
                <div className="about-left">
                    <img 
                        src={require('./Style/about1.jpeg')} 
                        alt="Engagement Illustration" 
                        className="about-image" 
                    />
                </div>
                <div className="about-right">
                    <h1 className="welcome-text">About Our System</h1>
                    <div className="about-content">
                        <p>
                            Our AI-powered platform revolutionizes the online learning experience by helping educators monitor and improve student engagement during virtual classes. It addresses one of the most significant challenges in online education: identifying distracted students in real-time. Using state-of-the-art machine learning algorithms and computer vision techniques, the system detects behavioral patterns that indicate disengagement.
                        </p>
                        <h2>Key Features:</h2>
                        <ul>
                            <li>Real-time attentiveness detection</li>
                            <li>Blink rate and facial expression analysis</li>
                            <li>Alerts for disengaged students</li>
                            <li>Customizable reporting for teachers</li>
                        </ul>
                        <h2>How It Works:</h2>
                        <p>
                            Our system captures live video feeds, analyzes facial data using advanced AI models, and notifies instructors and students when students appear distracted or disengaged. This helps create a more interactive and focused virtual classroom environment.
                        </p>

                        <p className="boldText">Sign up now to experience</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
