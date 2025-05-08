const express = require('express');
const router = express.Router();
const Meeting = require('../../models/Meeting');

function meetingRoutes(io) {
    // Create meeting (stores client-generated room ID)
    router.post('/', async (req, res) => {
        try {
            const { roomId } = req.body;

            // Validate room ID format
            if (!roomId || roomId.length !== 6) {
                return res.status(400).json({ error: 'Room ID must be 6 characters' });
            }

            // Check if room already exists
            const existingMeeting = await Meeting.findOne({ roomId });
            if (existingMeeting) {
                return res.status(409).json({ error: 'Room ID already exists' });
            }

            // Create new meeting
            const meeting = new Meeting({
                roomId,
                participants: []
            });

            await meeting.save();

            res.status(201).json({ 
                success: true,
                roomId,
                expiresAt: meeting.expiresAt
            });

        } catch (error) {
            console.error('Error creating meeting:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Validate meeting for student join
    router.get('/validate/:roomId', async (req, res) => {
        try {
            const { roomId } = req.params;

            const meeting = await Meeting.findOne({ roomId });

            if (!meeting) {
                return res.status(404).json({ valid: false, error: 'Room not found' });
            }

            if (new Date() > meeting.expiresAt) {
                await Meeting.deleteOne({ roomId });
                return res.status(410).json({ valid: false, error: 'Meeting expired' });
            }

            res.json({ 
                valid: true,
                roomId,
                expiresAt: meeting.expiresAt
            });

        } catch (error) {
            console.error('Error validating meeting:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // Join meeting (add participant)
    router.post('/join/:roomId', async (req, res) => {
        try {
            const { roomId } = req.params;
            const { studentId } = req.body;

            const meeting = await Meeting.findOne({ roomId });

            // Validate meeting exists and is active
            if (!meeting) {
                return res.status(404).json({ error: 'Room not found' });
            }
            if (new Date() > meeting.expiresAt) {
                await Meeting.deleteOne({ roomId });
                return res.status(410).json({ error: 'Meeting expired' });
            }

            // Add participant if not already present
            if (!meeting.participants.includes(studentId)) {
                meeting.participants.push(studentId);
                await meeting.save();
            }

            res.json({
                success: true,
                roomId,
                participants: meeting.participants
            });

            // Notify teacher via Socket.IO
            io.to(roomId).emit('participant-joined', { studentId });

        } catch (error) {
            console.error('Error joining meeting:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // End meeting
    router.delete('/:roomId', async (req, res) => {
        try {
            const { roomId } = req.params;
            
            await Meeting.deleteOne({ roomId });
            
            io.to(roomId).emit('meeting-ended');
            
            res.json({ success: true });
            
        } catch (error) {
            console.error('Error ending meeting:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
}

module.exports = meetingRoutes;