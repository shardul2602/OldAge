const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  url: { type: String, required: true },
  homeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
