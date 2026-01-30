const User = require('../models/User');

// Register new user (admin or volunteer)
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: 'volunteer' });
    const { password: _, ...userSafe } = user.toObject();
    return res.status(201).json({ message: 'Registered successfully', user: userSafe });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
}

// Login user (basic)
async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    // Elevate to admin if email is allowlisted in ADMIN_EMAILS
    const allow = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
    if (allow.includes(email.toLowerCase()) && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const { password: _, ...userSafe } = user.toObject();
    return res.json({ message: 'Login successful', user: userSafe });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
}

module.exports = { register, login };
// Google upsert: create user if not exists, otherwise return existing
async function googleUpsert(req, res) {
  try {
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ message: 'Email is required' });

    let user = await User.findOne({ email });
    if (!user) {
      const tempPass = Math.random().toString(36).slice(2) + Date.now();
      user = await User.create({ name: name || email.split('@')[0], email, password: tempPass, role: 'volunteer' });
    }

    const allow = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
    if (allow.includes(email.toLowerCase()) && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const { password: _, ...userSafe } = user.toObject();
    return res.json({ message: 'Upserted successfully', user: userSafe });
  } catch (err) {
    return res.status(500).json({ message: 'Google upsert failed', error: err.message });
  }
}

module.exports.googleUpsert = googleUpsert;
