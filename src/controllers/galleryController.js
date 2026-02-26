const Gallery = require('../models/Gallery');

// Get all gallery images
exports.getImages = async (req, res) => {
  try {
    const images = await Gallery.find({ homeId: { $in: req.homeIds } }).sort({ createdAt: -1 });
    res.json(images.map(g => g.url));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add an image (admin only)
exports.addImage = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL required' });
    const newImage = new Gallery({ url, homeId: req.homeId });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an image by index (admin only)
exports.deleteImage = async (req, res) => {
  try {
    const idx = parseInt(req.params.idx, 10);
    const images = await Gallery.find({ homeId: { $in: req.homeIds } }).sort({ createdAt: -1 });
    if (idx < 0 || idx >= images.length) return res.status(404).json({ error: 'Invalid index' });
    await Gallery.findByIdAndDelete(images[idx]._id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
