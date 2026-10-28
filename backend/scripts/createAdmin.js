require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/skillbridge');
    const email = process.argv[2] || 'admin@skillbridge.com';
    const password = process.argv[3] || 'Admin@123';
    const user = await User.findOne({ email });
    if (user) { user.role = 'admin'; await user.save(); console.log(`Existing user promoted to admin: ${email}`); }
    else { await User.create({ name: 'Admin', email, password, role: 'admin' }); console.log(`Admin created: ${email} / ${password}`); }
  } catch (e) { console.error(e.message); }
  process.exit(0);
})();
