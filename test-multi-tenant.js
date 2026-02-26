// Simple test to verify multi-tenancy
// Run with: node test-multi-tenant.js

const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = require('./src/models/User');
  const Resident = require('./src/models/Resident');
  const Visit = require('./src/models/Visit');
  const Donation = require('./src/models/Donation');
  const Gallery = require('./src/models/Gallery');

  // Create two users with different homeIds
  const user1 = await User.create({
    name: 'Admin Home A',
    email: 'admin-a@test.com',
    password: '123456',
    role: 'admin',
    homeId: 'home-a'
  });

  const user2 = await User.create({
    name: 'Admin Home B',
    email: 'admin-b@test.com',
    password: '123456',
    role: 'admin',
    homeId: 'home-b'
  });

  // Create residents for each home
  const residentA = await Resident.create({
    name: 'Resident A1',
    age: 70,
    gender: 'male',
    emergencyContact: { name: 'Contact A', phone: '111' },
    homeId: 'home-a'
  });

  const residentB = await Resident.create({
    name: 'Resident B1',
    age: 75,
    gender: 'female',
    emergencyContact: { name: 'Contact B', phone: '222' },
    homeId: 'home-b'
  });

  // Create visits for each home
  await Visit.create({
    resident: residentA._id,
    volunteer: user1._id,
    visitDate: new Date(),
    homeId: 'home-a'
  });

  await Visit.create({
    resident: residentB._id,
    volunteer: user2._id,
    visitDate: new Date(),
    homeId: 'home-b'
  });

  // Create donations for each home
  await Donation.create({
    donorName: 'Donor A',
    amount: 100,
    homeId: 'home-a'
  });

  await Donation.create({
    donorName: 'Donor B',
    amount: 200,
    homeId: 'home-b'
  });

  // Create gallery images for each home
  await Gallery.create({
    url: 'https://example.com/a.jpg',
    homeId: 'home-a'
  });

  await Gallery.create({
    url: 'https://example.com/b.jpg',
    homeId: 'home-b'
  });

  // Test isolation
  console.log('=== Home A ===');
  console.log('Residents:', (await Resident.find({ homeId: 'home-a' })).map(r => r.name));
  console.log('Visits:', (await Visit.find({ homeId: 'home-a' })).length);
  console.log('Donations:', (await Donation.find({ homeId: 'home-a' })).map(d => d.donorName));
  console.log('Gallery:', (await Gallery.find({ homeId: 'home-a' })).map(g => g.url));
  
  console.log('\n=== Home B ===');
  console.log('Residents:', (await Resident.find({ homeId: 'home-b' })).map(r => r.name));
  console.log('Visits:', (await Visit.find({ homeId: 'home-b' })).length);
  console.log('Donations:', (await Donation.find({ homeId: 'home-b' })).map(d => d.donorName));
  console.log('Gallery:', (await Gallery.find({ homeId: 'home-b' })).map(g => g.url));
  
  await mongoose.disconnect();
  console.log('\nTest completed. Each home should only see its own data.');
}

test().catch(console.error);
