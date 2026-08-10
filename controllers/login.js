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

    // 2. Comparamos la contraseña ingresada con la contraseña encriptada (hash)
    const isCorrect = await bcrypt.compare(password, userExist.passwordHash);
    if (!isCorrect) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // 3. Creamos la información que guarda en el token (payload)
    const userForToken = {
      id: userExist._id
    };

    // 4. Firmamos el token con la clave secreta
    const accessToken = jwt.sign(
      userForToken, 
      process.env.ACCESS_TOKEN_SECRET || 'secreto_temporal', 
      { expiresIn: '1d' }
    );

    // 5. Guardamos el token en una cookie del navegador
    res.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // expira en 1 día 
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true // seguridad para que no sea leída por JS en el navegador
    });

    return res.status(200).json({ message: 'Success' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = loginRouter;