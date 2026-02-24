const express = require('express');
const router = express.Router();
const { getImages, addImage, deleteImage } = require('../controllers/galleryController');
const { requireRole } = require('../middlewares/auth');

router.get('/', getImages);
router.post('/', requireRole('admin'), addImage);
router.delete('/:idx', requireRole('admin'), deleteImage);

module.exports = router;
