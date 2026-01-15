const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const User = require('../models/user.model');
const logger = require('../utils/logger');

const {
  getUsers,
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  updateUserStatus,
  changePassword
} = require('../controllers/user.controller');

// Public routes
/**
 * Get leaderboard
 * @route GET /api/users/leaderboard
 * @access Public
 */
router.get('/leaderboard', async (req, res) => {
  try {
    // Get top users by coins/points
    const topUsers = await User.find()
      .select('name coins topDays')
      .sort({ coins: -1 })
      .limit(50);

    // If user is authenticated, get their rank
    let userRank = null;
    if (req.user) {
      const user = await User.findById(req.user._id).select('name coins topDays');
      if (user) {
        const rank = await User.countDocuments({
          coins: { $gt: user.coins }
        }) + 1;
        
        userRank = {
          rank,
          name: user.name,
          coins: user.coins || 0,
          topDays: user.topDays || 0
        };
      }
    }

    res.json({
      success: true,
      leaderboard: topUsers.map((user, index) => ({
        id: user._id,
        name: user.name,
        coins: user.coins || 0,
        topDays: user.topDays || 0
      })),
      userRank
    });
  } catch (error) {
    logger.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard'
    });
  }
});

// User routes
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);
router.put('/change-password', authenticate, changePassword);

// Admin routes
router.get('/', authenticate, authorize('admin'), getUsers);
router.put('/:id/role', authenticate, authorize('admin'), updateUserRole);
router.put('/:id', authenticate, authorize('admin'), updateUserStatus);

module.exports = router;
