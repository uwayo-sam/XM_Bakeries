// middlewares/requestProcessor.js
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const multerStorage = multer.memoryStorage();

// Filter for image files only
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

// Initialize multer upload
exports.upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// Resize and save product images
exports.resizeProductImages = async (req, res, next) => {
  if (!req.files || !req.files.images) return next();

  // 1) Create directory if it doesn't exist
  const uploadDir = path.join(__dirname, '../public/img/products');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 2) Process images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-${req.params.id || 'new'}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(800, 800)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(path.join(uploadDir, filename));

      req.body.images.push(filename);
    })
  );

  next();
};

// Parse JSON bodies
exports.parseJson = express.json({ limit: '10kb' });

// Parse URL-encoded bodies
exports.parseUrlEncoded = express.urlencoded({ extended: true, limit: '10kb' });