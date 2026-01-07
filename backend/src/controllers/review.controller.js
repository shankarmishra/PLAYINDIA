const Review = require('../models/Review.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');
const Order = require('../models/order.model');

/**
 * Create a new review
 */
exports.createReview = async (req, res, next) => {
  try {
    const { revieweeId, service, serviceId, rating, title, comment, images } = req.body;
    
    // Validate input
    if (!revieweeId || !service || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Reviewee ID, service, and rating (1-5) are required'
      });
    }

    // Verify the user exists
    const reviewee = await User.findById(revieweeId);
    if (!reviewee) {
      return res.status(404).json({
        success: false,
        message: 'Reviewee not found'
      });
    }

    // Verify user has permission to review (e.g., they had a transaction with the reviewee)
    let isVerified = false;
    if (service === 'booking') {
      const booking = await Booking.findById(serviceId);
      if (booking && booking.userId.toString() === req.user.id) {
        isVerified = true;
      }
    } else if (service === 'order') {
      const order = await Order.findById(serviceId);
      if (order && order.userId.toString() === req.user.id) {
        isVerified = true;
      }
    }
    // Add other verification checks for different services

    // Generate review ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const reviewId = `REV-${timestamp}-${random}`.toUpperCase();

    // Create review
    const review = await Review.create({
      reviewId,
      reviewer: {
        userId: req.user.id,
        name: req.user.name, // This should be populated from the request
        role: req.user.role
      },
      reviewee: {
        userId: revieweeId,
        name: reviewee.name,
        role: reviewee.role
      },
      service,
      serviceId,
      rating,
      title,
      comment,
      images,
      verified: isVerified,
      status: 'pending' // Could be auto-approved or require admin approval
    });

    // Update reviewee's average rating
    await updateAverageRating(revieweeId);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get reviews for a user/service
 */
exports.getReviews = async (req, res, next) => {
  try {
    const { revieweeId, service, serviceId, minRating, status, limit = 20, page = 1 } = req.query;
    
    let query = {};
    
    if (revieweeId) {
      query['reviewee.userId'] = revieweeId;
    }
    
    if (service) {
      query.service = service;
    }
    
    if (serviceId) {
      query.serviceId = serviceId;
    }
    
    if (minRating) {
      query.rating = { $gte: parseInt(minRating) };
    }
    
    if (status) {
      query.status = status;
    } else {
      query.status = 'approved'; // Default to approved reviews
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find(query)
      .populate('reviewer.userId', 'name mobile')
      .populate('reviewee.userId', 'name mobile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get user's reviews (reviews they wrote)
 */
exports.getUserReviews = async (req, res, next) => {
  try {
    const { service, minRating, limit = 20, page = 1 } = req.query;
    
    let query = { 'reviewer.userId': req.user.id };
    
    if (service) {
      query.service = service;
    }
    
    if (minRating) {
      query.rating = { $gte: parseInt(minRating) };
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find(query)
      .populate('reviewee.userId', 'name mobile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update a review (only by the reviewer)
 */
exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, images } = req.body;
    
    // Verify the review exists and belongs to the user
    const review = await Review.findOne({ 
      _id: id, 
      'reviewer.userId': req.user.id 
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        $set: {
          rating,
          title,
          comment,
          images,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    // Update reviewee's average rating
    await updateAverageRating(review.reviewee.userId);

    res.status(200).json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete a review (only by the reviewer)
 */
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verify the review exists and belongs to the user
    const review = await Review.findOne({ 
      _id: id, 
      'reviewer.userId': req.user.id 
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    await Review.findByIdAndDelete(id);

    // Update reviewee's average rating
    await updateAverageRating(review.reviewee.userId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Mark review as helpful
 */
exports.markReviewHelpful = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already voted
    const hasVoted = review.helpful.voters.some(voter => 
      voter.userId.toString() === req.user.id
    );

    if (hasVoted) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted for this review'
      });
    }

    // Update helpful count
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        $inc: { 'helpful.count': 1 },
        $push: { 
          'helpful.voters': {
            userId: req.user.id,
            votedAt: new Date()
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get top reviews by rating or helpfulness
 */
exports.getTopReviews = async (req, res, next) => {
  try {
    const { sortBy = 'rating', limit = 10 } = req.query;
    
    let sort = {};
    if (sortBy === 'helpful') {
      sort = { 'helpful.count': -1 };
    } else {
      sort = { rating: -1, createdAt: -1 };
    }
    
    const reviews = await Review.find({ status: 'approved' })
      .populate('reviewer.userId', 'name')
      .populate('reviewee.userId', 'name')
      .sort(sort)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update average rating for a user
 */
async function updateAverageRating(userId) {
  try {
    const reviews = await Review.find({ 
      'reviewee.userId': userId, 
      status: 'approved' 
    });
    
    if (reviews.length === 0) {
      await User.findByIdAndUpdate(userId, {
        $set: { 'ratings.average': 0, 'ratings.count': 0 }
      });
      return;
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await User.findByIdAndUpdate(userId, {
      $set: { 
        'ratings.average': Math.round(averageRating * 10) / 10, // Round to 1 decimal
        'ratings.count': reviews.length 
      }
    });
  } catch (error) {
    console.error('Error updating average rating:', error);
  }
}

module.exports = exports;