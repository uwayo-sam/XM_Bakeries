// middlewares/validationMiddleware.js
const { validationResult } = require('express-validator');
const AppError = require('../utils/appError');

// Wrapper for express-validator to handle errors
exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({
      success: false,
      errors: extractedErrors
    });
  };
};

// Validate object ID format (for MongoDB or similar)
exports.validateObjectId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName} format`
      });
    }
    next();
  };
};

// Validate file uploads
exports.validateFileUpload = (fieldName, allowedTypes, maxSizeMB = 5) => {
  return (req, res, next) => {
    if (!req.files || !req.files[fieldName]) {
      return next();
    }

    const file = req.files[fieldName];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileSizeMB = file.size / (1024 * 1024);

    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    if (fileSizeMB > maxSizeMB) {
      return res.status(400).json({
        success: false,
        message: `File size too large. Maximum ${maxSizeMB}MB allowed`
      });
    }

    next();
  };
};