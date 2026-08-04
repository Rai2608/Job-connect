const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  try {
    let mongoUri = env.MONGO_URI;
    // Auto-fix unencoded '!' in password portion of mongodb URIs
    if (mongoUri && mongoUri.includes(':') && mongoUri.includes('@')) {
      const atIndex = mongoUri.indexOf('@');
      const userPassPart = mongoUri.substring(0, atIndex);
      const hostPart = mongoUri.substring(atIndex);
      const fixedUserPassPart = userPassPart.replace(/!/g, '%21');
      mongoUri = fixedUserPassPart + hostPart;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;
