import React from 'react';
import './Style/Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <div className="sidebar-item">
                <button className="sidebar-btn">Dashboard</button>
            </div>
            <div className="sidebar-item">
                <button className="sidebar-btn">Courses</button>
            </div>
        </div>
    );
};

export default Sidebar;
