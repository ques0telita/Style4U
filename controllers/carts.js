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
const UserCart = require('../models/userCart');

// GET /api/cart - Fetch user's cart items
cartRouter.get('/', userExtractor, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Token missing or invalid' });
    }

    let userCart = await UserCart.findOne({ user: req.user._id });
    if (!userCart) {
      userCart = new UserCart({ user: req.user._id, items: [] });
      await userCart.save();
    }

    return res.status(200).json({ cart: userCart.items || [] });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching cart', details: error.message });
  }
});

// POST /api/cart - Sync or save user's cart items
cartRouter.post('/', userExtractor, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Token missing or invalid' });
    }

    const { items } = req.body;
    let userCart = await UserCart.findOne({ user: req.user._id });

    if (!userCart) {
      userCart = new UserCart({ user: req.user._id, items: items || [] });
    } else {
      userCart.items = items || [];
    }

    await userCart.save();
    return res.status(200).json({ cart: userCart.items });
  } catch (error) {
    return res.status(500).json({ error: 'Error saving cart', details: error.message });
  }
});

module.exports = cartRouter;