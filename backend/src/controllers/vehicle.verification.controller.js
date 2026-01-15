const multer = require('multer');
const path = require('path');
const User = require('../models/user.model');
const {
  verifyRC,
  verifyInsurance,
  getVehicleVerificationStatus
} = require('../services/vehicle.verification.service');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory for Firebase upload
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * Upload and verify RC document
 */
exports.uploadRC = [
  upload.single('document'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'RC document is required'
        });
      }

      const result = await verifyRC(req.user._id, req.file);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      console.error('Upload RC error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
];

/**
 * Upload and verify insurance document
 */
exports.uploadInsurance = [
  upload.single('document'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Insurance document is required'
        });
      }

      const result = await verifyInsurance(req.user._id, req.file);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      console.error('Upload insurance error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
];

/**
 * Get vehicle verification status
 */
exports.getVehicleVerificationStatus = async (req, res, next) => {
  try {
    const result = await getVehicleVerificationStatus(req.user._id);

    res.status(200).json({
      success: true,
      data: result.vehicleVerification
    });
  } catch (error) {
    console.error('Get vehicle verification status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};