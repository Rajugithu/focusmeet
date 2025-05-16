const express = require('express');
const router = express.Router();
const Meeting = require('../../models/Meeting');

function meetingRoutes(io) {
    // Create meeting - just save the meeting ID
    router.post('/', async (req, res) => {
        try {
            const { roomId, teacherId } = req.body;
            
            const meeting = new Meeting({
                roomId,
                teacherId,
                createdAt: new Date(),
                status: 'active'
            });

            await meeting.save();
            
            res.status(201).json({ 
                success: true,
                roomId,
                status: 'active'
            });
        } catch (error) {
            res.status(500).json({ 
                success: false,
                error: 'Failed to create meeting'
            });
        }
    });

    // Validate meeting ID exists and is active
    router.get('/validate/:roomId', async (req, res) => {
        try {
            const { roomId } = req.params;
            const meeting = await Meeting.findOne({ roomId });

            if (!meeting) {
                return res.status(404).json({ 
                    valid: false, 
                    error: 'Meeting not found' 
                });
            }

            if (meeting.status !== 'active') {
                return res.json({ 
                    valid: false, 
                    error: 'Meeting is not active' 
                });
            }

            res.json({ 
                valid: true,
                roomId,
                status: meeting.status,
                createdAt: meeting.createdAt
            });

        } catch (error) {
            res.status(500).json({ 
                valid: false,
                error: 'Server error during validation'
            });
        }
    });

    // End meeting - just update status
    router.patch('/:roomId/end', async (req, res) => {
        try {
            const { roomId } = req.params;

            // Step 1: Update meeting status to 'ended'
            const meeting = await Meeting.findOneAndUpdate(
                { roomId },
                { status: 'ended' },
                { new: true }
            );

            if (!meeting) {
                return res.status(404).json({ 
                    success: false,
                    error: 'Meeting not found'
                });
            }

            // Step 2: Delete the meeting from DB
            await Meeting.deleteOne({ roomId });

            res.json({ 
                success: true,
                roomId,
                status: 'ended',
                message: 'Meeting ended and deleted successfully'
            });

        } catch (error) {
            res.status(500).json({ 
                success: false,
                error: 'Failed to end and delete meeting'
            });
        }
    });


    return router;
}

module.exports = meetingRoutes;