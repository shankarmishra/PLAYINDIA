const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  adType: {
    type: String,
    enum: ['home-banner', 'category-banner', 'sponsored-product'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  bannerImage: {
    type: String, // Cloudinary URL
    required: true
  },
  // Targeting
  targeting: {
    location: {
      cities: [String],
      states: [String]
    },
    category: {
      type: String,
      enum: ['cricket', 'football', 'badminton', 'tennis', 'gym', 'multi-sports', 'sports-wear', 'accessories', 'all']
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'all'],
      default: 'all'
    },
    ageGroup: {
      min: { type: Number, min: 0, max: 100 },
      max: { type: Number, min: 0, max: 100 }
    }
  },
  // Budget & Duration
  budget: {
    total: { type: Number, required: true, min: 0 },
    daily: { type: Number, required: true, min: 0 },
    spent: { type: Number, default: 0 }
  },
  duration: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  // Pricing
  pricing: {
    pricePerDay: { type: Number, required: true },
    pricePerClick: { type: Number, default: 0 },
    pricePerView: { type: Number, default: 0 }
  },
  // Status
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'active', 'paused', 'rejected', 'expired', 'completed'],
    default: 'draft'
  },
  // Payment
  payment: {
    method: String,
    transactionId: String,
    amount: Number,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  // Performance Metrics
  metrics: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    impressions: { type: Number, default: 0 },
    ctr: { type: Number, default: 0 }, // Click-through rate
    conversions: { type: Number, default: 0 }
  },
  // Admin
  adminNotes: String,
  rejectionReason: String,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  // Priority (higher = shown first)
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Auto-renew
  autoRenew: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
adSchema.index({ storeId: 1, status: 1 });
adSchema.index({ productId: 1 });
adSchema.index({ status: 1, 'duration.startDate': 1, 'duration.endDate': 1 });
adSchema.index({ adType: 1, status: 1 });
adSchema.index({ 'targeting.location.cities': 1 });
adSchema.index({ 'targeting.location.states': 1 });
adSchema.index({ 'targeting.category': 1 });
adSchema.index({ priority: -1 });

// Virtual for CTR calculation
adSchema.virtual('calculatedCTR').get(function() {
  if (this.metrics.views === 0) return 0;
  return ((this.metrics.clicks / this.metrics.views) * 100).toFixed(2);
});

// Method to check if ad is active
adSchema.methods.isActive = function() {
  const now = new Date();
  return (
    this.status === 'active' &&
    this.payment.status === 'completed' &&
    now >= this.duration.startDate &&
    now <= this.duration.endDate &&
    this.budget.spent < this.budget.total
  );
};

// Method to increment view
adSchema.methods.incrementView = async function() {
  this.metrics.views += 1;
  this.metrics.impressions += 1;
  await this.save();
};

// Method to increment click
adSchema.methods.incrementClick = async function() {
  this.metrics.clicks += 1;
  // Update CTR
  if (this.metrics.views > 0) {
    this.metrics.ctr = ((this.metrics.clicks / this.metrics.views) * 100).toFixed(2);
  }
  // Deduct from budget if pay-per-click
  if (this.pricing.pricePerClick > 0) {
    this.budget.spent += this.pricing.pricePerClick;
  }
  await this.save();
};

// Pre-save middleware to update status
adSchema.pre('save', function(next) {
  const now = new Date();
  
  // Auto-expire ads
  if (this.status === 'active' && now > this.duration.endDate) {
    this.status = 'expired';
  }
  
  // Auto-complete if budget exhausted
  if (this.status === 'active' && this.budget.spent >= this.budget.total) {
    this.status = 'completed';
  }
  
  next();
});

module.exports = mongoose.model('Ad', adSchema);

