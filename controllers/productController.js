// controllers/productController.js
const Product = require('../models/productModel');
const { validationResult } = require('express-validator');

exports.createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, category, quantityInStock, imageUrl } = req.body;

    const productId = await Product.create({
      name,
      description,
      price,
      category,
      quantityInStock,
      imageUrl
    });

    res.status(201).json({
      message: 'Product created successfully',
      productId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating product' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, sortBy, sortOrder } = req.query;
    
    const products = await Product.findAll({
      category,
      minPrice: parseFloat(minPrice),
      maxPrice: parseFloat(maxPrice),
      sortBy,
      sortOrder
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
};

exports.updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const productId = req.params.id;
    const updates = req.body;

    await Product.update(productId, updates);

    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.delete(req.params.id);

    res.json({ message: 'Product deactivated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deactivating product' });
  }
};