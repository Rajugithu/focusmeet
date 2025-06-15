// Signaling.js
module.exports = function(io) {
  const rooms = new Map();
   
  io.on('connection', (socket) => {
    debugger;
    console.log('New connection:', socket.id);
    
    socket.on('end-meeting', (roomId) => {
      io.to(roomId).emit('meeting-ended');
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room) {
        room.forEach(socketId => {
          io.sockets.sockets.get(socketId)?.disconnect();
        });
      }
    });

    socket.on('join-room', (roomId, userId, callback) => {
      console.log(`${userId} joining room ${roomId}`);

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map());
      }

      const room = rooms.get(roomId);
      room.set(userId, socket.id);
      socket.join(roomId);

      const existingUsers = Array.from(room.keys()).filter(id => id !== userId);
      socket.emit('existing-users', { existingUsers, userId });

      socket.to(roomId).emit('user-connected', userId);

      // Sending response to fronend for succes 
      if (callback){
        callback({success: true});
      }
      socket.on('signal', ({ to, from, signal }) => {
        console.log(`Signal from ${from} to ${to}`);
        const targetSocketId = room.get(to);
        if (targetSocketId) {
          io.to(targetSocketId).emit('signal', { from, signal });
        }
      });

      socket.on('disconnect', () => {
        console.log(`${userId} disconnected`);
        room.delete(userId);
        socket.to(roomId).emit('user-disconnected', userId);
        if (room.size === 0) {
          rooms.delete(roomId);
        }
      });
    });
  });
};
