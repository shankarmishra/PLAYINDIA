const express = require('express');
const { authenticate: protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/auth.middleware');
const {
  getAllCoaches,
  getCoachById,
  getMyCoachProfile,
  createCoachProfile,
  updateCoachProfile,
  deleteCoachProfile,
  getCoachSchedule,
  updateCoachSchedule,
  addCoachReview,
  getCoachReviews
} = require('../controllers/coach.controller');

const router = express.Router();

// Public routes
router.get('/', getAllCoaches);

// Protected routes
router.use(protect);
router.get('/profile', getMyCoachProfile); // Must come before /:id route
router.post('/', createCoachProfile);
router.get('/:id', getCoachById);
router.get('/:id/reviews', getCoachReviews);
router.put('/:id', protect, authorize('coach'), updateCoachProfile);
router.delete('/:id', protect, authorize('coach'), deleteCoachProfile);
router.post('/:id/reviews', protect, addCoachReview);
router.get('/:id/schedule', getCoachSchedule);
router.put('/:id/schedule', protect, authorize('coach'), updateCoachSchedule);

module.exports = router; 