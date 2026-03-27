const Gallery = require('../models/Gallery');
const mongoose = require('mongoose');

// Get all gallery images
exports.getImages = async (req, res) => {
  try {
    console.log('🔍 Gallery - User role:', req.user.role);
    console.log('🔍 Gallery - User homeIds:', req.homeIds);
    
    const homeObjectIds = req.homeIds.map(id => new mongoose.Types.ObjectId(id));
    console.log('🔍 Gallery - Home ObjectIds:', homeObjectIds);
    
    let images = [];
    
    if (req.user.role === 'superadmin') {
      // Super admin sees all images
      images = await Gallery.find({}).sort({ createdAt: -1 });
      console.log('🔍 Gallery - Super admin - Found all images:', images.length);
    } else {
      // Admin and volunteer see images from their homes + images with undefined homeId
      images = await Gallery.find({ 
        $or: [
          { homeId: { $in: homeObjectIds } },
          { homeId: { $exists: false } },
          { homeId: null }
        ]
      }).sort({ createdAt: -1 });
      console.log('🔍 Gallery - Admin/Volunteer - Found images:', images.length);
      
      // For admin users, assign undefined homeId images to their home
      if (req.user.role === 'admin') {
        const undefinedImages = images.filter(img => !img.homeId);
        if (undefinedImages.length > 0 && req.homeIds.length > 0) {
          console.log('🔍 Gallery - Assigning', undefinedImages.length, 'undefined images to admin home');
          await Gallery.updateMany(
            { homeId: { $exists: false } },
            { $set: { homeId: req.homeIds[0] } }
          );
          
          // Refetch after update
          images = await Gallery.find({ 
            $or: [
              { homeId: { $in: homeObjectIds } },
              { homeId: { $exists: false } },
              { homeId: null }
            ]
          }).sort({ createdAt: -1 });
        }
      }
    }
    
    // Let's also check what images exist in total
    const allImages = await Gallery.find({});
    console.log('🔍 Gallery - All images in database:', allImages.length);
    if (allImages.length > 0) {
      console.log('🔍 Gallery - Sample image:', {
        id: allImages[0]._id,
        url: allImages[0].url,
        homeId: allImages[0].homeId,
        homeIdType: typeof allImages[0].homeId
      });
    }
    
    res.json(images.map(g => g.url));
  } catch (err) {
    console.log('❌ Gallery - Error:', err.message);
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
    const homeObjectIds = req.homeIds.map(id => new mongoose.Types.ObjectId(id));
    const images = await Gallery.find({ homeId: { $in: homeObjectIds } }).sort({ createdAt: -1 });
    if (idx < 0 || idx >= images.length) return res.status(404).json({ error: 'Invalid index' });
    await Gallery.findByIdAndDelete(images[idx]._id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
