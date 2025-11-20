// Quick script to update user role in database
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function updateUserRole() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Get email from command line: node updateUserRole.js your@email.com volunteer
    const email = process.argv[2];
    const newRole = process.argv[3] || 'volunteer';
    
    if (!email) {
      console.log('\nUsage: node updateUserRole.js <email> <role>');
      console.log('Example: node updateUserRole.js user@example.com volunteer');
      console.log('\nRoles: user, volunteer, admin');
      process.exit(1);
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`❌ User with email "${email}" not found`);
      process.exit(1);
    }
    
    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`Current role: ${user.role}`);
    
    user.role = newRole;
    await user.save();
    
    console.log(`✅ Updated role to: ${newRole}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

updateUserRole();
