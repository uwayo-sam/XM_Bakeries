// models/customerModel.js
const pool = require('../db');

class Customer {
  static async create(userId, address) {
    const [result] = await pool.execute(
      'INSERT INTO customers (user_id, address) VALUES (?, ?)',
      [userId, address]
    );
    return result.insertId;
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM customers WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }

  static async findById(customerId) {
    const [rows] = await pool.execute(
      'SELECT * FROM customers WHERE customer_id = ?',
      [customerId]
    );
    return rows[0];
  }

  static async update(customerId, updates) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    
    values.push(customerId);
    
    await pool.execute(
      `UPDATE customers SET ${fields.join(', ')} WHERE customer_id = ?`,
      values
    );
  }

  static async addLoyaltyPoints(customerId, points) {
    await pool.execute(
      'UPDATE customers SET loyalty_points = loyalty_points + ? WHERE customer_id = ?',
      [points, customerId]
    );
  }
}

module.exports = Customer;