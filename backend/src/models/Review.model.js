const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  reviewer: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    role: {
      type: String,
      enum: ['user', 'coach', 'seller', 'delivery', 'admin']
    }
  },
  reviewee: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: String,
    role: {
      type: String,
      enum: ['user', 'coach', 'seller', 'delivery', 'admin']
    }
  },
  service: {
    type: String,
    enum: ['booking', 'order', 'delivery', 'coach', 'store', 'match', 'tournament', 'product']
  },
  serviceId: mongoose.Schema.Types.ObjectId, // Reference to the service
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: String,
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  images: [String], // URLs to review images
  helpful: {
    count: { type: Number, default: 0 },
    voters: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      votedAt: Date
    }]
  },
  response: {
    adminResponse: String,
    adminRespondedAt: Date,
    ownerResponse: String,
    ownerRespondedAt: Date
  },
  category: {
    type: String,
    enum: ['quality', 'service', 'delivery', 'value', 'experience']
  },
  tags: [String], // ['punctual', 'knowledgeable', 'helpful', etc.]
  verified: {
    type: Boolean,
    default: false // Whether the review is from a verified transaction
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'flagged'],
    default: 'pending'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  analytics: {
    helpfulCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },
  isPublic: {
    type: Boolean,
    default: true
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
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient queries
reviewSchema.index({ reviewId: 1, unique: true });
reviewSchema.index({ 'reviewer.userId': 1 });
reviewSchema.index({ 'reviewee.userId': 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ service: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ verified: 1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Review', reviewSchema);