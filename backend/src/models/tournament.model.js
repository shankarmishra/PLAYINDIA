const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Could be a coach or admin
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cricket', 'football', 'badminton', 'tennis', 'basketball', 'volleyball', 'table-tennis', 'chess', 'carrom']
  },
  level: {
    type: String,
    enum: ['local', 'city', 'state', 'national', 'international'],
    default: 'local'
  },
  type: {
    type: String,
    enum: ['knockout', 'league', 'round-robin', 'double-elimination'],
    default: 'knockout'
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
    state: String,
    venue: String
  },
  dates: {
    registrationStart: Date,
    registrationEnd: Date,
    tournamentStart: Date,
    tournamentEnd: Date
  },
  registration: {
    fee: {
      type: Number,
      default: 0
    },
    maxTeams: Number,
    minTeams: Number,
    currentTeams: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['closed', 'open', 'full'],
      default: 'closed'
    }
  },
  teams: [{
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    captain: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    members: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    registrationDate: Date,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'disqualified', 'withdrawn'],
      default: 'pending'
    }
  }],
  matches: [{
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Match'
    },
    team1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    team2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    date: Date,
    time: String, // 'HH:MM'
    venue: String,
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'postponed', 'cancelled'],
      default: 'scheduled'
    },
    scores: {
      team1: Number,
      team2: Number
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    referee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  prize: {
    first: Number,
    second: Number,
    third: Number,
    others: [{
      position: String,
      amount: Number
    }]
  },
  sponsors: [{
    name: String,
    logo: String,
    type: String, // 'title', 'official', 'associate'
    amount: Number
  }],
  rules: {
    format: String,
    duration: String,
    substitutions: Number,
    equipment: String,
    other: String
  },
  documents: {
    tournamentRules: String,
    safetyGuidelines: String,
    insurance: String
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'friends'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'cancelled', 'archived'],
    default: 'draft'
  },
  settings: {
    allowIndividualRegistration: { type: Boolean, default: false },
    requireApproval: { type: Boolean, default: true },
    maxPlayersPerTeam: { type: Number, default: 11 },
    minPlayersPerTeam: { type: Number, default: 5 }
  },
  features: {
    liveScore: { type: Boolean, default: true },
    liveStreaming: { type: Boolean, default: false },
    digitalCertificates: { type: Boolean, default: true },
    photoGallery: { type: Boolean, default: true },
    shareableLeaderboard: { type: Boolean, default: true },
    liveStats: { type: Boolean, default: false },
    videoAnalysis: { type: Boolean, default: false },
    playerTracking: { type: Boolean, default: false },
    aiAnalysis: { type: Boolean, default: false },
    virtualAwards: { type: Boolean, default: false }
  },
  brackets: {
    type: String, // 'single_elimination', 'double_elimination', 'round_robin', 'swiss'
    structure: mongoose.Schema.Types.Mixed, // Bracket structure data
    currentRound: String,
    completed: { type: Boolean, default: false }
  },
  officials: {
    referees: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      qualification: String,
      assignedMatches: [Number] // Match numbers assigned
    }],
    scorers: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      assignedMatches: [Number]
    }],
    medicalStaff: [{
      name: String,
      qualification: String,
      contact: String
    }]
  },
  media: {
    photographers: [{
      name: String,
      contact: String
    }],
    videographers: [{
      name: String,
      contact: String
    }],
    commentators: [{
      name: String,
      expertise: String
    }],
    socialMedia: {
      autoPost: { type: Boolean, default: false },
      hashtags: [String],
      contentSchedule: [{
        time: Date,
        content: String,
        platform: String // 'instagram', 'facebook', 'twitter'
      }]
    }
  },
  prizeDistribution: {
    structure: [{
      position: Number,
      prize: Number,
      type: String, // 'cash', 'gift', 'trophy', 'certificate'
      recipient: {
        teamId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Team'
        },
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
      }
    }],
    distributionDate: Date,
    claimed: { type: Boolean, default: false },
    claimDate: Date
  },
  insurance: {
    covered: { type: Boolean, default: false },
    amount: Number,
    provider: String,
    policyNumber: String
  },
  safety: {
    safetyOfficer: String,
    emergencyContact: String,
    firstAidAvailable: { type: Boolean, default: true },
    medicalFacility: String,
    safetyProtocols: [String]
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
  analytics: {
    views: { type: Number, default: 0 },
    registrations: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    participantSatisfaction: { type: Number, default: 0 }
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
tournamentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient queries
tournamentSchema.index({ organizer: 1 });
tournamentSchema.index({ category: 1 });
tournamentSchema.index({ level: 1 });
tournamentSchema.index({ status: 1 });
tournamentSchema.index({ 'location.coordinates': '2dsphere' });
tournamentSchema.index({ 'dates.tournamentStart': 1 });
tournamentSchema.index({ 'dates.registrationEnd': 1 });
tournamentSchema.index({ createdAt: -1 });
tournamentSchema.index({ 'brackets.type': 1 });
tournamentSchema.index({ 'analytics.revenue': 1 });
tournamentSchema.index({ 'prizeDistribution.claimed': 1 });

module.exports = mongoose.model('Tournament', tournamentSchema);