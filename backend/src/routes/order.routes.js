const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate: protect, authorize } = require('../middleware/auth.middleware');
const {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  cancelOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
  assignDelivery,
  updateDeliveryStatus
} = require('../controllers/order.controller');

// Validation middleware
const validateOrder = [
  body('items').isArray().notEmpty().withMessage('Items are required'),
  body('items.*.product').isMongoId().withMessage('Valid product ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress').isObject().withMessage('Shipping address is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.postalCode').trim().notEmpty().withMessage('Postal code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  body('paymentMethod').isIn(['Credit Card', 'Debit Card', 'UPI', 'Net Banking']).withMessage('Invalid payment method')
];

// Protected routes
router.use(protect);

// Customer routes
router.post('/', validateOrder, createOrder);
router.get('/my-orders', getMyOrders);

// Seller/Store routes - MUST be before /:id to prevent route conflict
router.get('/store', authorize('seller', 'store'), getSellerOrders);

// Seller routes
router.get('/seller/orders', authorize('seller'), getSellerOrders);

// Parameterized routes - MUST come after specific routes
router.get('/:id', getOrder);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', authorize('seller'), updateOrderStatus);

// Admin routes
router.get('/', authorize('admin'), getOrders);
router.put('/:id', authorize('admin'), updateOrder);

// Delivery routes
router.put('/:id/assign-delivery', authorize(['admin', 'delivery']), assignDelivery);
router.put('/:id/delivery-status', authorize('delivery'), updateDeliveryStatus);

module.exports = router; 