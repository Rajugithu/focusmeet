import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5001"); // Connect to signaling server

const LiveMeeting = ({ roomId }) => {
    const [stream, setStream] = useState(null);

    useEffect(() => {
        // Get user media (camera and microphone)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
                setStream(stream);
                socket.emit("joinRoom", roomId); // Emit event to join the room
            })
            .catch((err) => console.error("Error accessing media devices.", err));

        // Handle incoming WebRTC signals
        socket.on("offer", (offer) => {
            // Handle WebRTC offer
            // Create an answer to the offer and send it back
        });

        socket.on("answer", (answer) => {
            // Handle the answer to a WebRTC offer
        });

        socket.on("iceCandidate", (candidate) => {
            // Handle ICE candidates for WebRTC peer connection
        });

        return () => {
            socket.disconnect(); // Clean up on component unmount
        };
    }, [roomId]);

    return (
        <div>
            <h1>Live Meeting</h1>
            <video autoPlay muted ref={(video) => {
                if (video && stream) {
                    video.srcObject = stream; // Display user's video stream
                }
            }} />
        </div>
    );
};

export default LiveMeeting;
