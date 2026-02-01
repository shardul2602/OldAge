const mongoose = require('mongoose');


async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGO_URI is not defined. Set it in your .env file.');
  }
  try {
    await mongoose.connect(uri, {
      // Keep options simple for a mini-project; Mongoose 8 uses sane defaults
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
