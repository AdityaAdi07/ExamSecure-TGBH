const mongoose = require('mongoose');

const RiskLogSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  appRisk: {
    type: Number,
    required: false,
    default: 0
  },
  finalRisk: {
    type: Number,
    required: true
  },
  keyboardRisk: {
    type: Number,
    required: true
  },
  mouseRisk: {
    type: Number,
    required: true
  },
  appsOpened: {
    type: Array,
    required: false,
    default: []
  },
  updatedAt: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    required: false,
    default: 'Normal'
  },
  // Add action field to store action messages
  action: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('RiskLog', RiskLogSchema, 'risklogs');