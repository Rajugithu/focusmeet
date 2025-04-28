// export const ICE_SERVERS = {
//   iceServers: [
//     { urls: 'stun:stun.l.google.com:19302' },
//     { urls: 'stun:stun1.l.google.com:19302' },
//     { urls: 'stun:stun2.l.google.com:19302' },
//     { urls: 'stun:stun3.l.google.com:19302' },
//     { urls: 'stun:stun4.l.google.com:19302' },
//     // Add your TURN server configuration here if you have one
//     // {
//     //   urls: 'turn:your-turn-server.com:3478',
//     //   username: 'username',
//     //   credential: 'credential'
//     // }
//   ],
//   iceCandidatePoolSize: 10,
// };

// export const setupWebRTC = async (
//   localStream: MediaStream,
//   sendIceCandidate: (candidate: RTCIceCandidateInit) => void,
//   addRemoteStream: (stream: MediaStream, peerId: string) => void,
//   peerId: string,
// ): Promise<RTCPeerConnection | null> => {
//   try {
//     const peerConnection = new RTCPeerConnection(ICE_SERVERS);

//     // Add the local stream tracks to the peer connection
//     localStream.getTracks().forEach((track) =>
//       peerConnection.addTrack(track, localStream)
//     );

//     // Handle remote streams
//     peerConnection.ontrack = (event) => {
//       addRemoteStream(event.streams[0], peerId);
//     };

//     // Handle ICE candidates
//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate) {
//         sendIceCandidate(event.candidate);
//       }
//     };

//     return peerConnection;
//   } catch (error) {
//     console.error('Error setting up WebRTC:', error);
//     return null;
//   }
// };