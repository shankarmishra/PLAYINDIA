const mongoose = require('mongoose');

const playPointSchema = new mongoose.Schema({
  playPointId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['indoor', 'outdoor', 'multi_sport', 'cricket', 'football', 'badminton', 'tennis', 'gym'],
    required: true
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
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },
    venue: String
  },
  owner: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    contact: String
  },
  facilities: {
    courts: [{
      type: String,
      enum: ['cricket', 'football', 'badminton', 'tennis', 'basketball', 'volleyball']
    }],
    equipment: [String], // List of available equipment
    amenities: {
      parking: { type: Boolean, default: false },
      locker: { type: Boolean, default: false },
      cafeteria: { type: Boolean, default: false },
      changingRoom: { type: Boolean, default: false },
      firstAid: { type: Boolean, default: false },
      wifi: { type: Boolean, default: false }
    }
  },
  pricing: {
    hourlyRates: [{
      sport: String,
      timeSlot: String, // 'morning', 'afternoon', 'evening'
      rate: Number,
      currency: { type: String, default: 'INR' }
    }],
    membershipPlans: [{
      name: String,
      type: String, // 'daily', 'weekly', 'monthly', 'yearly'
      price: Number,
      benefits: [String]
    }]
  },
  availability: {
    schedule: [{
      day: String, // 'monday', 'tuesday', etc.
      open: String, // 'HH:MM'
      close: String, // 'HH:MM'
      open24Hours: { type: Boolean, default: false }
    }],
    isAvailable: { type: Boolean, default: true },
    peakHours: {
      startTime: String,
      endTime: String
    }
  },
  bookings: [{
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    date: Date,
    timeSlot: String,
    status: {
      type: String,
      enum: ['available', 'booked', 'maintenance', 'closed'],
      default: 'available'
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  qrCode: {
    code: String, // QR code identifier
    enabled: { type: Boolean, default: true }
  },
  equipmentBooking: {
    enabled: { type: Boolean, default: true },
    items: [{
      name: String,
      price: Number,
      available: Number,
      total: Number
    }]
  },
  tournamentHosting: {
    enabled: { type: Boolean, default: false },
    capacity: Number, // Max participants
    facilities: [String] // 'indoor', 'outdoor', 'lighting', etc.
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
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
  documents: {
    registration: String,
    insurance: String,
    safetyCert: String
  },
  features: {
    onlineBooking: { type: Boolean, default: true },
    liveStatus: { type: Boolean, default: false },
    photoGallery: { type: Boolean, default: false },
    videoTutorials: { type: Boolean, default: false }
  },
  settings: {
    autoConfirm: { type: Boolean, default: true },
    cancellationPolicy: {
      hours: Number, // Hours before booking
      penalty: Number // Percentage penalty
    },
    maxBookingDays: { type: Number, default: 30 }
  },
  analytics: {
    totalBookings: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    occupancyRate: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance', 'closed'],
    default: 'active'
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
playPointSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient queries
playPointSchema.index({ playPointId: 1, unique: true });
playPointSchema.index({ type: 1 });
playPointSchema.index({ 'location.coordinates': '2dsphere' });
playPointSchema.index({ 'location.address.city': 1 });
playPointSchema.index({ 'location.address.state': 1 });
playPointSchema.index({ ratings: 1 });
playPointSchema.index({ status: 1 });
playPointSchema.index({ createdAt: -1 });
playPointSchema.index({ 'availability.isAvailable': 1 });

module.exports = mongoose.model('PlayPoint', playPointSchema);