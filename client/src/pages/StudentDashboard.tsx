import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import { useNavigate } from "react-router-dom";

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [roomIdToJoin, setRoomIdToJoin] = useState("");

  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    debugger;
    const storedRoomId = localStorage.getItem("meetingRoomId");
    if (storedRoomId) {
      setRoomIdToJoin(storedRoomId);
    }
  }, []);

  const handleJoinMeeting = () => {
    debugger;
    const storedRoomId = localStorage.getItem("meetingRoomId");
    if (storedRoomId) {
      setRoomIdToJoin(storedRoomId);
    }
    if (!roomIdToJoin || roomIdToJoin.length !== 6) {
      setError("Meeting ID must be exactly 6 characters");
      return;
    }
    navigate(`/StudentPage/${roomIdToJoin}`);
    debugger;
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="flex justify-end items-end gap-2 mb-4">
          <div>
            {" "}
            {/* removed flex-1 from here */}
            {/* <label htmlFor="roomId" className="block mb-1">Meeting ID </label> */}
            <input
              id="roomId"
              type="text"
              placeholder="Enter 6-digit Meeting ID"
              value={roomIdToJoin}
              onChange={(e) => {
                setRoomIdToJoin(e.target.value);
                setError("");
              }}
              className="border rounded py-2 px-3 w-48"
              maxLength={6}
              pattern="[A-Za-z0-9]{6}"
              disabled={isValidating}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <button
            onClick={handleJoinMeeting}
            disabled={isValidating}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            {isValidating ? "Validating..." : "Join Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;