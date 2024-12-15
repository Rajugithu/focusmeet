import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Style/LandingPage.css';
import HeroImage from '../assets/eLearn.jpg';

function LandingPage() {
  const navigate = useNavigate();
  const [moveUp, setMoveUp] = useState(false);

  const handleTransition = (path) => {
    setMoveUp(true); // Trigger animation
    setTimeout(() => {
      navigate(path);
    }, 800);
  };

  return (
    <div className="landing-container">
      {/* Navbar Component */}
      <Navbar />

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Enhancing Online Learning</h1>
          <p>Real-time Attention Detection for Better Student Engagement</p>

          {/* Bullet Points */}
          <ul className="hero-details">
            <li>AI-powered system that tracks student attention in real-time</li>
            <li>Monitors facial expressions, eye movements, and blink rates</li>
            <li>Provides immediate feedback to instructors about student engagement</li>
            <li>Helps maintain an interactive and focused learning environment</li>
            <li>Improves learning outcomes through personalized engagement monitoring</li>
          </ul>

          <button className="btn" onClick={() => handleTransition('/about')}>
            Get Started
          </button>
        </div>

        {/* Image Section */}
        <div className="hero-image">
          <img src={HeroImage} alt="Enhancing Online Learning" />
        </div>
      </div>

      <div className="project">
        {/* Project Overview */}
        <div className="project-overview">
          <h2>What Our System Does</h2>

          {/* Section 1 */}
          <div className="section">
            <p>
              Enhances online education by monitoring students' attention in real-time.<br />
              Tracks facial expressions, eye movements, blink rates, and screen interactions.<br />
              Alerts instructors upon detecting a drop in engagement for timely intervention.<br />
              Provides insights on attention span, peak engagement, and participation trends.<br />
              Generates reports to refine teaching methods and design engaging lesson plans<br />
              Seamlessly integrates with popular online learning platforms and video conferencing tools.<br />
              Bridges the gap between online and in-person education.<br />
              Creates a productive virtual learning environment for students and educators.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="how-it-works">
          <h2>How It Works</h2>
          <ul>
            <li>AI-powered attention detection based on facial expressions</li>
            <li>Real-time alerts for disengaged students</li>
            <li>Performance tracking for instructors</li>
          </ul>
        </div>
      </div>

      <div className="team-section">
        <h2>Meet the Team</h2>
        <div className="team-members">
          <div className="team-member">
            <h3>Mujahid Raja</h3>
            <p>mujahidr319@gmail.com</p>
          </div>
          <div className="team-member">
            <h3>Hamza Saud</h3>
            <p>hamzasaoud3@gmail.com</p>
          </div>
          <div className="team-member">
            <h3>Hassan Akmal</h3>
            <p>hassanakmal420@gmail.com</p>
          </div>
        </div>

        {/* Contact Us Button */}
        <div className="contact-us">
          <button className="btn" onClick={() => handleTransition('/contact')}>
            Contact Us
          </button>
        </div>
      </div>


      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h5>Contact Us</h5>
            <ul>
              <li><a href="#">Questions? Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">About Us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Resources</h5>
            <ul>
              <li><a href="#">Courses</a></li>
              <li><a href="#">Certifications</a></li>
              <li><a href="#">Learning Paths</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Terms of Use</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Preferences</a></li>
            </ul>
          </div>
        </div>
        <hr />
        <div className="footer-bottom">
          <p>© 2024 Your Online Learning Platform. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
