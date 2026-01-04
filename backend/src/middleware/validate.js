const validator = require('validator');
const logger = require('../utils/logger');
const { validationResult, body, param, query } = require('express-validator');
const { AppError } = require('./error');

// Validate email
const validateEmail = (email) => {
  return validator.isEmail(email);
};

// Validate password
const validatePassword = (password) => {
  return password.length >= 8 && // minimum length
    /[A-Z]/.test(password) && // has uppercase
    /[a-z]/.test(password) && // has lowercase
    /[0-9]/.test(password) && // has number
    /[^A-Za-z0-9]/.test(password); // has special char
};

// Validate phone number
const validatePhone = (phone) => {
  return validator.isMobilePhone(phone);
};

// Validate URL
const validateURL = (url) => {
  return validator.isURL(url);
};

// Validate date
const validateDate = (date) => {
  return validator.isDate(date);
};

// Validate coordinates
const validateCoordinates = (coords) => {
  if (!coords || !coords.type || !coords.coordinates) return false;
  if (coords.type !== 'Point') return false;
  const [longitude, latitude] = coords.coordinates;
  return validator.isLatLong(`${latitude},${longitude}`);
};

// Request body validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      logger.error('Validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.details[0].message
      });
    }
    next();
  };
};

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    return next(new AppError(errorMessages.join('. '), 400));
  }
  next();
};

// Common validation rules
const commonValidations = {
  // ID validation
  id: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format'),
    validate
  ],

  // Pagination validation
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    validate
  ],

  // Search validation
  search: [
    query('search')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Search query cannot be empty'),
    validate
  ],

  // Sort validation
  sort: [
    query('sort')
      .optional()
      .isString()
      .matches(/^[a-zA-Z]+(:[1,-1])?$/)
      .withMessage('Invalid sort format. Use field:1 or field:-1'),
    validate
  ],

  // Date range validation
  dateRange: [
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO date'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO date')
      .custom((endDate, { req }) => {
        if (req.query.startDate && endDate <= req.query.startDate) {
          throw new Error('End date must be after start date');
        }
        return true;
      }),
    validate
  ]
};

// Auth validations
const authValidations = {
  register: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    body('phone')
      .optional()
      .matches(/^\+[1-9]\d{10,14}$/)
      .withMessage('Please provide a valid phone number with country code'),
    validate
  ],

  login: [
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
    validate
  ],

  updatePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/)
      .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
    validate
  ],

  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('phone')
      .optional()
      .matches(/^\+[1-9]\d{10,14}$/)
      .withMessage('Please provide a valid phone number with country code'),
    body('address')
      .optional()
      .isObject()
      .withMessage('Address must be an object')
      .custom((value) => {
        if (value) {
          const requiredFields = ['street', 'city', 'state', 'pincode'];
          const missingFields = requiredFields.filter(field => !value[field]);
          if (missingFields.length > 0) {
            throw new Error(`Address must contain ${missingFields.join(', ')}`);
          }
        }
        return true;
      }),
    validate
  ]
};

// User validations
const userValidations = {
  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('phone')
      .optional()
      .matches(/^\+[1-9]\d{10,14}$/)
      .withMessage('Please provide a valid phone number with country code'),
    body('address')
      .optional()
      .isObject()
      .withMessage('Address must be an object')
      .custom((value) => {
        if (value) {
          const requiredFields = ['street', 'city', 'state', 'pincode'];
          const missingFields = requiredFields.filter(field => !value[field]);
          if (missingFields.length > 0) {
            throw new Error(`Address must contain ${missingFields.join(', ')}`);
          }
        }
        return true;
      }),
    validate
  ]
};

// Product validations
const productValidations = {
  create: [
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('description')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('Description must be between 10 and 1000 characters'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('category')
      .isIn(['Equipment', 'Apparel', 'Accessories', 'Other'])
      .withMessage('Invalid category'),
    body('stock')
      .isInt({ min: 0 })
      .withMessage('Stock must be a non-negative integer')
  ]
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateURL,
  validateDate,
  validateCoordinates,
  validateRequest,
  validate,
  commonValidations,
  authValidations,
  userValidations,
  productValidations
}; 