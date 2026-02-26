require('dotenv').config();
const mongoose = require('mongoose');
const Resident = require('./src/models/Resident');
const Home = require('./src/models/Home');

async function fixResidents() {
  await mongoose.connect(process.env.MONGO_URI);
  
  console.log('=== Checking Residents ===');
  const residents = await Resident.find({});
  residents.forEach(r => {
    console.log(`Name: ${r.name}, HomeId: ${r.homeId}`);
  });
  
  console.log('\n=== Checking Homes ===');
  const homes = await Home.find({});
  homes.forEach(h => {
    console.log(`Home: ${h.name}, ID: ${h._id}`);
  });
  
  // Fix residents if needed
  const homeA = await Home.findOne({ name: 'Home A - Downtown' });
  const homeB = await Home.findOne({ name: 'Home B - Uptown' });
  
  if (homeA && homeB) {
    await Resident.updateOne({ name: 'Alice Johnson' }, { homeId: homeA._id });
    await Resident.updateOne({ name: 'Margaret Davis' }, { homeId: homeB._id });
    console.log('\n✅ Updated Alice to Home A, Margaret to Home B');
    
    // Verify the fix
    console.log('\n=== After Fix ===');
    const updatedResidents = await Resident.find({});
    updatedResidents.forEach(r => {
      console.log(`Name: ${r.name}, HomeId: ${r.homeId}`);
    });
  }
  
  mongoose.disconnect();
}

fixResidents().catch(console.error);
