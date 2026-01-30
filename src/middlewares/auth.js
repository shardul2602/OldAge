const User = require('../models/User');

async function attachUser(req, res, next) {
  try {
    const id = req.header('x-user-id');
    if (id) {
      const user = await User.findById(id).select('-password');
      if (user) req.user = user;
    }
  } catch (_) {}
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized: user not found' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
    next();
  };
}

module.exports = { attachUser, requireRole };
