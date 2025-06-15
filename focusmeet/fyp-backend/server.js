const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require("socket.io");
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data");
const axios = require("axios");
const connectDB = require("./src/config/db");
const studentRoutes = require("./src/routes/auth/studentRoutes");
const teacherRoutes = require("./src/routes/auth/teacherRoutes");
const lectureRoutes = require("./src/routes/auth/lectureRoutes");
const sessionRoutes = require("./src/routes/auth/sessionRoutes");
const userRoutes = require("./src/routes/auth/userRoutes");
const Signaling = require("./src/Signaling/Signaling");
const reportRoutes = require("./src/routes/auth/reportRoutes");
const { registerSocket } = require("./src/controllers/reportController");
const responseRoutes = require("./src/routes/auth/responseRoutes");


// Initialize Express App
const app = express();

// Enhanced CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "cache-control",
      "meetingid", "meeting-id",
      "userid", "user-id"
    ],
    credentials: true,
  })
);

const server = http.createServer(app);

// WebRTC Signaling Server configuration
const io = socketio(server, {
  cors: {
    origin: ["http://localhost:8080", "http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const meetingRoutes = require("./src/routes/auth/meetingRoutes")(io);
Signaling(io);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

const upload = multer({ dest: "uploads/" });

const distractedStudents = {}; // Keep the record of students
const userMeetingMap = {}; // To store userId to meetingId

setInterval(() => {
  const now = Date.now();
  for (const userId in distractedStudents) {
    if (now - distractedStudents[userId] >= 10000) {
      // 10 seconds
      const meetingId = userMeetingMap[userId];
      if (meetingId) {
        io.to(`user-id ${userId}`).emit("distractionAlert", {
          meetingId: meetingId,
          timestamp: new Date().toISOString(),
        });
        console.log(
          `Distraction alert sent to ${userId} in Meeting ${meetingId}`
        );
      }
      delete distractedStudents[userId]; // Remove user after sending alert
      delete userMeetingMap[userId]; // Clean up the meeting ID as well
    }
  }
}, 1000);

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/lectures", lectureRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/ai', responseRoutes(io, distractedStudents, userMeetingMap));


// Socket connection logic
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register-student", (studentId) => {
    registerSocket(studentId, socket);
    console.log(`Registered student: ${studentId}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on("SIGINT", () => {
  console.log("\nShutting down server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});