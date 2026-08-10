const logoutRouter = require('express').Router();

logoutRouter.get('/', (req, res) => {
  // Limpiamos la cookie que guardó el login
  res.clearCookie('accessToken');
  return res.status(200).json({ message: 'Session succesfuly close.' });
});

module.exports = logoutRouter;
