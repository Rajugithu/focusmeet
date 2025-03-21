const { Server } = require("socket.io");

function setupSignaling(server) {
    const io = new Server(server, {
        cors: {
            origin: "*", // Adjust this for production!
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`User ${socket.id} joined room ${roomId}`);

            // Inform other users in the room
            socket.to(roomId).emit("userJoined", socket.id);
        });

        socket.on("offer", (offer, roomId) => {
            socket.to(roomId).emit("offer", offer, socket.id);
        });

        socket.on("answer", (answer, roomId) => {
            socket.to(roomId).emit("answer", answer, socket.id);
        });

        socket.on("iceCandidate", (candidate, roomId) => {
            socket.to(roomId).emit("iceCandidate", candidate, socket.id);
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
            // Inform other users in the room (optional)
        });
    });
}

module.exports = setupSignaling;