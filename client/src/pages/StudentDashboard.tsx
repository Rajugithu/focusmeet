import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import { useLocation } from "wouter";

const StudentDashboard: React.FC = () => {
  const [, navigate] = useLocation();
  const [activeMeetings, setActiveMeetings] = useState<{ id: string; expiresAt: number; host: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch active meetings periodically
  useEffect(() => {
    const fetchActiveMeetings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/meetings/active");
        if (response.ok) {
          const data = await response.json();
          setActiveMeetings(data.meetings); // Changed to data.meetings
        }
      } catch (error) {
        console.error("Error fetching active meetings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchActiveMeetings();

    // Refresh every 10 seconds
    const interval = setInterval(fetchActiveMeetings, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleJoinMeeting = async (meetingId: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/meetings/join/${meetingId}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("Invalid meeting ID");
      }

      navigate(`/meeting/${meetingId}`);
    } catch (error) {
      console.error("Error joining meeting:", error);
      alert("Failed to join meeting. Please try again.");
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="flex justify-end mb-4 gap-2">
          {/* Active Meetings Section */}
          <div className="flex flex-col items-end gap-2">
            {isLoading ? (
              <div className="animate-pulse">Loading active meetings...</div>
            ) : activeMeetings.length > 0 ? (
              activeMeetings.map((meeting) => (
                <button
                  key={meeting.id}
                  onClick={() => handleJoinMeeting(meeting.id)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded animate-pulse"
                >
                  Join Meeting ({meeting.id.slice(0, 6)}...)
                </button>
              ))
            ) : (
              <div className="bg-green-500 text-white p-2 rounded">Join meeting</div>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-4">Student Dashboard</h1>
        {/* Rest of your dashboard content */}
      </div>
    </div>
  );
};

export default StudentDashboard;