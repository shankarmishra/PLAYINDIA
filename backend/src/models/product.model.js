const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cricket', 'football', 'badminton', 'tennis', 'gym', 'yoga', 'sports-wear', 'accessories']
  },
  subCategory: String,
  brand: String,
  sku: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  images: [{
    type: String // URLs to product images
  }],
  price: {
    original: {
      type: Number,
      required: true,
      min: 0
    },
    selling: {
      type: Number,
      required: true,
      min: 0
    },
    discount: {
      type: Number,
      default: 0 // in percentage
    }
  },
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    reserved: {
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    totalSold: {
      type: Number,
      default: 0
    }
  },
  specifications: {
    size: String,
    weight: String,
    color: String,
    material: String,
    dimensions: String,
    features: [String]
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
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  shipping: {
    freeShipping: {
      enabled: { type: Boolean, default: false },
      minOrderValue: Number
    },
    weight: Number, // in kg
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    fragile: { type: Boolean, default: false }
  },
  availability: {
    isActive: { type: Boolean, default: true },
    availableIn: [String], // cities where available
    deliveryTime: String // '2-3 days', '1-2 days'
  },
  features: {
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false }
  },
  warranty: {
    period: String, // '1 year', '6 months'
    terms: String
  },
  returnPolicy: {
    eligible: { type: Boolean, default: true },
    days: { type: Number, default: 30 },
    terms: String
  },
  tags: [String],
  inventory: {
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    reserved: {
      type: Number,
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10
    },
    totalSold: {
      type: Number,
      default: 0
    },
    reservedFor: [{
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
      },
      quantity: Number,
      reservedAt: Date
    }],
    batchNumbers: [{
      batchNumber: String,
      quantity: Number,
      expiryDate: Date,
      manufacturedDate: Date
    }]
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true
    },
    canonicalUrl: String,
    structuredData: String
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
    },
    verifiedPurchase: { type: Boolean, default: false },
    helpfulCount: { type: Number, default: 0 },
    images: [String],
    response: {
      from: String, // Store response
      comment: String,
      respondedAt: Date
    }
  }],
  analytics: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    addToCart: { type: Number, default: 0 },
    purchases: { type: Number, default: 0 },
    conversionRate: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    profit: { type: Number, default: 0 },
    customerSatisfaction: { type: Number, default: 0 },
    returnRate: { type: Number, default: 0 }
  },
  recommendations: {
    similarProducts: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      similarityScore: { type: Number, default: 0 }
    }],
    frequentlyBoughtTogether: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    }],
    viewedTogether: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
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
productSchema.index({ storeId: 1 });
productSchema.index({ category: 1 });
productSchema.index({ sku: 1, unique: true });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': 1 });
productSchema.index({ availability: 1 });
productSchema.index({ features: 1 });
productSchema.index({ 'inventory.quantity': 1 });
productSchema.index({ 'seo.slug': 1, unique: true });
productSchema.index({ 'analytics.revenue': -1 });

module.exports = mongoose.model('Product', productSchema);