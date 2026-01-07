const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  experience: {
    years: {
      type: Number,
      required: true,
      min: 0
    },
    description: String
  },
  sports: [{
    type: String,
    required: true
  }],
  specialization: String,
  coachingStyle: String,
  coachingFees: {
    perSession: {
      type: Number,
      min: 0
    },
    perMonth: {
      type: Number,
      min: 0
    }
  },
  certificates: [{
    name: String,
    issuingBody: String,
    issueDate: Date,
    expiryDate: Date,
    certificateFile: String
  }],
  achievements: [{
    title: String,
    description: String,
    date: Date
  }],
  previousAcademies: [{
    name: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  rating: {
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
  verified: {
    type: Boolean,
    default: false
  },
  documents: {
    aadhaar: {
      front: String,
      back: String,
      verified: { type: Boolean, default: false }
    },
    pan: {
      file: String,
      verified: { type: Boolean, default: false }
    },
    profilePhoto: String,
    additionalDocs: [String]
  },
  availability: {
    schedule: [{
      day: String, // 'monday', 'tuesday', etc.
      startTime: String, // '09:00'
      endTime: String,
      available: { type: Boolean, default: true }
    }],
    isAvailable: { type: Boolean, default: true }
  },
  sessions: {
    total: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 }
  },
  earnings: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  },
  commissionPercentage: {
    type: Number,
    default: 10, // Platform commission
    min: 0,
    max: 100
  },
  tournamentCreationEnabled: {
    type: Boolean,
    default: false
  },
  academyMode: {
    enabled: { type: Boolean, default: false },
    name: String,
    multipleCoaches: { type: Boolean, default: false },
    monthlySubscription: Number,
    batchSystem: Boolean,
    parentDashboard: Boolean
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
  bio: String,
  videoIntroduction: String,
  successRate: {
    type: Number,
    default: 0 // Percentage of successful student outcomes
  },
  languages: [String],
  onlineCoaching: {
    enabled: { type: Boolean, default: false },
    platforms: [String] // ['zoom', 'google meet', 'teams']
  },
  academyMode: {
    enabled: { type: Boolean, default: false },
    name: String,
    students: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      batch: String,
      enrolledAt: Date,
      progress: Number,
      status: {
        type: String,
        enum: ['active', 'completed', 'dropped', 'on_hold'],
        default: 'active'
      }
    }],
    batches: [{
      name: String,
      schedule: [{
        day: String,
        startTime: String,
        endTime: String
      }],
      maxStudents: Number,
      currentStudents: { type: Number, default: 0 }
    }],
    parentDashboard: { type: Boolean, default: false },
    monthlySubscription: Number,
    features: {
      videoAnalysis: { type: Boolean, default: false },
      progressTracking: { type: Boolean, default: false },
      parentCommunication: { type: Boolean, default: false },
      attendanceTracking: { type: Boolean, default: false }
    }
  },
  aiFeatures: {
    enabled: { type: Boolean, default: false },
    skillAssessment: { type: Boolean, default: false },
    personalizedTraining: { type: Boolean, default: false },
    performanceAnalysis: { type: Boolean, default: false }
  },
  pricing: {
    sessionTypes: [{
      type: String, // 'beginner', 'intermediate', 'advanced', 'tournament', 'match_analysis'
      price: Number,
      duration: Number // in minutes
    }],
    groupSessions: {
      enabled: { type: Boolean, default: false },
      pricePerPerson: Number,
      maxGroupSize: Number
    },
    packageDeals: [{
      name: String,
      sessions: Number,
      price: Number,
      validity: Number // in days
    }]
  },
  availability: {
    schedule: [{
      day: String, // 'monday', 'tuesday', etc.
      startTime: String, // '09:00'
      endTime: String,
      available: { type: Boolean, default: true }
    }],
    isAvailable: { type: Boolean, default: true },
    timeSlots: [{
      date: Date,
      slots: [{
        time: String, // 'HH:MM'
        available: { type: Boolean, default: true },
        bookingId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Booking'
        }
      }]
    }],
    bufferTime: { type: Number, default: 30 } // in minutes between sessions
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
    },
    breakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    },
    recentReviews: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: Number,
      comment: String,
      date: Date
    }]
  },
  earnings: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    pending: { type: Number, default: 0 },
    monthlyEarnings: [{
      month: String, // 'YYYY-MM'
      amount: Number,
      commission: Number
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
coachSchema.index({ userId: 1 });
coachSchema.index({ sports: 1 });
coachSchema.index({ verified: 1 });
coachSchema.index({ 'location.coordinates': '2dsphere' });
coachSchema.index({ 'ratings.average': 1 });
coachSchema.index({ experience: 1 });
coachSchema.index({ 'academyMode.enabled': 1 });
coachSchema.index({ 'pricing.sessionTypes.price': 1 });
coachSchema.index({ 'availability.isAvailable': 1 });

module.exports = mongoose.model('Coach', coachSchema);