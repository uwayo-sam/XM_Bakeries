// middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');
const AppError = require('../utils/appError');

// General rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  handler: (req, res, next) => {
    next(new AppError('Too many requests from this IP, please try again later!', 429));
  }
});

// Strict rate limiter for auth routes
exports.authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after an hour',
  handler: (req, res, next) => {
    next(new AppError('Too many login attempts, please try again later!', 429));
  }
});