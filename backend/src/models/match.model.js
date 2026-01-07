const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true
  },
  matchNumber: {
    type: Number,
    required: true
  },
  round: {
    type: String,
    required: true,
    enum: ['group', 'round_of_32', 'round_of_16', 'quarter_final', 'semi_final', 'final', 'bronze_final']
  },
  teams: {
    team1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },
    team2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
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
    venue: String,
    address: String
  },
  schedule: {
    date: {
      type: Date,
      required: true
    },
    time: {
      type: String, // 'HH:MM'
      required: true
    },
    duration: {
      type: Number, // in minutes
      default: 90
    }
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'postponed', 'cancelled', 'abandoned'],
    default: 'scheduled'
  },
  scores: {
    team1: {
      type: Number,
      default: 0
    },
    team2: {
      type: Number,
      default: 0
    }
  },
  result: {
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    method: {
      type: String,
      enum: ['win', 'loss', 'draw', 'forfeit', 'abandoned']
    },
    scoreDetails: {
      type: String // "2-1", "3-0", etc.
    },
    overtime: {
      occurred: { type: Boolean, default: false },
      score: String
    }
  },
  stats: {
    attendance: { type: Number, default: 0 },
    liveViews: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 }
  },
  officials: {
    referee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    umpires: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    scorers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  events: [{
    type: {
      type: String,
      enum: ['goal', 'foul', 'yellow_card', 'red_card', 'substitution', 'injury', 'timeout']
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    minute: Number,
    description: String,
    timestamp: Date
  }],
  liveUpdates: [{
    message: String,
    type: {
      type: String,
      enum: ['commentary', 'score_update', 'event', 'announcement']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  streaming: {
    enabled: { type: Boolean, default: false },
    url: String,
    viewers: { type: Number, default: 0 }
  },
  weather: {
    temperature: Number,
    condition: String, // 'sunny', 'rainy', 'cloudy'
    windSpeed: Number
  },
  equipment: {
    used: [String], // List of equipment used
    condition: String // 'good', 'fair', 'poor'
  },
  photos: [String], // URLs to match photos
  videos: [String], // URLs to match videos
  highlights: [String], // URLs to match highlights
  documents: {
    scorecard: String,
    report: String
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
  notifications: {
    sent: [String],
    lastNotified: Date
  },
  aiAnalysis: {
    enabled: { type: Boolean, default: false },
    performanceMetrics: {
      team1: mongoose.Schema.Types.Mixed,
      team2: mongoose.Schema.Types.Mixed
    },
    playerStats: [mongoose.Schema.Types.Mixed],
    tacticalAnalysis: String,
    improvementSuggestions: [String]
  },
  playerTracking: {
    enabled: { type: Boolean, default: false },
    data: [mongoose.Schema.Types.Mixed], // GPS tracking data
    heatmaps: [String], // URLs to heatmap images
    distanceCovered: [{
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      distance: Number // in meters
    }],
    speedData: [mongoose.Schema.Types.Mixed]
  },
  broadcast: {
    enabled: { type: Boolean, default: false },
    provider: String, // 'youtube', 'facebook', 'custom'
    streamUrl: String,
    viewers: { type: Number, default: 0 },
    quality: String, // '720p', '1080p', '4k'
    recording: { type: Boolean, default: false },
    recordingUrl: String
  },
  sponsorship: {
    enabled: { type: Boolean, default: false },
    sponsors: [{
      name: String,
      logo: String,
      position: String, // 'field', 'jersey', 'stadium'
      amount: Number,
      visibility: Number // percentage
    }],
    revenue: { type: Number, default: 0 }
  },
  analytics: {
    engagement: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    viewerEngagement: { type: Number, default: 0 },
    socialMediaMentions: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 }
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
matchSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient queries
matchSchema.index({ tournamentId: 1 });
matchSchema.index({ 'teams.team1': 1 });
matchSchema.index({ 'teams.team2': 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ 'schedule.date': 1 });
matchSchema.index({ 'location.coordinates': '2dsphere' });
matchSchema.index({ createdAt: -1 });
matchSchema.index({ matchNumber: 1 });
matchSchema.index({ 'aiAnalysis.enabled': 1 });
matchSchema.index({ 'broadcast.enabled': 1 });
matchSchema.index({ 'sponsorship.enabled': 1 });

module.exports = mongoose.model('Match', matchSchema);