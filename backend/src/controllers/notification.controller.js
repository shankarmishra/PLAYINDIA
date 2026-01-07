const Notification = require('../models/Notification.model');
const User = require('../models/user.model');

/**
 * Get user notifications
 */
exports.getNotifications = async (req, res, next) => {
  try {
    const { read, type, category, priority, limit = 20, page = 1 } = req.query;
    
    let query = { userId: req.user.id };
    
    if (read !== undefined) {
      query.read = read === 'true';
    }
    
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Mark notification as read
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      {
        $set: {
          read: true,
          readAt: new Date()
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedNotification
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Mark all notifications as read
 */
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        userId: req.user.id,
        read: false
      },
      {
        $set: {
          read: true,
          readAt: new Date()
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete notification
 */
exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const notification = await Notification.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await Notification.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get notification count (unread)
 */
exports.getNotificationCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      read: false
    });

    res.status(200).json({
      success: true,
      data: {
        unreadCount: count
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
 * Create a notification (for internal use by other services)
 */
exports.createNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type, category, priority, relatedEntity, relatedId, data } = req.body;
    
    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate notification ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const notificationId = `NOT-${timestamp}-${random}`.toUpperCase();

    // Check if user has notification preferences enabled
    if (user.preferences && user.preferences.notificationSettings) {
      const settings = user.preferences.notificationSettings;
      
      // Determine which channels to use based on user preferences
      const channels = {
        push: settings.push || false,
        email: settings.email || false,
        sms: settings.sms || false,
        whatsapp: settings.whatsapp || false
      };
      
      // Create notification
      const notification = await Notification.create({
        notificationId,
        userId,
        title,
        message,
        type,
        category,
        priority: priority || 'medium',
        relatedEntity,
        relatedId,
        data,
        channels
      });

      // In a real implementation, you would send the notification through the appropriate channels
      // This might involve calling external services like Firebase, Twilio, etc.

      res.status(201).json({
        success: true,
        data: notification
      });
    } else {
      // Create notification with default channels
      const notification = await Notification.create({
        notificationId,
        userId,
        title,
        message,
        type,
        category,
        priority: priority || 'medium',
        relatedEntity,
        relatedId,
        data,
        channels: {
          push: true,
          email: false,
          sms: false,
          whatsapp: false
        }
      });

      res.status(201).json({
        success: true,
        data: notification
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update notification settings
 */
exports.updateNotificationSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;
    
    // Update user's notification settings
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'preferences.notificationSettings': settings
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        notificationSettings: user.preferences.notificationSettings
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
 * Get notification settings
 */
exports.getNotificationSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        notificationSettings: user.preferences.notificationSettings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;