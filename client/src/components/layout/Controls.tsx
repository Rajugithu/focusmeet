import React, { useState } from "react";
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff, Link as LinkIcon } from "lucide-react";

interface ControlsProps {
  localStream: MediaStream | null;
  endSession: () => void;
  meetingId: string; // Pass meeting ID to generate the meeting link
}

const Controls: React.FC<ControlsProps> = ({ localStream, endSession, meetingId }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [copied, setCopied] = useState(false); // State to track copy status

  const meetingLink = `${window.location.origin}/meetings/${meetingId}`; // Generate meeting link

  // Toggle Microphone
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle Camera
  const toggleCamera = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  // Share Screen
  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        console.log("Screen sharing started");
      } else {
        console.log("Screen sharing stopped");
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  // Copy Meeting Link to Clipboard
  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-3 rounded-lg flex gap-4 shadow-lg">
      <button onClick={toggleMute} className="p-2 bg-gray-700 rounded-lg">
        {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
      </button>
      <button onClick={toggleCamera} className="p-2 bg-gray-700 rounded-lg">
        {isCameraOff ? <VideoOff size={24} /> : <Video size={24} />}
      </button>
      <button onClick={toggleScreenShare} className="p-2 bg-gray-700 rounded-lg">
        <Monitor size={24} />
      </button>
      <button onClick={copyMeetingLink} className="p-2 bg-gray-700 rounded-lg">
        <LinkIcon size={24} />
      </button>
      <button onClick={endSession} className="p-2 bg-red-600 rounded-lg">
        <PhoneOff size={24} />
      </button>
      {copied && <span className="text-green-400 text-sm">Link copied!</span>}
    </div>
  );
};

export default Controls;
