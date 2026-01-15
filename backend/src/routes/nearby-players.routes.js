const express = require('express');
const router = express.Router();
const { authenticate: protect } = require('../middleware/auth.middleware');
const logger = require('../utils/logger');

/**
 * Notify nearby players
 * @route POST /api/nearby-players/notify
 * @access Private
 */
router.post('/notify', protect, async (req, res) => {
  try {
    const { location, game, time, address } = req.body;

    // Validate required fields
    if (!location || !game || !time || !address) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // In a real implementation, you would:
    // 1. Query users within a certain radius of the location
    // 2. Filter by sport/game preference
    // 3. Send push notifications
    // 4. Store the match request in database

    // For now, return mock response
    const mockPlayers = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        distance: '2.5 km',
        sport: game,
        skillLevel: 'Intermediate'
      },
      {
        id: '2',
        name: 'Amit Patel',
        distance: '3.1 km',
        sport: game,
        skillLevel: 'Advanced'
      },
      {
        id: '3',
        name: 'Vikram Singh',
        distance: '4.8 km',
        sport: game,
        skillLevel: 'Beginner'
      }
    ];

    logger.info(`Notifying players for ${game} at ${address}`);

    res.json({
      success: true,
      message: `Successfully notified ${mockPlayers.length} players`,
      players: mockPlayers,
      matchDetails: {
        game,
        time,
        address,
        location
      }
    });
  } catch (error) {
    logger.error('Nearby players notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error notifying nearby players'
    });
  }
});

/**
 * Get nearby players
 * @route GET /api/nearby-players
 * @access Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const { latitude, longitude, radius = 10, sport } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    // Mock response
    const mockPlayers = [
      {
        id: '1',
        name: 'Rajesh Kumar',
        distance: '2.5 km',
        sports: ['Cricket', 'Football'],
        skillLevel: 'Intermediate',
        availability: 'Available'
      },
      {
        id: '2',
        name: 'Priya Sharma',
        distance: '3.2 km',
        sports: ['Badminton', 'Tennis'],
        skillLevel: 'Intermediate',
        availability: 'Available'
      }
    ];

    res.json({
      success: true,
      players: mockPlayers,
      count: mockPlayers.length
    });
  } catch (error) {
    logger.error('Get nearby players error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby players'
    });
  }
});

module.exports = router;
