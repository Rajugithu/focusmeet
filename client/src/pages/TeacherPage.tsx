import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client'; // Modern import
import Peer, { Instance as PeerInstance } from 'simple-peer';
import { useParams } from 'react-router-dom';

interface PeerData {
  id: string;
  stream: MediaStream;
}

const TeacherPage = () => {
  const  roomId  = localStorage.getItem("meetingRoomId");
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const socketRef = useRef<Socket | null>(null); // Correct type
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const peersRef = useRef<Record<string, PeerInstance>>({});
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  // 1. Copy Meeting Link
  const copyMeetingLink = () => {
    const meetingLink = `${window.location.origin}/StudentPage/${roomId}`;
    navigator.clipboard.writeText(meetingLink)
      .then(() => alert('Meeting link copied!'))
      .catch(err => console.error('Copy failed:', err));
  };

  // 2. Screen Sharing Functionality
  const toggleScreenShare = async () => {
    if (!isSharingScreen) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true,
          audio: true 
        });
        screenStreamRef.current = screenStream;
        if (screenVideoRef.current) {
          screenVideoRef.current.srcObject = screenStream;
        }
        setIsSharingScreen(true);

        // Replace all peer streams with screen share
        Object.values(peersRef.current).forEach(peer => {
          peer.replaceTrack(
            peer.streams[0].getVideoTracks()[0],
            screenStream.getVideoTracks()[0],
            peer.streams[0]
          );
        });
        
        screenStream.getTracks()[0].onended = () => {
          toggleScreenShare(); // Auto-stop when user ends screen share
        };
      } catch (err) {
        console.error('Screen share error:', err);
      }
    } else {
      // Switch back to camera
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      setIsSharingScreen(false);
      
      Object.values(peersRef.current).forEach(peer => {
        const cameraTrack = mediaStreamRef.current?.getVideoTracks()[0];
        if (cameraTrack) {
          peer.replaceTrack(
            peer.streams[0].getVideoTracks()[0],
            cameraTrack,
            peer.streams[0]
          );
        }
      });
    }
  };

  // 3. End Meeting Functionality
  const endMeeting = () => {
    // Notify all students
    socketRef.current?.emit('end-meeting', roomId);
    
    // Clean up local resources
    Object.values(peersRef.current).forEach(peer => peer.destroy());
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
    
    // Redirect to home or show meeting ended message
    const role = localStorage.getItem('role');
    if (role === 'teacher') {
      window.location.href = '/teacher-dashboard';
    }  else {
      window.location.href = '/';
    }
  };

  useEffect(() => {
    debugger;
    console.log("roomid", roomId);
    const socket = io('http://localhost:5000');
    socketRef.current = socket;
    const userId = `teacher-${Date.now()}`;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        mediaStreamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        socket.emit('join-room', roomId, userId);
        debugger;

        socket.on('user-connected', (studentId: string) => {
          const peer = new Peer({
            initiator: true,
            stream: (isSharingScreen ? screenStreamRef.current : stream) ?? undefined,
            config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
          });

          peer.on('signal', signal => {
            socket.emit('signal', { to: studentId, from: userId, signal });
          });

          peer.on('stream', remoteStream => {
            setPeers(prev => [...prev, { id: studentId, stream: remoteStream }]);
          });

          peersRef.current[studentId] = peer;
        });

        socket.on('signal', ({ from, signal }: { from: string; signal: any }) => {
          const peer = peersRef.current[from];
          peer?.signal(signal);
        });

        socket.on('user-disconnected', (studentId: string) => {
          const peer = peersRef.current[studentId];
          peer?.destroy();
          delete peersRef.current[studentId];
          setPeers(prev => prev.filter(p => p.id !== studentId));
        });
      });

    return () => {
      socket.disconnect();
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [roomId]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Teacher Room: {roomId}</h2>
      
      {/* Control Buttons */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={copyMeetingLink}>Copy Meeting Link</button>
        <button onClick={toggleScreenShare} style={{ marginLeft: '10px' }}>
          {isSharingScreen ? 'Stop Sharing' : 'Share Screen'}
        </button>
        <button onClick={endMeeting} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
          End Meeting
        </button>
      </div>

      {/* Video Displays */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {isSharingScreen ? (
          <video
            ref={screenVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '300px', border: '2px solid purple' }}
          />
        ) : (
          <video
            ref={userVideoRef}
            autoPlay
            playsInline
            muted
            style={{ width: '300px', border: '2px solid blue' }}
          />
        )}
        
        {peers.map(peer => (
          <video
            key={peer.id}
            autoPlay
            playsInline
            ref={ref => { if (ref) ref.srcObject = peer.stream }}
            style={{ width: '300px', border: '2px solid red' }}
          />
        ))}
      </div>
    </div>
  );
};

export default TeacherPage;