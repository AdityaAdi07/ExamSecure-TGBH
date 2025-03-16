const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Note: The actual MongoDB URI will be provided by the user
    // and should be stored in a .env file
    const conn = await mongoose.connect('mongodb+srv://sushmaaditya717:rdqdcaYTLY7p50za@adityaadi.vztbe.mongodb.net/mern_1_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;