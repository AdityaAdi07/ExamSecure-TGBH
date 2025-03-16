const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  // Add any other user fields that might be needed
  email: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema, 'users');