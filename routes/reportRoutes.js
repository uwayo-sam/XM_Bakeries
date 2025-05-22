// routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const reportController = require('../controllers/reportController');

// @desc    Generate daily sales report
// @route   POST /api/v1/reports/sales/daily
// @access  Private/Admin/Manager
router.post(
  '/sales/daily',
  protect,
  authorize('admin', 'manager'),
  reportController.generateSalesReport
);

// @desc    Get report by ID
// @route   GET /api/v1/reports/:id
// @access  Private/Admin/Manager
router.get(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  reportController.getReport
);

// @desc    Get recent reports
// @route   GET /api/v1/reports
// @access  Private/Admin/Manager
router.get(
  '/',
  protect,
  authorize('admin', 'manager'),
  reportController.getRecentReports
);

module.exports = router;