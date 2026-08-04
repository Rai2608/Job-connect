const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const requiredEnv = [
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET'
];

// Check required environment variables
requiredEnv.forEach((envName) => {
  if (!process.env[envName]) {
    console.error(`WARNING: Environment variable ${envName} is not set! Using default placeholder for development.`);
    process.env[envName] = 'placeholder_secret_for_development_purposes_only';
  }
});

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/jobconnect',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:4200',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@jobconnect.com'
};
