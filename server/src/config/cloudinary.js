const cloudinary = require('cloudinary').v2;
const env = require('./env');
const logger = require('../utils/logger');

let isCloudinaryConfigured = false;

if (env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
  isCloudinaryConfigured = true;
  logger.info('Cloudinary configured successfully.');
} else {
  logger.warn('Cloudinary credentials missing. File uploads will fall back to local disk storage.');
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
};
