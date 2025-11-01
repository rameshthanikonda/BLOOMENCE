// backend/models/Result.js

const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        index: true
    },
    // 🟢 CRITICAL FIX: Ensure user details fields are defined
    userName: {
        type: String,
        default: 'Anonymous User'
    },
    userEmail: {
        type: String,
        required: true // Email should always be present via Firebase Auth
    },
    // ----------------------------------------------------
    questionnaireType: {
        type: String,
        required: true,
        enum: ['PHQ-9', 'GAD-7']
    },
    totalScore: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Result', ResultSchema);