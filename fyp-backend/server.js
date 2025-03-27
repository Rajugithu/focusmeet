const express = require('express');
const http = require('http');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const connectDB = require('./src/config/db');
const studentRoutes = require('./src/routes/auth/studentRoutes');
const teacherRoutes = require('./src/routes/auth/teacherRoutes');
const lectureRoutes = require('./src/routes/auth/lectureRoutes');
const sessionRoutes = require('./src/routes/auth/sessionRoutes');
const userRoutes = require('./src/routes/auth/userRoutes');
const meetingRoutes = require('./src/routes/auth/meetingRoutes');
const setupSignaling = require('./src/Signaling/webrtcSignaling');

// **Initialize Express App**
const app = express();

// Set up file upload storage
const upload = multer({ dest: 'uploads/' });

// **Middleware**
app.use(cors({ origin: ["http://localhost:3000", "http://127.0.0.1:8080"] }));
app.use(express.json());

// **Connect Database**
connectDB();

// **Define Routes**
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);

// **AI Model API**
app.post('/api/analyze', upload.single('frame'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }

    const imagePath = req.file.path;

    // Run AI Model
    const pythonProcess = spawn('python3', ['src/AI-Model/main.py', imagePath]);

    let resultData = '';

    pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`AI Model Error: ${data}`);
    });

    pythonProcess.on('close', () => {
        fs.unlinkSync(imagePath); // Delete temp file
        res.json({ prediction: resultData.trim() });
    });
});

// **Create HTTP Server**
const server = http.createServer(app);

// **Now call setupSignaling**
setupSignaling(server);

// **Start the Server**
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.url}`);
    console.log("Request Body:", req.body);
    next();
});