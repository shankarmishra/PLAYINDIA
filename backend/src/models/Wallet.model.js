const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  transactions: [{
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    balanceAfter: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      enum: [
        'booking_payment', 'booking_refund', 'order_payment', 'order_refund',
        'coach_payment', 'coach_refund', 'delivery_payment', 'delivery_refund',
        'wallet_recharge', 'wallet_withdrawal', 'referral_bonus', 'cashback',
        'commission', 'refund', 'adjustment'
      ]
    },
    description: String,
    relatedTo: {
      type: String,
      enum: ['booking', 'order', 'coach', 'delivery', 'store', 'wallet', 'admin']
    },
    relatedId: mongoose.Schema.Types.ObjectId, // Reference to related document
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed'
    },
    paymentMethod: {
      type: String,
      enum: ['upi', 'card', 'net_banking', 'wallet', 'cash', 'bank_transfer']
    },
    transactionDate: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  totalCredits: {
    type: Number,
    default: 0
  },
  totalDebits: {
    type: Number,
    default: 0
  },
  lastTransactionDate: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
walletSchema.index({ userId: 1 });
walletSchema.index({ balance: 1 });
walletSchema.index({ 'transactions.transactionDate': -1 });
walletSchema.index({ 'transactions.type': 1 });
walletSchema.index({ 'transactions.category': 1 });
walletSchema.index({ 'transactions.status': 1 });

module.exports = mongoose.model('Wallet', walletSchema);