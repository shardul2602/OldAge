const mongoose = require('mongoose');
const User = require('./src/models/User');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/oldage-assistance');
    
    const demoUsers = await User.find({ email: { $regex: 'demo' } });
    console.log('Demo users found:');
    demoUsers.forEach(u => console.log(`- ${u.email} (role: ${u.role})`));
    
    if (demoUsers.length === 0) {
      console.log('❌ No demo users found! Need to run seeding script.');
    } else {
      console.log('✅ Demo users exist in database');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Database error:', error.message);
  }
}

checkUsers();
