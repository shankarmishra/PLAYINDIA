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
    const { location, game, time, address } = req.body;

    if (!location || !game || !time || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // In a real implementation, you would trigger push notifications here
    // For now, we log the request and return success
    logger.info(`Notification request for ${game} at ${address}`);

    res.json({
      success: true,
      message: `Notification request sent for ${game}`,
      matchDetails: { game, time, address, location }
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
