const logoutRouter = require("express").Router();


logoutRouter.get("/", async (req, res) => {
  const cookie = req.cookies;
  
  // CORRECCIÓN: usa 'acces_token' (todo en minúsculas)
  if(!cookie?.acces_token){ 
    return res.sendStatus(401);
  }

  // CORRECCIÓN: usa 'acces_token' aquí también
  res.clearCookie('acces_token', {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  });

  return res.sendStatus(204);
});
module.exports = logoutRouter;