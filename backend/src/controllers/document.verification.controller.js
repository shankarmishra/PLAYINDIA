const multer = require('multer');
const path = require('path');
const User = require('../models/user.model');
const {
  verifyAadhaar,
  verifyPan,
  verifyFaceMatch,
  getUserVerificationStatus,
  updateVerificationStatus
} = require('../services/document.verification.service');

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
 * Upload and verify Aadhaar document
 */
exports.uploadAadhaar = [
  upload.fields([
    { name: 'front', maxCount: 1 },
    { name: 'back', maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      const { front, back } = req.files;

      if (!front || !back) {
        return res.status(400).json({
          success: false,
          message: 'Both front and back of Aadhaar are required'
        });
      }

      const result = await verifyAadhaar(req.user._id, {
        front: front[0],
        back: back[0]
      });

      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      console.error('Upload Aadhaar error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
];

/**
 * Upload and verify PAN document
 */
exports.uploadPan = [
  upload.single('document'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'PAN document is required'
        });
      }

      const result = await verifyPan(req.user._id, req.file);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      console.error('Upload PAN error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
];

/**
 * Upload selfie for face match verification
 */
exports.uploadSelfie = [
  upload.single('selfie'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Selfie is required'
        });
      }

      // For face match, we need a document photo URL to compare with
      const { documentPhotoUrl } = req.body;

      if (!documentPhotoUrl) {
        return res.status(400).json({
          success: false,
          message: 'Document photo URL is required for face match'
        });
      }

      const result = await verifyFaceMatch(req.user._id, req.file, documentPhotoUrl);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (error) {
      console.error('Upload selfie error:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
];

/**
 * Get user verification status
 */
exports.getVerificationStatus = async (req, res, next) => {
  try {
    const result = await getUserVerificationStatus(req.user._id);

    res.status(200).json({
      success: true,
      data: result.verification
    });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update verification status (Admin only)
 */
exports.updateVerificationStatus = async (req, res, next) => {
  try {
    const { userId, verificationType, status, reason } = req.body;

    if (!userId || !verificationType || !status) {
      return res.status(400).json({
        success: false,
        message: 'userId, verificationType, and status are required'
      });
    }

    const result = await updateVerificationStatus(userId, verificationType, status, reason);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.verification
    });
  } catch (error) {
    console.error('Update verification status error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all pending verifications (Admin only)
 */
exports.getPendingVerifications = async (req, res, next) => {
  try {
    // Find users with pending or manual review verifications
    const users = await User.find({
      $or: [
        { 'verification.aadhaar.status': { $in: ['pending', 'manual_review'] } },
        { 'verification.pan.status': { $in: ['pending', 'manual_review'] } },
        { 'verification.faceMatch.status': { $in: ['pending', 'manual_review'] } }
      ]
    }).select('name email mobile verification createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get pending verifications error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Export the upload middleware for use in routes
exports.uploadMiddleware = upload;