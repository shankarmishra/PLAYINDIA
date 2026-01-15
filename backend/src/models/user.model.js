const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  firebaseUid: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  mobile: {
    type: String,
    required: [true, 'Please provide your mobile number'],
    unique: true,
    match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit mobile number']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
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
    enum: ['user', 'coach', 'seller', 'delivery', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'suspended', 'rejected'],
    default: 'pending'
  },
  profileComplete: {
    type: Boolean,
    default: false
  },
  verification: {
    email: {
      verified: { type: Boolean, default: false },
      token: String,
      expires: Date
    },
    mobile: {
      verified: { type: Boolean, default: false },
      otp: String,
      otpExpires: Date
    }
  },
  trustScore: {
    type: Number,
    default: 75, // Base trust score
    min: 0,
    max: 100
  },
  walletBalance: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    enum: ['rookie', 'pro', 'elite', 'legend'],
    default: 'rookie'
  },
  experiencePoints: {
    type: Number,
    default: 0
  },
  achievements: [{
    type: String
  }],
  preferences: {
    favoriteGames: [String],
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'pro']
    },
    ageGroup: String,
    city: String,
    preferredPlayTime: [String], // ['morning', 'evening', 'weekend']
    distancePreference: {
      type: Number,
      default: 5 // km
    }
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
    },
    address: String,
    city: String,
    state: String
  },
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    winLossRatio: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    skillProgression: { type: Number, default: 0 }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  deviceTokens: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  trustScore: {
    type: Number,
    default: 75, // Base trust score
    min: 0,
    max: 100
  },
  verification: {
    email: {
      verified: { type: Boolean, default: false },
      token: String,
      expires: Date
    },
    mobile: {
      verified: { type: Boolean, default: false },
      otp: String,
      otpExpires: Date
    },
    aadhaar: {
      number: String,
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
      documentFront: String,
      documentBack: String
    },
    pan: {
      number: String,
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
      document: String
    },
    faceMatch: {
      verified: { type: Boolean, default: false },
      verifiedAt: Date,
      selfie: String
    }
  },
  security: {
    lastLogin: Date,
    loginCount: { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0 },
    lockedUntil: Date,
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: String,
    deviceFingerprint: String,
    ipAddresses: [String]
  },
  preferences: {
    favoriteGames: [String],
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'pro']
    },
    ageGroup: String,
    city: String,
    preferredPlayTime: [String], // ['morning', 'evening', 'weekend']
    distancePreference: {
      type: Number,
      default: 5 // km
    },
    notificationSettings: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false }
    },
    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'public'
      },
      locationSharing: { type: Boolean, default: false },
      contactSharing: { type: Boolean, default: false }
    }
  },
  social: {
    followers: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      followedAt: Date
    }],
    following: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      followedAt: Date
    }],
    friendRequests: [{
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      sentAt: Date,
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
      }
    }],
    blockedUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  achievements: [{
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    earnedAt: Date,
    unlocked: { type: Boolean, default: true }
  }],
  playPoints: {
    totalPoints: { type: Number, default: 0 },
    availablePoints: { type: Number, default: 0 },
    pointsHistory: [{
      points: Number,
      type: String, // 'earned', 'redeemed', 'bonus'
      description: String,
      date: Date
    }]
  },
  subscription: {
    type: String, // 'free', 'premium', 'pro'
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired', 'cancelled'],
      default: 'active'
    },
    features: [String]
  },
  referral: {
    code: String,
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    totalReferrals: { type: Number, default: 0 },
    earnedPoints: { type: Number, default: 0 },
    bonusHistory: [{
      amount: Number,
      date: Date,
      type: String
    }]
  },
  behavior: {
    noShowRate: { type: Number, default: 0 }, // Percentage of no-shows
    cancellationRate: { type: Number, default: 0 }, // Percentage of cancellations
    responseTime: { type: Number, default: 0 }, // Average response time in minutes
    reliabilityScore: { type: Number, default: 0 } // Overall reliability score
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index for efficient queries
// mobile and email already have unique indexes via schema definition
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ trustScore: 1 });
// location.coordinates already has 2dsphere index via schema definition
userSchema.index({ 'verification.email.verified': 1 });
userSchema.index({ 'verification.mobile.verified': 1 });
userSchema.index({ 'security.lastLogin': -1 });
// referral.code already has unique index via schema definition

module.exports = mongoose.model('User', userSchema);