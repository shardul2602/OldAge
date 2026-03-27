const User = require('../models/User');

async function attachUser(req, res, next) {
  try {
    const id = req.header('x-user-id');
    console.log('🔍 Attach User - User ID from header:', id);
    
    if (id) {
      const user = await User.findById(id).select('-password').populate('homeId', 'name address contact');
      if (user) {
        req.user = user;
        req.homeIds = user.homeId.map(h => h._id ? h._id.toString() : h.toString());
        req.homeId = user.homeId[0]?._id || user.homeId[0]; // Primary home for compatibility
        console.log('🔍 Attach User - User found:', user.name, 'Role:', user.role);
        console.log('🔍 Attach User - Home IDs:', req.homeIds);
        console.log('🔍 Attach User - Raw homeId array:', user.homeId);
        
        // Handle selected home filter for volunteers
        if (user.role === 'volunteer') {
          const selectedHome = req.header('x-selected-home');
          console.log('🏠 Volunteer home selection:', {
            selectedHome,
            userHomeIds: user.homeId.map(h => String(h._id)),
            userHomeIdsRaw: user.homeId,
            isValid: selectedHome && user.homeId.some(homeId => String(homeId._id) === selectedHome)
          });
          if (selectedHome && user.homeId.some(homeId => String(homeId._id) === selectedHome)) {
            req.homeIds = [selectedHome]; // Filter to selected home only
            console.log('✅ Filtering to single home:', selectedHome);
          } else {
            console.log('❌ No valid home selection, using all homes');
          }
        }
      } else {
        console.log('❌ Attach User - No user found with ID:', id);
      }
    } else {
      console.log('❌ Attach User - No x-user-id header found');
    }
  } catch (error) {
    console.log('❌ Attach User - Error:', error.message);
  }
  next();
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized: user not found' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: insufficient role' });
    next();
  };
}

function requireSuperAdmin(req, res, next) {
  console.log('🔍 Super Admin Check - User:', req.user?.name, 'Role:', req.user?.role);
  if (!req.user) {
    console.log('❌ No user found in request');
    return res.status(401).json({ message: 'Unauthorized: user not found' });
  }
  if (req.user.role !== 'superadmin') {
    console.log('❌ User role is not superadmin:', req.user.role);
    return res.status(403).json({ message: 'Forbidden: superadmin required' });
  }
  console.log('✅ Super admin check passed');
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized: user not found' });
  if (!['admin', 'superadmin'].includes(req.user.role)) return res.status(403).json({ message: 'Forbidden: admin required' });
  next();
}

module.exports = { attachUser, requireRole, requireSuperAdmin, requireAdmin };
