const User = require('../models/user.model');
const Coach = require('../models/coach.model');
const Store = require('../models/Store.model');
const Delivery = require('../models/delivery.model');
const Booking = require('../models/booking.model');
const Order = require('../models/order.model');
const Wallet = require('../models/Wallet.model');
const Achievement = require('../models/achievement.model');
const Notification = require('../models/Notification.model');
const PlayPoint = require('../models/PlayPoint.model');
const Review = require('../models/Review.model');

/**
 * Get nearby players based on location, skill, and preferences
 */
exports.getNearbyPlayers = async (req, res, next) => {
  try {
    const { lat, lng, distance = 5, game, skill, availability } = req.query;
    const userId = req.user.id;

    // Convert distance to radians for MongoDB geospatial queries
    const radiusInRadians = distance / 6378.1; // Earth's radius in km

    // Build query
    const query = {
      _id: { $ne: userId }, // Exclude current user
      role: 'user',
      status: 'active',
      'location.coordinates': {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            radiusInRadians
          ]
        }
      }
    };

    // Add optional filters
    if (game) {
      query['preferences.favoriteGames'] = { $in: [game] };
    }

    if (skill) {
      query['preferences.skillLevel'] = skill;
    }

    if (availability === 'true') {
      // Add availability filter if needed
      query['availability.isAvailable'] = true;
    }

    const users = await User.find(query)
      .select('name mobile location preferences trustScore level')
      .limit(50);

    // Calculate AI-based matching scores
    const usersWithScores = users.map(user => {
      // Simple matching algorithm - can be enhanced with ML
      let score = 0;
      
      // Distance factor (closer is better)
      const userLat = user.location.coordinates[1];
      const userLng = user.location.coordinates[0];
      const distance = calculateDistance(lat, lng, userLat, userLng);
      score += Math.max(0, 100 - (distance * 10)); // Up to 100 points for distance
      
      // Skill compatibility
      if (game && user.preferences.favoriteGames.includes(game)) {
        score += 30;
      }
      
      // Trust score factor
      score += user.trustScore;
      
      return {
        ...user.toObject(),
        matchScore: Math.min(score, 100)
      };
    });

    // Sort by match score
    usersWithScores.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      count: usersWithScores.length,
      data: usersWithScores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get user profile with stats and achievements
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id)
      .populate('achievements.achievementId', 'name description icon badgeColor points level rarity')
      .populate('referral.referredBy', 'name mobile');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get additional stats
    const bookings = await Booking.countDocuments({
      $or: [
        { userId: id },
        { coachId: id }
      ]
    });

    const reviews = await Review.countDocuments({ 'reviewee.userId': id });
    const avgRating = await Review.aggregate([
      { $match: { 'reviewee.userId': id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const profileData = {
      ...user.toObject(),
      stats: {
        totalBookings: bookings,
        totalReviews: reviews,
        averageRating: avgRating[0] ? avgRating[0].avgRating : 0
      }
    };

    res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update user preferences
 */
exports.updatePreferences = async (req, res, next) => {
  try {
    const { preferences } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get user dashboard data
 */
exports.getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user with populated data
    const user = await User.findById(userId)
      .populate('achievements.achievementId', 'name description icon badgeColor points level rarity');

    // Get user wallet
    const wallet = await Wallet.findOne({ userId });

    // Get recent bookings
    const recentBookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('coachId', 'name');

    // Get upcoming bookings
    const upcomingBookings = await Booking.find({
      userId,
      status: { $in: ['pending', 'confirmed'] },
      'schedule.date': { $gte: new Date() }
    }).populate('coachId', 'name');

    // Get recent orders
    const recentOrders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get nearby PlayPoints
    const nearbyPlayPoints = await PlayPoint.find({
      'location.coordinates': {
        $geoWithin: {
          $centerSphere: [
            [user.location.coordinates[0], user.location.coordinates[1]],
            5 / 6378.1 // 5km radius
          ]
        }
      }
    }).limit(10);

    const dashboardData = {
      user: {
        ...user.toObject(),
        walletBalance: wallet ? wallet.balance : 0
      },
      stats: {
        todayMatches: 0, // Implement based on user's teams
        upcomingTournaments: 0, // Implement based on user's participation
        fitnessSummary: {} // Implement based on integration with health APIs
      },
      sections: {
        todayBookings: recentBookings.filter(b => 
          new Date(b.schedule.date).toDateString() === new Date().toDateString()
        ),
        nearbyPlayers: [], // Will be populated by separate API call
        upcomingTournaments: [], // Implement based on user's interests
        orders: recentOrders,
        wallet: wallet ? wallet.balance : 0
      },
      charts: {
        gamesPlayed: [], // Implement based on user's activity
        winLossRatio: 0, // Implement based on user's teams/matches
        caloriesBurned: 0, // Implement based on health integration
        skillProgression: 0 // Implement based on coach feedback
      }
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get user achievements
 */
exports.getUserAchievements = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('achievements.achievementId', 'name description icon badgeColor points level rarity');

    const unlockedAchievements = user.achievements.filter(a => a.unlocked);
    
    res.status(200).json({
      success: true,
      data: {
        unlocked: unlockedAchievements,
        totalPoints: user.playPoints.totalPoints,
        availablePoints: user.playPoints.availablePoints
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Calculate distance between two points (in km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

// Export the required functions for user routes
exports.getUsers = async (req, res, next) => {
  try {
    // Get all users with pagination and filtering
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // Build query with filters
    const query = {};
    if (req.query.role) {
      query.role = req.query.role;
    }
    if (req.query.status) {
      query.status = req.query.status;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      page,
      pages: Math.ceil(total / limit),
      total,
      data: {
        users: users,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserProfile = exports.getUserProfile;

exports.updateUserProfile = async (req, res, next) => {
  try {
    const allowedUpdates = ['name', 'email', 'mobile', 'location', 'preferences'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid updates!'
      });
    }

    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['user', 'coach', 'seller', 'delivery', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'active', 'inactive', 'suspended', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status specified'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;