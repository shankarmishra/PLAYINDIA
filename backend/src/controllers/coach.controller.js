const Coach = require('../models/coach.model');
const User = require('../models/user.model');
const { AppError } = require('../middleware/error');
const logger = require('../utils/logger');

/**
 * Get all coaches
 * @route GET /api/coaches
 * @access Public
 */
exports.getAllCoaches = async (req, res, next) => {
  try {
    const { sport, city, experience, rating, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (sport) query.sport = sport;
    if (city) query.city = city;
    if (experience) query.experience = { $gte: parseInt(experience) };
    if (rating) query.averageRating = { $gte: parseFloat(rating) };

    // Execute query with pagination
    const coaches = await Coach.find(query)
      .populate('user', 'name email phone')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort('-averageRating');

    // Get total count
    const total = await Coach.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        coaches,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get coach by ID
 * @route GET /api/coaches/:id
 * @access Public
 */
exports.getCoachById = async (req, res, next) => {
  try {
    const coach = await Coach.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('reviews.user', 'name');

    if (!coach) {
      return next(new AppError('Coach not found', 404));
    }

    res.status(200).json({
      success: true,
      data: coach
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create coach profile
 * @route POST /api/coaches
 * @access Private
 */
exports.createCoachProfile = async (req, res, next) => {
  try {
    // Check if coach profile already exists
    const existingCoach = await Coach.findOne({ user: req.user.id });
    if (existingCoach) {
      return next(new AppError('Coach profile already exists', 400));
    }

    // Create coach profile
    const coach = await Coach.create({
      user: req.user.id,
      ...req.body
    });

    // Update user role
    await User.findByIdAndUpdate(req.user.id, { role: 'coach' });

    res.status(201).json({
      success: true,
      data: coach
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update coach profile
 * @route PUT /api/coaches/:id
 * @access Private
 */
exports.updateCoachProfile = async (req, res, next) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return next(new AppError('Coach not found', 404));
    }

    // Check ownership
    if (coach.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to update this profile', 403));
    }

    // Update coach profile
    const updatedCoach = await Coach.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      data: updatedCoach
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Add review to coach
 * @route POST /api/coaches/:id/reviews
 * @access Private
 */
exports.addCoachReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const coach = await Coach.findById(req.params.id);
    
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    const review = {
      user: req.user.id,
      rating,
      comment
    };

    coach.reviews.push(review);
    
    // Update average rating
    const totalRating = coach.reviews.reduce((sum, item) => sum + item.rating, 0);
    coach.rating = totalRating / coach.reviews.length;

    await coach.save();
    res.status(201).json(coach);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get coach reviews
 * @route GET /api/coaches/:id/reviews
 * @access Public
 */
exports.getCoachReviews = async (req, res, next) => {
  try {
    const coach = await Coach.findById(req.params.id)
      .populate('reviews.user', 'name email')
      .select('reviews averageRating totalReviews');

    if (!coach) {
      return next(new AppError('Coach not found', 404));
    }

    res.status(200).json({
      success: true,
      data: {
        reviews: coach.reviews,
        averageRating: coach.averageRating,
        totalReviews: coach.totalReviews
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete coach profile
 * @route DELETE /api/coaches/:id
 * @access Private
 */
exports.deleteCoachProfile = async (req, res, next) => {
  try {
    const coach = await Coach.findById(req.params.id);

    if (!coach) {
      return next(new AppError('Coach not found', 404));
    }

    // Check ownership
    if (coach.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized to delete this profile', 403));
    }

    await Coach.findByIdAndDelete(req.params.id);

    // Update user role back to user
    await User.findByIdAndUpdate(req.user.id, { role: 'user' });

    res.status(200).json({
      success: true,
      message: 'Coach profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get coach's schedule
 * @route GET /api/coaches/:id/schedule
 * @access Public
 */
exports.getCoachSchedule = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id).select('availability');
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }
    res.json(coach.availability);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update coach's schedule
 * @route PUT /api/coaches/:id/schedule
 * @access Private
 */
exports.updateCoachSchedule = async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ message: 'Coach not found' });
    }

    if (coach.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    coach.availability = req.body;
    await coach.save();
    res.json(coach.availability);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Search nearby coaches
 * @route POST /api/coaches/nearby
 * @access Public
 */
exports.searchNearbyCoaches = async (req, res) => {
  try {
    const { coordinates, radius, specialization, maxHourlyRate } = req.body;
    
    let query = {};
    
    if (specialization) {
      query.specialties = specialization;
    }
    
    if (maxHourlyRate) {
      query.hourlyRate = { $lte: maxHourlyRate };
    }
    
    const coaches = await Coach.find(query)
      .populate('user', 'name email')
      .select('-reviews');
    
    res.json({
      success: true,
      coaches
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 