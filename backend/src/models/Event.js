import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true,
        enum: ['page_view', 'click', 'session_start', 'session_end'],
        index: true,
    },
    page: {
        type: String,
        required: true,
        index: true,
    },
    sessionId: {
        type: String,
        required: true,
        index: true,
    },
    userId: {
        type: String,
        index: true,
    },
    referrer: String,
    ip: String,
    userAgent: String,
    timezone: String,
    timestamp: {
        type: Number,
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

// Indexes for common queries
eventSchema.index({ createdAt: -1 });
eventSchema.index({ event: 1, createdAt: -1 });
eventSchema.index({ sessionId: 1, timestamp: 1 });

export const Event = mongoose.model('Event', eventSchema);
