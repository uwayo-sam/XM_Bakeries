// middlewares/performanceMiddleware.js
const responseTime = require('response-time');

// Add response time header
exports.addResponseTime = responseTime((req, res, time) => {
  res.setHeader('X-Response-Time', `${time.toFixed(2)}ms`);
});

// Compress responses
exports.compressResponses = require('compression')();

// Cache control
exports.setCacheControl = (req, res, next) => {
  // Cache for 1 day (in seconds)
  const period = 60 * 60 * 24;
  
  if (req.method === 'GET') {
    res.set('Cache-control', `public, max-age=${period}`);
  } else {
    res.set('Cache-control', 'no-store');
  }
  
  next();
};