const mongoose = require('mongoose');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');


const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  let message = 'Duplicate field value. Please use another value!';
  
  // Try to extract the duplicate field value from error message
  if (err.errmsg) {
    const match = err.errmsg.match(/(["'])(\\?.)*?\1/);
    if (match && match[0]) {
      message = `Duplicate field value: ${match[0]}. Please use another value!`;
    }
  } else if (err.keyValue) {
    // MongoDB driver v4+ uses keyValue
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `Duplicate field value for ${field}: ${value}. Please use another value!`;
  }
  
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const handleMulterError = err => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File too large! Maximum size is 5MB', 400);
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files! Maximum is 5 files', 400);
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected field! Please check your form data', 400);
  }
  return new AppError('File upload error', 400);
};

const handleJSONParseError = err => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return new AppError('Invalid JSON format in request body. Please check your request data.', 400);
  }
  return err;
};

const sendErrorDev = (err, res) => {
  logger.error('Error 🔥:', {
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });

  res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    logger.error('Operational Error 🔥:', {
      status: err.status,
      message: err.message
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } 
  // Programming or other unknown error: don't leak error details
  else {
    // Log error for debugging
    logger.error('Unknown Error 🔥:', {
      error: err,
      stack: err.stack
    });

    // Send generic message
    res.status(500).json({
      success: false,
      message: 'Something went wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle JSON parsing errors first (works in both dev and prod)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    err = handleJSONParseError(err);
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error instanceof mongoose.Error.CastError) error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    if (error.name === 'MulterError') error = handleMulterError(error);

    sendErrorProd(error, res);
  }
}; 