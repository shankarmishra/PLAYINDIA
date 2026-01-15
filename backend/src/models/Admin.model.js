const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide admin name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide admin email'],
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'moderator', 'support_agent', 'content_manager'],
    default: 'admin'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true, // Optional - can link to User if needed
    unique: true
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
      min: 0,
      max: 5,
      default: 0
    },
    satisfaction: {
      type: Number,
      min: 0,
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

// Hash password before saving
adminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    this.updatedAt = Date.now();
    return next();
  }
  
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.updatedAt = Date.now();
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes for efficient queries
adminSchema.index({ email: 1 });
adminSchema.index({ userId: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ status: 1 });
adminSchema.index({ isActive: 1 });
adminSchema.index({ lastLogin: -1 });

module.exports = mongoose.model('Admin', adminSchema);