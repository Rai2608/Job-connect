const Notification = require('../models/Notification');
const logger = require('../utils/logger');

/**
 * Create a notification for a user
 * @param {string} userId - Target User ID
 * @param {string} type - Notification Type (e.g. 'APPLICATION_STATUS', 'INTERVIEW_SCHEDULED', 'COMPANY_VERIFIED')
 * @param {string} message - Notification Message
 * @returns {Promise<Object>} - Saved notification
 */
const createNotification = async (userId, type, message) => {
  try {
    const notification = new Notification({
      userId,
      type,
      message,
    });
    await notification.save();
    logger.info(`Notification created for user ${userId}: ${type}`);
    return notification;
  } catch (error) {
    logger.error(`Failed to create notification: ${error.message}`);
    return null;
  }
};

module.exports = {
  createNotification,
};
