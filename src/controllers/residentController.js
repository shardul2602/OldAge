const Resident = require('../models/Resident');

// Create resident
async function createResident(req, res) {
  try {
    const resident = await Resident.create({ ...req.body, homeId: req.homeIds[0] });
    return res.status(201).json({ message: 'Resident created', resident });
  } catch (err) {
    return res.status(400).json({ message: 'Create failed', error: err.message });
  }
}

// List all residents
async function getResidents(req, res) {
  try {
    let filter = {};
    
    // Role-based filtering
    if (req.user.role === 'admin') {
      // Admin sees only their home's residents
      filter.homeId = { $in: req.homeIds };
    } else if (req.user.role === 'volunteer') {
      // Volunteer sees residents from their assigned homes
      filter.homeId = { $in: req.homeIds };
    }
    // Superadmin sees all residents (no filter)
    
    console.log('Querying residents with filter:', filter); // Debug
    const list = await Resident.find(filter).sort({ createdAt: -1 });
    console.log('Found residents:', list.map(r => ({ name: r.name, homeId: r.homeId }))); // Debug
    return res.json(list);
  } catch (err) {
    return res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
}

// Get one by id
async function getResidentById(req, res) {
  try {
    const item = await Resident.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Resident not found' });
    return res.json(item);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid id', error: err.message });
  }
}

// Update
async function updateResident(req, res) {
  try {
    const updated = await Resident.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Resident not found' });
    return res.json({ message: 'Resident updated', resident: updated });
  } catch (err) {
    return res.status(400).json({ message: 'Update failed', error: err.message });
  }
}

// Delete
async function deleteResident(req, res) {
  try {
    const deleted = await Resident.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Resident not found' });
    return res.json({ message: 'Resident deleted' });
  } catch (err) {
    return res.status(400).json({ message: 'Delete failed', error: err.message });
  }
}

module.exports = {
  createResident,
  getResidents,
  getResidentById,
  updateResident,
  deleteResident,
};
