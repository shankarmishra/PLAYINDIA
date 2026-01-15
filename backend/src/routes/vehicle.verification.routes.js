const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { 
  uploadRC, 
  uploadInsurance, 
  getVehicleVerificationStatus
} = require('../controllers/vehicle.verification.controller');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Vehicle verification routes
router.get('/status', getVehicleVerificationStatus);
router.post('/rc', uploadRC);
router.post('/insurance', uploadInsurance);

module.exports = router;