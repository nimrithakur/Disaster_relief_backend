require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const users = await User.find({});
    console.log(`Found ${users.length} user(s):\n`);
    
    for (const user of users) {
      console.log(`- ${user.email} (${user.name}) - Current role: ${user.role}`);
      if (user.role === 'user') {
        user.role = 'volunteer';
        await user.save();
        console.log(`  ✅ Updated to: volunteer\n`);
      }
    }
    
    console.log('\n✅ All users with "user" role have been upgraded to "volunteer"');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixAllUsers();
