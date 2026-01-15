const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { 
  getCompleteVerificationStatus,
  getVerificationSummary
} = require('../controllers/verification.controller');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Verification summary routes
router.get('/complete-status', getCompleteVerificationStatus);
router.get('/summary', getVerificationSummary);

module.exports = router;