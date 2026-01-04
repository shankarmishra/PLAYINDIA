const express = require('express');
const { protect } = require('../middleware/auth');
const { coachOnly } = require('../middleware/auth.middleware');
const {
  getAllCoaches,
  getCoachById,
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
router.get('/:id', getCoachById);
router.get('/:id/reviews', getCoachReviews);

// Protected routes
router.post('/', protect, createCoachProfile);
router.put('/:id', protect, coachOnly, updateCoachProfile);
router.delete('/:id', protect, coachOnly, deleteCoachProfile);
router.post('/:id/reviews', protect, addCoachReview);
router.get('/:id/schedule', getCoachSchedule);
router.put('/:id/schedule', protect, coachOnly, updateCoachSchedule);

module.exports = router; 