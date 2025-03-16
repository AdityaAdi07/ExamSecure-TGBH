const User = require('../models/User');
const RiskLog = require('../models/RiskLog');
const mongoose = require('mongoose');

// Get all users with their risk data
exports.getUsers = async (req, res) => {
  try {
    // First get all users
    const users = await User.find();
    
    // Then get all risk logs
    const riskLogs = await RiskLog.find();
    
    // Map risk logs to users
    const userData = users.map(user => {
      // Find the risk log for this user
      const riskLog = riskLogs.find(log => log.userId === user._id.toString());
      
      // If risk log exists, calculate status based on final risk
      let status = 'Normal';
      if (riskLog) {
        if (riskLog.finalRisk > 90) {
          status = 'Ban';
        } else if (riskLog.finalRisk > 80) {
          status = 'OS Lockdown';
        } else if (riskLog.finalRisk > 50) {
          status = 'Warning';
        }
        
        // Update the risk log with the status
        RiskLog.findByIdAndUpdate(riskLog._id, { status })
          .catch(err => console.error('Error updating status:', err));
      }
      
      // Return user data with risk information
      return {
        _id: user._id,
        name: user.username,
        riskScore: riskLog ? Math.round(riskLog.finalRisk) : 0,
        keyboardRisk: riskLog ? Math.round(riskLog.keyboardRisk * 100) / 100 : 0,
        mouseRisk: riskLog ? Math.round(riskLog.mouseRisk * 100) / 100 : 0,
        status: riskLog ? status : 'Normal',
        lastEvent: riskLog ? new Date(riskLog.updatedAt).toLocaleString() : 'N/A',
        appsOpened: riskLog ? riskLog.appsOpened : [],
        latestApp: riskLog && riskLog.appsOpened && riskLog.appsOpened.length > 0 
          ? riskLog.appsOpened[riskLog.appsOpened.length - 1] 
          : 'None'
      };
    });
    
    // Calculate risk distribution
    const lowRisk = userData.filter(user => user.riskScore < 50).length;
    const mediumRisk = userData.filter(user => user.riskScore >= 50 && user.riskScore < 80).length;
    const highRisk = userData.filter(user => user.riskScore >= 80).length;
    
    const riskDistribution = {
      labels: ['Low', 'Medium', 'High'],
      data: [lowRisk, mediumRisk, highRisk]
    };
    
    // Get users with non-normal status for real-time alerts
    const alertUsers = userData.filter(user => user.status !== 'Normal');
    
    res.json({
      users: userData,
      riskDistribution,
      alertUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get specific user with risk data
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const riskLog = await RiskLog.findOne({ userId: user._id.toString() });
    
    res.json({
      user,
      riskLog
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Ban a user
exports.banUser = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Find the user's risk log
    const riskLog = await RiskLog.findOne({ userId });
    
    if (!riskLog) {
      return res.status(404).json({ message: 'Risk log not found for user' });
    }
    
    // Update status to 'Ban' and set action message
    await RiskLog.findByIdAndUpdate(riskLog._id, { 
      status: 'Ban',
      action: 'BAN'
    });
    
    res.json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Error banning user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Unban a user
exports.unbanUser = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Find the user's risk log
    const riskLog = await RiskLog.findOne({ userId });
    
    if (!riskLog) {
      return res.status(404).json({ message: 'Risk log not found for user' });
    }
    
    // Recalculate status based on risk score
    let status = 'Normal';
    if (riskLog.finalRisk > 80) {
      status = 'OS Lockdown';
    } else if (riskLog.finalRisk > 50) {
      status = 'Warning';
    }
    
    // Update status and clear action
    await RiskLog.findByIdAndUpdate(riskLog._id, { 
      status,
      action: null
    });
    
    res.json({ message: 'User unbanned successfully' });
  } catch (error) {
    console.error('Error unbanning user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send warning to a user
exports.sendWarning = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Find the user's risk log
    const riskLog = await RiskLog.findOne({ userId });
    
    if (!riskLog) {
      return res.status(404).json({ message: 'Risk log not found for user' });
    }
    
    // Update status to 'Warning' if not already higher and set action message
    const updates = { action: 'YOU HAVE BEEN FLAGGED' };
    
    if (riskLog.status !== 'Ban' && riskLog.status !== 'OS Lockdown') {
      updates.status = 'Warning';
    }
    
    await RiskLog.findByIdAndUpdate(riskLog._id, updates);
    
    res.json({ message: 'Warning sent successfully' });
  } catch (error) {
    console.error('Error sending warning:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.params;
    
    const users = await User.find({
      name: { $regex: query, $options: 'i' }
    });
    
    // Get risk logs for these users
    const userIds = users.map(user => user._id.toString());
    const riskLogs = await RiskLog.find({ userId: { $in: userIds } });
    
    // Map risk logs to users
    const userData = users.map(user => {
      const riskLog = riskLogs.find(log => log.userId === user._id.toString());
      
      let status = 'Normal';
      if (riskLog) {
        if (riskLog.finalRisk > 90) {
          status = 'Ban';
        } else if (riskLog.finalRisk > 80) {
          status = 'OS Lockdown';
        } else if (riskLog.finalRisk > 50) {
          status = 'Warning';
        }
      }
      
      return {
        _id: user._id,
        name: user.username,
        riskScore: riskLog ? Math.round(riskLog.finalRisk) : 0,
        keyboardRisk: riskLog ? Math.round(riskLog.keyboardRisk * 100) / 100 : 0,
        mouseRisk: riskLog ? Math.round(riskLog.mouseRisk * 100) / 100 : 0,
        status: riskLog ? status : 'Normal',
        lastEvent: riskLog ? new Date(riskLog.updatedAt).toLocaleString() : 'N/A',
        appsOpened: riskLog ? riskLog.appsOpened : [],
        latestApp: riskLog && riskLog.appsOpened && riskLog.appsOpened.length > 0 
          ? riskLog.appsOpened[riskLog.appsOpened.length - 1] 
          : 'None'
      };
    });
    
    // Get users with non-normal status for real-time alerts
    const alertUsers = userData.filter(user => user.status !== 'Normal');
    
    res.json({
      users: userData,
      alertUsers
    });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};