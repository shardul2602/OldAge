const mongoose = require('mongoose');
const User = require('./src/models/User');

async function createTestUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/oldage-assistance');
    
    // Delete existing test user if exists
    await User.deleteOne({ email: 'test@demo.com' });
    
    // Create fresh test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'test@demo.com',
      password: 'demo123',
      role: 'volunteer'
    });
    
    console.log('✅ Created test user:', testUser.email);
    
    // Test login immediately
    const user = await User.findOne({ email: 'test@demo.com' });
    const isValid = await user.comparePassword('demo123');
    console.log('✅ Password verification:', isValid);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createTestUser();
