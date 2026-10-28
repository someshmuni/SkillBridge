
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    const email = process.argv[2];
    const password = process.argv[3];

    if (!email || !password) {
      console.error(
        'Usage: node scripts/createAdmin.js <email> <strong-password>'
      );
      process.exitCode = 1;
      return;
    }

    if (password.length < 12) {
      console.error('Password must be at least 12 characters long.');
      process.exitCode = 1;
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);

    const user = await User.findOne({ email });

    if (user) {
      user.role = 'admin';
      await user.save();
      console.log(`Existing user promoted to admin: ${email}`);
    } else {
      await User.create({
        name: 'Admin',
        email,
        password,
        role: 'admin'
      });
      console.log(`Admin created successfully: ${email}`);
    }
  } catch (error) {
    console.error('Admin setup failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect().catch(() => {});
  }
})();
