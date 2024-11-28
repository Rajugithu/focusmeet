import React from 'react';
import './Style/home.css'; // Import home.css for styling
import Sidebar from './sidebar'; // Import Sidebar for the Home page layout
import Navbar from './Navbar'; // Import Navbar component

const Home = () => {
    const isLoggedIn = true; // Simulate login state (true = logged in, false = not logged in)

    return (
        <div className="home-container">
            {/* Render Navbar and pass the isLoggedIn prop */}
            <Navbar isLoggedIn={isLoggedIn} />
            <div className="home-layout">
                <h1 className="welcome-text">Welcome to the Home Page</h1>
                <button className="create-meeting-btn">Create a Meeting</button>
                {/* Left Section: Sidebar */}
                <Sidebar />
            </div>
        </div>
    );
};

export default Home;
