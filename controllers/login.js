const loginRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Ruta para procesar el inicio de sesión
loginRouter.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscamos si el correo existe en la base de datos
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // 2. Comparamos la contraseña ingresada con el hash
    const isCorrect = await bcrypt.compare(password, userExist.passwordHash);
    if (!isCorrect) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // 3. 👈 CAMBIO 1: Incluimos el ROL en la información del token
    const userForToken = {
      id: userExist._id,
      role: userExist.role || 'user'
    };

    // 4. Firmamos el token con la clave secreta
    const accessToken = jwt.sign(
      userForToken, 
      process.env.ACCESS_TOKEN_SECRET || 'secreto_temporal', 
      { expiresIn: '1d' }
    );

    // 5. Guardamos el token en la cookie
    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // expira en 1 día 
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    });

    // 👈 CAMBIO 2: Retornamos los datos básicos del usuario para usarlos en el frontend
    return res.status(200).json({ 
      message: 'Success',
      user: {
        id: userExist._id,
        email: userExist.email,
        name: userExist.name,
        role: userExist.role || 'user'
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = loginRouter;