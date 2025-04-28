import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'wouter';
//import { setupWebRTC, ICE_SERVERS } from '@/lib/webRTC';
import { io, Socket } from 'socket.io-client';

const MeetingPage: React.FC = () => {
  const { meetingId } = useParams();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isMuted, setIsMuted] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [error, setError] = useState<string | null>(null);
  const role = localStorage.getItem('role');

  const createPeerConnection = async (peerId: string) => {
    try {
      const peerConnection = new RTCPeerConnection(ICE_SERVERS);
      peersRef.current.set(peerId, peerConnection);

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
          peerConnection.addTrack(track, localStreamRef.current!);
        });
      }

      peerConnection.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          setRemoteStreams(prev => {
            const newStreams = new Map(prev);
            newStreams.set(peerId, event.streams[0]);
            return newStreams;
          });
        }
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit('iceCandidate', event.candidate, peerId);
        }
      };

      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.connectionState);
        debugger;
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log('ICE state:', peerConnection.iceConnectionState);
        debugger;
      };

      return peerConnection;
    } catch (error) {
      console.error('Peer connection error:', error);
      throw error;
    }
  };

  const handleOffer = async (offer: RTCSessionDescriptionInit, peerId: string) => {
    try {
      const peerConnection = await createPeerConnection(peerId);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket?.emit('answer', answer, peerId);
    } catch (error) {
      console.error('Offer handling error:', error);
    }
  };

  const handleAnswer = async (answer: RTCSessionDescriptionInit, peerId: string) => {
    const peerConnection = peersRef.current.get(peerId);
    if (peerConnection) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleNewICECandidate = async (candidate: RTCIceCandidateInit, peerId: string) => {
    const peerConnection = peersRef.current.get(peerId);
    if (peerConnection) {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const initializeSocket = () => {
    try {
      const socket = io('http://localhost:5000', {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socket.on('connect', () => {
        socket.emit('joinRoom', { roomId: meetingId, role: role });
        debugger;
        console.log('user connected to server', meetingId);
        debugger;
      });

      socket.on('connect_error', (error) => {
        setError('Failed to connect to server.');
      });

      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          socket.connect();
        }
      });

      socket.on('existingUsers', async (users) => {
        for (const userId of users) {
          if (userId !== socket.id) {
            const peerConnection = await createPeerConnection(userId);
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('offer', offer, userId);
          }
        }
      });

      socket.on('userJoined', async (userId) => {
        const peerConnection = await createPeerConnection(userId);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer, userId);
      });

      socket.on('offer', async (offer, peerId) => {
        await handleOffer(offer, peerId);
      });

      socket.on('answer', async (answer, peerId) => {
        await handleAnswer(answer, peerId);
      });

      socket.on('iceCandidate', async (candidate, peerId) => {
        await handleNewICECandidate(candidate, peerId);
      });

      socket.on('userDisconnected', (userId) => {
        const peerConnection = peersRef.current.get(userId);
        if (peerConnection) {
          peerConnection.close();
          peersRef.current.delete(userId);
          setRemoteStreams(prev => {
            const newStreams = new Map(prev);
            newStreams.delete(userId);
            return newStreams;
          });
        }
      });

      setSocket(socket);
    } catch (error) {
      console.error('Socket init error:', error);
      setError('Could not initialize socket');
    }
  };

  useEffect(() => {
    initializeSocket();

    const initLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Failed to access camera/mic');
      }
    };

    initLocalStream();

    return () => {
      socket?.disconnect();
      peersRef.current.forEach(pc => pc.close());
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [meetingId]);

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isSharingScreen) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        localStreamRef.current?.getVideoTracks().forEach(track => track.stop());
        localStreamRef.current = screenStream;
        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
        setIsSharingScreen(true);
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        setIsSharingScreen(false);
      }
    } catch (err) {
      console.error('Screen share error:', err);
    }
  };

  const shareMeetingLink = () => {
    if (meetingId) {
      navigator.clipboard.writeText(window.location.href);
      alert('Meeting link copied to clipboard!');
    }
  };

  const endCall = () => {
    peersRef.current.forEach(pc => pc.close());
    peersRef.current.clear();

    const role = localStorage.getItem('role');
    if (role === 'student') {
      window.location.href = '/student-dashboard';
    } else if (role === 'teacher') {
      window.location.href = '/teacher-dashboard';
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Meeting: {meetingId}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
        <div className="relative">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-64 h-48 border rounded-lg"
          />
          <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
            You
          </span>
        </div>
        {Array.from(remoteStreams.entries()).map(([peerId, stream]) => (
          <div key={peerId} className="relative">
            <video
              autoPlay
              playsInline
              className="w-64 h-48 border rounded-lg"
              ref={(video) => {
                if (video && video.srcObject !== stream) {
                  video.srcObject = stream;
                }
              }}
            />
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs rounded">
              {peerId === socket?.id ? 'You' : 'Remote'}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={toggleMute} className="bg-gray-700 p-2 rounded">
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
        <button onClick={shareMeetingLink} className="bg-gray-700 p-2 rounded">
          Share Link
        </button>
        <button onClick={toggleScreenShare} className="bg-gray-700 p-2 rounded">
          {isSharingScreen ? 'Stop Share' : 'Share Screen'}
        </button>
        <button onClick={endCall} className="bg-red-600 p-2 rounded">
          End Call
        </button>
      </div>
      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default MeetingPage;
