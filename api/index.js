const mongoose = require('mongoose');
const connectDB = require('../server/src/config/db');
const app = require('../server/src/app');

module.exports = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return res.status(500).json({
      success: false,
      message: `Database connection error: ${error.message}`,
    });
  }
  return app(req, res);
};
