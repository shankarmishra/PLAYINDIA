const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { 
  getAddress,
  getCoordinates,
  updateLocation,
  getNearbyUsers,
  getNearbyCoaches
} = require('../controllers/address.controller');

const router = express.Router();

// Public routes (authenticated users only)
router.use(authenticate);

// Address routes
router.get('/from-coordinates', getAddress);
router.get('/to-coordinates', getCoordinates);
router.put('/update', updateLocation);
router.get('/nearby-users', getNearbyUsers);
router.get('/nearby-coaches', getNearbyCoaches);

module.exports = router;