const connectDB = require('../server/src/config/db');
const app = require('../server/src/app');

// Cache DB connection across warm serverless invocations
let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      await connectDB();
      isConnected = true;
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
