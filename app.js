// ==========================================
// 1. DEPENDENCIAS E IMPORTACIONES
// ==========================================
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const { MONGO_URI } = require('./config');

// ==========================================
// 2. MIDDLEWARES DE LA APLICACIÓN
// ==========================================
app.use(cors());
app.use(cookieParser());
app.use(morgan('dev'));

// Prevenir caché de archivos
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

// Configuración de límites para manejar imágenes Base64 grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// ==========================================
// 3. CONEXIÓN A MONGO DB
// ==========================================
(async () => {
  try {
    const uri = MONGO_URI || process.env.MONGO_URI_TEST || process.env.MONGO_URI_PROD;
    if (uri) {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
    } else {
      console.warn('⚠️ No MongoDB URI configured in environment variables.');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
})();

// ==========================================
// 4. ARCHIVOS ESTÁTICOS Y VISTAS HTML
// ==========================================
app.use('/catalogMan', express.static(path.resolve('views', 'catalogMan')));
app.use('/catalogWoman', express.static(path.resolve('views', 'catalogWoman')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/checkout', express.static(path.resolve('views', 'checkout')));
app.use('/media', express.static(path.resolve('views', 'media')));
app.use('/components', express.static(path.resolve('views', 'components')));
app.use('/', express.static(path.resolve('views', 'home')));

// ==========================================
// 5. RUTAS Y CONTROLADORES DE LA API
// ==========================================
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const cartRouter = require('./controllers/carts');
const productsRouter = require('./controllers/product');

app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/cart', cartRouter);
app.use('/api/logout', logoutRouter);

// Redirección directa para emails de verificación
app.get('/verify/:id/:token', (req, res) => {
  res.redirect(`/api/users/verify/${req.params.id}/${req.params.token}`);
});

module.exports = app;