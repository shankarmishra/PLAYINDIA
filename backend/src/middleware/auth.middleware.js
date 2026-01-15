const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const Admin = require('../models/Admin.model');
const config = require('../config');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Check if user exists based on role
    let user;
    if (decoded.userType === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
    } else {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Check if user is active
    if (user.status === 'inactive' || user.status === 'suspended') {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive or suspended.'
      });
    }

    req.user = user;
    req.userId = decoded.id;
    req.userType = decoded.userType;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    // If user is an admin (userType === 'admin'), allow access for admin routes
    // Admin roles: 'super_admin', 'admin', 'moderator', 'support_agent', 'content_manager'
    if (req.userType === 'admin') {
      // Check if any of the admin roles match the required roles
      const adminRoles = ['super_admin', 'admin', 'moderator', 'support_agent', 'content_manager'];
      const userRole = req.user.role || 'admin';
      
      // If 'admin' is in required roles, allow any admin userType
      if (roles.includes('admin') && adminRoles.includes(userRole)) {
        return next();
      }
      
      // If specific admin role is required, check if user has that role
      if (roles.includes(userRole)) {
        return next();
      }
    }

    // For regular users, check if their role matches
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Check if user is active
const checkUserStatus = async (req, res, next) => {
  try {
    if (!req.user) {
      return next();
    }

    if (req.user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended.'
      });
    }

    if (req.user.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your account registration has been rejected.'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking user status.'
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  checkUserStatus
};