const mongoose = require('mongoose');

const residentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    admissionDate: { type: Date, default: Date.now },
    bloodGroup: { type: String, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-'], default: 'O+' },
    medicalHistory: { type: String, default: '' },
    healthConditions: { type: String, default: '' },
    emergencyContact: {
      name: { type: String, required: true },
      phone: { type: String, required: true }
    },
    roomNumber: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resident', residentSchema);
