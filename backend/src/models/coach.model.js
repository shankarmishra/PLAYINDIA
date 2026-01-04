const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    trim: true,
    maxlength: [500, 'Review comment cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const scheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 30,
    max: 180
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'cancelled'],
    default: 'available'
  }
});

const coachSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  sport: {
    type: String,
    required: [true, 'Please specify your sport'],
    enum: ['Cricket', 'Football', 'Basketball', 'Tennis', 'Badminton', 'Swimming', 'Athletics', 'Other']
  },
  experience: {
    type: Number,
    required: [true, 'Please specify your years of experience'],
    min: 0
  },
  certifications: [{
    name: {
      type: String,
      required: true
    },
    issuedBy: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  }],
  specializations: [{
    type: String,
    required: true
  }],
  achievements: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    year: Number
  }],
  hourlyRate: {
    type: Number,
    required: [true, 'Please specify your hourly rate'],
    min: 0
  },
  city: {
    type: String,
    required: [true, 'Please specify your city']
  },
  availability: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }],
  schedule: [scheduleSchema],
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  bio: {
    type: String,
    required: [true, 'Please provide a bio'],
    trim: true,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  languages: [{
    type: String,
    required: true
  }],
  preferredAgeGroup: {
    type: String,
    enum: ['Kids', 'Teenagers', 'Adults', 'Seniors', 'All'],
    default: 'All'
  },
  trainingLocations: [{
    name: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    facilities: [String]
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
coachSchema.index({ sport: 1, city: 1 });
coachSchema.index({ hourlyRate: 1 });
coachSchema.index({ averageRating: -1 });

// Virtual field for upcoming sessions
coachSchema.virtual('upcomingSessions', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'coach',
  match: {
    status: 'confirmed',
    date: { $gte: new Date() }
  }
});

// Calculate average rating before saving
coachSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.averageRating = (
      this.reviews.reduce((acc, item) => item.rating + acc, 0) /
      this.reviews.length
    ).toFixed(1);
    this.totalReviews = this.reviews.length;
  }
  next();
});

// Check for schedule conflicts before saving
coachSchema.pre('save', function(next) {
  const schedules = this.schedule;
  const conflicts = schedules.some((schedule1, index1) => {
    return schedules.some((schedule2, index2) => {
      if (index1 === index2) return false;
      
      const start1 = new Date(schedule1.date).setHours(parseInt(schedule1.time.split(':')[0]));
      const end1 = new Date(start1).setMinutes(schedule1.duration);
      
      const start2 = new Date(schedule2.date).setHours(parseInt(schedule2.time.split(':')[0]));
      const end2 = new Date(start2).setMinutes(schedule2.duration);

      return (start1 < end2 && start2 < end1);
    });
  });

  if (conflicts) {
    next(new Error('Schedule conflict detected'));
  }
  next();
});

const Coach = mongoose.model('Coach', coachSchema);

module.exports = Coach; 