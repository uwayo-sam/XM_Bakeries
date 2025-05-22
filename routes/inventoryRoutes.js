// routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const inventoryController = require('../controllers/inventoryController');
const { check } = require('express-validator');

// @desc    Get inventory logs for a product
// @route   GET /api/v1/inventory/:productId/logs
// @access  Private/Admin/Manager
router.get(
  '/:productId/logs',
  protect,
  authorize('admin', 'manager'),
  inventoryController.getInventoryLogs
);

// @desc    Adjust inventory
// @route   POST /api/v1/inventory/adjust
// @access  Private/Admin/Manager
router.post(
  '/adjust',
  protect,
  authorize('admin', 'manager'),
  [
    check('productId', 'Product ID is required').isInt({ min: 1 }),
    check('quantityChange', 'Quantity change is required').isInt(),
    check('notes', 'Notes are required').optional().isString()
  ],
  validate,
  inventoryController.adjustInventory
);

// @desc    Get current stock level
// @route   GET /api/v1/inventory/:productId/stock
// @access  Private
router.get(
  '/:productId/stock',
  protect,
  inventoryController.getCurrentStock
);

module.exports = router;