const Banner = require('../models/banner.model');
const logger = require('../utils/logger');

/**
 * Get all active banners
 * Public endpoint - no auth required
 */
exports.getBanners = async (req, res, next) => {
  try {
    const { status, targetAudience } = req.query;
    const now = new Date();

    let query = {};

    // If status is specified, use it; otherwise get active banners
    if (status) {
      query.status = status;
    } else {
      query.status = 'active';
      // Also check date range for scheduled banners
      query.$or = [
        { startDate: { $exists: false } },
        { startDate: { $lte: now } }
      ];
      query.$and = [
        {
          $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: now } }
          ]
        }
      ];
    }

    if (targetAudience) {
      query.targetAudience = { $in: [targetAudience, 'all'] };
    }

    const banners = await Banner.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .select('-createdBy -updatedBy -__v')
      .lean();

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    logger.error('Get banners error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch banners'
    });
  }
};

/**
 * Get single banner by ID
 * Public endpoint
 */
exports.getBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id)
      .select('-createdBy -updatedBy -__v')
      .lean();

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    // Increment views
    await Banner.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    logger.error('Get banner error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch banner'
    });
  }
};

/**
 * Create new banner
 * Admin only
 */
exports.createBanner = async (req, res, next) => {
  try {
    const bannerData = {
      ...req.body,
      createdBy: req.user.id,
      updatedBy: req.user.id
    };

    const banner = await Banner.create(bannerData);

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner
    });
  } catch (error) {
    logger.error('Create banner error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create banner'
    });
  }
};

/**
 * Update banner
 * Admin only
 */
exports.updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedBy: req.user.id
    };

    const banner = await Banner.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: banner
    });
  } catch (error) {
    logger.error('Update banner error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update banner'
    });
  }
};

/**
 * Delete banner
 * Admin only
 */
exports.deleteBanner = async (req, res, next) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    logger.error('Delete banner error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete banner'
    });
  }
};

/**
 * Track banner click
 * Public endpoint
 */
exports.trackBannerClick = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Banner.findByIdAndUpdate(id, { $inc: { clicks: 1 } });

    res.status(200).json({
      success: true,
      message: 'Click tracked'
    });
  } catch (error) {
    logger.error('Track banner click error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to track click'
    });
  }
};

/**
 * Get all banners (admin view)
 * Admin only - includes inactive banners
 */
exports.getAllBanners = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const banners = await Banner.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email')
      .lean();

    const total = await Banner.countDocuments(query);

    res.status(200).json({
      success: true,
      count: banners.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: banners
    });
  } catch (error) {
    logger.error('Get all banners error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch banners'
    });
  }
};
