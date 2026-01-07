const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  notificationId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'booking_confirmation', 'booking_update', 'booking_reminder', 'booking_completed',
      'order_confirmation', 'order_update', 'order_ready', 'order_delivered',
      'delivery_assigned', 'delivery_pickup', 'delivery_in_transit', 'delivery_completed',
      'coach_availability', 'coach_response', 'coach_rating',
      'tournament_announcement', 'tournament_update', 'match_result',
      'payment_success', 'payment_failed', 'wallet_update',
      'system_message', 'admin_announcement', 'referral_bonus',
      'achievement_unlocked', 'level_up', 'review_received'
    ],
    required: true
  },
  category: {
    type: String,
    enum: ['booking', 'order', 'delivery', 'coach', 'tournament', 'payment', 'system', 'achievement'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  relatedEntity: {
    type: String,
    enum: ['booking', 'order', 'delivery', 'coach', 'tournament', 'match', 'product', 'user', 'wallet']
  },
  relatedId: mongoose.Schema.Types.ObjectId, // Reference to related document
  data: {
    // Additional data related to the notification
    bookingId: String,
    orderId: String,
    deliveryId: String,
    coachId: String,
    tournamentId: String,
    matchId: String,
    amount: Number,
    details: mongoose.Schema.Types.Mixed
  },
  read: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  delivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  channels: {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    whatsapp: { type: Boolean, default: false }
  },
  expiryDate: Date,
  tags: [String], // Additional tags for filtering
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update the updatedAt timestamp before saving
notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient queries
notificationSchema.index({ notificationId: 1, unique: true });
notificationSchema.index({ userId: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ category: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ createdAt: -1 });
notificationSchema.index({ expiryDate: 1 });

module.exports = mongoose.model('Notification', notificationSchema);