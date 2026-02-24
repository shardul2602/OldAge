const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getImages, addImage, deleteImage } = require('../controllers/galleryController');
const { requireRole } = require('../middlewares/auth');

const upload = multer({
  dest: 'public/uploads/',
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if(file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  }
});

// Upload an image file (admin only)
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const publicUrl = `/uploads/${req.file.filename}`;
    const Gallery = require('../models/Gallery');
    const newImage = new Gallery({ url: publicUrl });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Routes
router.get('/', getImages);
router.post('/', requireRole('admin'), addImage);
router.post('/upload', requireRole('admin'), upload.single('image'), exports.uploadImage);
router.delete('/:idx', requireRole('admin'), deleteImage);

module.exports = router;
