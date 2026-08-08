// IMPORTACIONES
const loginRouter = require('express').Router(); // importa el framework "express" y crea un enrutador para manejar las rutas de login
const User = require('../models/user'); // importa el modelo de usuario para poder hacer consultas en la base de datos
const bcrypt = require('bcrypt'); // importa "bcrypt" para comparar las contraseñas de forma segura (encriptadas)
const jwt = require('jsonwebtoken'); // importa "jsonwebtoken" para crear tokens de acceso (JWT) firmados
const { request } = require('../app'); // extrae el objeto "request" del archivo app (si es necesario para la app)

// RUTA POST PARA EL LOG IN
// define una ruta "post" en la raíz ('/') que maneja peticiones asincronas (async/await)
loginRouter.post('/', async (req, res) => {

    // extrae el email y el password que el usuario envió desde el formulario/cliente
    const { email, password } = req.body;

    // busca en la base de datos un usuario que coincida con el email ingresado
    const userExist = await User.findOne({ email });

    // Si el usuario NO existe (findOne devuelve null), detiene la ejecución y responde con error 400
    if (!userExist) {
        return res.status(400).json({ error: 'email o contraseña invalidos' });
    }
    // si el usuario existe pero aun no ha verificado su cuenta/email, detiene el flujo y lanza error
    if (!userExist.verified) {
        return res.status(400).json({ error: 'email no verificado' });
    }
    // compara la contraseña en texto plano con la contraseña encriptada (hash) guardada en la base de datos
    const isCorrect = await bcrypt.compare(password, userExist.passwordHash);

    // si las contraseñas NO coinciden, detiene la ejecucion y responde con error 400
    // posdata: se usa el mismo mensaje que arriba por seguridad (para no dar pistas a atacantes)
    if (!isCorrect) {
        return res.status(400).json({ error: 'email o contrasena invalidos' });
    }

    // CREACION Y FIRMA DEL TOKEN (JWT)
    // define los datos del usuario que queremos guardar dentro del token (en este caso su ID)
    const userForToken = {
        id: userExist.id,
    }
    // genera y firma el JWT usando los datos del usuario, una clave secreta del servidor y expira en 1 día
    const accessToken = jwt.sign(userForToken, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
    });

    // RESPUESTA AL CLIENTE (COOKIE)
    // guarda el token generado en una cookie del navegador llamada 'accessToken'
    res.cookie('acces_token', accessToken, {
        // establece la fecha de expiracion de la cookie para dentro de 24 horas (en milisegundoss)
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),

        // esto es seguridad... si esta en produccion, obliga a que la cookie viaje a traves de conexiones seguras HTTPS
        secure: process.env.NODE_ENV === 'production',

        // otra cosita de seguridad... Evita que el codigo JS del cliente (como scripts maliciosos XSS) pueda acceder a la cookie
        httpOnly: true
    });
    // envia un estado HTTP 200 al cliente para avisar que el inicio de sesion fue exitoso
    return res.sendStatus(200);

});
// exporta el enrutador
module.exports = loginRouter;
