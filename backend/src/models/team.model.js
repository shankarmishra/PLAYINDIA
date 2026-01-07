const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, 'Team name must be at least 3 characters'],
    maxlength: [50, 'Team name cannot exceed 50 characters']
  },
  description: String,
  sport: {
    type: String,
    required: true,
    enum: ['cricket', 'football', 'badminton', 'tennis', 'basketball', 'volleyball', 'table-tennis', 'chess', 'carrom']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Optional coach
  },
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['player', 'vice_captain', 'coach_assistant', 'trainer', 'manager'],
      default: 'player'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'removed', 'suspended'],
      default: 'active'
    }
  }],
  stats: {
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    matchesPlayed: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    currentRank: { type: Number, default: 0 },
    rating: { type: Number, default: 0 }
  },
  performance: {
    recentForm: [String], // ['W', 'L', 'D', 'W', 'W'] - last 5 matches
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    goalDifference: { type: Number, default: 0 }
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
    city: String,
    state: String
  },
  contact: {
    email: String,
    phone: String,
    socialMedia: {
      instagram: String,
      facebook: String,
      website: String
    }
  },
  documents: {
    registrationCertificate: String,
    teamPhoto: String,
    uniformPhotos: [String]
  },
  tournamentHistory: [{
    tournamentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament'
    },
    tournamentName: String,
    position: Number, // 1st, 2nd, 3rd, etc.
    matchesPlayed: Number,
    wins: Number,
    losses: Number,
    date: Date
  }],
  achievements: [{
    title: String,
    description: String,
    date: Date,
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament'
    }
  }],
  preferences: {
    preferredMatchTime: [String], // ['morning', 'evening']
    preferredVenue: String,
    uniformColors: [String]
  },
  settings: {
    allowJoinRequests: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: true },
    maxMembers: { type: Number, default: 15, min: 5, max: 30 }
  },
  fees: {
    membershipFee: Number,
    tournamentRegistrationFee: Number
  },
  isActive: {
    type: Boolean,
    default: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'friends'],
    default: 'public'
  },
  aiAnalysis: {
    enabled: { type: Boolean, default: false },
    performanceMetrics: mongoose.Schema.Types.Mixed,
    tacticalAnalysis: String,
    playerDevelopment: [mongoose.Schema.Types.Mixed],
    trainingRecommendations: [String]
  },
  training: {
    schedule: [{
      day: String,
      time: String,
      location: String,
      type: String // 'practice', 'match', 'fitness', 'strategy'
    }],
    drills: [String],
    fitnessProgram: String,
    nutritionPlan: String,
    progressTracking: [{
      date: Date,
      metrics: mongoose.Schema.Types.Mixed
    }]
  },
  media: {
    logo: String,
    primaryColor: String,
    secondaryColor: String,
    socialMedia: {
      instagram: String,
      facebook: String,
      twitter: String,
      youtube: String
    },
    photos: [String],
    videos: [String]
  },
  sponsorships: [{
    sponsorName: String,
    logo: String,
    contractValue: Number,
    startDate: Date,
    endDate: Date,
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'overdue'],
      default: 'pending'
    }
  }],
  analytics: {
    performanceTrend: [mongoose.Schema.Types.Mixed],
    opponentAnalysis: [mongoose.Schema.Types.Mixed],
    playerDevelopment: [mongoose.Schema.Types.Mixed],
    fanEngagement: { type: Number, default: 0 }
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
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
teamSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient queries
teamSchema.index({ owner: 1 });
teamSchema.index({ captain: 1 });
teamSchema.index({ sport: 1 });
teamSchema.index({ name: 'text' });
teamSchema.index({ 'location.coordinates': '2dsphere' });
teamSchema.index({ isActive: 1 });
teamSchema.index({ createdAt: -1 });
teamSchema.index({ 'aiAnalysis.enabled': 1 });
teamSchema.index({ 'analytics.fanEngagement': 1 });
teamSchema.index({ 'sponsorships.paymentStatus': 1 });

module.exports = mongoose.model('Team', teamSchema);