const express = require('express');
const router = express.Router();
const { authenticate: protect } = require('../middleware/auth.middleware');
const {
    getAchievements,
    getUserAchievements,
    getAchievement,
    checkAchievement,
    updateAchievementProgress,
    getAchievementLeaderboard
} = require('../controllers/achievement.controller');

// Public routes
router.get('/leaderboard', getAchievementLeaderboard);

// Protected routes
router.use(protect);

router.get('/', getAchievements);
router.get('/user', getUserAchievements);
router.get('/:id', getAchievement);
router.get('/:id/check', checkAchievement);
router.put('/:id/progress', updateAchievementProgress);

module.exports = router;
