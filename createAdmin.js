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
      // Si el usuario ya existe, actualizamos el rol a admin Y reseteamos la contraseña
      existingUser.role = 'admin';
      existingUser.passwordHash = await bcrypt.hash('Password123.', 10);
      await existingUser.save();
      console.log('✅ This user already exists — role set to admin and password reset to Password123.');
    } else {
      // Si no existe, lo creamos desde cero
      const passwordHash = await bcrypt.hash('Password123.', 10);
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