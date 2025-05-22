// controllers/inventoryController.js
const Inventory = require('../models/inventoryModel');
const Product = require('../models/productModel');

exports.getInventoryLogs = async (req, res) => {
  try {
    const logs = await Inventory.getProductLogs(req.params.productId);
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching inventory logs' });
  }
};

exports.adjustInventory = async (req, res) => {
  try {
    const { productId, quantityChange, notes } = req.body;
    
    // Update product stock
    await Product.updateStock(productId, quantityChange);
    
    // Log the adjustment
    await Inventory.logChange(
      productId,
      quantityChange,
      'adjustment',
      null,
      notes || 'Manual inventory adjustment'
    );
    
    res.json({ message: 'Inventory adjusted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adjusting inventory' });
  }
};

exports.getCurrentStock = async (req, res) => {
  try {
    const stock = await Inventory.getCurrentStock(req.params.productId);
    res.json({ quantityInStock: stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching current stock' });
  }
};