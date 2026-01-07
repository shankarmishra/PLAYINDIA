const Coach = require('../models/coach.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const Review = require('../models/Review.model');
const Wallet = require('../models/Wallet.model');

/**
 * Get coaches based on filters
 */
exports.getCoaches = async (req, res, next) => {
  try {
    const { sport, location, rating, experience, availability, price } = req.query;
    
    // Build query
    let query = { verified: true, 'availability.isAvailable': true };
    
    if (sport) {
      query.sports = { $in: [sport] };
    }
    
    if (rating) {
      query['ratings.average'] = { $gte: parseFloat(rating) };
    }
    
    if (experience) {
      query['experience.years'] = { $gte: parseInt(experience) };
    }
    
    if (location) {
      // Add location-based query if coordinates are provided
      // This would require additional parameters
    }
    
    const coaches = await Coach.find(query)
      .populate('userId', 'name mobile email')
      .sort({ 'ratings.average': -1, 'experience.years': -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: coaches.length,
      data: coaches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get coach profile
 */
exports.getCoachProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const coach = await Coach.findById(id)
      .populate('userId', 'name mobile email')
      .populate('achievements', 'title description date');

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    // Get additional stats
    const completedSessions = await Booking.countDocuments({
      coachId: id,
      status: 'completed'
    });

    const totalEarnings = await Booking.aggregate([
      { $match: { coachId: id, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$payment.amount' } } }
    ]);

    const avgRating = await Review.aggregate([
      { $match: { 'reviewee.userId': coach.userId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const profileData = {
      ...coach.toObject(),
      stats: {
        completedSessions,
        totalEarnings: totalEarnings[0] ? totalEarnings[0].total : 0,
        averageRating: avgRating[0] ? avgRating[0].avgRating : 0
      }
    };

    res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get coach dashboard
 */
exports.getCoachDashboard = async (req, res, next) => {
  try {
    const coach = await Coach.findOne({ userId: req.user.id })
      .populate('userId', 'name mobile email');

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach profile not found'
      });
    }

    // Get coach wallet
    const wallet = await Wallet.findOne({ userId: req.user.id });

    // Get recent bookings
    const recentBookings = await Booking.find({ coachId: coach._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get upcoming bookings
    const upcomingBookings = await Booking.find({
      coachId: coach._id,
      status: { $in: ['pending', 'confirmed', 'in_progress'] },
      'schedule.date': { $gte: new Date() }
    });

    // Get recent reviews
    const recentReviews = await Review.find({ 'reviewee.userId': req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get earnings analytics
    const monthlyEarnings = await Booking.aggregate([
      { $match: { 
          coachId: coach._id, 
          status: 'completed',
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 3)) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$payment.amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dashboardData = {
      coach: {
        ...coach.toObject(),
        walletBalance: wallet ? wallet.balance : 0
      },
      stats: {
        totalSessions: coach.sessions.total,
        completedSessions: coach.sessions.completed,
        totalEarnings: coach.earnings.total,
        availableEarnings: coach.earnings.available,
        pendingEarnings: coach.earnings.pending,
        rating: coach.ratings.average,
        totalRatings: coach.ratings.count
      },
      sections: {
        recentBookings,
        upcomingBookings,
        recentReviews,
        monthlyEarnings
      },
      analytics: {
        monthlyEarnings,
        sessionTrend: [], // Implement based on booking data
        studentGrowth: [] // Implement based on new students
      }
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update coach availability
 */
exports.updateAvailability = async (req, res, next) => {
  try {
    const { schedule, isAvailable, timeSlots } = req.body;
    
    const coach = await Coach.findOneAndUpdate(
      { userId: req.user.id },
      { 
        'availability.schedule': schedule,
        'availability.isAvailable': isAvailable,
        'availability.timeSlots': timeSlots
      },
      { new: true, runValidators: true }
    );

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: coach
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update coach profile
 */
exports.updateCoachProfile = async (req, res, next) => {
  try {
    const updateData = req.body;
    
    const coach = await Coach.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: coach
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get coach availability for specific date
 */
exports.getCoachAvailability = async (req, res, next) => {
  try {
    const { id, date } = req.params;
    
    const coach = await Coach.findById(id);
    
    if (!coach) {
      return res.status(404).json({
        success: false,
        message: 'Coach not found'
      });
    }

    // Check if coach is available on the specified date
    const coachDate = new Date(date);
    const dayOfWeek = coachDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const daySchedule = coach.availability.schedule.find(s => s.day === dayOfWeek);
    
    if (!daySchedule || !daySchedule.available) {
      return res.status(200).json({
        success: true,
        available: false,
        message: 'Coach not available on this day'
      });
    }

    // Check time slots for the specific date
    const dateSlot = coach.availability.timeSlots.find(ts => 
      new Date(ts.date).toDateString() === coachDate.toDateString()
    );

    let availableSlots = [];
    if (dateSlot) {
      availableSlots = dateSlot.slots
        .filter(slot => slot.available && !slot.bookingId)
        .map(slot => slot.time);
    } else {
      // Use default schedule for the day
      // This would require more complex time slot generation logic
      availableSlots = generateTimeSlots(daySchedule.startTime, daySchedule.endTime);
    }

    res.status(200).json({
      success: true,
      available: true,
      date,
      slots: availableSlots
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Generate time slots based on start and end time
 */
function generateTimeSlots(startTime, endTime) {
  const slots = [];
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    slots.push(`${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`);
    
    currentMin += 30; // 30-minute slots
    if (currentMin >= 60) {
      currentHour++;
      currentMin = 0;
    }
    
    // Stop if we've exceeded the end time
    if (currentHour > endHour || (currentHour === endHour && currentMin >= endMin)) {
      break;
    }
  }
  
  return slots;
}

module.exports = exports;