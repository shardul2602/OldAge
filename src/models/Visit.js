const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: 'Resident', required: true },
    volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    visitDate: { type: Date, required: true },
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled'], default: 'scheduled' },
    notes: { type: String, default: '' },
    homeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visit', visitSchema);
