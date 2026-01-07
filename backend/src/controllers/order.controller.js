const Order = require('../models/order.model');
const Product = require('../models/product.model');
const Store = require('../models/Store.model');
const Delivery = require('../models/delivery.model');
const Wallet = require('../models/Wallet.model');

/**
 * Create a new order
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { storeId, items, shipping, payment } = req.body;
    
    // Validate store exists and is active
    const store = await Store.findById(storeId);
    if (!store || store.status !== 'active' || !store.verified) {
      return res.status(400).json({
        success: false,
        message: 'Store not found or not active'
      });
    }

    // Validate products and calculate total
    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.storeId.toString() !== storeId) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found in this store`
        });
      }

      if (product.inventory.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient quantity for ${product.name}`
        });
      }

      const itemTotal = product.price.selling * item.quantity;
      totalAmount += itemTotal;

      processedItems.push({
        productId: product._id,
        name: product.name,
        price: {
          original: product.price.original,
          selling: product.price.selling
        },
        quantity: item.quantity,
        total: itemTotal
      });
    }

    // Calculate shipping charges
    let shippingCharges = 0;
    if (shipping.method === 'express') {
      shippingCharges = 100; // Example charge
    } else if (shipping.method === 'standard') {
      shippingCharges = 50;
    }

    totalAmount += shippingCharges;

    // Generate order ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const orderId = `ORD-${timestamp}-${random}`.toUpperCase();

    // Create order
    const order = await Order.create({
      orderId,
      userId: req.user.id,
      storeId,
      items: processedItems,
      totalAmount,
      shipping,
      payment,
      status: 'pending'
    });

    // Update product inventory
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { 
          $inc: { 
            'inventory.quantity': -item.quantity,
            'inventory.totalSold': item.quantity
          }
        }
      );
    }

    res.status(201).json({
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
 * Get user orders
 */
exports.getUserOrders = async (req, res, next) => {
  try {
    const { status, dateFrom, dateTo } = req.query;
    
    let query = { userId: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    if (dateFrom || dateTo) {
      query['createdAt'] = {};
      if (dateFrom) query['createdAt'].$gte = new Date(dateFrom);
      if (dateTo) query['createdAt'].$lte = new Date(dateTo);
    }
    
    const orders = await Order.find(query)
      .populate('storeId', 'storeName ownerName')
      .sort({ createdAt: -1 });

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
 * Get store orders
 */
exports.getStoreOrders = async (req, res, next) => {
  try {
    const { status, dateFrom, dateTo } = req.query;
    
    // Get store profile
    const store = await Store.findOne({ userId: req.user.id });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store profile not found'
      });
    }
    
    let query = { storeId: store._id };
    
    if (status) {
      query.status = status;
    }
    
    if (dateFrom || dateTo) {
      query['createdAt'] = {};
      if (dateFrom) query['createdAt'].$gte = new Date(dateFrom);
      if (dateTo) query['createdAt'].$lte = new Date(dateTo);
    }
    
    const orders = await Order.find(query)
      .populate('userId', 'name mobile')
      .sort({ createdAt: -1 });

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
 * Get order details
 */
exports.getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id)
      .populate('userId', 'name mobile')
      .populate('storeId', 'storeName ownerName')
      .populate('delivery.deliveryBoyId', 'name mobile');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (req.user.id !== order.userId.toString()) {
      const store = await Store.findOne({ userId: req.user.id });
      if (!store || order.storeId.toString() !== store._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to view this order'
        });
      }
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = [
      'pending', 'confirmed', 'processing', 'ready_for_pickup', 
      'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 
      'cancelled', 'returned', 'refunded'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify authorization
    const store = await Store.findOne({ userId: req.user.id });
    if (!store || order.storeId.toString() !== store._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this order'
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        status,
        'timeline': {
          status,
          timestamp: new Date(),
          notes: `Status updated by store`
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Assign delivery boy to order
 */
exports.assignDelivery = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { deliveryBoyId } = req.body;
    
    // Verify this store owns this order
    const store = await Store.findOne({ userId: req.user.id });
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store profile not found'
      });
    }

    const order = await Order.findById(orderId);
    if (!order || order.storeId.toString() !== store._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this order'
      });
    }

    // Verify delivery boy exists and is active
    const deliveryBoy = await Delivery.findById(deliveryBoyId);
    if (!deliveryBoy || deliveryBoy.status !== 'active' || !deliveryBoy.verified) {
      return res.status(400).json({
        success: false,
        message: 'Delivery boy not found or not active'
      });
    }

    // Update order with delivery assignment
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { 
        'delivery.deliveryBoyId': deliveryBoyId,
        'delivery.assignedAt': new Date(),
        'delivery.deliveryStatus': 'assigned',
        'status': 'out_for_delivery',
        'timeline': {
          status: 'out_for_delivery',
          timestamp: new Date(),
          notes: `Assigned to delivery boy ${deliveryBoyId}`
        }
      },
      { new: true }
    ).populate('delivery.deliveryBoyId', 'name mobile');

    // Update delivery boy's current order
    await Delivery.findByIdAndUpdate(
      deliveryBoyId,
      { 
        'currentOrder.orderId': orderId,
        'currentOrder.status': 'assigned'
      }
    );

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get available delivery boys for order
 */
exports.getAvailableDeliveryBoysForOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Verify authorization
    const store = await Store.findOne({ userId: req.user.id });
    if (!store || order.storeId.toString() !== store._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this order'
      });
    }

    // Get store location for distance calculation
    const storeProfile = await Store.findById(order.storeId);
    
    // Find available delivery boys near the shipping address
    const shippingLat = order.shipping.address.coordinates[1];
    const shippingLng = order.shipping.address.coordinates[0];
    
    const radiusInRadians = 20 / 6378.1; // 20km radius

    const query = {
      'availability.isAvailable': true,
      'currentOrder.status': { $in: [null, 'idle'] },
      status: 'active',
      'currentLocation.coordinates': {
        $geoWithin: {
          $centerSphere: [
            [shippingLng, shippingLat],
            radiusInRadians
          ]
        }
      }
    };

    const deliveryBoys = await Delivery.find(query)
      .populate('userId', 'name mobile email')
      .sort({ 'ratings.average': -1, 'performance.onTimeRate': -1 });

    // Calculate distance for each delivery boy
    const deliveryBoysWithDistance = deliveryBoys.map(db => {
      const distance = calculateDistance(
        shippingLat, 
        shippingLng, 
        db.currentLocation.coordinates[1], 
        db.currentLocation.coordinates[0]
      );
      
      return {
        ...db.toObject(),
        distance: Math.round(distance * 100) / 100
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