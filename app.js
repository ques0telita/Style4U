// ==========================================
// IMPORTAR DEPENDENCIAS
// ==========================================
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logoutRouter = require('./controllers/logout');
const cartRouter = require('./controllers/carts');
const productsRouter = require('./controllers/products');
const { PAGE_URL } = require('./config');
const { MONGO_URI } = require('./config');
const { userExtractor } = require('./middleware/auth');
const router = express.Router();

// ==========================================
// CONEXION A LA BASE DE DATOS
// ==========================================
(async () => {
   
    try {
        await mongoose.connect(process.env.MONGO_URI_TEST)
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log(error);
    }
})();

// ==========================================
// MIDDLEWARES GLOBALES (Confi)
// ==========================================
app.use(cors());
app.use(express.json()); // permite que el servidor pueda recibir y procesar solicitudes con datos en formato json
app.use(cookieParser()); // permite acceder a las cookies en las solicitudes
app.use(morgan('tiny')); // registra las peticiones en la terminal

// ==========================================
// RUTAS PARA LAS VISTAS (HTML)
// ==========================================

app.use('/catalogMan', express.static(path.resolve('views', 'catalogMan')));
app.use('/catalogWoman', express.static(path.resolve('views', 'catalogWoman')));
app.use('/signup', express.static(path.resolve('views', 'signup')));
app.use('/login', express.static(path.resolve('views', 'login')));
app.use('/checkout', express.static(path.resolve('views', 'checkout')));
app.use('/media', express.static(path.resolve('views', 'media')));
app.use('/components', express.static(path.resolve('views', 'components')));

// la raiz al final
app.use('/', express.static(path.resolve('views', 'home')));

// ==========================================
// RUTAS DEL BACKEND (APIs)
// ==========================================
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/cart', cartRouter);
app.use('/api/products', productsRouter);
app.use('/api/logout', logoutRouter);

//============================================
// EVITAR CACHEO DE ESTATICOS
//============================================
app.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});


///////////////////////////
// INICIAMOS SERVIDOR
///////////////////////////
console.log(`Servidor corriendo en ${PAGE_URL}`);

// PARA AJUSTAR EL TAMANO DE PRODUCTO
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

module.exports = app;