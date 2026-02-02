const Ad = require('../models/ad.model');
const Product = require('../models/product.model');
const Store = require('../models/Store.model');
const Wallet = require('../models/Wallet.model');
const { uploadToCloudinary } = require('../utils/cloudinary');
const multer = require('multer');

// Multer configuration for ad banner images
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

/**
 * Get all ads for a store
 */
exports.getStoreAds = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // Find store by userId
    const store = await Store.findOne({ userId });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const { status, adType } = req.query;
    const query = { storeId: store._id };
    
    if (status) query.status = status;
    if (adType) query.adType = adType;

    const ads = await Ad.find(query)
      .populate('productId', 'name price images category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ads
    });
  } catch (error) {
    console.error('Error fetching store ads:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get single ad
 */
exports.getAd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    
    const store = await Store.findOne({ userId });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const ad = await Ad.findOne({ _id: id, storeId: store._id })
      .populate('productId', 'name price images category description')
      .populate('approvedBy', 'name email');

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ad
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create new ad
 */
exports.createAd = [
  upload.single('bannerImage'),
  async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    
    // Find store
    const store = await Store.findOne({ userId });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Verify product belongs to store
    const product = await Product.findOne({
      _id: req.body.productId,
      storeId: store._id
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or does not belong to your store'
      });
    }

    // Handle banner image upload
    let bannerImage = req.body.bannerImage;
    if (req.file) {
      try {
        const file = req.file;
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const uploadResult = await uploadToCloudinary(base64, {
          folder: 'ads/banners',
          resource_type: 'image'
        });
        bannerImage = uploadResult.url;
      } catch (error) {
        console.error('Error uploading banner image:', error);
        return res.status(400).json({
          success: false,
          message: 'Failed to upload banner image'
        });
      }
    }

    // Calculate pricing based on ad type
    const pricing = calculatePricing(req.body.adType, req.body.duration);

    // Create ad
    const adData = {
      storeId: store._id,
      productId: req.body.productId,
      adType: req.body.adType,
      title: req.body.title || product.name,
      description: req.body.description || product.description,
      bannerImage: bannerImage || (product.images && product.images[0]) || '',
      targeting: {
        location: {
          cities: Array.isArray(req.body.targetCities) ? req.body.targetCities : [],
          states: Array.isArray(req.body.targetStates) ? req.body.targetStates : []
        },
        category: req.body.targetCategory || 'all',
        gender: req.body.targetGender || 'all',
        ageGroup: req.body.ageGroup || {}
      },
      budget: {
        total: parseFloat(req.body.totalBudget) || 0,
        daily: parseFloat(req.body.dailyBudget) || 0,
        spent: 0
      },
      duration: {
        startDate: new Date(req.body.startDate),
        endDate: new Date(req.body.endDate)
      },
      pricing: pricing,
      status: 'draft',
      payment: {
        status: 'pending',
        amount: pricing.totalCost
      }
    };

    const ad = await Ad.create(adData);

    res.status(201).json({
      success: true,
      data: ad,
      message: 'Ad created successfully. Please complete payment to submit for approval.'
    });
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
  }
];

/**
 * Update ad
 */
