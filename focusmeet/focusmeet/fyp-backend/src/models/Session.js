const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    subject: { type: String, required: true },
    startTime: { type: Date, default: Date.now },
    duration: { type: Number, default: 30 },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    meetingId: { type: String, unique: true },
    meetingUrl: { type: String },
    status: {
        type: String,
        enum: ['scheduled', 'inProgress', 'ended', 'dismissed'],
        default: 'scheduled',
    },
});

module.exports = mongoose.model('Session', sessionSchema);