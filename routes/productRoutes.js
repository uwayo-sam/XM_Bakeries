// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validationMiddleware');
const productController = require('../controllers/productController');
const { upload, resizeProductImages } = require('../middlewares/requestProcessor');
const { check } = require('express-validator');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
router.get('/', productController.getAllProducts);

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
router.get('/:id', productController.getProductById);

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin/Manager
router.post(
  '/',
  protect,
  authorize('admin', 'manager'),
  upload.array('images', 5),
  resizeProductImages,
  [
    check('name', 'Name is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('price', 'Price must be a positive number').isFloat({ min: 0 }),
    check('category', 'Category is required').notEmpty(),
    check('quantityInStock', 'Quantity must be a positive integer').isInt({ min: 0 })
  ],
  validate,
  productController.createProduct
);

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin/Manager
router.put(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  upload.array('images', 5),
  resizeProductImages,
  productController.updateProduct
);

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin/Manager
router.delete(
  '/:id',
  protect,
  authorize('admin', 'manager'),
  productController.deleteProduct
);

module.exports = router;