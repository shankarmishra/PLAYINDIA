const Store = require('../models/Store.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Wallet = require('../models/Wallet.model');
const Review = require('../models/Review.model');
const multer = require('multer');
const { uploadToCloudinary } = require('../utils/cloudinary');

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
      const store = await Store.findOne({ userId: req.user.id });
      
      if (!store) {
        return res.status(404).json({
          success: false,
          message: 'Store profile not found'
        });
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