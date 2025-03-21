// server.js
const express = require('express');
const http=require('http');
const connectDB = require('./src/config/db');
const studentRoutes = require('./src/routes/auth/studentRoutes');
const teacherRoutes = require('./src/routes/auth/teacherRoutes');
const lectureRoutes = require('./src/routes/auth/lectureRoutes');
const Session = require('./src/routes/auth/sessionRoutes');
const setupSignaling= require('./src/webrtc/signaling')

require('dotenv').config();

const app = express();
const server=http.createServer(app);


// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Define Routes
app.use('/routes/auth', require('./src/routes/auth/auth'));
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/session', Session);


setupSignaling(server);

const PORT = process.env.PORT || 5000;

// Export the app instance for testing
module.exports = app;

// Start the server only when this file is run directly
if (require.main === module) {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}