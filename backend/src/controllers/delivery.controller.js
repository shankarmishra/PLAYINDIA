const Delivery = require('../models/delivery.model');
const User = require('../models/user.model');
const Order = require('../models/order.model');
const Wallet = require('../models/Wallet.model');
const Review = require('../models/Review.model');

/**
 * Get available delivery boys in area
 */
exports.getAvailableDeliveryBoys = async (req, res, next) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    
    // Convert distance to radians for MongoDB geospatial queries
    const radiusInRadians = parseFloat(radius) / 6378.1; // Earth's radius in km

    // Build query for available delivery boys within radius
    const query = {
      'availability.isAvailable': true,
      'currentOrder.status': { $in: [null, 'idle'] }, // Not currently assigned
      status: 'active',
      'currentLocation.coordinates': {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(lng), parseFloat(lat)],
            radiusInRadians
          ]
        }
      }
    };

    const deliveryBoys = await Delivery.find(query)
      .populate('userId', 'name mobile email')
      .sort({ 'ratings.average': -1, 'performance.onTimeRate': -1 })
      .limit(20);

    // Calculate distance for each delivery boy
    const deliveryBoysWithDistance = deliveryBoys.map(db => {
      const distance = calculateDistance(
        parseFloat(lat), 
        parseFloat(lng), 
        db.currentLocation.coordinates[1], 
        db.currentLocation.coordinates[0]
      );
      
      return {
        ...db.toObject(),
        distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
      };
    });

    res.status(200).json({
      success: true,
      count: deliveryBoysWithDistance.length,
      data: deliveryBoysWithDistance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get delivery dashboard for delivery boy
 */
exports.getDeliveryDashboard = async (req, res, next) => {
  try {
    const deliveryProfile = await Delivery.findOne({ userId: req.user.id })
      .populate('userId', 'name mobile email');

    if (!deliveryProfile) {
      return res.status(404).json({
        success: false,
        message: 'Delivery profile not found'
      });
    }

    // Get delivery wallet
    const wallet = await Wallet.findOne({ userId: req.user.id });

    // Get current order if any
    let currentOrder = null;
    if (deliveryProfile.currentOrder && deliveryProfile.currentOrder.orderId) {
      currentOrder = await Order.findById(deliveryProfile.currentOrder.orderId)
        .populate('userId', 'name mobile')
        .populate('storeId', 'storeName');
    }

    // Get today's deliveries
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayDeliveries = await Order.countDocuments({
      'delivery.deliveryBoyId': deliveryProfile._id,
      'delivery.assignedAt': { $gte: startOfDay, $lte: endOfDay }
    });

    // Get recent orders assigned
    const recentOrders = await Order.find({
      'delivery.deliveryBoyId': deliveryProfile._id
    })
    .sort({ 'delivery.assignedAt': -1 })
    .limit(10);

    // Get earnings analytics
    const monthlyEarnings = await Order.aggregate([
      { $match: { 
          'delivery.deliveryBoyId': deliveryProfile._id,
          'delivery.assignedAt': { $gte: new Date(new Date().setMonth(new Date().getMonth() - 3)) },
          'payment.status': 'completed'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$delivery.assignedAt" } },
          total: { $sum: "$analytics.platformEarnings" }, // Assuming platform earnings are shared
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const dashboardData = {
      deliveryProfile: {
        ...deliveryProfile.toObject(),
        walletBalance: wallet ? wallet.balance : 0
      },
      stats: {
        todayDeliveries,
        totalDeliveries: deliveryProfile.deliveries.total,
        completedDeliveries: deliveryProfile.deliveries.completed,
        totalEarnings: deliveryProfile.earnings.total,
        availableEarnings: deliveryProfile.earnings.available,
        pendingEarnings: deliveryProfile.earnings.pending,
        rating: deliveryProfile.ratings.average,
        totalRatings: deliveryProfile.ratings.count,
        onTimeRate: deliveryProfile.performance.onTimeRate,
        avgDeliveryTime: deliveryProfile.performance.avgDeliveryTime
      },
      sections: {
        currentOrder,
        recentOrders,
        todayDeliveries,
        monthlyEarnings
      },
      analytics: {
        monthlyEarnings,
        deliveryTrend: [], // Implement based on delivery data
        performanceMetrics: deliveryProfile.performance
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
 * Update delivery availability
 */
exports.updateDeliveryAvailability = async (req, res, next) => {
  try {
    const { isAvailable } = req.body;
    
    const deliveryProfile = await Delivery.findOneAndUpdate(
      { userId: req.user.id },
      { 'availability.isAvailable': isAvailable, 'availability.lastActive': new Date() },
      { new: true, runValidators: true }
    );

    if (!deliveryProfile) {
      return res.status(404).json({
        success: false,
        message: 'Delivery profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deliveryProfile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update delivery location
 */
exports.updateDeliveryLocation = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    
    const deliveryProfile = await Delivery.findOneAndUpdate(
      { userId: req.user.id },
      { 
        'currentLocation.coordinates': [parseFloat(lng), parseFloat(lat)],
        'lastUpdate': new Date()
      },
      { new: true, runValidators: true }
    );

    if (!deliveryProfile) {
      return res.status(404).json({
        success: false,
        message: 'Delivery profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: deliveryProfile
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get delivery orders
 */
exports.getDeliveryOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = { 'delivery.deliveryBoyId': req.user.id };
    
    if (status) {
      query['delivery.status'] = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name mobile')
      .populate('storeId', 'storeName')
      .sort({ 'delivery.assignedAt': -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update order delivery status
 */
exports.updateOrderDeliveryStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, location } = req.body;
    
    // Update the order delivery status
    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        'delivery.deliveryStatus': status,
        'delivery.lastUpdate': new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update delivery profile current order status
    await Delivery.findOneAndUpdate(
      { userId: req.user.id },
      { 
        'currentOrder.status': status,
        'currentOrder.orderId': order._id
      }
    );

    // Update delivery statistics
    const deliveryProfile = await Delivery.findOne({ userId: req.user.id });
    if (deliveryProfile) {
      const updates = {};
      
      if (status === 'delivered') {
        updates['deliveries.completed'] = deliveryProfile.deliveries.completed + 1;
        updates['deliveries.total'] = deliveryProfile.deliveries.total + 1;
      } else if (status === 'in_transit') {
        updates['currentOrder.estimatedDelivery'] = new Date(Date.now() + 30 * 60000); // 30 min from now
      }
      
      await Delivery.findOneAndUpdate(
        { userId: req.user.id },
        updates
      );
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get delivery profile
 */
exports.getDeliveryProfile = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const deliveryProfile = await Delivery.findById(id)
      .populate('userId', 'name mobile email');

    if (!deliveryProfile) {
      return res.status(404).json({
        success: false,
        message: 'Delivery profile not found'
      });
    }

    // Get additional stats
    const completedDeliveries = await Order.countDocuments({
      'delivery.deliveryBoyId': id,
      'delivery.deliveryStatus': 'delivered'
    });

    const avgRating = await Review.aggregate([
      { $match: { 'reviewee.userId': deliveryProfile.userId } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    const profileData = {
      ...deliveryProfile.toObject(),
      stats: {
        completedDeliveries,
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
 * Calculate distance between two points (in km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
}

module.exports = exports;