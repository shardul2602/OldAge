const mongoose = require('mongoose');
const User = require('./src/models/User');

async function testLoginDirectly() {
  try {
    await mongoose.connect('mongodb://localhost:27017/oldage-assistance');
    
    console.log('🔍 Testing login directly...');
    
    // Get the user exactly as the login controller does
    const user = await User.findOne({ email: 'superadmin@demo.com' }).populate('homeId', 'name address contact');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    console.log('🔐 Password hash:', user.password.substring(0, 20) + '...');
    
    // Test the exact same login logic
    const password = 'demo123';
    console.log('🧪 Testing password:', password);
    
    // Test 1: User method
    const result1 = await user.comparePassword(password);
    console.log('✅ User.comparePassword():', result1);
    
    // Test 2: Manual bcrypt
    const bcrypt = require('bcryptjs');
    const result2 = await bcrypt.compare(password, user.password);
    console.log('✅ bcrypt.compare():', result2);
    
    // Test 3: Create a fresh hash and compare
    const freshHash = await bcrypt.hash(password, 10);
    console.log('🔐 Fresh hash:', freshHash);
    const result3 = await bcrypt.compare(password, freshHash);
    console.log('✅ Fresh hash test:', result3);
    
    // Test 4: Check if stored hash works with fresh password
    const result4 = await bcrypt.compare(password, user.password);
    console.log('✅ Stored hash test:', result4);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLoginDirectly();
