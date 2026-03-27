const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const Home = require('./src/models/Home');
const Resident = require('./src/models/Resident');
const Donation = require('./src/models/Donation');
const Visit = require('./src/models/Visit');

async function seedDemoData() {
  try {
    console.log('🌱 Starting multi-tenant demo data seeding...');
    
    // Connect to MongoDB - use environment or fallback
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://appuser:Shardul_2677@cluster0.t4mejj3.mongodb.net/?appName=Cluster0';
    await mongoose.connect(mongoUri);
    
    // Clear existing demo data (optional - comment out if you want to keep existing data)
    // await User.deleteMany({ email: { $regex: /demo/ } });
    // await Home.deleteMany({ name: { $regex: /Demo/ } });
    // await Resident.deleteMany({ name: { $regex: /Demo/ } });
    // await Donation.deleteMany({ donorName: { $regex: /Demo/ } });
    // await Visit.deleteMany({ notes: { $regex: /Demo/ } });
    
    // 1. Create Demo Homes
    console.log('🏠 Creating demo homes...');
    const sunshineHome = await Home.create({
      name: 'Sunshine Senior Home',
      address: '123 Sunshine Blvd, Miami, FL 33101',
      contact: '+1 (305) 555-0101'
    });
    
    const goldenYearsHome = await Home.create({
      name: 'Golden Years Care', 
      address: '456 Golden Ave, Orlando, FL 32801',
      contact: '+1 (407) 555-0202'
    });
    
    const peacefulHavenHome = await Home.create({
      name: 'Peaceful Haven',
      address: '789 Peace St, Tampa, FL 33601', 
      contact: '+1 (813) 555-0303'
    });
    
    console.log(`✅ Created homes: ${sunshineHome.name}, ${goldenYearsHome.name}, ${peacefulHavenHome.name}`);
    
    // 2. Create Demo Users
    console.log('👥 Creating demo users...');
    
    // Super Admin
    const superAdminPassword = await bcrypt.hash('demo123', 10);
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@demo.com',
      password: superAdminPassword,
      role: 'superadmin'
      // No homeId for superadmin
    });
    
    // Admin A (for Sunshine Home)
    const adminAPassword = await bcrypt.hash('demo123', 10);
    const adminA = await User.create({
      name: 'Admin Alice',
      email: 'admin.a@demo.com', 
      password: adminAPassword,
      role: 'admin',
      homeId: [sunshineHome._id]
    });
    
    // Admin B (for Golden Years Home)
    const adminBPassword = await bcrypt.hash('demo123', 10);
    const adminB = await User.create({
      name: 'Admin Bob',
      email: 'admin.b@demo.com',
      password: adminBPassword, 
      role: 'admin',
      homeId: [goldenYearsHome._id]
    });
    
    // Volunteer X (multiple homes)
    const volunteerXPassword = await bcrypt.hash('demo123', 10);
    const volunteerX = await User.create({
      name: 'Volunteer X',
      email: 'volunteer.x@demo.com',
      password: volunteerXPassword,
      role: 'volunteer', 
      homeId: [sunshineHome._id, goldenYearsHome._id] // Multiple homes
    });
    
    // Volunteer Y (single home)
    const volunteerYPassword = await bcrypt.hash('demo123', 10);
    const volunteerY = await User.create({
      name: 'Volunteer Y', 
      email: 'volunteer.y@demo.com',
      password: volunteerYPassword,
      role: 'volunteer',
      homeId: [peacefulHavenHome._id] // Single home
    });
    
    console.log(`✅ Created users: Super Admin, Admin A, Admin B, Volunteer X, Volunteer Y`);
    
    // 3. Create Demo Residents
    console.log('👴 Creating demo residents...');
    
    // Sunshine Home residents
    await Resident.create([
      { name: 'Demo Resident 1', age: 75, gender: 'male', homeId: sunshineHome._id, roomNumber: 'A101', 
        emergencyContact: { name: 'Emergency Contact 1', phone: '+1 (555) 010-0001' } },
      { name: 'Demo Resident 2', age: 82, gender: 'female', homeId: sunshineHome._id, roomNumber: 'A102',
        emergencyContact: { name: 'Emergency Contact 2', phone: '+1 (555) 010-0002' } },
      { name: 'Demo Resident 3', age: 68, gender: 'male', homeId: sunshineHome._id, roomNumber: 'A103',
        emergencyContact: { name: 'Emergency Contact 3', phone: '+1 (555) 010-0003' } }
    ]);
    
    // Golden Years Home residents  
    await Resident.create([
      { name: 'Demo Resident 4', age: 79, gender: 'female', homeId: goldenYearsHome._id, roomNumber: 'B201',
        emergencyContact: { name: 'Emergency Contact 4', phone: '+1 (407) 555-0201' } },
      { name: 'Demo Resident 5', age: 71, gender: 'male', homeId: goldenYearsHome._id, roomNumber: 'B202',
        emergencyContact: { name: 'Emergency Contact 5', phone: '+1 (407) 555-0202' } }
    ]);
    
    // Peaceful Haven residents
    await Resident.create([
      { name: 'Demo Resident 6', age: 85, gender: 'female', homeId: peacefulHavenHome._id, roomNumber: 'C301',
        emergencyContact: { name: 'Emergency Contact 6', phone: '+1 (813) 555-0301' } },
      { name: 'Demo Resident 7', age: 77, gender: 'male', homeId: peacefulHavenHome._id, roomNumber: 'C302',
        emergencyContact: { name: 'Emergency Contact 7', phone: '+1 (813) 555-0302' } }
    ]);
    
    console.log('✅ Created 7 demo residents across 3 homes');
    
    // 4. Create Demo Donations
    console.log('💰 Creating demo donations...');
    
    await Donation.create([
      { donorName: 'Demo Donor 1', amount: 100, method: 'cash', homeId: sunshineHome._id },
      { donorName: 'Demo Donor 2', amount: 250, method: 'bank', homeId: goldenYearsHome._id },
      { donorName: 'Demo Donor 3', amount: 150, method: 'online', homeId: peacefulHavenHome._id }
    ]);
    
    console.log('✅ Created 3 demo donations');
    
    // 5. Create Demo Visits
    console.log('📅 Creating demo visits...');
    
    const volunteerXId = volunteerX._id;
    const volunteerYId = volunteerY._id;
    
    await Visit.create([
      // Volunteer X visits Sunshine Home
      { resident: (await Resident.findOne({ name: 'Demo Resident 1', homeId: sunshineHome._id }))._id, volunteer: volunteerXId, visitDate: new Date(), status: 'completed', homeId: sunshineHome._id, notes: 'Demo visit - Sunshine Home' },
      
      // Volunteer X visits Golden Years Home  
      { resident: (await Resident.findOne({ name: 'Demo Resident 4', homeId: goldenYearsHome._id }))._id, volunteer: volunteerXId, visitDate: new Date(), status: 'scheduled', homeId: goldenYearsHome._id, notes: 'Demo visit - Golden Years Home' },
      
      // Volunteer Y visits Peaceful Haven
      { resident: (await Resident.findOne({ name: 'Demo Resident 6', homeId: peacefulHavenHome._id }))._id, volunteer: volunteerYId, visitDate: new Date(), status: 'completed', homeId: peacefulHavenHome._id, notes: 'Demo visit - Peaceful Haven' }
    ]);
    
    console.log('✅ Created 3 demo visits');
    
    console.log('🎉 Multi-tenant demo data seeding completed!');
    console.log('\n📋 DEMO LOGIN CREDENTIALS:');
    console.log('Super Admin: superadmin@demo.com / demo123');
    console.log('Admin A: admin.a@demo.com / demo123 (Sunshine Home)');  
    console.log('Admin B: admin.b@demo.com / demo123 (Golden Years Home)');
    console.log('Volunteer X: volunteer.x@demo.com / demo123 (Sunshine + Golden Years Homes)');
    console.log('Volunteer Y: volunteer.y@demo.com / demo123 (Peaceful Haven Home)');
    
    await mongoose.disconnect();
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDemoData();
