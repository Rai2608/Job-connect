const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Log error
  logger.error(`${req.method} ${req.originalUrl} - ${statusCode} - ${message}`);
  if (statusCode === 500) {
    logger.error(err.stack);
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // Handle Mongoose Cast Error (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Handle Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    const fieldName = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered: ${fieldName}`;
    errors = [{
      field: fieldName,
      message: `${fieldName} is already taken`,
    }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
  });
};

module.exports = errorHandler;
