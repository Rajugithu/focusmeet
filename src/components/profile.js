import React, { useState, useEffect } from 'react'; // Add useEffect import
import Navbar from './Navbar'; // Import Navbar
import Sidebar from './sidebar'; // Import Sidebar
import "./Style/Profile.css"; // Import Profile.css
import io from 'socket.io-client'; // Import socket.io-client

const Profile = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true); // Set the state to true for logged-in users
    const [socket, setSocket] = useState(null);

    // Establish socket connection when the component mounts
    useEffect(() => {
        const newSocket = io("http://localhost:5001"); // Replace with your signaling server URL
        setSocket(newSocket);
        return () => newSocket.close(); // Cleanup socket connection on unmount
    }, []);

    // Button click handler for creating a meeting
    const handleCreateMeeting = () => {
        if (socket) {
            const roomId = "unique-room-id"; // You can generate a random ID or create one from input
            socket.emit("createRoom", roomId); // Emit event to the server to create a room
            window.location.href = `/live/${roomId}`; // Redirect to the live page with the room ID
        } else {
            alert("Socket connection is not established!");
        }
    };

    return (
        <div>
            <Navbar isLoggedIn={isLoggedIn} /> {/* Pass the isLoggedIn state to Navbar */}
            <div className="profile-page">
                <Sidebar /> {/* Render the Sidebar */}
                <div className="profile-content">
                    <h1>Welcome to your profile!</h1>
                    <p>This is your profile page.</p>

                    {/* Create Meeting Button */}
                    <button className="create-meeting-btn" onClick={handleCreateMeeting}>
                        Create a Meeting
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
