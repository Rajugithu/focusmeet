import React, { useState, useEffect } from 'react'; 
import Navbar from './Navbar'; 
import Sidebar from './sidebar'; 
import "./Style/Profile.css"; 

const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    
    // State for storing profile information
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        bio: "."
    });

    const [isEditing, setIsEditing] = useState(false); 

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile({
            ...profile,
            [name]: value
        });
    };

    // Toggle edit mode
    const toggleEditMode = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div>
            <Navbar isLoggedIn={isLoggedIn} /> {/* Pass the isLoggedIn state to Navbar */}
            <div className="profile-page">
                <Sidebar /> {/* Render the Sidebar */}
                <div className="profile-content">
                    <h1>Profile Information</h1>
                    
                    {/* Profile Information */}
                    {!isEditing ? (
                        <div className="profile-info">
                            <p><strong>First Name:</strong> {profile.firstName}</p>
                            <p><strong>Last Name:</strong> {profile.lastName}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                            <p><strong>Phone:</strong> {profile.phone}</p>
                            <p><strong>Bio:</strong> {profile.bio}</p>
                            <button className="edit-btn" onClick={toggleEditMode}>
                                Edit Profile
                            </button>
                        </div>
                    ) : (
                        <div className="profile-edit-form">
                            <label>First Name:</label>
                            <input 
                                type="text" 
                                name="firstName" 
                                value={profile.firstName} 
                                onChange={handleInputChange} 
                            />
                            
                            <label>Last Name:</label>
                            <input 
                                type="text" 
                                name="lastName" 
                                value={profile.lastName} 
                                onChange={handleInputChange} 
                            />

                            <label>Email:</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={profile.email} 
                                onChange={handleInputChange} 
                            />

                            <label>Phone:</label>
                            <input 
                                type="tel" 
                                name="phone" 
                                value={profile.phone} 
                                onChange={handleInputChange} 
                            />

                            <label>Bio:</label>
                            <textarea 
                                name="bio" 
                                value={profile.bio} 
                                onChange={handleInputChange} 
                            />

                            <button className="save-btn" onClick={toggleEditMode}>
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
