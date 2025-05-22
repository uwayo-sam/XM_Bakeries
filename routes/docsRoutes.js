// routes/docsRoutes.js
const express = require('express');
const router = express.Router();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'XM Bakeries API',
      version: '1.0.0',
      description: 'API documentation for XM Bakeries backend application',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || 'http://localhost:5000/api/v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{
      bearerAuth: [],
    }],
  },
  apis: ['./routes/*.js'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

// @desc    API Documentation
// @route   GET /api/v1/docs
// @access  Public
router.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

module.exports = router;