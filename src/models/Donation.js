const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['cash', 'bank', 'online'], default: 'cash' },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
