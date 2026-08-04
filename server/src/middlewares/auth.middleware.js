const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required. Bearer token missing.');
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    } catch (err) {
      throw new ApiError(401, 'Invalid or expired access token');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'User associated with this token no longer exists.');
    }

    if (user.isSuspended) {
      throw new ApiError(403, 'Your account has been suspended.');
    }

    // Require email verification for all authenticated routes
    if (!user.isVerified) {
      throw new ApiError(403, 'Your email is not verified. Please verify your email.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
};
