// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const authController = require('../controllers/authController');
const { check } = require('express-validator');

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
router.post(
  '/register',
  [
    check('username', 'Username is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('fullName', 'Full name is required').notEmpty(),
    check('phone', 'Phone number is required').notEmpty(),
    check('address', 'Address is required').if(
      (req) => req.body.role === 'customer' || !req.body.role
    ).notEmpty()
  ],
  validate,
  authController.register
);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
router.post(
  '/login',
  [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').exists()
  ],
  validate,
  authController.login
);

// @desc    Get user profile
// @route   GET /api/v1/auth/profile
// @access  Private
router.get('/profile', protect, authController.getProfile);

module.exports = router;