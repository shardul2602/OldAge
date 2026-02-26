const User = require('../models/User');

// Register new user (admin or volunteer)
async function register(req, res) {
  try {
    const { name, email, password, homeId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    // If no homeId provided, assign to all available homes (for volunteers)
    let finalHomeId = homeId;
    if (!homeId) {
      const Home = require('../models/Home');
      const homes = await Home.find({ name: { $ne: 'Default Home' } });
      finalHomeId = homes.length > 0 ? homes.map(h => h._id) : [(await Home.findOne({ name: 'Default Home' }))._id];
    }

    const user = await User.create({ name, email, password, role: 'volunteer', homeId: Array.isArray(finalHomeId) ? finalHomeId : [finalHomeId] });
    
    // Populate home details for response
    const populatedUser = await User.findById(user._id).populate('homeId', 'name address contact');
    const { password: _, ...userSafe } = populatedUser.toObject();
    
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

    const user = await User.findOne({ email }).populate('homeId', 'name address contact');
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

    let user = await User.findOne({ email }).populate('homeId', 'name address contact');
    
    // Get all available homes
    const Home = require('../models/Home');
    const homes = await Home.find({ name: { $ne: 'Default Home' } });
    const allHomeIds = homes.length > 0 ? homes.map(h => h._id) : [(await Home.findOne({ name: 'Default Home' }))._id];
    
    if (!user) {
      // Create new user with all homes
      const tempPass = Math.random().toString(36).slice(2) + Date.now();
      user = await User.create({ name: name || email.split('@')[0], email, password: tempPass, role: 'volunteer', homeId: allHomeIds });
    } else {
      // Update existing user to have all homes (if they don't already)
      const currentHomeIds = user.homeId.map(h => h._id || h);
      const missingHomeIds = allHomeIds.filter(id => !currentHomeIds.includes(String(id)));
      
      if (missingHomeIds.length > 0) {
        user.homeId = allHomeIds;
        await user.save();
        console.log('Updated user with additional homes:', missingHomeIds);
      }
    }
    
    // Populate home details for response
    user = await User.findById(user._id).populate('homeId', 'name address contact');

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

async function exists(req, res) {
  try {
    const email = (req.query.email || req.body?.email || '').toLowerCase();
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findOne({ email });
    return res.json({ exists: !!user });
  } catch (err) {
    return res.status(500).json({ message: 'Exists check failed', error: err.message });
  }
}

module.exports.exists = exists;
