// controllers/orderController.js
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Inventory = require('../models/inventoryModel');
const { validationResult } = require('express-validator');

exports.createOrder = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { items, deliveryAddress } = req.body;
    const customerId = req.user.customerId || req.user.userId; // Assuming customerId is available

    const orderId = await Order.create(customerId, deliveryAddress);

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.quantity_in_stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for product ${product.name}` 
        });
      }

      await Order.addItem(orderId, item.productId, item.quantity, product.price);
      await Product.updateStock(item.productId, -item.quantity);
      await Inventory.logChange(
        item.productId, 
        -item.quantity, 
        'sale', 
        orderId,
        `Order ${orderId}`
      );
    }

    const total = await Order.calculateTotal(orderId);
    await Order.updateTotal(orderId, total);

    res.status(201).json({
      message: 'Order created successfully',
      orderId,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if the user is authorized to view this order
    if (req.user.role === 'customer' && order.customer_id !== req.user.customerId) {
      return res.status(403).json({ message: 'Unauthorized to view this order' });
    }

    const items = await Order.getOrderItems(req.params.id);

    res.json({
      ...order,
      items
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching order details' });
  }
};

exports.getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.customerId || req.user.userId;
    const orders = await Order.findByCustomer(customerId);

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching customer orders' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    await Order.updateStatus(req.params.id, status);
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
};

exports.addTrackingNumber = async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    
    await Order.setTrackingNumber(req.params.id, trackingNumber);
    
    res.json({ message: 'Tracking number added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding tracking number' });
  }
};