// /backend/express-server/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://sushmaaditya717:rdqdcaYTLY7p50za@adityaadi.vztbe.mongodb.net/mern_1_db", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
