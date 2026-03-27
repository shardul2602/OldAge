const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

async function checkPasswordHash() {
  try {
    await mongoose.connect('mongodb://localhost:27017/oldage-assistance');
    
    const user = await User.findOne({ email: 'superadmin@demo.com' });
    console.log('🔍 Password analysis:');
    console.log('- Raw password:', user.password);
    console.log('- Starts with $2:', user.password.startsWith('$2'));
    console.log('- Contains rounds:', user.password.includes('$2b$10') || user.password.includes('$2a$10'));
    
    // Test with different methods
    const testPassword = 'demo123';
    console.log('\n🧪 Testing password:', testPassword);
    
    // Method 1: Using user.comparePassword
    const method1 = await user.comparePassword(testPassword);
    console.log('✅ User.comparePassword():', method1);
    
    // Method 2: Direct bcrypt
    const method2 = await bcrypt.compare(testPassword, user.password);
    console.log('✅ Direct bcrypt.compare():', method2);
    
    // Method 3: Hash the test password and compare
    const hashed = await bcrypt.hash(testPassword, 10);
    console.log('🔐 Fresh hash of test password:', hashed);
    console.log('🔍 Does fresh hash match stored?', hashed === user.password);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkPasswordHash();
