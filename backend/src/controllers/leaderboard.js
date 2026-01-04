/**
 * Get leaderboard
 * @route GET /api/users/leaderboard
 * @access Public
 */
exports.getLeaderboard = async (req, res) => {
  try {
    // Get top users by coins/points
    const topUsers = await User.find({ role: 'player' })
      .select('name coins topDays')
      .sort({ coins: -1 })
      .limit(50);

    // If user is authenticated, get their rank
    let userRank = null;
    if (req.user) {
      const user = await User.findById(req.user._id).select('name coins topDays');
      if (user) {
        const rank = await User.countDocuments({
          role: 'player',
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
};
