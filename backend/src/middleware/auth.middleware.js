const jwt = require('jsonwebtoken');
const { AppError } = require('./error');
const User = require('../models/user.model');
const Coach = require('../models/coach.model');
const config = require('../config');

// Protect routes
const protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // 3) Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user changed password after the token was issued
    if (user.passwordChangedAfter && user.passwordChangedAfter(decoded.iat)) {
      return next(new AppError('User recently changed password! Please log in again.', 401));
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Authentication failed', 401));
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

// Coach only middleware
const coachOnly = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }
    
    if (req.user.role !== 'coach') {
      return next(new AppError('You do not have permission to perform this action. Coach access required.', 403));
    }
    
    // Find and attach coach profile to request
    const coach = await Coach.findOne({ user: req.user._id });
    if (!coach) {
      return next(new AppError('Coach profile not found', 404));
    }
    
    req.coach = coach;
    next();
  } catch (error) {
    next(new AppError('Error verifying coach access', 500));
  }
};

module.exports = {
  protect,
  authorize,
  coachOnly
}; 