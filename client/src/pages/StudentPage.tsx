import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client'; // Modern import
import Peer, { Instance as PeerInstance } from 'simple-peer';

interface PeerData {
  id: string;
  stream: MediaStream;
}

const StudentPage: React.FC = () => {
  const  roomId  = localStorage.getItem("meetingRoomId");
  const [peers, setPeers] = useState<PeerData[]>([]);
  const socketRef = useRef<Socket | null>(null); // Correct type
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<Record<string, PeerInstance>>({});

  useEffect(() => {
    debugger;
    console.log("roomid", roomId);
    const socket = io('http://localhost:5000');
    socketRef.current = socket;
    const userId = `student-${Date.now()}`;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        socket.emit('join-room', roomId, userId);
        console.log('Student joined room:', roomId);
        debugger;

        // 1. Handle new connections (teacher OR other students)
        socket.on('user-connected', (otherUserId: string) => {
          if (!peersRef.current[otherUserId]) {
            const peer = new Peer({
              initiator: true,
              stream,
              config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
            });

            peer.on('signal', signal => {
              socket.emit('signal', { to: otherUserId, from: userId, signal });
            });

            peer.on('stream', (remoteStream: MediaStream) => {
              setPeers(prev => [...prev, { id: otherUserId, stream: remoteStream }]);
            });

            peersRef.current[otherUserId] = peer;
          }
        });

        // 2. Handle incoming signals
        socket.on('signal', ({ from, signal }: { from: string; signal: Peer.SignalData }) => {
          if (!peersRef.current[from]) {
            const peer = new Peer({
              initiator: false,
              stream,
              config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
            });

            peer.on('signal', (studentSignal: Peer.SignalData) => {
              socket.emit('signal', { to: from, from: userId, signal: studentSignal });
            });

            peer.on('stream', (remoteStream: MediaStream) => {
              setPeers(prev => [...prev, { id: from, stream: remoteStream }]);
            });

            peersRef.current[from] = peer;
          }
          peersRef.current[from]?.signal(signal);
        });

        // 3. Handle disconnections
        socket.on('user-disconnected', (otherUserId: string) => {
          if (peersRef.current[otherUserId]) {
            peersRef.current[otherUserId].destroy();
            delete peersRef.current[otherUserId];
            setPeers(prev => prev.filter(p => p.id !== otherUserId));
          }
        });

        socket.on('meeting-ended', () => {
          alert('Meeting ended by teacher');
          const role = localStorage.getItem('role');
          if (role === 'student') {
            window.location.href = '/student-dashboard';
          } else{
            window.location.href = '/';
          }
        });
      })
      .catch(error => {
        console.error('Error accessing media devices:', error);
      });

    return () => {
      socket.disconnect();
      Object.values(peersRef.current).forEach(peer => peer.destroy());
      if (userVideoRef.current?.srcObject) {
        (userVideoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [roomId]);

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