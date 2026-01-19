const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Store = require('../models/Store.model');
const Banner = require('../models/banner.model');
const logger = require('../utils/logger');

/**
 * Get shop analytics for admin
 * Shows all stores, products, orders, revenue
 */
exports.getShopAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, storeId } = req.query;
    
    // Date range filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Store filter
    if (storeId) {
      dateFilter.storeId = storeId;
    }

    // Overall stats
    const totalStores = await Store.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments(dateFilter);
    
    // Revenue calculations
    const revenueData = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    const revenue = revenueData[0] || {
      totalRevenue: 0,
      totalOrders: 0,
      averageOrderValue: 0
    };

    // Store-wise analytics
    const storeAnalytics = await Store.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'storeId',
          as: 'products'
        }
      },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'storeId',
          as: 'orders'
        }
      },
      {
        $project: {
          storeName: 1,
          storeEmail: 1,
          createdAt: 1,
          'userId': 1,
          totalProducts: { $size: '$products' },
          totalOrders: { $size: '$orders' },
          totalRevenue: {
            $sum: '$orders.totalAmount'
          },
          lastProductAdded: {
            $max: '$products.createdAt'
          },
          recentOrders: {
            $slice: [
              {
                $map: {
                  input: '$orders',
                  as: 'order',
                  in: {
                    orderId: '$$order.orderId',
                    totalAmount: '$$order.totalAmount',
                    createdAt: '$$order.createdAt',
                    status: '$$order.status'
                  }
                }
              },
              5
            ]
          }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);

    // Product analytics
    const productAnalytics = await Product.aggregate([
      {
        $lookup: {
          from: 'stores',
          localField: 'storeId',
          foreignField: '_id',
          as: 'store'
        }
      },
      {
        $unwind: '$store'
      },
      {
        $project: {
          name: 1,
          category: 1,
          'price.selling': 1,
          'inventory.quantity': 1,
          'inventory.totalSold': 1,
          'ratings.average': 1,
          createdAt: 1,
          storeName: '$store.storeName',
          storeId: '$store._id',
          revenue: {
            $multiply: ['$inventory.totalSold', '$price.selling']
          }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 100 }
    ]);

    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Revenue by date (last 30 days)
    const revenueByDate = await Order.aggregate([
      {
        $match: {
          ...dateFilter,
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top selling products
    const topSellingProducts = await Product.aggregate([
      {
        $project: {
          name: 1,
          category: 1,
          'price.selling': 1,
          'inventory.totalSold': 1,
          'ratings.average': 1,
          storeId: 1,
          revenue: {
            $multiply: ['$inventory.totalSold', '$price.selling']
          }
        }
      },
      { $sort: { 'inventory.totalSold': -1 } },
      { $limit: 10 }
    ]);

    // Populate store names for top products
    const topProductsWithStore = await Product.populate(topSellingProducts, {
      path: 'storeId',
      select: 'storeName'
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalStores,
          totalProducts,
          totalOrders: revenue.totalOrders,
          totalRevenue: revenue.totalRevenue,
          averageOrderValue: revenue.averageOrderValue
        },
        storeAnalytics,
        productAnalytics,
        orderStatusBreakdown,
        revenueByDate,
        topSellingProducts: topProductsWithStore
      }
    });
  } catch (error) {
    logger.error('Get shop analytics error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch shop analytics'
    });
  }
};

/**
 * Get store details with all products and orders
 */
exports.getStoreDetails = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId)
      .populate('userId', 'name email mobile')
      .lean();

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found'
      });
    }

    // Get all products
    const products = await Product.find({ storeId })
      .sort({ createdAt: -1 })
      .lean();

    // Get all orders
    const orders = await Order.find({ storeId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate store stats
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.status === 'delivered' ? order.totalAmount : 0);
    }, 0);

    const totalProducts = products.length;
    const totalOrders = orders.length;
    const activeProducts = products.filter(p => p.availability.isActive).length;

    res.status(200).json({
      success: true,
      data: {
        store,
        stats: {
          totalProducts,
          activeProducts,
          totalOrders,
          totalRevenue,
          averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
        },
        products,
        orders
      }
    });
  } catch (error) {
    logger.error('Get store details error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch store details'
    });
  }
};

/**
 * Get product details with analytics
 */
exports.getProductDetails = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
      .populate('storeId', 'storeName storeEmail')
      .lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Get orders containing this product
    const orders = await Order.find({
      'items.productId': productId
    })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean();

    const totalSold = orders.reduce((sum, order) => {
      const item = order.items.find(i => i.productId.toString() === productId);
      return sum + (item ? item.quantity : 0);
    }, 0);

    const revenue = totalSold * product.price.selling;

    res.status(200).json({
      success: true,
      data: {
        product,
        analytics: {
          totalSold,
          revenue,
          totalOrders: orders.length,
          ...product.analytics
        },
        orders
      }
    });
  } catch (error) {
    logger.error('Get product details error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch product details'
    });
  }
};

module.exports = exports;
