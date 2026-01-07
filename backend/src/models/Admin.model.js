const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  adminType: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator', 'support_agent', 'content_manager'],
    default: 'admin'
  },
  permissions: {
    users: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      approve: { type: Boolean, default: false }
    },
    coaches: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      approve: { type: Boolean, default: true }
    },
    stores: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      approve: { type: Boolean, default: true }
    },
    deliveries: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false },
      approve: { type: Boolean, default: true }
    },
    bookings: {
      view: { type: Boolean, default: true },
      edit: { type: Boolean, default: false },
      cancel: { type: Boolean, default: false }
    },
    orders: {
      view: { type: Boolean, default: true },
      edit: { type: Boolean, default: false },
      cancel: { type: Boolean, default: false }
    },
    payments: {
      view: { type: Boolean, default: true },
      process: { type: Boolean, default: false },
      refund: { type: Boolean, default: false }
    },
    content: {
      view: { type: Boolean, default: true },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    analytics: {
      view: { type: Boolean, default: true },
      export: { type: Boolean, default: false }
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  loginCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  assignedTickets: {
    type: Number,
    default: 0
  },
  resolvedTickets: {
    type: Number,
    default: 0
  },
  avgResolutionTime: {
    type: Number, // in minutes
    default: 0
  },
  performance: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 0
    },
    satisfaction: {
      type: Number,
      min: 1,
      max: 5,
      default: 0
    }
  },
  notifications: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    criticalOnly: { type: Boolean, default: false }
  },
  settings: {
    timezone: { type: String, default: 'Asia/Kolkata' },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    timeFormat: { type: String, default: '24h' }
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
adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient queries
adminSchema.index({ userId: 1 });
adminSchema.index({ adminType: 1 });
adminSchema.index({ isActive: 1 });
adminSchema.index({ lastLogin: -1 });

module.exports = mongoose.model('Admin', adminSchema);