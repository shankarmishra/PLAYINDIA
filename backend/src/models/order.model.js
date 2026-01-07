const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
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
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: String,
    price: {
      original: Number,
      selling: Number
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    total: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  discount: {
    amount: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    code: String
  },
  shipping: {
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      coordinates: [Number] // [longitude, latitude]
    },
    charges: { type: Number, default: 0 },
    method: {
      type: String,
      enum: ['standard', 'express', 'pickup'],
      default: 'standard'
    },
    estimatedDelivery: Date
  },
  payment: {
    method: {
      type: String,
      enum: ['upi', 'card', 'net_banking', 'wallet', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    gateway: String,
    amount: Number
  },
  status: {
    type: String,
    enum: [
      'pending', 'confirmed', 'processing', 'ready_for_pickup', 'picked_up',
      'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'
    ],
    default: 'pending'
  },
  delivery: {
    deliveryBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delivery'
    },
    assignedAt: Date,
    pickupTime: Date,
    deliveryTime: Date,
    actualDeliveryTime: Date,
    deliveryStatus: {
      type: String,
      enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed']
    }
  },
  ratings: {
    user: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      date: Date
    },
    store: {
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      date: Date
    }
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  cancellation: {
    requested: { type: Boolean, default: false },
    reason: String,
    requestedAt: Date,
    approved: { type: Boolean, default: false },
    approvedBy: String, // 'user', 'admin', 'system'
    approvedAt: Date
  },
  refund: {
    initiated: { type: Boolean, default: false },
    amount: Number,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    initiatedAt: Date,
    completedAt: Date
  },
  notifications: {
    sent: [String], // list of notification types sent
    lastNotified: Date
  },
  packaging: {
    type: String, // 'standard', 'premium', 'eco-friendly'
    materials: [String],
    specialInstructions: String,
    fragile: { type: Boolean, default: false },
    temperatureControl: { type: Boolean, default: false },
    temperatureRange: String // e.g., '2-8°C'
  },
  insurance: {
    covered: { type: Boolean, default: false },
    amount: Number, // Insurance value
    provider: String,
    policyNumber: String
  },
  customs: {
    requiresDocumentation: { type: Boolean, default: false },
    documentation: String, // URL to customs docs
    dutyPaid: { type: Boolean, default: false },
    dutyAmount: Number
  },
  tracking: {
    enabled: { type: Boolean, default: true },
    provider: String, // 'delhivery', 'shiprocket', 'bluedart'
    trackingNumber: String,
    trackingUrl: String,
    lastUpdated: Date,
    statusHistory: [{
      status: String,
      timestamp: Date,
      location: String,
      notes: String
    }]
  },
  giftOptions: {
    isGift: { type: Boolean, default: false },
    giftMessage: String,
    giftWrap: { type: Boolean, default: false },
    senderName: String,
    recipientName: String
  },
  subscription: {
    isSubscription: { type: Boolean, default: false },
    frequency: String, // 'weekly', 'monthly', 'quarterly'
    nextDelivery: Date,
    endDate: Date,
    autoRenew: { type: Boolean, default: true }
  },
  analytics: {
    value: Number,
    commission: Number,
    platformEarnings: Number,
    customerLifetimeValue: { type: Number, default: 0 },
    repeatOrderRate: { type: Number, default: 0 },
    profitMargin: { type: Number, default: 0 }
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent', 'express'],
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
orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient queries
orderSchema.index({ orderId: 1, unique: true });
orderSchema.index({ userId: 1 });
orderSchema.index({ storeId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'shipping.address.coordinates': '2dsphere' });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ payment: 1 });
orderSchema.index({ delivery: 1 });
orderSchema.index({ 'tracking.trackingNumber': 1 });
orderSchema.index({ 'analytics.customerLifetimeValue': 1 });
orderSchema.index({ 'subscription.isSubscription': 1 });

module.exports = mongoose.model('Order', orderSchema);