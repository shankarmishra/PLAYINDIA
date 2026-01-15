const express = require('express');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { 
  uploadAadhaar, 
  uploadPan, 
  uploadSelfie, 
  getVerificationStatus,
  updateVerificationStatus,
  getPendingVerifications
} = require('../controllers/document.verification.controller');

const router = express.Router();

// Public routes (authenticated users only)
router.use(authenticate);

// User routes
router.get('/status', getVerificationStatus);
router.post('/aadhaar', uploadAadhaar);
router.post('/pan', uploadPan);
router.post('/selfie', uploadSelfie);

// Admin routes
router.use(authorize('admin'));
router.patch('/status', updateVerificationStatus);
router.get('/pending', getPendingVerifications);

module.exports = router;