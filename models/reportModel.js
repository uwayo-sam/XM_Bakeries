// models/reportModel.js
const pool = require('../db');

class Report {
  static async generateDailySales(userId) {
    // Call the stored procedure
    const [rows] = await pool.execute(
      'CALL generate_daily_sales_report(?)',
      [userId]
    );
    return rows[0][0].report_id;
  }

  static async getReport(reportId) {
    const [rows] = await pool.execute(
      `SELECT r.*, p.name AS most_sold_product_name, u.username AS generated_by_username
       FROM sales_reports r
       LEFT JOIN products p ON r.most_sold_product_id = p.product_id
       JOIN users u ON r.generated_by = u.user_id
       WHERE r.report_id = ?`,
      [reportId]
    );
    return rows[0];
  }

  static async getRecentReports(limit = 10) {
    const [rows] = await pool.execute(
      `SELECT r.*, p.name AS most_sold_product_name, u.username AS generated_by_username
       FROM sales_reports r
       LEFT JOIN products p ON r.most_sold_product_id = p.product_id
       JOIN users u ON r.generated_by = u.user_id
       ORDER BY r.report_date DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  }
}

module.exports = Report;