const Notification = require('../models/Notification');
const ApiResponse = require('../utils/apiResponse');
const ApiError = require('../utils/apiError');

const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    return ApiResponse.success(res, notifications, 'Notifications retrieved successfully');
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOne({ _id: id, userId: req.user._id });
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }

    notification.isRead = true;
    await notification.save();

    return ApiResponse.success(res, notification, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    return ApiResponse.success(res, {}, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user._id, isRead: false });
    return ApiResponse.success(res, { count }, 'Unread count retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};
