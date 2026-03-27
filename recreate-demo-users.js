const mongoose = require('mongoose');
const User = require('./src/models/User');
const Home = require('./src/models/Home');

async function recreateDemoUsers() {
  try {
    await mongoose.connect('mongodb+srv://appuser:Shardul_2677@cluster0.t4mejj3.mongodb.net/?appName=Cluster0');
    console.log('Connected to MongoDB Atlas');
    
    // Get homes
    const homes = await Home.find({ name: { $regex: /Sunshine|Golden|Peaceful/ } });
    console.log('Found homes:', homes.map(h => h.name));
    
    // Delete existing demo users
    await User.deleteMany({ email: { $regex: /demo/ } });
    console.log('🗑️ Deleted existing demo users');
    
    // Create fresh demo users
    const demoUsers = [
      {
        name: 'Super Admin',
        email: 'superadmin@demo.com',
        password: 'demo123',
        role: 'superadmin',
        homeId: [] // No home for superadmin
      },
      {
        name: 'Admin Alice',
        email: 'admin.a@demo.com',
        password: 'demo123',
        role: 'admin',
        homeId: [homes.find(h => h.name.includes('Sunshine'))._id]
      },
      {
        name: 'Admin Bob',
        email: 'admin.b@demo.com',
        password: 'demo123',
        role: 'admin',
        homeId: [homes.find(h => h.name.includes('Golden'))._id]
      },
      {
        name: 'Volunteer X',
        email: 'volunteer.x@demo.com',
        password: 'demo123',
        role: 'volunteer',
        homeId: [
          homes.find(h => h.name.includes('Sunshine'))._id,
          homes.find(h => h.name.includes('Golden'))._id
        ]
      },
      {
        name: 'Volunteer Y',
        email: 'volunteer.y@demo.com',
        password: 'demo123',
        role: 'volunteer',
        homeId: [homes.find(h => h.name.includes('Peaceful'))._id]
      }
    ];
    
    for (const userData of demoUsers) {
      const user = await User.create(userData);
      console.log(`✅ Created: ${user.email} (${user.role})`);
      
      // Test password immediately
      const isValid = await user.comparePassword('demo123');
      console.log(`   Password test: ${isValid}`);
    }
    
    console.log('\n🎉 All demo users recreated successfully!');
    console.log('\n📋 LOGIN CREDENTIALS:');
    console.log('Super Admin: superadmin@demo.com / demo123');
    console.log('Admin A: admin.a@demo.com / demo123');
    console.log('Admin B: admin.b@demo.com / demo123');
    console.log('Volunteer X: volunteer.x@demo.com / demo123');
    console.log('Volunteer Y: volunteer.y@demo.com / demo123');
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

recreateDemoUsers();
