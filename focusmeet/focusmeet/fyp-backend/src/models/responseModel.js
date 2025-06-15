const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  name: {
    type: String,
    default: "Unknown"
  },
  meetingId: {
    type: String,
    required: true,
    index: true
  },
  isAttentive: {
    type: Boolean,
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  distractionCount: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    required: true,
    index: true,
    default: Date.now
  },
  stateDuration: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Add indexes for better query performance
responseSchema.index({ userId: 1, timestamp: -1 });
responseSchema.index({ meetingId: 1, timestamp: -1 });
responseSchema.index({ isAttentive: 1, timestamp: -1 });

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;