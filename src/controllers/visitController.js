const Visit = require('../models/Visit');

// Schedule a visit
async function createVisit(req, res) {
  try {
    const { resident, volunteer, visitDate, status, notes } = req.body;
    if (!resident || !volunteer || !visitDate) {
      return res.status(400).json({ message: 'resident, volunteer and visitDate are required' });
    }
    const visit = await Visit.create({ resident, volunteer, visitDate, status, notes, homeId: req.homeIds[0] });
    return res.status(201).json({ message: 'Visit scheduled', visit });
  } catch (err) {
    return res.status(400).json({ message: 'Create visit failed', error: err.message });
  }
}

// List visits (optionally by volunteer id)
async function listVisits(req, res) {
  try {
    const filter = { homeId: { $in: req.homeIds } };
    if (req.query.volunteer) filter.volunteer = req.query.volunteer;
    if (req.query.resident) filter.resident = req.query.resident;
    const visits = await Visit.find(filter)
      .populate('resident', 'name roomNumber')
      .populate('volunteer', 'name email role')
      .sort({ visitDate: -1 });
    return res.json(visits);
  } catch (err) {
    return res.status(500).json({ message: 'Fetch visits failed', error: err.message });
  }
}

// Get one
async function getVisit(req, res) {
  try {
    const v = await Visit.findById(req.params.id)
      .populate('resident', 'name roomNumber')
      .populate('volunteer', 'name email role');
    if (!v) return res.status(404).json({ message: 'Visit not found' });
    return res.json(v);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid id', error: err.message });
  }
}

// Update status/notes/date
async function updateVisit(req, res) {
  try {
    const allowed = ['status', 'notes', 'visitDate', 'resident', 'volunteer'];
    const patch = {};
    for (const k of allowed) if (k in req.body) patch[k] = req.body[k];
    const updated = await Visit.findByIdAndUpdate(req.params.id, patch, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Visit not found' });
    return res.json({ message: 'Visit updated', visit: updated });
  } catch (err) {
    return res.status(400).json({ message: 'Update visit failed', error: err.message });
  }
}

// Delete
async function deleteVisit(req, res) {
  try {
    const deleted = await Visit.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Visit not found' });
    return res.json({ message: 'Visit deleted' });
  } catch (err) {
    return res.status(400).json({ message: 'Delete visit failed', error: err.message });
  }
}

module.exports = { createVisit, listVisits, getVisit, updateVisit, deleteVisit };
