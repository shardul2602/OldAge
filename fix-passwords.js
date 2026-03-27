const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function fixPasswords() {
  try {
    await mongoose.connect('mongodb://localhost:27017/oldage-assistance');
    
    const demoUsers = [
      { email: 'superadmin@demo.com', role: 'superadmin' },
      { email: 'admin.a@demo.com', role: 'admin' },
      { email: 'admin.b@demo.com', role: 'admin' },
      { email: 'volunteer.x@demo.com', role: 'volunteer' },
      { email: 'volunteer.y@demo.com', role: 'volunteer' }
    ];
    
    for (const userData of demoUsers) {
      const user = await User.findOne({ email: userData.email });
      if (user) {
        const hashedPassword = await bcrypt.hash('demo123', 10);
        user.password = hashedPassword;
        await user.save();
        console.log(`✅ Updated password for: ${userData.email} (${userData.role})`);
      }
    }
    
    console.log('🎉 All demo passwords updated to: demo123');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixPasswords();
