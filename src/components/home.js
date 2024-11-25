import React from 'react';
import './Style/home.css'; // Import home.css for styling
import Sidebar from './sidebar'; // Import Sidebar for the Home page layout

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-layout">
                {/* Left Section: Sidebar */}
                <Sidebar /> {/* Render the Sidebar */}
            </div>
        </div>
    );
};

export default Home;
