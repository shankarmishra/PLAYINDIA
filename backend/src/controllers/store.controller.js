const Store = require('../models/Store.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Wallet = require('../models/Wallet.model');
const Review = require('../models/Review.model');
const multer = require('multer');
const { uploadToCloudinary } = require('../utils/cloudinary');
const mongoose = require('mongoose');

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
 * Get current user's store profile
 */
exports.getMyStoreProfile = async (req, res, next) => {
  try {
    const store = await Store.findOne({ userId: req.user.id })
      .populate('userId', 'name mobile email');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store profile not found for current user'
      });
    }

    // Get additional stats
    const totalOrders = await Order.countDocuments({ storeId: store._id });
    const totalRevenue = await Order.aggregate([
      { $match: { storeId: store._id, 'payment.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const avgRating = await Review.aggregate([
      { $match: { 'reviewee.userId': store.userId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const products = await Product.find({ storeId: store._id })
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
 * Route: GET /api/stores/dashboard
 */
exports.getStoreDashboard = async (req, res, next) => {
  try {
    // Get user ID - handle both _id and id
    const userId = req.user._id || req.user.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in request'
      });
    }

    console.log('Store dashboard endpoint called for user:', userId);
    const store = await Store.findOne({ userId: userId })
      .populate('userId', 'name mobile email');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store profile not found'
      });
    }

    // Use store._id directly (MongoDB ObjectId)
    const storeId = store._id;
    
    // Ensure storeId is valid
    if (!storeId) {
      return res.status(404).json({
        success: false,
        message: 'Store ID not found'
      });
    }

    // Ensure storeId is properly formatted for queries
    // store._id is already a MongoDB ObjectId, but ensure it's used correctly
    let storeObjectId = storeId;
    
    // Convert to ObjectId if it's a string (shouldn't happen, but safety check)
    if (typeof storeId === 'string' && mongoose.Types.ObjectId.isValid(storeId)) {
      try {
        storeObjectId = new mongoose.Types.ObjectId(storeId);
      } catch (err) {
        console.error('Error converting storeId to ObjectId:', err);
        // Keep original value
      }
    }

    // Get store wallet
    let wallet = null;
    try {
      wallet = await Wallet.findOne({ userId: userId });
    } catch (err) {
      console.error('Error fetching wallet:', err);
    }

    // Get recent orders with error handling
    let recentOrders = [];
    try {
      const ordersResult = await Order.find({ storeId: storeObjectId })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();
      recentOrders = Array.isArray(ordersResult) ? ordersResult : [];
    } catch (err) {
      console.error('Error fetching recent orders:', err);
      recentOrders = [];
    }

    // Get order analytics with error handling
    let orderAnalytics = [];
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      
      const analyticsResult = await Order.aggregate([
        { $match: { 
            storeId: storeObjectId,
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: { 
              $dateToString: { 
                format: "%Y-%m-%d", 
                date: "$createdAt"
              } 
            },
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: { $ifNull: ["$totalAmount", 0] } }
          }
        },
        { $sort: { _id: 1 } }
      ]);
      orderAnalytics = Array.isArray(analyticsResult) ? analyticsResult : [];
    } catch (err) {
      console.error('Error fetching order analytics:', err);
      console.error('Error details:', err.message, err.stack);
      orderAnalytics = [];
    }

    // Get top selling products with error handling
    let topSellingProducts = [];
    try {
      const productsResult = await Product.find({ storeId: storeObjectId })
        .sort({ 'analytics.purchases': -1 })
        .limit(5)
        .lean();
      topSellingProducts = Array.isArray(productsResult) ? productsResult : [];
    } catch (err) {
      console.error('Error fetching top selling products:', err);
      // Try without analytics field
      try {
        const productsResult2 = await Product.find({ storeId: storeObjectId })
          .sort({ createdAt: -1 })
          .limit(5)
          .lean();
        topSellingProducts = Array.isArray(productsResult2) ? productsResult2 : [];
      } catch (err2) {
        console.error('Error fetching products:', err2);
        topSellingProducts = [];
      }
    }

    // Calculate stats from actual data with error handling
    let totalOrdersCount = 0;
    let completedOrdersCount = 0;
    let totalRevenue = 0;
    let todayOrders = 0;
    let pendingOrders = 0;
    let totalProducts = 0;

    try {
      totalOrdersCount = await Order.countDocuments({ storeId: storeObjectId }).catch(() => 0) || 0;
      completedOrdersCount = await Order.countDocuments({ storeId: storeObjectId, status: 'delivered' }).catch(() => 0) || 0;
      
      // Calculate revenue from completed orders (orders with completed payment)
      try {
        const revenueData = await Order.aggregate([
          { $match: { 
              storeId: storeObjectId, 
              'payment.status': 'completed' 
            } 
          },
          { $group: { _id: null, total: { $sum: { $ifNull: ["$totalAmount", 0] } } } }
        ]).catch(() => []);
        totalRevenue = Array.isArray(revenueData) && revenueData.length > 0 && revenueData[0].total 
          ? Number(revenueData[0].total) 
          : 0;
      } catch (revenueErr) {
        console.error('Error calculating revenue:', revenueErr);
        totalRevenue = 0;
      }

      // Get today's orders count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      todayOrders = await Order.countDocuments({ 
        storeId: storeObjectId, 
        createdAt: { $gte: today } 
      }).catch(() => 0) || 0;

      // Get pending orders count
      pendingOrders = await Order.countDocuments({ 
        storeId: storeObjectId, 
        status: { $in: ['pending', 'confirmed', 'processing'] } 
      }).catch(() => 0) || 0;

      // Get total products count
      totalProducts = await Product.countDocuments({ storeId: storeObjectId }).catch(() => 0) || 0;
    } catch (statsError) {
      console.error('Error calculating dashboard stats:', statsError);
      console.error('Stats error details:', statsError.message, statsError.stack);
      // Use defaults if calculation fails
    }

    // Safely convert store to object
    let storeObject = {};
    try {
      if (store && typeof store.toObject === 'function') {
        storeObject = store.toObject();
      } else if (store) {
        storeObject = JSON.parse(JSON.stringify(store));
      } else {
        storeObject = { _id: storeId, storeName: 'Store' };
      }
    } catch (err) {
      console.error('Error converting store to object:', err.message);
      storeObject = { 
        _id: storeId, 
        storeName: (store && store.storeName) ? store.storeName : 'Store',
        ownerName: (store && store.ownerName) ? store.ownerName : ''
      };
    }

    // Ensure all arrays are valid
    const safeRecentOrders = Array.isArray(recentOrders) ? recentOrders : [];
    const safeTopProducts = Array.isArray(topSellingProducts) ? topSellingProducts : [];
    const safeAnalytics = Array.isArray(orderAnalytics) ? orderAnalytics : [];

    const dashboardData = {
      store: {
        ...storeObject,
        walletBalance: wallet && typeof wallet.balance === 'number' ? wallet.balance : 0
      },
      stats: {
        totalProducts: Number(totalProducts) || 0,
        todayOrders: Number(todayOrders) || 0,
        monthlyRevenue: Number(totalRevenue) || 0,
        pendingOrders: Number(pendingOrders) || 0,
        totalOrders: Number(totalOrdersCount) || 0,
        completedOrders: Number(completedOrdersCount) || 0
      },
      sections: {
        recentOrders: safeRecentOrders,
        topSellingProducts: safeTopProducts,
        orderAnalytics: safeAnalytics
      },
      analytics: {
        orderAnalytics: safeAnalytics,
        revenueTrend: safeAnalytics,
        topSellingProducts: safeTopProducts
      }
    };

    // Validate dashboardData before sending
    if (!dashboardData || !dashboardData.store || !dashboardData.stats) {
      console.error('Invalid dashboard data structure');
      return res.status(500).json({
        success: false,
        message: 'Failed to generate dashboard data'
      });
    }

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Store dashboard error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

