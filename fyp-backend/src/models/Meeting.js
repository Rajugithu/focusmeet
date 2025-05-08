const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: v => v.length === 6,
      message: 'Room ID must be exactly 6 characters'
    }
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  participants: { type: [String], default: [] }
});

module.exports = mongoose.model('Meeting', meetingSchema);