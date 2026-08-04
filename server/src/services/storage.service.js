const fs = require('fs');
const path = require('path');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const env = require('../config/env');
const logger = require('../utils/logger');
const ApiError = require('../utils/apiError');

// Ensure local uploads directory exists
const localUploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

/**
 * Uploads a file buffer (from multer) either to Cloudinary or to local disk
 * @param {Object} file - Multer file object
 * @param {string} folder - Target folder on Cloudinary or subfolder locally
 * @returns {Promise<string>} - The URL of the uploaded file
 */
const uploadFile = async (file, folder = 'jobconnect') => {
  if (!file) {
    throw new ApiError(400, 'No file provided');
  }

  if (isCloudinaryConfigured) {
    try {
      const options = {
        folder: folder,
        resource_type: 'auto',
      };
      
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
          if (error) {
            logger.error(`Cloudinary upload failed: ${error.message}`);
            return reject(error);
          }
          resolve(result);
        });

        const { Readable } = require('stream');
        const readable = new Readable();
        readable._read = () => {};
        readable.push(file.buffer);
        readable.push(null);
        readable.pipe(stream);
      });

      return uploadResult.secure_url;
    } catch (error) {
      logger.error(`Cloudinary upload failed: ${error.message}. Falling back to local storage.`);
    }
  }

  // Fallback: Local Disk Storage
  try {
    const cleanFileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
    const destinationPath = path.join(localUploadsDir, cleanFileName);
    
    fs.writeFileSync(destinationPath, file.buffer);
    
    const localUrl = `http://localhost:${env.PORT}/uploads/${cleanFileName}`;
    logger.info(`File saved locally: ${localUrl}`);
    return localUrl;
  } catch (error) {
    logger.error(`Local file write failed: ${error.message}`);
    throw new ApiError(500, `File upload failed: ${error.message}`);
  }
};

module.exports = {
  uploadFile,
};
