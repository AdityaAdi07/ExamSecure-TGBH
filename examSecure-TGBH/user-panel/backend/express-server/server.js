// /backend/express-server/server.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const mongoose = require("mongoose"); // ✅ Import mongoose
const app = express();
app.use(cors());
const server = http.createServer(app);
app.use(express.json());
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Simple test route
app.get('/', (req, res) => {
  res.send('Express server for proctoring is running...');
});

// Auth routes
app.use('/api/auth', authRoutes);

mongoose.connect("mongodb+srv://sushmaaditya717:rdqdcaYTLY7p50za@adityaadi.vztbe.mongodb.net/mern_1_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define RiskLog schema and model first (moved up)
const RiskLog = mongoose.model("RiskLog", new mongoose.Schema({
  userId: String,
  action: String, // "ban" or "warning"
  updatedAt: { type: Date, default: Date.now }
}));

// Track connected users
const connectedUsers = {};

// Socket.IO connection handling (consolidated)
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  
  // Handle user join
  socket.on('join', async ({ userId }) => {
    if (!userId) {
      console.log("No userId provided");
      return;
    }
    
    console.log(`User ${userId} joined with socket ID: ${socket.id}`);
    connectedUsers[userId] = socket.id;
    
    // Check if user already has a ban/warning
    try {
      const latestLog = await RiskLog.findOne({ userId }).sort({ updatedAt: -1 });
      if (latestLog && latestLog.action === 'BAN') {
        io.to(socket.id).emit('banUser');
        console.log(`🚨 User ${userId} notified of existing ban on connect`);
      } else if (latestLog && latestLog.action === 'warning') {
        io.to(socket.id).emit('warnUser');
        console.log(`⚠️ User ${userId} notified of existing warning on connect`);
      }
    } catch (err) {
      console.error('Error checking user risk status:', err);
    }
  });
  
  // Risk update from Python app
  socket.on('riskUpdate', async (data) => {
    try {
      const newLog = new RiskLog(data);
      await newLog.save();
      console.log('✅ Risk log saved for userId:', data.userId);
    } catch (err) {
      console.error('❌ Error saving risk log:', err);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    const userId = Object.keys(connectedUsers).find(key => connectedUsers[key] === socket.id);
    if (userId) {
      delete connectedUsers[userId];
      console.log(`User ${userId} disconnected`);
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Set up MongoDB change stream to watch for risk log changes
try {
  const changeStream = RiskLog.watch();
  
  changeStream.on('change', (change) => {
    if (change.operationType === 'insert' || change.operationType === 'update') {
      // For insert operations
      let userId, action;
      
      if (change.operationType === 'insert') {
        userId = change.fullDocument.userId;
        action = change.fullDocument.action;
      } 
      // For update operations
      else if (change.operationType === 'update') {
        userId = change.documentKey._id.toString();
        
        // Check if action field was updated
        if (change.updateDescription && change.updateDescription.updatedFields.action) {
          action = change.updateDescription.updatedFields.action;
        }
      }
      
      // Send notification if we have both userId and action
      if (userId && action && connectedUsers[userId]) {
        if (action === 'BAN') {
          io.to(connectedUsers[userId]).emit('banUser');
          console.log(`🚨 Emitted 'banUser' event to socket ID ${connectedUsers[userId]} for user ${userId}`);
        } else if (action === 'warning') {
          io.to(connectedUsers[userId]).emit('warnUser');
          console.log(`⚠️ User ${userId} warned and notified.`);
        }
      }
    }
  });
  
  console.log('MongoDB change stream initialized successfully');
} catch (err) {
  console.error('Failed to initialize change stream:', err);
}

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});