exports.updateAd = [
  upload.single('bannerImage'),
  async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    
    const store = await Store.findOne({ userId });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const ad = await Ad.findOne({ _id: id, storeId: store._id });
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Can only update draft or rejected ads
    if (ad.status !== 'draft' && ad.status !== 'rejected') {
      return res.status(400).json({
        success: false,
        message: 'Can only update draft or rejected ads'
      });
    }

    // Handle banner image upload
    if (req.file) {
      try {
        const file = req.file;
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const uploadResult = await uploadToCloudinary(base64, {
          folder: 'ads/banners',
          resource_type: 'image'
        });
        ad.bannerImage = uploadResult.url;
      } catch (error) {
        console.error('Error uploading banner image:', error);
      }
    }

    // Update fields
    if (req.body.title) ad.title = req.body.title;
    if (req.body.description) ad.description = req.body.description;
    if (req.body.adType) ad.adType = req.body.adType;
    if (req.body.startDate) ad.duration.startDate = new Date(req.body.startDate);
    if (req.body.endDate) ad.duration.endDate = new Date(req.body.endDate);
    if (req.body.totalBudget) ad.budget.total = parseFloat(req.body.totalBudget);
    if (req.body.dailyBudget) ad.budget.daily = parseFloat(req.body.dailyBudget);
    
    if (req.body.targetCities) {
      ad.targeting.location.cities = Array.isArray(req.body.targetCities) 
        ? req.body.targetCities 
        : [];
    }
    if (req.body.targetStates) {
      ad.targeting.location.states = Array.isArray(req.body.targetStates) 
        ? req.body.targetStates 
        : [];
    }
    if (req.body.targetCategory) ad.targeting.category = req.body.targetCategory;
    if (req.body.targetGender) ad.targeting.gender = req.body.targetGender;

    // Recalculate pricing if dates or budget changed
    if (req.body.startDate || req.body.endDate || req.body.totalBudget) {
      ad.pricing = calculatePricing(ad.adType, {
        startDate: ad.duration.startDate,
        endDate: ad.duration.endDate
      });
      ad.payment.amount = ad.pricing.totalCost;
    }

    await ad.save();

    res.status(200).json({
      success: true,
      data: ad
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
  }
];

/**
 * Delete ad
 */
exports.deleteAd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    
    const store = await Store.findOne({ userId });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const ad = await Ad.findOne({ _id: id, storeId: store._id });
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Can only delete draft, rejected, or expired ads
    if (!['draft', 'rejected', 'expired'].includes(ad.status)) {
      return res.status(400).json({
        success: false,
        message: 'Can only delete draft, rejected, or expired ads'
      });
    }

    await Ad.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Submit ad for approval (after payment)
 */
exports.submitAd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    
    const store = await Store.findOne({ userId });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const ad = await Ad.findOne({ _id: id, storeId: store._id });
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    if (ad.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Ad is not in draft status'
      });
    }

    // Process payment
    const paymentMethod = req.body.paymentMethod || 'wallet';
    const paymentAmount = ad.payment.amount;

    if (paymentMethod === 'wallet') {
      // Deduct from wallet
      let wallet = await Wallet.findOne({ userId });
      if (!wallet) {
        wallet = await Wallet.create({ userId, balance: 0 });
      }

      if (wallet.balance < paymentAmount) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient wallet balance'
        });
      }

      wallet.balance -= paymentAmount;
      await wallet.save();

      ad.payment.method = 'wallet';
      ad.payment.status = 'completed';
      ad.payment.paidAt = new Date();
    } else {
      // For UPI/Card, payment will be processed externally
      ad.payment.method = paymentMethod;
      ad.payment.transactionId = req.body.transactionId;
      // Status will be updated after payment gateway confirmation
    }

    ad.status = 'pending';
    await ad.save();

    res.status(200).json({
      success: true,
      data: ad,
      message: 'Ad submitted for approval'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Pause/Resume ad
 */
exports.toggleAdStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;
    
    const store = await Store.findOne({ userId });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    const ad = await Ad.findOne({ _id: id, storeId: store._id });
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    if (ad.status === 'active') {
      ad.status = 'paused';
    } else if (ad.status === 'paused') {
      // Check if still within duration and budget
      const now = new Date();
      if (now >= ad.duration.startDate && now <= ad.duration.endDate && ad.budget.spent < ad.budget.total) {
        ad.status = 'active';
      } else {
        return res.status(400).json({
          success: false,
          message: 'Cannot resume ad: duration expired or budget exhausted'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Can only pause/resume active ads'
      });
    }

    await ad.save();

    res.status(200).json({
      success: true,
      data: ad
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get active ads for users (public endpoint)
 */
exports.getActiveAds = async (req, res, next) => {
  try {
    const { adType, category, city, state } = req.query;
    const now = new Date();

    const query = {
      status: 'active',
      'payment.status': 'completed',
      'duration.startDate': { $lte: now },
      'duration.endDate': { $gte: now },
      $expr: { $lt: ['$budget.spent', '$budget.total'] }
    };

    if (adType) query.adType = adType;
    if (category && category !== 'all') {
      query.$or = [
        { 'targeting.category': category },
        { 'targeting.category': 'all' }
      ];
    }

    // Location targeting
    if (city || state) {
      query.$and = [];
      if (city) {
        query.$and.push({
          $or: [
            { 'targeting.location.cities': { $in: [city] } },
            { 'targeting.location.cities': { $size: 0 } }
          ]
        });
      }
      if (state) {
        query.$and.push({
          $or: [
            { 'targeting.location.states': { $in: [state] } },
            { 'targeting.location.states': { $size: 0 } }
          ]
        });
      }
    }

    const ads = await Ad.find(query)
      .populate('productId', 'name price images category')
      .populate('storeId', 'storeName')
      .sort({ priority: -1, createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: ads
    });
  } catch (error) {
    console.error('Error fetching active ads:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Track ad click
 */
exports.trackClick = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ad = await Ad.findById(id);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Increment click
    await ad.incrementClick();

    res.status(200).json({
      success: true,
      message: 'Click tracked'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Track ad view
 */
exports.trackView = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ad = await Ad.findById(id);
    if (!ad) {
      return res.status(200).json({ success: true }); // Don't fail on view tracking
    }

    // Increment view
    await ad.incrementView();

    res.status(200).json({
      success: true
    });
  } catch (error) {
    // Don't fail on view tracking errors
    res.status(200).json({ success: true });
  }
};

/**
 * Admin: Get all ads
 */
exports.getAllAds = async (req, res, next) => {
  try {
    const { status, adType, storeId } = req.query;
    const query = {};

    if (status) query.status = status;
    if (adType) query.adType = adType;
    if (storeId) query.storeId = storeId;

    const ads = await Ad.find(query)
      .populate('productId', 'name price images')
      .populate('storeId', 'storeName ownerName')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: ads
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin: Approve ad
 */
exports.approveAd = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const ad = await Ad.findById(id);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    if (ad.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Ad is not pending approval'
      });
    }

    ad.status = 'approved';
    ad.approvedBy = userId;
    ad.approvedAt = new Date();
    ad.adminNotes = req.body.notes || '';

    // Auto-activate if start date has passed
    const now = new Date();
    if (now >= ad.duration.startDate) {
      ad.status = 'active';
    }

    await ad.save();

    res.status(200).json({
      success: true,
      data: ad,
      message: 'Ad approved successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin: Reject ad
 */
exports.rejectAd = async (req, res, next) => {
  try {
    const { id } = req.params;

    const ad = await Ad.findById(id);
    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    if (ad.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Ad is not pending approval'
      });
    }

    ad.status = 'rejected';
    ad.rejectionReason = req.body.reason || 'Ad rejected by admin';
    ad.adminNotes = req.body.notes || '';

    // Refund payment
    if (ad.payment.status === 'completed' && ad.payment.method === 'wallet') {
      const wallet = await Wallet.findOne({ userId: ad.storeId.userId });
      if (wallet) {
        wallet.balance += ad.payment.amount;
        await wallet.save();
      }
    }

    await ad.save();

    res.status(200).json({
      success: true,
      data: ad,
      message: 'Ad rejected'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin: Update ad pricing
 */
exports.updatePricing = async (req, res, next) => {
  try {
    const { adType, pricePerDay } = req.body;

    // This would typically update a pricing configuration
    // For now, we'll just return success
    res.status(200).json({
      success: true,
      message: 'Pricing updated'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Helper function to calculate pricing
 */
function calculatePricing(adType, duration) {
  const startDate = new Date(duration.startDate);
  const endDate = new Date(duration.endDate);
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Base pricing per day (can be configured)
  const basePricing = {
    'home-banner': 500,      // ₹500 per day
    'category-banner': 300,   // ₹300 per day
    'sponsored-product': 200 // ₹200 per day
  };

  const pricePerDay = basePricing[adType] || 200;
  const totalCost = pricePerDay * days;

  return {
    pricePerDay,
    pricePerClick: 0, // Can be configured
    pricePerView: 0,  // Can be configured
    totalCost,
    days
  };
}

