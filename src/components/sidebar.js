import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './Style/Sidebar.css';

const Sidebar = () => {
    const navigate = useNavigate(); 

    return (
        <div className="sidebar">
            <div className="sidebar-item">
                <button 
                    className="sidebar-btn" 
                    onClick={() => navigate('/home')} 
                >
                    Dashboard
                </button>
            </div>
            <div className="sidebar-item">
                <button 
                    className="sidebar-btn" 
                    onClick={() => navigate('/home')} 
                >
                    Courses
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
