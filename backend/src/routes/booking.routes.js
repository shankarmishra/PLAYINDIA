const express = require('express');
const router = express.Router();
const { authenticate: protect, authorize } = require('../middleware/auth.middleware');
// Note: coachOnly middleware doesn't exist, using role-based authorization instead
const {
  createBooking,
  getUserBookings,
  getCoachBookings,
  getBooking,
  updateBookingStatus,
  rateBooking
} = require('../controllers/booking.controller');

// User routes
router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.post('/:id/rate', protect, rateBooking);

// Coach routes (must come before /:id route to avoid route conflicts)
router.get('/coach', protect, authorize('coach'), getCoachBookings);
router.put('/:id/status', protect, authorize('coach'), updateBookingStatus);

// General routes (must come after specific routes)
router.get('/:id', protect, getBooking);

module.exports = router; 