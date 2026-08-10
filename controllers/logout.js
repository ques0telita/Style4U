const logoutRouter = require('express').Router();

logoutRouter.get('/', (req, res) => {
  // Limpiamos la cookie que guardó el login
  res.clearCookie('accessToken');
  return res.status(200).json({ message: 'Session succesfuly close.' });
});

module.exports = logoutRouter;
// El Logout funciona anulando la cookie de autenticación. 
// Cuando el usuario hace clic en el botón de Logout en el frontend, 
// enviamos una petición GET a /api/logout. El servidor ejecuta res.clearCookie('accessToken'), 
// lo que elimina el token guardado en el navegador. Luego, el frontend redirige a la vista de login y, 
// como la cookie ya no existe, el sistema vuelve a mostrar el estado no autenticado.