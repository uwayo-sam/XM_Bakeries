// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { protect, customerOnly } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const orderController = require('../controllers/orderController');
const { check } = require('express-validator');

// @desc    Get all orders for current customer
// @route   GET /api/v1/orders
// @access  Private/Customer
router.get('/', protect, customerOnly, orderController.getCustomerOrders);

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private/Customer
router.post(
  '/',
  protect,
  customerOnly,
  [
    check('items', 'Items are required').isArray({ min: 1 }),
    check('items.*.productId', 'Product ID is required').isInt({ min: 1 }),
    check('items.*.quantity', 'Quantity must be at least 1').isInt({ min: 1 }),
    check('deliveryAddress', 'Delivery address is required').notEmpty()
  ],
  validate,
  orderController.createOrder
);

// @desc    Get order details
// @route   GET /api/v1/orders/:id
// @access  Private
router.get('/:id', protect, orderController.getOrderDetails);

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin/Manager
router.put(
  '/:id/status',
  protect,
  authorize('admin', 'manager'),
  [
    check('status', 'Valid status is required').isIn([
      'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    ])
  ],
  validate,
  orderController.updateOrderStatus
);

// @desc    Add tracking number to order
// @route   PUT /api/v1/orders/:id/tracking
// @access  Private/Admin/Manager
router.put(
  '/:id/tracking',
  protect,
  authorize('admin', 'manager'),
  [
    check('trackingNumber', 'Tracking number is required').notEmpty()
  ],
  validate,
  orderController.addTrackingNumber
);

module.exports = router;