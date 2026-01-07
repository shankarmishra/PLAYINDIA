const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  achievementId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['sports', 'engagement', 'loyalty', 'social', 'performance', 'milestone'],
    required: true
  },
  type: {
    type: String,
    enum: ['milestone', 'badge', 'trophy', 'certificate', 'rank'],
    required: true
  },
  icon: String, // URL to achievement icon
  badgeColor: String, // Color code for the achievement badge
  points: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  requirements: {
    action: String, // What action unlocks this achievement
    threshold: Number, // How many times to perform the action
    conditions: mongoose.Schema.Types.Mixed // Additional conditions
  },
  users: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    earnedAt: {
      type: Date,
      default: Date.now
    },
    unlocked: {
      type: Boolean,
      default: true
    },
    progress: {
      current: { type: Number, default: 0 },
      target: Number
    }
  }],
  validity: {
    startDate: Date,
    endDate: Date,
    isActive: { type: Boolean, default: true }
  },
  rewards: {
    bonusPoints: { type: Number, default: 0 },
    discount: { type: Number, default: 0 }, // percentage
    cashback: { type: Number, default: 0 },
    specialPrivileges: [String]
  },
  sharing: {
    enabled: { type: Boolean, default: true },
    shareText: String
  },
  analytics: {
    earnedCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 }
  },
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
achievementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient queries
achievementSchema.index({ achievementId: 1, unique: true });
achievementSchema.index({ category: 1 });
achievementSchema.index({ type: 1 });
achievementSchema.index({ level: 1 });
achievementSchema.index({ rarity: 1 });
achievementSchema.index({ 'users.userId': 1 });
achievementSchema.index({ createdAt: -1 });
achievementSchema.index({ 'validity.isActive': 1 });

module.exports = mongoose.model('Achievement', achievementSchema);