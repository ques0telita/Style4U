const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Importamos el validador y la nueva función del correo desde utils
const { validateEmail } = require("../utils/emailValidator");
const sendVerificationEmail = require("../utils/mailer");

// --- ENDPOINT PARA REGISTRAR USUARIOS ---
usersRouter.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ error: "The email has already been registered." });
  }

  // Variable de control para el estado de verificación
  let isVerified = false;

  // Filtrar el correo con Abstract API
  try {
    const emailCheck = await validateEmail(email);

    if (!emailCheck.valid) {
      return res.status(400).json({ error: emailCheck.error });
    }

    isVerified = true;
  } catch (error) {
    console.error("Bypass de Abstract API por error:", error.message);
    isVerified = false;
  }

  // Encriptar contraseña
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name,
    email,
    passwordHash,
    verified: isVerified,
  });

  const savedUser = await newUser.save();

  if (savedUser.verified) {
    return res.status(201).json({ message: "User created and verified successfully." });
  }

  // RESPALDO: Enviar correo de verificación si la API no lo verificó automáticamente
  const token = jwt.sign(
    { id: savedUser._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  try {
    const info = await sendVerificationEmail(savedUser.email, savedUser.id, token);
    console.log("Message sent: %s", info.messageId);
    return res.status(201).json("User created, verify your email.");
  } catch (err) {
    console.error("Error while sending mail:", err);
    return res.status(201).json("User created, but failed to send verification email. Please contact support.");
  }
});

// --- ENDPOINT PARA CONFIRMAR EL CORREO CLICKEADO ---
usersRouter.patch("/:id/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const id = decodedToken.id;

    await User.findByIdAndUpdate(id, { verified: true });
    return res.status(200).json("Successfully verified email");
  } catch (error) {
    const id = req.params.id;
    const { email } = await User.findById(id);

    const token = jwt.sign(
      { id: id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    await sendVerificationEmail(email, id, token);

    return res.status(400).json({ error: "Invalid or expired token. A new verification email has been sent." });
  }
});

// Ruta /api/users/me para validar la cookie activa
usersRouter.get('/me', async (req, res) => {
  try {
    // Leemos la cookie llamada accessToken
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({ error: 'No token privided.' });
    }

    // Verificamos el token con la clave secreta
    const decodedToken = jwt.verify(
      token, 
      process.env.ACCESS_TOKEN_SECRET || 'secreto_temporal'
    );

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ email: user.email, name: user.name });

  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
});
module.exports = usersRouter;