const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, default: '' },
  contact: { type: String, default: '' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Home', homeSchema);
