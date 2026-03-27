const Donation = require('../models/Donation');
const mongoose = require('mongoose');

// Add donation
async function addDonation(req, res) {
  try {
    const { donorName, amount, method, date, notes } = req.body;
    if (!donorName || amount == null) {
      return res.status(400).json({ message: 'donorName and amount are required' });
    }
    const donation = await Donation.create({ donorName, amount, method, date, notes, homeId: req.homeIds[0] });
    return res.status(201).json({ message: 'Donation added', donation });
  } catch (err) {
    return res.status(400).json({ message: 'Add donation failed', error: err.message });
  }
}

// List donations (most recent first)
async function listDonations(req, res) {
  try {
    let filter = {};
    
    // Role-based filtering
    if (req.user.role === 'admin') {
      // Admin sees only their home's donations
      const homeObjectIds = req.homeIds.map(id => new mongoose.Types.ObjectId(id));
      filter.homeId = { $in: homeObjectIds };
    } else if (req.user.role === 'volunteer') {
      // Volunteer sees donations from their assigned homes
      const homeObjectIds = req.homeIds.map(id => new mongoose.Types.ObjectId(id));
      filter.homeId = { $in: homeObjectIds };
    }
    // Superadmin sees all donations (no filter)
    
    const list = await Donation.find(filter).sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: 'Fetch donations failed', error: err.message });
  }
}

// Get total amount
async function getTotal(req, res) {
  try {
    let filter = {};
    
    // Role-based filtering
    if (req.user.role === 'admin') {
      // Admin sees only their home's donations
      const homeObjectIds = req.homeIds.map(id => new mongoose.Types.ObjectId(id));
      filter.homeId = { $in: homeObjectIds };
    } else if (req.user.role === 'volunteer') {
      // Volunteer sees donations from their assigned homes
      const homeObjectIds = req.homeIds.map(id => new mongoose.Types.ObjectId(id));
      filter.homeId = { $in: homeObjectIds };
    }
    // Superadmin sees all donations (no filter)
    
    console.log('🔍 Donation Total - User role:', req.user.role);
    console.log('🔍 Donation Total - Filter:', filter);
    
    const result = await Donation.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    
    const summary = result[0] || { total: 0, count: 0 };
    return res.json({ total: summary.total, count: summary.count });
  } catch (err) {
    console.log('❌ Donation Total - Error:', err.message);
    return res.status(500).json({ message: 'Summary failed', error: err.message });
  }
}

module.exports = { addDonation, listDonations, getTotal };
