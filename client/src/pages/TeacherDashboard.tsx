import React, { useRef, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { useNavigate } from "react-router-dom"; // Importing useNavigate for redirection

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate(); // Use the navigate function from useNavigate
  const videoRef = useRef<HTMLVideoElement>(null); // Reference for video element
  const [stream, setStream] = useState<MediaStream | null>(null); // State to manage the video stream
  const [roomId, setRoomId] = useState<string>('');
   

  // Function to handle creating the meeting
  const handleCreateMeeting = async () => {
    const newRoomId = Math.random().toString(36).substring(2, 8); // 6-character ID
    setRoomId(newRoomId);
    localStorage.setItem('meetingRoomId', newRoomId);
  
    navigate(`/TeacherPage/${newRoomId}`);
    debugger; 
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

        {/* Upcoming Classes */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Upcoming Classes</h2>
          <ul className="list-disc list-inside">
            <li className="mb-1">Math 101 - 10:00 AM</li>
            <li className="mb-1">Science 202 - 11:00 AM</li>
            <li className="mb-1">English 303 - 12:00 PM</li>
          </ul>
        </div>

        {/* Recent Activities */}
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
