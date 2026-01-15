const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cricket', 'football', 'badminton', 'tennis', 'gym', 'multi-sports', 'sports-wear', 'accessories']
  },
  gst: {
    number: String,
    verified: { type: Boolean, default: false }
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  contact: {
    phone: String,
    email: String,
    whatsapp: String
  },
  businessHours: {
    monday: { open: String, close: String, open24Hours: Boolean },
    tuesday: { open: String, close: String, open24Hours: Boolean },
    wednesday: { open: String, close: String, open24Hours: Boolean },
    thursday: { open: String, close: String, open24Hours: Boolean },
    friday: { open: String, close: String, open24Hours: Boolean },
    saturday: { open: String, close: String, open24Hours: Boolean },
    sunday: { open: String, close: String, open24Hours: Boolean }
  },
  documents: {
    gstCertificate: {
      file: String,
      verified: { type: Boolean, default: false }
    },
    shopLicense: {
      file: String,
      verified: { type: Boolean, default: false }
    },
    ownerID: {
      front: String,
      back: String,
      verified: { type: Boolean, default: false }
    },
    additionalDocs: [String]
  },
  commissionPercentage: {
    type: Number,
    default: 15, // Platform commission
    min: 0,
    max: 100
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
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'suspended', 'rejected'],
    default: 'pending'
  },
  features: {
    deliveryAvailable: { type: Boolean, default: true },
    pickupAvailable: { type: Boolean, default: true },
    onlineBooking: { type: Boolean, default: true },
    homeDelivery: { type: Boolean, default: true },
    sameDayDelivery: { type: Boolean, default: false },
    expressDelivery: { type: Boolean, default: false }
  },
  deliveryZones: [{
    area: String,
    radius: Number, // in km
    charges: {
      base: Number,
      perKm: Number
    }
  }],
  inventoryManagement: {
    lowStockAlerts: { type: Boolean, default: true },
    autoOrder: { type: Boolean, default: false },
    supplierIntegration: { type: Boolean, default: false }
  },

  earnings: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    pending: { type: Number, default: 0 }
  },
  orders: {
    total: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    cancelled: { type: Number, default: 0 }
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    accountHolderName: String
  },

  inventory: {
    autoReorder: { type: Boolean, default: false },
    reorderThreshold: { type: Number, default: 5 },
    suppliers: [{
      name: String,
      contact: String,
      leadTime: Number, // in days
      preferred: { type: Boolean, default: false }
    }],
    lowStockAlerts: { type: Boolean, default: true },
    outOfStockProducts: [String]
  },
  analytics: {
    views: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    topSellingProducts: [String],
    seasonalTrends: [{
      month: String,
      sales: Number
    }],
    customerRetention: { type: Number, default: 0 }
  },
  promotions: {
    active: [{
      title: String,
      description: String,
      discount: Number, // percentage
      startDate: Date,
      endDate: Date,
      active: { type: Boolean, default: false },
      minOrderValue: Number,
      maxDiscount: Number,
      usageLimit: Number,
      usedCount: { type: Number, default: 0 }
    }],
    flashSales: [{
      title: String,
      discount: Number,
      startTime: Date,
      endTime: Date,
      active: { type: Boolean, default: false }
    }],
    loyaltyProgram: {
      enabled: { type: Boolean, default: false },
      pointsPerRupee: { type: Number, default: 1 },
      redemptionRate: { type: Number, default: 0.01 }, // 1 point = 0.01 rupees
      tierBenefits: [{
        tier: String, // 'silver', 'gold', 'platinum'
        minPoints: Number,
        benefits: [String]
      }]
    }
  },
  customerService: {
    supportHours: {
      start: String, // 'HH:MM'
      end: String, // 'HH:MM'
      timezone: { type: String, default: 'Asia/Kolkata' }
    },
    responseTime: { type: Number, default: 0 }, // in minutes
    satisfactionRating: { type: Number, default: 0 },
    faq: [{
      question: String,
      answer: String
    }],
    returnPolicy: {
      days: { type: Number, default: 30 },
      conditions: [String],
      process: String
    }
  },
  settings: {
    autoAcceptOrders: { type: Boolean, default: true },
    autoAssignDelivery: { type: Boolean, default: false },
    notifyOnNewOrder: { type: Boolean, default: true },
    maxDeliveryRadius: { type: Number, default: 10 }, // in km
    inventorySync: { type: Boolean, default: false },
    multiChannel: { type: Boolean, default: false },
    orderNotifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
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
storeSchema.index({ storeName: 'text' });
storeSchema.index({ category: 1 });
storeSchema.index({ verified: 1 });
// address.coordinates already has 2dsphere index via schema definition
storeSchema.index({ status: 1 });
storeSchema.index({ 'ratings.average': 1 });
storeSchema.index({ 'analytics.revenue': -1 });
storeSchema.index({ 'promotions.active.active': 1 });
storeSchema.index({ 'inventory.lowStockAlerts': 1 });

module.exports = mongoose.model('Store', storeSchema);