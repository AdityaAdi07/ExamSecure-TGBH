// /backend/express-server/models/RiskLog.js
const mongoose = require('mongoose');

const RiskLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    ref: 'User'
  },
  username:String,
  mouseRisk: Number,
  keyboardRisk: Number,
  appRisk: Number,
  finalRisk: Number,
  appsOpened: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RiskLog', RiskLogSchema);
