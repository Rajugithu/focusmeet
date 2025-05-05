import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Peer, { Instance as PeerInstance } from 'simple-peer';
import MeetingComponent from '@/components/layout/MeetingComponent';

interface PeerData {
  id: string;
  stream: MediaStream;
}

type JoinResponse = { success: boolean };

const StudentPage: React.FC = () => {
  const roomId = localStorage.getItem("meetingRoomId") || '';
  const [hasJoined, setHasJoined] = useState(false);
  const [peers, setPeers] = useState<PeerData[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<Record<string, PeerInstance>>({});
  const [userStream, setUserStream] = useState<MediaStream | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    console.log("Initializing student page for room:", roomId);

    const socket = io('http://localhost:5000', {
      reconnectionAttempts: 3,
      timeout: 5000
    });
    socketRef.current = socket;
    const userId = `student-${Date.now()}`;

    // Connection handlers
    socket.on('connect', () => setConnectionStatus('connected'));
    socket.on('disconnect', () => setConnectionStatus('disconnected'));
    socket.on('connect_error', () => setConnectionStatus('error'));

    // Initialize media stream
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });

        // Set up video element
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }

        // Create new stream to avoid reference issues
        const mediaStream = new MediaStream(stream.getTracks());
        setUserStream(mediaStream);

        // Join room with media stream
        debugger;
        socket.emit('join-room', roomId, userId, (response?: JoinResponse) => {
          console.log('Join response:', response);
          if (response?.success) {
            console.log('Join successful');
            setHasJoined(true);
            debugger;
          } else {
            console.error("Failed to join room");
            setTimeout(() => {
              socket.emit('join-room', roomId, userId, (retryResponse?: JoinResponse) => {
                if (retryResponse?.success) {
                  setHasJoined(true);
                  debugger;
                }
              });
            }, 2000);
          }
        });

        // Peer connection handlers
        socket.on('user-connected', (otherUserId: string) => {
          if (!peersRef.current[otherUserId]) {
            const peer = new Peer({
              initiator: true,
              stream: mediaStream,
              config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
            });

            peer.on('signal', signal => {
              socket.emit('signal', { to: otherUserId, from: userId, signal });
            });

            peer.on('stream', remoteStream => {
              setPeers(prev => [...prev, { id: otherUserId, stream: remoteStream }]);
            });

            peersRef.current[otherUserId] = peer;
          }
        });

        socket.on('signal', ({ from, signal }) => {
          if (!peersRef.current[from]) {
            const peer = new Peer({
              initiator: false,
              stream: mediaStream,
              config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
            });

            peer.on('signal', studentSignal => {
              socket.emit('signal', { to: from, from: userId, signal: studentSignal });
            });

            peer.on('stream', remoteStream => {
              setPeers(prev => [...prev, { id: from, stream: remoteStream }]);
            });

            peersRef.current[from] = peer;
          }
          peersRef.current[from]?.signal(signal);
        });

      } catch (error) {
        console.error("Error accessing media devices:", error);
        setConnectionStatus('media-error');
      }
    };

    initializeMedia();

    // Cleanup
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (userStream) {
        userStream.getTracks().forEach(track => track.stop());
      }
      Object.values(peersRef.current).forEach(peer => peer.destroy());
    };
  }, [roomId]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Room: {roomId}</h2>
      {connectionStatus !== 'connected' && (
        <div style={{ color: 'red' }}>Status: {connectionStatus}</div>
      )}

      <MeetingComponent 
        meetingId={roomId} 
        stream={userStream} 
        hasJoined={hasJoined} 
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        <video
          ref={userVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '300px', border: '2px solid green' }}
        />

        {peers.map(peer => (
          <video
            key={peer.id}
            autoPlay
            playsInline
            ref={ref => ref && (ref.srcObject = peer.stream)}
            style={{
              width: '300px',
              border: peer.id.startsWith('teacher-') ? '2px solid orange' : '2px solid blue'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentPage;