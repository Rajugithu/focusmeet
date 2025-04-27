// client/src/pages/TeacherDashboard.tsx
import React, { useRef, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { useLocation } from "wouter";

const TeacherDashboard: React.FC = () => {
  const [, navigate] = useLocation(); // Get the navigate function from useLocation
  const videoRef = useRef<HTMLVideoElement>(null); // Reference for video element
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleCreateMeeting = async () => {
    try {
      console.log("Trying to create a session...");
      
      // Request camera and microphone access
      await startSession();

      console.log("let's create a video session..!")
      const response = await fetch("http://localhost:5000/api/meetings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Failed to create a meeting");
      }

      const data = await response.json();
      console.log("Meeting Created:", data);

      // Navigate to the meeting page with the generated meeting ID
      navigate(`/meeting/${data.meetingId}`);
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  const startSession = async () => {
    try {
      const userStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = userStream;
        videoRef.current.play();
      }
      setStream(userStream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleCreateMeeting}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Create Meeting
          </button>
        </div>
        <h1 className="text-2xl font-semibold mb-4">Teacher Dashboard</h1>
        {/* <p className="mb-4">Welcome Teacher!</p> */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Upcoming Classes</h2>
          <ul className="list-disc list-inside">
            <li className="mb-1">Math 101 - 10:00 AM</li>
            <li className="mb-1">Science 202 - 11:00 AM</li>
            <li className="mb-1">English 303 - 12:00 PM</li>
          </ul>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Recent Activities</h2>
          <ul className="list-disc list-inside">
            <li className="mb-1">Graded assignments for Math 101.</li>
            <li className="mb-1">Posted a new announcement for Science 202.</li>
            <li className="mb-1">Scheduled a parent-teacher meeting.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;