const Achievement = require('../models/achievement.model');
const User = require('../models/user.model');

/**
 * Get all available achievements
 */
exports.getAchievements = async (req, res, next) => {
  try {
    const { category, type, level, rarity, active, limit = 20, page = 1 } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (level) {
      query.level = level;
    }
    
    if (rarity) {
      query.rarity = rarity;
    }
    
    if (active !== undefined) {
      query['validity.isActive'] = active === 'true';
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const achievements = await Achievement.find(query)
      .sort({ points: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Achievement.countDocuments(query);

    res.status(200).json({
      success: true,
      count: achievements.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: achievements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get user's achievements
 */
exports.getUserAchievements = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('achievements.achievementId', 'name description icon badgeColor points level rarity requirements');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const unlockedAchievements = user.achievements.filter(a => a.unlocked);
    const lockedAchievements = await Achievement.find({
      _id: { $nin: user.achievements.map(a => a.achievementId) },
      'validity.isActive': true
    });

    res.status(200).json({
      success: true,
      data: {
        unlocked: unlockedAchievements,
        locked: lockedAchievements,
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
 * Check if user has earned an achievement
 */
exports.checkAchievement = async (req, res, next) => {
  try {
    const { achievementId } = req.params;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userAchievement = user.achievements.find(
      a => a.achievementId.toString() === achievementId
    );

    if (userAchievement) {
      return res.status(200).json({
        success: true,
        data: {
          earned: true,
          earnedAt: userAchievement.earnedAt,
          unlocked: userAchievement.unlocked
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        earned: false
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
 * Get achievement details
 */
exports.getAchievement = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Award achievement to user (internal use)
 */
exports.awardAchievement = async (req, res, next) => {
  try {
    const { userId, achievementId, progress } = req.body;
    
    // Verify admin access for manual awarding
    // In a real implementation, you'd check if the requesting user is an admin
    
    const user = await User.findById(userId);
    const achievement = await Achievement.findById(achievementId);
    
    if (!user || !achievement) {
      return res.status(404).json({
        success: false,
        message: 'User or achievement not found'
      });
    }

    // Check if user already has this achievement
    const existingAchievement = user.achievements.find(
      a => a.achievementId.toString() === achievementId
    );

    if (existingAchievement) {
      return res.status(400).json({
        success: false,
        message: 'User already has this achievement'
      });
    }

    // Add achievement to user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          achievements: {
            achievementId,
            earnedAt: new Date(),
            unlocked: true,
            progress: progress || { current: achievement.requirements.threshold, target: achievement.requirements.threshold }
          }
        },
        $inc: {
          'playPoints.totalPoints': achievement.points,
          'playPoints.availablePoints': achievement.points,
          'experiencePoints': achievement.points
        }
      },
      { new: true }
    );

    // Update achievement analytics
    await Achievement.findByIdAndUpdate(
      achievementId,
      {
        $inc: { 'analytics.earnedCount': 1 }
      }
    );

    res.status(200).json({
      success: true,
      data: {
        achievement,
        user: updatedUser
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update achievement progress for user
 */
exports.updateAchievementProgress = async (req, res, next) => {
  try {
    const { achievementId } = req.params;
    const { increment = 0, newValue } = req.body;
    
    const user = await User.findById(req.user.id);
    const achievement = await Achievement.findById(achievementId);
    
    if (!user || !achievement) {
      return res.status(404).json({
        success: false,
        message: 'User or achievement not found'
      });
    }

    // Find the user's achievement record
    let userAchievement = user.achievements.find(
      a => a.achievementId.toString() === achievementId
    );

    let updatedProgress;
    if (userAchievement) {
      // Update existing progress
      const current = newValue !== undefined ? newValue : userAchievement.progress.current + increment;
      const target = userAchievement.progress.target || achievement.requirements.threshold;
      
      updatedProgress = {
        current: Math.min(current, target), // Don't exceed target
        target: target
      };
      
      // Update existing achievement
      userAchievement.progress = updatedProgress;
    } else {
      // Create new achievement record
      const current = newValue !== undefined ? newValue : increment;
      const target = achievement.requirements.threshold;
      
      updatedProgress = {
        current: Math.min(current, target),
        target: target
      };
      
      // Add new achievement to user
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $push: {
            achievements: {
              achievementId,
              earnedAt: new Date(),
              unlocked: false, // Will be unlocked below if threshold reached
              progress: updatedProgress
            }
          }
        }
      );
    }

    // Check if achievement should be unlocked
    if (updatedProgress.current >= updatedProgress.target && !userAchievement?.unlocked) {
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            'achievements.$.unlocked': true,
            'achievements.$.earnedAt': new Date()
          },
          $inc: {
            'playPoints.totalPoints': achievement.points,
            'playPoints.availablePoints': achievement.points,
            'experiencePoints': achievement.points
          }
        },
        { arrayFilters: [{ 'elem.achievementId': achievementId }] }
      );

      // Update achievement analytics
      await Achievement.findByIdAndUpdate(
        achievementId,
        {
          $inc: { 'analytics.earnedCount': 1 }
        }
      );

      // Send notification about achievement unlock
      // In a real implementation, you'd call the notification service
    }

    res.status(200).json({
      success: true,
      data: {
        achievement,
        progress: updatedProgress
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get achievement leaderboard
 */
exports.getAchievementLeaderboard = async (req, res, next) => {
  try {
    const { limit = 50 } = req.query;
    
    // Get users with the most achievements unlocked
    const users = await User.aggregate([
      {
        $addFields: {
          unlockedAchievementsCount: {
            $size: {
              $filter: {
                input: "$achievements",
                cond: { $eq: ["$$this.unlocked", true] }
              }
            }
          },
          totalAchievementPoints: {
            $sum: "$playPoints.totalPoints"
          }
        }
      },
      {
        $sort: { 
          unlockedAchievementsCount: -1, 
          totalAchievementPoints: -1,
          experiencePoints: -1
        }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          name: 1,
          mobile: 1,
          level: 1,
          experiencePoints: 1,
          playPoints: 1,
          unlockedAchievementsCount: 1,
          achievements: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;