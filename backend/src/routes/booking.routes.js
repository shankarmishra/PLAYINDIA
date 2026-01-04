const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { coachOnly } = require('../middleware/auth.middleware');
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
router.get('/coach', protect, coachOnly, getCoachBookings);
router.put('/:id/status', protect, coachOnly, updateBookingStatus);

// General routes (must come after specific routes)
router.get('/:id', protect, getBooking);

module.exports = router; 