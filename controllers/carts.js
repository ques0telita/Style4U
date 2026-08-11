// const cartRouter = require('express').Router();
// const UserCart = require('../models/userCart');

// // Endpoint para verificar sesión y obtener el carrito del usuario
// cartRouter.get('/me', async (req, res) => {
//   try {
//     // Leemos el token desde las cookies creadas en el login
//     const token = req.cookies.token; 

//     if (!token) {
//       return res.status(401).json({ isLoggedIn: false, message: 'No autenticado' });
//     }

//     // Si tu middleware verifica el token y adjunta el id del usuario (ej: req.userId):
//     // const cart = await UserCart.findOne({ userId: req.userId });

//     return res.status(200).json({
//       isLoggedIn: true,
//       // cart: cart ? cart.items : []
//     });
//   } catch (error) {
//     return res.status(500).json({ error: 'Error del servidor' });
//   }
// });

// module.exports = cartRouter;

const cartRouter = require('express').Router();
const { userExtractor } = require('../middleware/auth');

// Esta ruta responde a GET /api/cart
cartRouter.get('/', userExtractor, async (req, res) => {
  // req.user ya debería ser inyectado por userExtractor
  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  return res.status(200).json({ cart: req.user.cart || [] });
});

module.exports = cartRouter;