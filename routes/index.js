// routes/index.js
const express = require('express');
const router = express.Router();

// Import all route files
const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const orderRoutes = require('./orderRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const reportRoutes = require('./reportRoutes');
const userRoutes = require('./userRoutes');
const docsRoutes = require('./docsRoutes');

// Mount routers
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reports', reportRoutes);
router.use('/users', userRoutes);
router.use('/docs', docsRoutes);

module.exports = router;