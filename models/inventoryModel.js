// models/inventoryModel.js
const pool = require('../db');

class Inventory {
  static async logChange(productId, quantityChange, changeType, referenceId, notes) {
    await pool.execute(
      `INSERT INTO inventory_log 
       (product_id, quantity_change, change_type, reference_id, notes) 
       VALUES (?, ?, ?, ?, ?)`,
      [productId, quantityChange, changeType, referenceId, notes]
    );
  }

  static async getProductLogs(productId) {
    const [rows] = await pool.execute(
      `SELECT * FROM inventory_log 
       WHERE product_id = ? 
       ORDER BY created_at DESC`,
      [productId]
    );
    return rows;
  }

  static async getCurrentStock(productId) {
    const [rows] = await pool.execute(
      'SELECT quantity_in_stock FROM products WHERE product_id = ?',
      [productId]
    );
    return rows[0]?.quantity_in_stock || 0;
  }
}

module.exports = Inventory;