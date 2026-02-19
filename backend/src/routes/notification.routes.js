const express = require('express');
const router = express.Router();
const { authenticate: protect } = require('../middleware/auth.middleware');
const {
    getNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    getNotificationCount,
    getNotificationSettings,
    updateNotificationSettings
} = require('../controllers/notification.controller');

// All notification routes are protected
router.use(protect);

router.get('/', getNotifications);
router.get('/count', getNotificationCount);
router.put('/read-all', markAllAsRead);
router.get('/settings', getNotificationSettings);
router.put('/settings', updateNotificationSettings);
router.put('/:id', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
