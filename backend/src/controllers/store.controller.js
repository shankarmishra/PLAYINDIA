const Store = require('../models/Store.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Wallet = require('../models/Wallet.model');
const Review = require('../models/Review.model');

/**
 * Get stores based on filters
 */
exports.getStores = async (req, res, next) => {
  try {
    const { category, location, rating, delivery, city, state } = req.query;
    
    // Build query
    let query = { verified: true, status: 'active' };
    
    if (category) {
      query.category = category;
    }
    
    if (rating) {
      query['ratings.average'] = { $gte: parseFloat(rating) };
    }
    
    if (delivery === 'true') {
      query['features.deliveryAvailable'] = true;
    }
    
    if (city) {
      query['address.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      query['address.state'] = new RegExp(state, 'i');
    }
    
    // Add location-based query if coordinates are provided
    if (location) {
      const [lat, lng] = location.split(',').map(Number);
      const distance = req.query.distance || 10; // default 10km
      const radiusInRadians = distance / 6378.1; // Earth's radius in km

      query['address.coordinates'] = {
        $geoWithin: {
          $centerSphere: [
            [lng, lat],
            radiusInRadians
          ]
        }
      };
    }
    
    const stores = await Store.find(query)
      .populate('userId', 'name mobile email')
      .sort({ 'ratings.average': -1, createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get store profile
 */
exports.getStoreProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const store = await Store.findById(id)
      .populate('userId', 'name mobile email');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Get additional stats
    const totalOrders = await Order.countDocuments({ storeId: id });
    const totalRevenue = await Order.aggregate([
      { $match: { storeId: id, 'payment.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const avgRating = await Review.aggregate([
      { $match: { 'reviewee.userId': store.userId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const products = await Product.find({ storeId: id })
      .select('name price inventory.quantity ratings.average')
      .limit(10);

    const profileData = {
      ...store.toObject(),
      stats: {
        totalOrders,
        totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
        averageRating: avgRating[0] ? avgRating[0].avgRating : 0
      },
      products
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
 * Get store dashboard
 */
exports.getStoreDashboard = async (req, res, next) => {
  try {
    const store = await Store.findOne({ userId: req.user.id })
      .populate('userId', 'name mobile email');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store profile not found'
      });
    }

    // Get store wallet
    const wallet = await Wallet.findOne({ userId: req.user.id });

    // Get recent orders
    const recentOrders = await Order.find({ storeId: store._id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get order analytics
    const orderAnalytics = await Order.aggregate([
      { $match: { 
          storeId: store._id,
          createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } // Last 30 days
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top selling products
    const topSellingProducts = await Product.find({ storeId: store._id })
      .sort({ 'analytics.purchases': -1 })
      .limit(5);

    const dashboardData = {
      store: {
        ...store.toObject(),
        walletBalance: wallet ? wallet.balance : 0
      },
      stats: {
        totalOrders: store.orders.total,
        completedOrders: store.orders.completed,
        totalRevenue: store.earnings.total,
        availableEarnings: store.earnings.available,
        pendingEarnings: store.earnings.pending,
        rating: store.ratings.average,
        totalRatings: store.ratings.count
      },
      sections: {
        recentOrders,
        topSellingProducts,
        orderAnalytics
      },
      analytics: {
        orderAnalytics,
        revenueTrend: orderAnalytics,
        topSellingProducts
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
 * Update store profile
 */
exports.updateStoreProfile = async (req, res, next) => {
  try {
    const updateData = req.body;
    
    const store = await Store.findOneAndUpdate(
      { userId: req.user.id },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: store
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get store products
 */
exports.getStoreProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, search, minPrice, maxPrice, sort } = req.query;
    
    let query = { storeId: id, 'availability.isActive': true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      query['price.selling'] = {};
      if (minPrice) query['price.selling'].$gte = parseFloat(minPrice);
      if (maxPrice) query['price.selling'].$lte = parseFloat(maxPrice);
    }
    
    let sortOption = {};
    if (sort === 'price-low') {
      sortOption = { 'price.selling': 1 };
    } else if (sort === 'price-high') {
      sortOption = { 'price.selling': -1 };
    } else if (sort === 'rating') {
      sortOption = { 'ratings.average': -1 };
    } else if (sort === 'popularity') {
      sortOption = { 'analytics.purchases': -1 };
    } else {
      sortOption = { createdAt: -1 };
    }
    
    const products = await Product.find(query)
      .sort(sortOption)
      .limit(50);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Add product to store
 */
exports.addProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    
    // Generate SKU if not provided
    if (!productData.sku) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substr(2, 5);
      productData.sku = `PROD-${timestamp}-${random}`.toUpperCase();
    }
    
    const product = await Product.create({
      ...productData,
      storeId: req.user.id
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update product
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete product
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;