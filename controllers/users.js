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
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ error: "El correo ya está registrado" });
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
    return res.status(201).json({ message: "Usuario creado y verificado exitosamente" });
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
    return res.status(201).json("Usuario creado, verifica tu correo");
  } catch (err) {
    console.error("Error while sending mail:", err);
    return res.status(201).json("Usuario creado, pero hubo un problema al enviar el correo de verificación.");
  }
});

// --- ENDPOINT PARA CONFIRMAR EL CORREO CLICKEADO ---
usersRouter.patch("/:id/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const id = decodedToken.id;

    await User.findByIdAndUpdate(id, { verified: true });
    return res.status(200).json("Correo verificado correctamente");
  } catch (error) {
    const id = req.params.id;
    const { email } = await User.findById(id);

    const token = jwt.sign(
      { id: id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    await sendVerificationEmail(email, id, token);

    return res.status(400).json({ error: "Token inválido o expirado. Se ha enviado un nuevo correo de verificación." });
  }
});

module.exports = usersRouter;