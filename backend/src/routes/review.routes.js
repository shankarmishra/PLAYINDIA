const express = require('express');
const router = express.Router();
const { authenticate: protect } = require('../middleware/auth.middleware');
const {
    createReview,
    getReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    markReviewHelpful,
    getTopReviews
} = require('../controllers/review.controller');

// Public routes
router.get('/', getReviews);
router.get('/top', getTopReviews);

// Protected routes
router.use(protect);

router.post('/', createReview);
router.get('/user', getUserReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markReviewHelpful);

module.exports = router;
