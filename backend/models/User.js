const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true },
  name: { type: String, default: 'User' },
  registeredAt: { type: Date, default: Date.now },
  lastSeen: { type: Date, default: Date.now },
  emailPrefs: {
    weeklyDigest: { type: Boolean, default: true },
    loginEmails: { type: Boolean, default: true },
    highScoreAlerts: { type: Boolean, default: true },
    reengagementEmails: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
