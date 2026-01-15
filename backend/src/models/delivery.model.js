const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  vehicle: {
    type: {
      type: String,
      enum: ['bicycle', 'scooter', 'bike', 'car', 'truck'],
      required: true
    },
    number: {
      type: String,
      required: true,
      uppercase: true,
      match: [/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/, 'Please provide a valid vehicle number']
    },
    model: String,
    color: String,
    licenseNumber: {
      type: String,
      required: true
    }
  },
  serviceRadius: {
    type: Number,
    default: 10, // km
    min: 1,
    max: 50
  },
  currentLocation: {
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
  documents: {
    aadhaar: {
      front: String,
      back: String,
      verified: { type: Boolean, default: false }
    },
    drivingLicense: {
      number: String,
      file: String,
      expiryDate: Date,
      verified: { type: Boolean, default: false }
    },
    vehicleRC: {
      number: String,
      file: String,
      verified: { type: Boolean, default: false }
    },
    insurance: {
      policyNumber: String,
      file: String,
      expiryDate: Date,
      verified: { type: Boolean, default: false }
    }
  },
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
  deliveries: {
    today: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 },
    avgDeliveryTime: { type: Number, default: 0 } // in minutes
  },
  earnings: {
    today: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  },
  availability: {
    isAvailable: { type: Boolean, default: true },
    lastActive: { type: Date, default: Date.now }
  },
  performance: {
    onTimeRate: { type: Number, default: 0 }, // percentage
    customerSatisfaction: { type: Number, default: 0 }, // average rating
    loadCapacity: { type: Number, default: 0 } // number of orders
  },
  currentOrder: {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    status: {
      type: String,
      enum: ['idle', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled']
    },
    estimatedDelivery: Date
  },
  zones: [{
    type: String // Areas where this delivery boy operates
  }],
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'suspended', 'rejected'],
    default: 'pending'
  },
  commissionPercentage: {
    type: Number,
    default: 10, // Platform commission
    min: 0,
    max: 100
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },

  geoFencing: {
    enabled: { type: Boolean, default: false },
    zones: [{
      name: String,
      coordinates: [{
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }],
      radius: { type: Number, default: 1000 } // in meters
    }],
    pickupFence: {
      enabled: { type: Boolean, default: false },
      coordinates: [Number], // [longitude, latitude]
      radius: { type: Number, default: 100 } // in meters
    },
    deliveryFence: {
      enabled: { type: Boolean, default: false },
      coordinates: [Number], // [longitude, latitude]
      radius: { type: Number, default: 100 } // in meters
    }
  },
  safety: {
    safetyScore: { type: Number, default: 0 }, // Safety rating
    incidents: [{
      type: String, // 'accident', 'delay', 'customer_complaint'
      description: String,
      date: Date,
      resolved: { type: Boolean, default: false },
      resolution: String
    }],
    insurance: {
      policyNumber: String,
      company: String,
      coverage: Number, // in rupees
      expiryDate: Date
    }
  },
  incentives: {
    baseRate: { type: Number, default: 0 }, // Base pay per delivery
    distanceRate: { type: Number, default: 0 }, // Pay per km
    performanceBonus: { type: Number, default: 0 }, // Bonus for good performance
    peakHourRate: { type: Number, default: 0 }, // Extra pay during peak hours
    holidayRate: { type: Number, default: 0 }, // Extra pay on holidays
    totalIncentives: { type: Number, default: 0 }
  },
  lastUpdate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
// userId already has unique index via schema definition
// currentLocation.coordinates already has 2dsphere index via schema definition
deliverySchema.index({ availability: 1 });
deliverySchema.index({ 'rating.average': 1 });
deliverySchema.index({ serviceRadius: 1 });
deliverySchema.index({ currentOrder: 1 });
deliverySchema.index({ 'performance.efficiencyScore': 1 });
deliverySchema.index({ 'geoFencing.enabled': 1 });
deliverySchema.index({ 'safety.safetyScore': 1 });

module.exports = mongoose.model('Delivery', deliverySchema);