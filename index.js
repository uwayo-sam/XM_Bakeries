// server.js
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cors = require('cors');
const path = require('path');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Import middlewares
const {
  setSecurityHeaders,
  preventXSS,
  sanitizeData,
  preventParameterPollution,
  configureCORS
} = require('./middlewares/securityMiddleware');
const { apiLimiter, authLimiter } = require('./middlewares/rateLimiter');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const requestLogger = require('./middlewares/requestLogger');
const {
  addResponseTime,
  compressResponses,
  setCacheControl
} = require('./middlewares/performanceMiddleware');
const { parseJson, parseUrlEncoded } = require('./middlewares/requestProcessor');

// Create express app
const app = express();

// 1️⃣ GLOBAL MIDDLEWARE

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security middleware
app.use(setSecurityHeaders());
app.use(preventXSS());
app.use(sanitizeData());
app.use(preventParameterPollution());
app.use(configureCORS());

// Performance middleware
app.use(addResponseTime());
app.use(compressResponses());
app.use(setCacheControl());

// Request processing
app.use(parseJson());
app.use(parseUrlEncoded());
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Request logging
app.use(requestLogger);

// 2️⃣ ROUTE-SPECIFIC MIDDLEWARE

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Apply stricter rate limiting to auth routes
app.use('/api/v1/auth', authLimiter);

// 3️⃣ ROUTES
app.use('/api/v1', require('./routes'));

// 4️⃣ ERROR HANDLING MIDDLEWARE
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});