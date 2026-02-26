// Seed script to create default homes
// Run with: node seed-homes.js

const mongoose = require('mongoose');
require('dotenv').config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const Home = require('./src/models/Home');

  const homes = [
    { name: 'Home A - Downtown', address: '123 Main St, Downtown', contact: '555-0101' },
    { name: 'Home B - Uptown', address: '456 Oak Ave, Uptown', contact: '555-0102' },
    { name: 'Home C - Suburbs', address: '789 Pine Rd, Suburbs', contact: '555-0103' },
    { name: 'Default Home', address: '', contact: '' }
  ];

  for (const home of homes) {
    await Home.findOneAndUpdate(
      { name: home.name },
      home,
      { upsert: true, new: true }
    );
    console.log(`Created/updated: ${home.name}`);
  }

  await mongoose.disconnect();
  console.log('Seed completed');
}

seed().catch(console.error);
