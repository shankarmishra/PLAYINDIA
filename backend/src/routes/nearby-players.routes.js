const express = require('express');
const router = express.Router();
const { authenticate: protect } = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');
const logger = require('../utils/logger');

/**
 * Get nearby players based on location and sport
 * @route GET /api/nearby-players
 * @access Private
 */
router.get('/', protect, userController.getNearbyPlayers);

/**
 * Notify nearby players (placeholder for real notification service)
 * @route POST /api/nearby-players/notify
 * @access Private
 */
router.post('/notify', protect, async (req, res) => {
  try {
    const { location, game, time, address, radius = 5 } = req.body;

    // Validation
    if (!location || !game || !time || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide game, time, address, and coordinates (location)'
      });
    }

    if (!Array.isArray(location) || location.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Location must be an array of [longitude, latitude]'
      });
    }

    // In a real implementation, you would trigger push notifications here using Firebase Cloud Messaging
    // 1. Query users within radius
    // 2. Filter by game preference
    // 3. Send FCM tokens to notification service

    logger.info(`Notification request by user ${req.user.id} for ${game} at ${address}`);

    res.json({
      success: true,
      message: `Notification request sent to players within ${radius}km for ${game}`,
      notificationDetails: {
        game,
        time,
        address,
        location,
        sender: req.user.name,
        timestamp: new Date()
      }
    });
  } catch (error) {
    logger.error('Nearby players notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing notification request'
    });
  }
});

module.exports = router;
