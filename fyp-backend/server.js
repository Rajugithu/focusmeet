// server.js
const express = require('express');
const connectDB = require('./src/config/db');
const studentRoutes = require('./src/routes/auth/studentRoutes');

require('dotenv').config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Define Routes
app.use('/routes/auth', require('./src/routes/auth/auth')); 
app.use('/api/students', studentRoutes);


const PORT = process.env.PORT || 5000;

// Export the app instance for testing
module.exports = app;

// Start the server only when this file is run directly
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}