// models/orderModel.js
const pool = require('../db');

class Order {
  static async create(customerId, deliveryAddress) {
    const [result] = await pool.execute(
      'INSERT INTO orders (customer_id, delivery_address) VALUES (?, ?)',
      [customerId, deliveryAddress]
    );
    return result.insertId;
  }

  static async addItem(orderId, productId, quantity, unitPrice) {
    await pool.execute(
      'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)',
      [orderId, productId, quantity, unitPrice]
    );
  }

  static async calculateTotal(orderId) {
    const [rows] = await pool.execute(
      `SELECT SUM(quantity * unit_price) AS total 
       FROM order_items 
       WHERE order_id = ?`,
      [orderId]
    );
    return rows[0].total;
  }

  static async updateTotal(orderId, totalAmount) {
    await pool.execute(
      'UPDATE orders SET total_amount = ? WHERE order_id = ?',
      [totalAmount, orderId]
    );
  }

  static async findById(orderId) {
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE order_id = ?',
      [orderId]
    );
    return rows[0];
  }

  static async findByCustomer(customerId) {
    const [rows] = await pool.execute(
      'SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC',
      [customerId]
    );
    return rows;
  }

  static async getOrderItems(orderId) {
    const [rows] = await pool.execute(
      `SELECT oi.*, p.name, p.image_url 
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows;
  }

  static async updateStatus(orderId, status) {
    await pool.execute(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, orderId]
    );
  }

  static async setTrackingNumber(orderId, trackingNumber) {
    await pool.execute(
      'UPDATE orders SET tracking_number = ? WHERE order_id = ?',
      [trackingNumber, orderId]
    );
  }
}

module.exports = Order;