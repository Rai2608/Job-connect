const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../src/models/User');
const env = require('../src/config/env');

const seedAdmin = async () => {
  const args = process.argv.slice(2);
  let email = '';
  let password = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      email = args[i + 1];
    }
    if (args[i] === '--password' && args[i + 1]) {
      password = args[i + 1];
    }
  }

  if (!email || !password) {
    console.error('Error: Please provide both --email and --password arguments.');
    console.log('Usage: npm run seed:admin -- --email <email> --password <password>');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(env.MONGO_URI);
    console.log('Connected to MongoDB.');

    let adminUser = await User.findOne({ email });
    if (adminUser) {
      console.log(`User ${email} already exists. Updating to Admin and resetting password...`);
      adminUser.password = password;
      adminUser.role = 'admin';
      adminUser.isVerified = true;
      adminUser.isSuspended = false;
      await adminUser.save();
      console.log('Admin account updated successfully.');
    } else {
      console.log(`Creating new Admin account for ${email}...`);
      adminUser = new User({
        fullName: 'System Administrator',
        email,
        password,
        role: 'admin',
        isVerified: true,
        isSuspended: false,
      });
      await adminUser.save();
      console.log('Admin account created successfully.');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error.message);
    process.exit(1);
  }
};

seedAdmin();
