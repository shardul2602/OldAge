const Home = require('../models/Home');

// Get all homes
async function getHomes(req, res) {
  try {
    const homes = await Home.find().sort({ name: 1 });
    res.json(homes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Create a home (superadmin only)
async function createHome(req, res) {
  try {
    const { name, address, contact } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const home = await Home.create({ name, address, contact });
    res.status(201).json(home);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getHomes, createHome };
