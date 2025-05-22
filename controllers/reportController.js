// controllers/reportController.js
const Report = require('../models/reportModel');

exports.generateSalesReport = async (req, res) => {
  try {
    const reportId = await Report.generateDailySales(req.user.userId);
    const report = await Report.getReport(reportId);
    
    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating sales report' });
  }
};

exports.getReport = async (req, res) => {
  try {
    const report = await Report.getReport(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching report' });
  }
};

exports.getRecentReports = async (req, res) => {
  try {
    const reports = await Report.getRecentReports();
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching recent reports' });
  }
};