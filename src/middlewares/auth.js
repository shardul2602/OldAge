const User = require('../models/User');

async function attachUser(req, res, next) {
  try {
    const id = req.header('x-user-id');
    if (id) {
      const user = await User.findById(id).select('-password').populate('homeId', 'name address contact');
      if (user) {
        req.user = user;
        req.homeIds = user.homeId.map(h => h._id || h);
        req.homeId = user.homeId[0]?._id || user.homeId[0]; // Primary home for compatibility
      }
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
