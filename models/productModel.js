// models/productModel.js
const pool = require('../db');

class Product {
  static async create({ name, description, price, category, quantityInStock, imageUrl }) {
    const [result] = await pool.execute(
      `INSERT INTO products (name, description, price, category, quantity_in_stock, image_url) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, description, price, category, quantityInStock, imageUrl]
    );
    return result.insertId;
  }

  static async findAll({ category, minPrice, maxPrice, sortBy, sortOrder = 'ASC' }) {
    let query = 'SELECT * FROM products WHERE is_active = TRUE';
    const params = [];
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(minPrice);
    }
    
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(maxPrice);
    }
    
    if (sortBy) {
      query += ` ORDER BY ${sortBy} ${sortOrder}`;
    }
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }

  static async findById(productId) {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE product_id = ?',
      [productId]
    );
    return rows[0];
  }

  static async update(productId, updates) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    
    values.push(productId);
    
    await pool.execute(
      `UPDATE products SET ${fields.join(', ')} WHERE product_id = ?`,
      values
    );
  }

  static async updateStock(productId, quantityChange) {
    await pool.execute(
      'UPDATE products SET quantity_in_stock = quantity_in_stock + ? WHERE product_id = ?',
      [quantityChange, productId]
    );
  }

  static async delete(productId) {
    await pool.execute(
      'UPDATE products SET is_active = FALSE WHERE product_id = ?',
      [productId]
    );
  }
}

module.exports = Product;