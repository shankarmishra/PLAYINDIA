const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [200, 'Subtitle cannot exceed 200 characters']
  },
  image: {
    type: String,
    required: [true, 'Banner image is required']
  },
  link: {
    type: String,
    trim: true
  },
  linkType: {
    type: String,
    enum: ['tournament', 'product', 'coach', 'external', 'none'],
    default: 'none'
  },
  linkId: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'scheduled'],
    default: 'active'
  },
  priority: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  targetAudience: {
    type: [String],
    enum: ['all', 'user', 'coach', 'store', 'delivery'],
    default: ['all']
  },
  bannerType: {
    type: String,
    enum: ['home', 'shop', 'tournament', 'general'],
    default: 'general'
  },
  clicks: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});

// Index for efficient queries
bannerSchema.index({ status: 1, priority: -1 });
bannerSchema.index({ startDate: 1, endDate: 1 });

// Method to check if banner is currently active
bannerSchema.methods.isActive = function() {
  const now = new Date();
  if (this.status !== 'active') return false;
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  return true;
};

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
