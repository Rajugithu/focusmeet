import { useEffect, useRef, useState } from "react";
import { setupWebRTC } from "@/lib/webRTC";
import VideoStream from "./VideoStream";

const VideoCall = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    // Function to get the local media stream
    const startLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);

        // If we successfully get the local stream, set the video element source
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Initialize WebRTC when the stream is available
        if (stream) {
          // This only runs when the stream is available, ensures the session is created properly
          setupWebRTC(
            stream,  // Pass the local stream here
            handleIceCandidate,
            handleRemoteStream,
            "default-meeting-id"
          );
        }
      } catch (err) {
        console.error("Error getting local stream:", err);
      }
    };

    if (isCallActive) {
      startLocalStream();
    } else {
      // Optional cleanup
      setLocalStream(null);
      setRemoteStreams([]);
    }

    return () => {
      // Optional cleanup if needed (e.g., stopping the stream when the component unmounts)
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCallActive]);

  const handleIceCandidate = (candidate: RTCIceCandidateInit) => {
    console.log("ICE Candidate:", candidate);
    // Handle the ICE candidate signaling logic here (send it to the other peer)
  };

  const handleRemoteStream = (stream: MediaStream, peerId: string) => {
    setRemoteStreams((prevStreams) => {
      const alreadyExists = prevStreams.some((s) => s.id === stream.id);
      return alreadyExists ? prevStreams : [...prevStreams, stream];
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl font-bold mb-6">Video Call</h1>

      <div className="flex flex-wrap justify-center gap-4">
        {localStream && (
          <VideoStream stream={localStream} isLocal />
        )}

        {remoteStreams.map((stream, index) => (
          <VideoStream key={stream.id || index} stream={stream} />
        ))}
      </div>

      <button
        onClick={() => setIsCallActive(!isCallActive)}
        className="mt-6 px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
      >
        {isCallActive ? "End Call" : "Start Call"}
      </button>
    </div>
  );
};

export default VideoCall;
