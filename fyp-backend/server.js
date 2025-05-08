const express = require('express');
    const http = require('http');
    const cors = require('cors');
    const socketio = require('socket.io');
    const multer = require('multer');
    const fs = require('fs');
    const FormData = require('form-data');
    const axios = require('axios');
    const connectDB = require('./src/config/db');
    const studentRoutes = require('./src/routes/auth/studentRoutes');
    const teacherRoutes = require('./src/routes/auth/teacherRoutes');
    const lectureRoutes = require('./src/routes/auth/lectureRoutes');
    const sessionRoutes = require('./src/routes/auth/sessionRoutes');
    const userRoutes = require('./src/routes/auth/userRoutes');
    const Signaling = require('./src/Signaling/Signaling');

    // Initialize Express App
    const app = express();

    // Enhanced CORS configuration
    app.use(cors({
        origin: "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'cache-control', 'meeting-id', 'user-id'],
        credentials: true
    }));

    const server = http.createServer(app);

    // WebRTC Signaling Server configuration
    const io = socketio(server, {
        cors: {
            origin: ["http://localhost:8080", "http://localhost:3000"],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    const meetingRoutes = require('./src/routes/auth/meetingRoutes')(io);
    Signaling(io);


    // Middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));

    // Connect Database
    connectDB();

    const upload = multer({ dest: 'uploads/' });

    const distractedStudents = {}; // Keep the record of students
    const userMeetingMap = {};     // To store userId to meetingId

    setInterval(() => {
        const now = Date.now();
        for (const userId in distractedStudents) {
            if (now - distractedStudents[userId] >= 10000) { // 10 seconds
                const meetingId = userMeetingMap[userId];
                if (meetingId) {
                    io.to(`user-id ${userId}`).emit('distractionAlert', {
                        meetingId: meetingId,
                        timestamp: new Date().toISOString()
                    });
                    console.log(`Distraction alert sent to ${userId} in Meeting ${meetingId}`);
                }
                delete distractedStudents[userId]; // Remove user after sending alert
                delete userMeetingMap[userId];     // Clean up the meeting ID as well
            }
        }
    }, 1000);



    // AI Integration
    app.post('/api/ai/process-frame', upload.single('frame'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No frame file provided' });
            }

            // Get meeting ID from headers
            const meetingId = req.headers['meeting-id'];
            if (!meetingId) {
                return res.status(400).json({ error: 'Meeting ID is required' });
            }

            // Check the user id in the header to send the notification
            const userId = req.headers['user-id'];
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            // Create FormData to forward to AI server
            const formData = new FormData();
            formData.append('frame', fs.createReadStream(req.file.path), {
                filename: 'frame.jpg',
                contentType: 'image/jpeg'
            });

            // Forward the request to AI server with correct endpoint and headers
            const aiResponse = await axios.post('http://localhost:5001/predict', formData, {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Meeting ${meetingId}` // Changed to match Flask expectation

                },
                timeout: 10000
            });

            // Clean up the uploaded file
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting temporary file:', err);
            });

            // Forward the AI server's response back to client
            const aiData= aiResponse.data;
            res.status(aiResponse.status).json(aiResponse.data);

            if(aiData.isAttentive === false && userId){
                if(!distractedStudents[userId]){
                    distractedStudents[userId] = Date.now();
                    userMeetingMap[userId] = meetingId; // Store the meetingId here
                }
                io.to(`user-id ${userId}`).emit('distractionDetected', {
                    meetingId: meetingId,
                    timestamp: new Date().toISOString()
                });
                console.log(`Distraction detected for ${userId} in Meeting ${meetingId}`);
            } else if(aiData.isAttentive === true && distractedStudents[userId]){
                delete distractedStudents[userId];
                delete userMeetingMap[userId]; // Clean up when student is attentive again
                console.log("distracted ended for user ID ", userId);
            }

        } catch (error) {
            console.error('Error processing frame:', error);

            // Enhanced error logging
            if (error.response) {
                console.error('AI Server Response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Request setup error:', error.message);
            }

            // Clean up file if it exists
            if (req.file?.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error deleting temporary file:', err);
                });
            }

            if (error.response) {
                res.status(error.response.status).json(error.response.data);
            } else if (error.code === 'ECONNABORTED') {
                res.status(504).json({ error: 'AI server timeout' });
            } else {
                res.status(500).json({
                    error: 'Internal server error',
                    details: error.message
                });
            }
        }
    });

    // Routes
    app.use('/api/students', studentRoutes);
    app.use('/api/teachers', teacherRoutes);
    app.use('/api/lectures', lectureRoutes);
    app.use('/api/sessions', sessionRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/meetings', meetingRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'healthy' });
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });

    // Graceful Shutdown
    process.on('SIGINT', () => {
        console.log("\nShutting down server...");
        server.close(() => {
            console.log("Server closed.");
            process.exit(0);
        });
    });