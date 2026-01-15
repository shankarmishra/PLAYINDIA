const Booking = require('../models/booking.model');
const Coach = require('../models/coach.model');
const User = require('../models/user.model');
const Wallet = require('../models/Wallet.model');
const Review = require('../models/Review.model');

/**
 * Create a new booking
 */
exports.createBooking = async (req, res, next) => {
  try {
    const bookingData = req.body;
    
    // Validate coach availability
    const coach = await Coach.findById(bookingData.coachId);
    if (!coach || !coach.verified) {
      return res.status(400).json({
        success: false,
        message: 'Coach not found or not verified'
      });
    }

    // Generate booking ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const bookingId = `BK-${timestamp}-${random}`.toUpperCase();

    // Create booking
    const booking = await Booking.create({
      ...bookingData,
      bookingId,
      userId: req.user.id
    });

    // Update coach schedule to mark time slot as booked
    await Coach.findByIdAndUpdate(
      bookingData.coachId,
      { 
        $push: { 
          'availability.timeSlots': {
            date: bookingData.schedule.date,
            slots: [{
              time: bookingData.schedule.startTime,
              available: false,
              bookingId: booking._id
            }]
          }
        }
      }
    );

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get user bookings
 */
exports.getUserBookings = async (req, res, next) => {
  try {
    const { status, dateFrom, dateTo } = req.query;
    
    let query = { userId: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    if (dateFrom || dateTo) {
      query['schedule.date'] = {};
      if (dateFrom) query['schedule.date'].$gte = new Date(dateFrom);
      if (dateTo) query['schedule.date'].$lte = new Date(dateTo);
    }
    
    const bookings = await Booking.find(query)
      .populate('coachId', 'name mobile')
      .populate('coachProfileId', 'specialization experience')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get coach bookings
 */
exports.getCoachBookings = async (req, res, next) => {
  try {
    const { status, dateFrom, dateTo } = req.query;
    
    // Get coach profile
    const coach = await Coach.findOne({ userId: req.user.id });
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach profile not found'
      });
    }
    
    let query = { coachId: coach._id };
    
    if (status) {
      query.status = status;
    }
    
    if (dateFrom || dateTo) {
      query['schedule.date'] = {};
      if (dateFrom) query['schedule.date'].$gte = new Date(dateFrom);
      if (dateTo) query['schedule.date'].$lte = new Date(dateTo);
    }
    
    const bookings = await Booking.find(query)
      .populate('userId', 'name mobile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update booking status
 */
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = [
      'pending', 'confirmed', 'in_progress', 'completed', 
      'cancelled', 'no_show', 'rescheduled', 'rejected', 'expired'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Add timeline entry
    await Booking.findByIdAndUpdate(
      id,
      { 
        $push: { 
          timeline: {
            action: `Status changed to ${status}`,
            timestamp: new Date(),
            actor: req.user.role,
            notes: `Status updated by ${req.user.role}`
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Accept or reject booking (coach action)
 */
exports.respondToBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // 'accept' or 'reject'
    
    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be accept or reject'
      });
    }
    
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Verify this coach owns this booking
    const coach = await Coach.findOne({ userId: req.user.id });
    if (!coach || booking.coachId.toString() !== coach._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this booking'
      });
    }
    
    let updatedStatus;
    let coachStatus;
    
    if (action === 'accept') {
      updatedStatus = 'confirmed';
      coachStatus = 'accepted';
    } else {
      updatedStatus = 'rejected';
      coachStatus = 'rejected';
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { 
        status: updatedStatus,
        'coach.status': coachStatus,
        'coach.acceptedAt': action === 'accept' ? new Date() : undefined
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Complete booking (coach action)
 */
exports.completeBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { feedback, rating } = req.body;
    
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Verify this coach owns this booking
    const coach = await Coach.findOne({ userId: req.user.id });
    if (!coach || booking.coachId.toString() !== coach._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this booking'
      });
    }
    
    // Update booking status to completed
    const completedBooking = await Booking.findByIdAndUpdate(
      id,
      { 
        status: 'completed',
        'coach.status': 'completed',
        'coach.completedAt': new Date(),
        'feedback.coach': feedback,
        'ratings.coach.rating': rating,
        'ratings.coach.date': new Date()
      },
      { new: true }
    );

    // Add timeline entry
    await Booking.findByIdAndUpdate(
      id,
      { 
        $push: { 
          timeline: {
            action: 'Booking completed',
            timestamp: new Date(),
            actor: 'coach',
            notes: 'Coach marked booking as completed'
          }
        }
      }
    );

    // Update coach ratings
    if (rating) {
      await Coach.findByIdAndUpdate(
        booking.coachId,
        { 
          $inc: { 
            'ratings.count': 1,
            [`ratings.breakdown.${rating}`]: 1
          },
          $push: {
            'ratings.recentReviews': {
              userId: booking.userId,
              rating: rating,
              comment: feedback,
              date: new Date()
            }
          }
        }
      );
      
      // Calculate new average
      const updatedCoach = await Coach.findById(booking.coachId);
      const totalRatings = updatedCoach.ratings.count;
      const newAvg = (updatedCoach.ratings.breakdown[5]*5 + 
                     updatedCoach.ratings.breakdown[4]*4 + 
                     updatedCoach.ratings.breakdown[3]*3 + 
                     updatedCoach.ratings.breakdown[2]*2 + 
                     updatedCoach.ratings.breakdown[1]*1) / totalRatings;
      
      await Coach.findByIdAndUpdate(
        booking.coachId,
        { 'ratings.average': Math.round(newAvg * 10) / 10 } // Round to 1 decimal
      );
    }

    res.status(200).json({
      success: true,
      data: completedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get booking details
 */
exports.getBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id)
      .populate('userId', 'name mobile')
      .populate('coachId', 'name mobile')
      .populate('coachProfileId', 'specialization experience');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    if (req.user.id !== booking.userId.toString() && req.user.role !== 'coach') {
      const coach = await Coach.findOne({ userId: req.user.id });
      if (!coach || booking.coachId.toString() !== coach._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to view this booking'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * Rate a booking (user action)
 */
exports.rateBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;
    
    // Validate rating
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }
    
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Verify this user owns this booking
    if (req.user.id !== booking.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to rate this booking'
      });
    }
    
    // Check if booking is completed (can only rate completed bookings)
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed bookings'
      });
    }
    
    // Update booking with user rating
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { 
        'ratings.user.rating': rating,
        'ratings.user.review': review,
        'ratings.user.date': new Date()
      },
      { new: true }
    );
    
    // Create review record
    await Review.create({
      reviewer: {
        userId: req.user.id,
        role: 'user'
      },
      reviewee: {
        userId: booking.coachId,
        role: 'coach'
      },
      bookingId: booking._id,
      rating,
      review,
      type: 'booking'
    });
    
    // Update coach ratings
    const coach = await Coach.findById(booking.coachId);
    if (coach) {
      await Coach.findByIdAndUpdate(
        booking.coachId,
        { 
          $inc: { 
            'ratings.count': 1,
            [`ratings.breakdown.${rating}`]: 1
          },
          $push: {
            'ratings.recentReviews': {
              userId: req.user.id,
              rating: rating,
              comment: review,
              date: new Date()
            }
          }
        }
      );
      
      // Calculate new average
      const updatedCoach = await Coach.findById(booking.coachId);
      const totalRatings = updatedCoach.ratings.count;
      const newAvg = (updatedCoach.ratings.breakdown[5]*5 + 
                     updatedCoach.ratings.breakdown[4]*4 + 
                     updatedCoach.ratings.breakdown[3]*3 + 
                     updatedCoach.ratings.breakdown[2]*2 + 
                     updatedCoach.ratings.breakdown[1]*1) / totalRatings;
      
      await Coach.findByIdAndUpdate(
        booking.coachId,
        { 'ratings.average': Math.round(newAvg * 10) / 10 } // Round to 1 decimal
      );
    }
    
    res.status(200).json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Aliases for function compatibility
exports.getCoachBookings = exports.getCoachBookings;

module.exports = exports;