/**
 * Update store profile with file uploads
 */
// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed!'), false);
    }
  }
});

exports.updateStoreProfile = [
  upload.fields([
    { name: 'gstCertificate', maxCount: 1 },
    { name: 'shopAct', maxCount: 1 },
    { name: 'bankPassbook', maxCount: 1 },
    { name: 'ownerPhoto', maxCount: 1 },
    { name: 'storePhoto', maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      let store = await Store.findOne({ userId: req.user.id });
      
      // If store doesn't exist, create it
      if (!store) {
        // Create new store profile
        const storeData = {
          userId: req.user.id,
          storeName: req.body.storeName || req.user.name + "'s Store",
          ownerName: req.body.ownerName || req.user.name,
          category: req.body.category || 'multi-sports',
          status: 'pending', // New stores start as pending
          verified: false
        };
        
        // Add address if provided
        if (req.body.address || req.body.city || req.body.state || req.body.pincode) {
          storeData.address = {
            street: req.body.address || '',
            city: req.body.city || '',
            state: req.body.state || '',
            pincode: req.body.pincode || '',
            coordinates: req.user.location?.coordinates || [0, 0]
          };
        }
        
        // Add business info if provided
        if (req.body.gstNumber) {
          storeData.gstNumber = req.body.gstNumber;
        }
        if (req.body.businessType) {
          storeData.businessType = req.body.businessType;
        }
        
        store = await Store.create(storeData);
      }

      const updateData = { ...req.body };
      
      // Handle file uploads
      if (req.files) {
        // Upload GST Certificate
        if (req.files.gstCertificate && req.files.gstCertificate[0]) {
          try {
            const file = req.files.gstCertificate[0];
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const uploadResult = await uploadToCloudinary(base64, {
              folder: 'stores/documents',
              resource_type: 'auto'
            });
            updateData['documents.gstCertificate.file'] = uploadResult.url;
            updateData['documents.gstCertificate.verified'] = false;
          } catch (error) {
            console.error('Error uploading GST certificate:', error);
          }
        }

        // Upload Shop Act License
        if (req.files.shopAct && req.files.shopAct[0]) {
          try {
            const file = req.files.shopAct[0];
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const uploadResult = await uploadToCloudinary(base64, {
              folder: 'stores/documents',
              resource_type: 'auto'
            });
            updateData['documents.shopLicense.file'] = uploadResult.url;
            updateData['documents.shopLicense.verified'] = false;
          } catch (error) {
            console.error('Error uploading Shop Act:', error);
          }
        }

        // Upload Bank Passbook
        if (req.files.bankPassbook && req.files.bankPassbook[0]) {
          try {
            const file = req.files.bankPassbook[0];
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const uploadResult = await uploadToCloudinary(base64, {
              folder: 'stores/documents',
              resource_type: 'auto'
            });
            if (!updateData['documents.additionalDocs']) {
              updateData['documents.additionalDocs'] = [];
            }
            if (!Array.isArray(updateData['documents.additionalDocs'])) {
              updateData['documents.additionalDocs'] = [updateData['documents.additionalDocs']];
            }
            updateData['documents.additionalDocs'].push(uploadResult.url);
          } catch (error) {
            console.error('Error uploading bank passbook:', error);
          }
        }

        // Upload Owner Photo
        if (req.files.ownerPhoto && req.files.ownerPhoto[0]) {
          try {
            const file = req.files.ownerPhoto[0];
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const uploadResult = await uploadToCloudinary(base64, {
              folder: 'stores/photos',
              resource_type: 'image'
            });
            updateData['documents.ownerID.front'] = uploadResult.url;
            updateData['documents.ownerID.verified'] = false;
          } catch (error) {
            console.error('Error uploading owner photo:', error);
          }
        }

        // Upload Store Photo
        if (req.files.storePhoto && req.files.storePhoto[0]) {
          try {
            const file = req.files.storePhoto[0];
            const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const uploadResult = await uploadToCloudinary(base64, {
              folder: 'stores/photos',
              resource_type: 'image'
            });
            // Store photo can be saved in additionalDocs or as a separate field
            if (!updateData['documents.additionalDocs']) {
              updateData['documents.additionalDocs'] = [];
            }
            if (!Array.isArray(updateData['documents.additionalDocs'])) {
              updateData['documents.additionalDocs'] = [updateData['documents.additionalDocs']];
            }
            updateData['documents.additionalDocs'].push(uploadResult.url);
          } catch (error) {
            console.error('Error uploading store photo:', error);
          }
        }
      }

      // Update store fields
      if (updateData.storeName) {
        store.storeName = updateData.storeName;
      }
      if (updateData.ownerName) {
        store.ownerName = updateData.ownerName;
      }
      if (updateData.address) {
        if (typeof updateData.address === 'string') {
          store.address.street = updateData.address;
        } else {
          Object.assign(store.address, updateData.address);
        }
      }
      if (updateData.city) {
        store.address.city = updateData.city;
      }
      if (updateData.state) {
        store.address.state = updateData.state;
      }
      if (updateData.pincode) {
        store.address.pincode = updateData.pincode;
      }
      if (updateData.gstNumber) {
        store.gst.number = updateData.gstNumber;
      }
      if (updateData.category) {
        try {
          const category = typeof updateData.category === 'string' ? JSON.parse(updateData.category) : updateData.category;
          store.category = Array.isArray(category) ? category[0] : category;
        } catch {
          store.category = updateData.category;
        }
      }

      // Update documents
      if (updateData['documents.gstCertificate.file']) {
        store.documents.gstCertificate.file = updateData['documents.gstCertificate.file'];
        store.documents.gstCertificate.verified = updateData['documents.gstCertificate.verified'] || false;
      }
      if (updateData['documents.shopLicense.file']) {
        store.documents.shopLicense.file = updateData['documents.shopLicense.file'];
        store.documents.shopLicense.verified = updateData['documents.shopLicense.verified'] || false;
      }
      if (updateData['documents.ownerID.front']) {
        store.documents.ownerID.front = updateData['documents.ownerID.front'];
        store.documents.ownerID.verified = updateData['documents.ownerID.verified'] || false;
      }
      if (updateData['documents.additionalDocs']) {
        const additionalDocs = Array.isArray(updateData['documents.additionalDocs']) 
          ? updateData['documents.additionalDocs'] 
          : [updateData['documents.additionalDocs']];
        store.documents.additionalDocs = [
          ...(store.documents.additionalDocs || []),
          ...additionalDocs
        ];
      }

      await store.save();

      res.status(200).json({
        success: true,
        data: store
      });
    } catch (error) {
      console.error('Update store profile error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
];

/**
 * Get store products
 */
exports.getStoreProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, search, minPrice, maxPrice, sort, includeInactive } = req.query;
    
    // Build query - for store owners, show all products; for customers, only active
    let query = { storeId: id };
    if (includeInactive !== 'true' && (!req.user || (req.user.role !== 'seller' && req.user.role !== 'store'))) {
      query['availability.isActive'] = true;
    }
    
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
    const { id } = req.params; // Store ID from route
    const productData = req.body;
    
    // Verify the store belongs to the current user
    const store = await Store.findOne({ _id: id, userId: req.user.id });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found or you do not have permission to add products to this store'
      });
    }
    
    // Generate SKU if not provided
    if (!productData.sku) {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substr(2, 5);
      productData.sku = `PROD-${timestamp}-${random}`.toUpperCase();
    }
    
    const product = await Product.create({
      ...productData,
      storeId: id // Use store document ID, not user ID
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
    
    // Get existing product first
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // If price is being updated partially, merge with existing price
    if (updateData.price && typeof updateData.price === 'object') {
      updateData.price = {
        original: updateData.price.original !== undefined ? updateData.price.original : existingProduct.price.original,
        selling: updateData.price.selling !== undefined ? updateData.price.selling : existingProduct.price.selling,
        discount: updateData.price.discount !== undefined ? updateData.price.discount : existingProduct.price.discount
      };
    }
    
    // If inventory is being updated partially, merge with existing inventory
    if (updateData.inventory && typeof updateData.inventory === 'object') {
      updateData.inventory = {
        quantity: updateData.inventory.quantity !== undefined ? updateData.inventory.quantity : existingProduct.inventory.quantity,
        reserved: updateData.inventory.reserved !== undefined ? updateData.inventory.reserved : existingProduct.inventory.reserved,
        lowStockThreshold: updateData.inventory.lowStockThreshold !== undefined ? updateData.inventory.lowStockThreshold : existingProduct.inventory.lowStockThreshold,
        totalSold: updateData.inventory.totalSold !== undefined ? updateData.inventory.totalSold : existingProduct.inventory.totalSold
      };
    }
    
    // If availability is being updated partially, merge with existing availability
    if (updateData.availability && typeof updateData.availability === 'object') {
      updateData.availability = {
        isActive: updateData.availability.isActive !== undefined ? updateData.availability.isActive : existingProduct.availability?.isActive,
        inStock: updateData.availability.inStock !== undefined ? updateData.availability.inStock : existingProduct.availability?.inStock,
        isAvailable: updateData.availability.isAvailable !== undefined ? updateData.availability.isAvailable : existingProduct.availability?.isAvailable
      };
    }
    
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

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

/**
 * Admin: Approve store
 */
exports.approveStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const store = await Store.findById(id).populate('userId', 'name email mobile');
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Update store status
    store.status = 'active';
    store.verified = true;
    if (notes) {
      store.adminNotes = notes;
    }

    // Update user status
    const user = await User.findById(store.userId);
    if (user) {
      user.status = 'active';
      await user.save({ validateBeforeSave: false });
    }

    await store.save();

    res.status(200).json({
      success: true,
      message: 'Store approved successfully',
      data: store
    });
  } catch (error) {
    console.error('Approve store error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin: Reject store
 */
exports.rejectStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason, notes } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const store = await Store.findById(id).populate('userId', 'name email mobile');
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Update store status
    store.status = 'rejected';
    store.rejectionReason = reason;
    if (notes) {
      store.adminNotes = notes;
    }

    // Update user status
    const user = await User.findById(store.userId);
    if (user) {
      user.status = 'rejected';
      await user.save({ validateBeforeSave: false });
    }

    await store.save();

    res.status(200).json({
      success: true,
      message: 'Store rejected successfully',
      data: store
    });
  } catch (error) {
    console.error('Reject store error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin: Get pending stores
 */
exports.getPendingStores = async (req, res, next) => {
  try {
    const stores = await Store.find({ status: 'pending' })
      .populate('userId', 'name email mobile createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: stores.length,
      data: stores
    });
  } catch (error) {
    console.error('Get pending stores error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin: Get store details with documents
 */
exports.getStoreDetailsForAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const store = await Store.findById(id)
      .populate('userId', 'name email mobile createdAt')
      .lean();

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Get user verification data
    const user = await User.findById(store.userId)
      .select('verification roleData')
      .lean();

    res.status(200).json({
      success: true,
      data: {
        store,
        user: user || null,
        documents: {
          gstCertificate: store.documents?.gstCertificate,
          shopLicense: store.documents?.shopLicense,
          ownerID: store.documents?.ownerID,
          additionalDocs: store.documents?.additionalDocs || []
        }
      }
    });
  } catch (error) {
    console.error('Get store details error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;