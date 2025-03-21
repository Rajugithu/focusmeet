const Session = require('../models/Session');

// Create a new session
exports.createSession = async (req, res) => {
    try {
        const { teacherId, subject, startTime, duration, students, meetingId, meetingUrl } = req.body;
        const session = new Session({ teacherId, subject, startTime, duration, students, meetingId, meetingUrl });
        await session.save();
        res.status(201).json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Get all sessions
exports.getSessions = async (req, res) => {
    try {
        const sessions = await Session.find();
        res.json(sessions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Get a session by ID
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Update a session
exports.updateSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Update session status
exports.updateSessionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const session = await Session.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(session);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Delete a session
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json({ message: 'Session deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};