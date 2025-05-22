// models/userModel.js
const pool = require('../db');

class User {
  static async create({ username, passwordHash, email, role, fullName, phone }) {
    const [result] = await pool.execute(
      `INSERT INTO users (username, password_hash, email, role, full_name, phone) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [username, passwordHash, email, role, fullName, phone]
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(userId) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );
    return rows[0];
  }

  static async update(userId, updates) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    
    values.push(userId);
    
    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`,
      values
    );
  }

  static async delete(userId) {
    await pool.execute(
      'DELETE FROM users WHERE user_id = ?',
      [userId]
    );
  }
}

module.exports = User;