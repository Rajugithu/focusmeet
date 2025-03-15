import React from 'react';
import Navbar from './Navbar';
import './Style/about.css';
import Image from '../assets/Home2.jpeg';

const About = () => {
    return (
        <div className="about-container">
            {/* Navbar Component */}
            <Navbar isLoggedIn={false} />

            {/* Main About Section */}
            <div className="about-layout">
                {/* Image Section */}
                <div className="about-left">
                    <img src={Image} alt="Interactive Learning" className="about-image" />
                </div>

                {/* Content Section */}
                <div className="about-right">
                    <h1 className="welcome-text">About Our System</h1>

                    {/* Introduction */}
                    <div className="about-content">
                        <p>
                            Our AI-powered platform is designed to revolutionize online learning by addressing the challenge of student disengagement in virtual classes. Through advanced technology, we aim to empower educators and improve the overall learning experience for students.
                        </p>

                        {/* Problem Statement and Solution */}
                        <h2>Problem and Solution</h2>
                        <p>
                            In online education, one of the most significant challenges is identifying disengaged students. Our system tackles this issue by providing real-time attentiveness detection using cutting-edge facial recognition and eye-tracking algorithms. It not only alerts instructors when attention drops but also generates valuable insights to improve teaching strategies.
                        </p>

                        {/* Mission and Vision */}
                        <h2>Our Mission and Vision</h2>
                        <p>
                            Our mission is to bridge the gap between traditional and online education by fostering an engaging and productive learning environment. We envision a future where technology empowers educators and ensures every student receives the attention they deserve.
                        </p>

                        {/* Privacy and Security */}
                        <h2>Privacy and Security</h2>
                        <p>
                            We prioritize user privacy and data security. Our system only tracks attentiveness metrics without recording or storing sensitive personal data, ensuring compliance with privacy standards and fostering trust among users.
                        </p>

                        {/* Call to Action */}
                        <h2>Get Involved</h2>
                        <p>
                            Whether you're an educator, student, or stakeholder, we'd love to hear from you. Explore our platform, share your feedback, or reach out to learn more about how our system can transform online education.
                        </p>
                        <p className="cta-text">
                            <strong>Join us today</strong> in shaping the future of online education!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
