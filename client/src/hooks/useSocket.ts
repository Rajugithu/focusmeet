import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Update with your backend URL

export const joinMeeting = (meetingId: string) => {
  socket.emit('join', { userId: meetingId });
};

export const sendOffer = (offer: RTCSessionDescriptionInit, meetingId: string, target: string) => {
  socket.emit('offer', { offer, userId: meetingId, target });
};

export const sendAnswer = (answer: RTCSessionDescriptionInit, meetingId: string, target: string) => {
  socket.emit('answer', { answer, userId: meetingId, target });
};

export const sendCandidate = (candidate: RTCIceCandidateInit, meetingId: string, target: string) => {
  socket.emit('candidate', { candidate, userId: meetingId, target });
};

export const onNewUser = (callback: (data: any) => void) => {
  socket.on('new-user', callback);
};

export const onOffer = (callback: (data: any) => void) => {
  socket.on('offer', callback);
};

export const onAnswer = (callback: (data: any) => void) => {
  socket.on('answer', callback);
};

export const onCandidate = (callback: (data: any) => void) => {
  socket.on('candidate', callback);
};

export const onDisconnect = (callback: () => void) => {
  socket.on('disconnect', callback);
};

export default socket;
