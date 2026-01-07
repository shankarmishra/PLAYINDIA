const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coachId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coachProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Coach',
    required: true
  },
  type: {
    type: String,
    enum: ['session', 'training', 'match_analysis', 'fitness', 'tournament', 'consultation'],
    default: 'session'
  },
  service: {
    name: String,
    description: String,
    duration: {
      type: Number, // in minutes
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  },
  schedule: {
    date: {
      type: Date,
      required: true
    },
    startTime: {
      type: String, // 'HH:MM'
      required: true
    },
    endTime: {
      type: String // 'HH:MM'
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata'
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
    venue: String,
    type: {
      type: String,
      enum: ['online', 'offline', 'hybrid'],
      default: 'offline'
    }
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    age: Number,
    skillLevel: String
  }],
  status: {
    type: String,
    enum: [
      'pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 
      'no_show', 'rescheduled', 'rejected', 'expired'
    ],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['upi', 'card', 'net_banking', 'wallet', 'cash']
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    amount: {
      type: Number,
      required: true
    },
    transactionId: String,
    gateway: String,
    paidAt: Date
  },
  coach: {
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending'
    },
    acceptedAt: Date,
    completedAt: Date
  },
  ratings: {
    user: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      date: Date
    },
    coach: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      date: Date
    }
  },
  feedback: {
    user: String,
    coach: String
  },
  cancellation: {
    requested: { type: Boolean, default: false },
    reason: String,
    requestedAt: Date,
    approved: { type: Boolean, default: false },
    approvedBy: String, // 'user', 'coach', 'admin'
    approvedAt: Date,
    penalty: {
      amount: Number,
      percentage: Number
    }
  },
  reschedule: {
    requested: { type: Boolean, default: false },
    newDate: Date,
    newTime: String,
    reason: String,
    approved: { type: Boolean, default: false },
    approvedBy: String,
    approvedAt: Date
  },
  communication: {
    videoCall: {
      enabled: { type: Boolean, default: false },
      url: String,
      meetingId: String,
      password: String
    },
    chatEnabled: { type: Boolean, default: true }
  },
  equipment: {
    required: [String],
    provided: [String]
  },
  specialRequirements: String,
  notes: String,
  timeline: [{
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    actor: String, // 'user', 'coach', 'admin'
    notes: String
  }],
  notifications: {
    sent: [String],
    lastNotified: Date
  },
  aiFeatures: {
    enabled: { type: Boolean, default: false },
    skillAssessment: { type: Boolean, default: false },
    performanceAnalysis: { type: Boolean, default: false },
    personalizedTraining: { type: Boolean, default: false },
    progressTracking: { type: Boolean, default: false },
    videoAnalysis: { type: Boolean, default: false }
  },
  sessionNotes: {
    coachNotes: String,
    userGoals: String,
    progressNotes: String,
    improvementAreas: [String],
    nextSessionPlan: String
  },
  compliance: {
    termsAccepted: { type: Boolean, default: false },
    termsAcceptedAt: Date,
    termsAcceptedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    privacyPolicyAccepted: { type: Boolean, default: false },
    privacyPolicyAcceptedAt: Date
  },
  insurance: {
    covered: { type: Boolean, default: false },
    amount: Number,
    provider: String,
    policyNumber: String
  },
  safety: {
    safetyFormFilled: { type: Boolean, default: false },
    emergencyContact: {
      name: String,
      phone: String
    },
    medicalConditions: String,
    waiverSigned: { type: Boolean, default: false },
    waiverSignedAt: Date
  },
  feedback: {
    user: String,
    coach: String,
    improvementSuggestions: [String],
    rating: {
      user: {
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: Date
      },
      coach: {
        rating: { type: Number, min: 1, max: 5 },
        comment: String,
        date: Date
      }
    }
  },
  analytics: {
    duration: Number, // actual duration in minutes
    value: Number,
    commission: Number,
    platformEarnings: Number,
    userEngagement: { type: Number, default: 0 },
    skillImprovement: { type: Number, default: 0 },
    satisfactionScore: { type: Number, default: 0 }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent', 'asap'],
    default: 'medium'
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
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient queries
bookingSchema.index({ bookingId: 1, unique: true });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ coachId: 1 });
bookingSchema.index({ coachProfileId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'schedule.date': 1 });
bookingSchema.index({ 'location.coordinates': '2dsphere' });
bookingSchema.index({ createdAt: -1 });
bookingSchema.index({ 'schedule.date': 1, 'schedule.startTime': 1 });
bookingSchema.index({ 'aiFeatures.enabled': 1 });
bookingSchema.index({ 'analytics.satisfactionScore': 1 });
bookingSchema.index({ 'compliance.termsAccepted': 1 });

module.exports = mongoose.model('Booking', bookingSchema);