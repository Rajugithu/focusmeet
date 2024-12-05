import React from 'react';
import './Style/home.css'; // Import home.css for styling
import Sidebar from './sidebar'; // Import Sidebar for the Home page layout
import Navbar from './Navbar'; // Import Navbar component

const Home = () => {
    const isLoggedIn = true;

    return (
        <div className="home-container">
            {/* Render Navbar and pass the isLoggedIn prop */}
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="home-layout">
                {/* Main Content */}
                <div className="main-content">
                    <h1 className="welcome-text">Welcome to the Home Page</h1>
                    <button className="create-meeting-btn">Create a Meeting</button>
                    <div className="course-grid">
                        <div className="course-box">
                            <img src="course-image.jpg" alt="Course" />
                            <h3>Course 1</h3>
                        </div>
                        <div className="course-box">
                            <img src="course-image.jpg" alt="Course" />
                            <h3>Course 2</h3>
                        </div>
                        <div className="course-box">
                            <img src="course-image.jpg" alt="Course" />
                            <h3>Course 3</h3>
                        </div>
                        <div className="course-box">
                            <img src="course-image.jpg" alt="Course" />
                            <h3>Course 4</h3>
                        </div>
                        <div className="course-box">
                            <img src="course-image.jpg" alt="Course" />
                            <h3>Course 5</h3>
                        </div>
                        <div className="course-box">
                            <img src="course-image.jpg" alt="Course" />
                            <h3>Course 6</h3>
                        </div>
                        <div className="course-box">
                            <img src="course-image.jpg" alt="Course" />
                            <h3>Course 7</h3>
                        </div>
                        <div className="course-box">
                            <img src="course-image.jpg" alt="Course" />
                            <h3>Course 8</h3>
                        </div>
                    </div>
                </div>

                {/* Sidebar Component */}
                <div className="sidebar">
                    <Sidebar />
                </div>
            </div>
        </div>
    );
};

export default Home;
