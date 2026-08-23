require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const { MONGO_URI } = require('./config');

const createAdminUser = async () => {
  try {
    await mongoose.connect(MONGO_URI); // uso MONGO_URI

    const adminEmail = 'sebastianrcm06@gmail.com';
    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      // Si el usuario ya existe, solo le actualizamos el rol a admin
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('✅ This user is alredy created passing to admin rol.');
    } else {
      // Si no existe, lo creamos desde cero
      const passwordHash = await bcrypt.hash('Sebastian123', 10);
      const adminUser = new User({
        name: 'Admin',
        email: adminEmail,
        passwordHash,
        role: 'admin'
      });
      await adminUser.save();
      console.log('✅ ADMIN user created succesfully.');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating ADMIN user:', error);
  }
};

createAdminUser();