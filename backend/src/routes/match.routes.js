const express = require('express');
const router = express.Router();
const { authenticate: protect, authorize } = require('../middleware/auth.middleware');
const {
    createMatch,
    getMatches,
    getMatch,
    updateMatchStatus,
    updateMatchResult,
    addMatchEvent,
    addLiveUpdate
} = require('../controllers/match.controller');

// Public routes
router.get('/', getMatches);
router.get('/:id', getMatch);

// Protected routes
router.use(protect);

router.post('/', authorize(['admin', 'coach']), createMatch);
router.put('/:id/status', updateMatchStatus);
router.put('/:id/result', updateMatchResult);
router.post('/:id/events', addMatchEvent);
router.post('/:id/live-update', addLiveUpdate);

module.exports = router;
