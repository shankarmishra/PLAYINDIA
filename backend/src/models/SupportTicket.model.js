const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  ticketId: {
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
  subject: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: [
      'account', 'payment', 'booking', 'order', 'delivery', 'coach', 'tournament', 
      'technical', 'refund', 'verification', 'complaint', 'suggestion', 'other'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed', 'escalated'],
    default: 'open'
  },
  type: {
    type: String,
    enum: ['query', 'complaint', 'feedback', 'bug_report', 'feature_request'],
    required: true
  },
  relatedEntity: {
    type: String,
    enum: ['booking', 'order', 'delivery', 'coach', 'tournament', 'match', 'product', 'user', 'wallet']
  },
  relatedId: mongoose.Schema.Types.ObjectId, // Reference to related document
  attachments: [{
    filename: String,
    url: String,
    type: String, // 'image', 'document', 'video'
    size: Number // in bytes
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    senderRole: {
      type: String,
      enum: ['user', 'admin', 'support'],
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    attachments: [{
      filename: String,
      url: String,
      type: String
    }]
  }],
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Support agent or admin
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  resolution: String, // How the ticket was resolved
  satisfactionRating: {
    type: Number,
    min: 1,
    max: 5
  },
  tags: [String], // Additional tags for categorization
  slaDeadline: Date, // Service Level Agreement deadline
  escalationLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 3
  },
  analytics: {
    responseTime: Number, // in minutes
    resolutionTime: Number, // in minutes
    reopenedCount: { type: Number, default: 0 }
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
supportTicketSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Indexes for efficient queries
supportTicketSchema.index({ ticketId: 1, unique: true });
supportTicketSchema.index({ userId: 1 });
supportTicketSchema.index({ status: 1 });
supportTicketSchema.index({ category: 1 });
supportTicketSchema.index({ priority: 1 });
supportTicketSchema.index({ type: 1 });
supportTicketSchema.index({ assignedTo: 1 });
supportTicketSchema.index({ createdAt: -1 });
supportTicketSchema.index({ slaDeadline: 1 });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);