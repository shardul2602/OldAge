const Donation = require('../models/Donation');

// Add donation
async function addDonation(req, res) {
  try {
    const { donorName, amount, method, date, notes } = req.body;
    if (!donorName || amount == null) {
      return res.status(400).json({ message: 'donorName and amount are required' });
    }
    const donation = await Donation.create({ donorName, amount, method, date, notes });
    return res.status(201).json({ message: 'Donation added', donation });
  } catch (err) {
    return res.status(400).json({ message: 'Add donation failed', error: err.message });
  }
}

// List donations (most recent first)
async function listDonations(req, res) {
  try {
    const list = await Donation.find().sort({ createdAt: -1 });
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: 'Fetch donations failed', error: err.message });
  }
}

// Get total amount
async function getTotal(req, res) {
  try {
    const result = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    const summary = result[0] || { total: 0, count: 0 };
    return res.json({ total: summary.total, count: summary.count });
  } catch (err) {
    return res.status(500).json({ message: 'Summary failed', error: err.message });
  }
}

module.exports = { addDonation, listDonations, getTotal };
