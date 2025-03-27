const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Store meetings with metadata
const activeMeetings = new Map();

// Create meeting with expiration
router.post('/create', (req, res) => {
    const meetingId = uuidv4();
    activeMeetings.set(meetingId, {
        createdAt: Date.now(),
        expiresAt: Date.now() + (2 * 60 * 60 * 1000), // 2 hour expiration
        host: req.body.host || 'teacher' // Optional host info
    });
    
    res.json({ 
        meetingId,
        expiresAt: activeMeetings.get(meetingId).expiresAt
    });
});

// Join meeting endpoint (modified for GET)
// Join meeting endpoint (modified for GET)
router.get('/join/:meetingId', (req, res) => {
    const { meetingId } = req.params;

    if (!activeMeetings.has(meetingId)) {
        return res.status(404).json({ error: 'Meeting not found' });
    }

    const meeting = activeMeetings.get(meetingId);
    if (Date.now() > meeting.expiresAt) {
        activeMeetings.delete(meetingId);
        return res.status(410).json({ error: 'Meeting expired' });
    }

    // At this point the meeting is valid.
    // We need to add logic here to initiate the web socket connection,
    // and handle the webRTC signaling.

    // Example response (you'll need to adapt this)
    res.json({
        valid: true,
        meetingId,
        expiresAt: meeting.expiresAt,
    });
});

// Get active meetings (modified)
router.get('/active', (req, res) => {
    const now = Date.now();
    
    // Cleanup expired meetings first
    activeMeetings.forEach((meeting, id) => {
        if (now > meeting.expiresAt) {
            activeMeetings.delete(id);
        }
    });
    
    res.json({
        meetings: Array.from(activeMeetings).map(([id, data]) => ({
            id,
            expiresAt: data.expiresAt,
            host: data.host
        }))
    });
});

// Automatic cleanup every 5 minutes
setInterval(() => {
    const now = Date.now();
    activeMeetings.forEach((meeting, id) => {
        if (now > meeting.expiresAt) {
            activeMeetings.delete(id);
        }
    });
}, 5 * 60 * 1000);

module.exports = router;