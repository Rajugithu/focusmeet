import React, { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client'; // Modern import
import Peer, { Instance as PeerInstance } from 'simple-peer';

interface PeerData {
  id: string;
  stream: MediaStream;
}

interface StudentPageProps {
  isJoined: boolean; // Receive the isJoined prop from Meeting
}

const StudentPage: React.FC<StudentPageProps> = ({ isJoined }) => {
  const roomId = localStorage.getItem("meetingRoomId");
  const [peers, setPeers] = useState<PeerData[]>([]);
  const socketRef = useRef<Socket | null>(null); // Correct type
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<Record<string, PeerInstance>>({});

  const addPeer = (otherUserId: string, userId: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      stream,
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });

    peer.on('signal', signal => {
      socketRef.current?.emit('signal', { to: otherUserId, from: userId, signal });
    });

    peer.on('stream', (remoteStream: MediaStream) => {
      setPeers(prev => [...prev, { id: otherUserId, stream: remoteStream }]);
    });

    return peer;
  };

  const createPeer = (otherUserId: string, userId: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: false,
      stream,
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });

    peer.on('signal', signal => {
      socketRef.current?.emit('signal', { to: otherUserId, from: userId, signal });
    });

    peer.on('stream', (remoteStream: MediaStream) => {
      setPeers(prev => [...prev, { id: otherUserId, stream: remoteStream }]);
    });

    return peer;
  };

  useEffect(() => {
    if (!isJoined) return; // Only start after student has joined
  
    const socket = io('http://localhost:5000');
    socketRef.current = socket;
    const userId = `student-${Date.now()}`;
  
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
  
        // 1. Tell server you joined
        socket.emit('join-room', roomId, userId);
  
        // 2. Server responds with users already in room
        socket.on('all-users', (users: string[]) => {
          users.forEach(otherUserId => {
            const peer = createPeer(otherUserId, userId, stream);
            peersRef.current[otherUserId] = peer;
          });
        });
  
        // 3. New user joins later
        socket.on('user-connected', (otherUserId: string) => {
          const peer = addPeer(otherUserId, userId, stream);
          peersRef.current[otherUserId] = peer;
        });
  
        socket.on('signal', ({ from, signal }: { from: string; signal: Peer.SignalData }) => {
          const peer = peersRef.current[from];
          if (peer) {
            peer.signal(signal);
          }
        });
  
        socket.on('user-disconnected', (otherUserId: string) => {
          if (peersRef.current[otherUserId]) {
            peersRef.current[otherUserId].destroy();
            delete peersRef.current[otherUserId];
            setPeers(prev => prev.filter(peer => peer.id !== otherUserId));
          }
        });
  
      });
  
    return () => {
      socket.disconnect();
    };
  
  }, [isJoined]);
  
  

  return (
    <div style={{ padding: '20px' }}>
      <h2>Student Room: {roomId}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {/* Self video */}
        <video
          ref={userVideoRef}
          autoPlay
          playsInline
          muted
          style={{ width: '300px', border: '2px solid green' }}
        />

        {/* Other participants (teacher + students) */}
        {peers.map(peer => (
          <video
            key={peer.id}
            autoPlay
            playsInline
            ref={ref => {
              if (ref) {
                ref.srcObject = peer.stream;
              }
            }}
            style={{
              width: '300px',
              border: peer.id.startsWith('teacher-')
                ? '2px solid orange'
                : '2px solid blue'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default StudentPage;