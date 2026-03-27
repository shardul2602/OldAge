const mongoose = require('mongoose');
const User = require('./src/models/User');

async function fixPasswordsCorrectly() {
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
        // Set plain password - the pre-save hook will hash it automatically
        user.password = 'demo123';
        await user.save();
        console.log(`✅ Updated password for: ${userData.email} (${userData.role})`);
      }
    }
    
    console.log('🎉 All demo passwords updated to: demo123');
    
    // Test one password
    const testUser = await User.findOne({ email: 'superadmin@demo.com' });
    const isValid = await testUser.comparePassword('demo123');
    console.log('✅ Password verification test:', isValid);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

fixPasswordsCorrectly();
