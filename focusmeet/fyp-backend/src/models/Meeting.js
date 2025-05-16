const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    teacherId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'ended'],
        default: 'active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Meeting', meetingSchema);