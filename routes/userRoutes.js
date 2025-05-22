// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const userController = require('../controllers/userController');
const { check } = require('express-validator');

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
router.get(
  '/',
  protect,
  authorize('admin'),
  userController.getAllUsers
);

// @desc    Get user by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin
router.get(
  '/:id',
  protect,
  authorize('admin'),
  userController.getUserById
);

// @desc    Update user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  authorize('admin'),
  [
    check('email', 'Please include a valid email').optional().isEmail(),
    check('role', 'Role must be admin, manager, or customer').optional().isIn(['admin', 'manager', 'customer'])
  ],
  validate,
  userController.updateUser
);

// @desc    Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  userController.deleteUser
);

module.exports = router;