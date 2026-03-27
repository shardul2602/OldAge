const mongoose = require('mongoose');
const User = require('./src/models/User');

async function debugLogin() {
  try {
    await mongoose.connect('mongodb://localhost:27017/oldage-assistance');
    
    const email = 'superadmin@demo.com';
    const password = 'demo123';
    
    console.log('🔍 Debugging login for:', email);
    
    // Step 1: Find user
    const user = await User.findOne({ email }).populate('homeId', 'name address contact');
    console.log('✅ User found:', user ? 'YES' : 'NO');
    
    if (user) {
      console.log('📋 User details:');
      console.log('- Email:', user.email);
      console.log('- Role:', user.role);
      console.log('- Has password:', !!user.password);
      console.log('- Password length:', user.password.length);
      console.log('- Home count:', user.homeId.length);
      
      // Step 2: Test password comparison
      console.log('\n🔐 Testing password comparison...');
      const isValid = await user.comparePassword(password);
      console.log('Password verification result:', isValid);
      
      // Step 3: Manual bcrypt test
      const bcrypt = require('bcryptjs');
      const manualCheck = await bcrypt.compare(password, user.password);
      console.log('Manual bcrypt check:', manualCheck);
      
      // Step 4: Check if password is properly hashed
      console.log('\n🔍 Password analysis:');
      console.log('- Starts with $2:', user.password.startsWith('$2'));
      console.log('- Contains rounds:', user.password.includes('$2b$10') || user.password.includes('$2a$10'));
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Debug error:', error.message);
  }
}

debugLogin();
