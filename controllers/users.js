const usersRouter = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Importamos el validador y la función del correo desde utils
const { validateEmail } = require("../utils/emailValidator");
const sendVerificationEmail = require("../utils/mailer");

const SECRET = process.env.ACCESS_TOKEN_SECRET || "secreto_temporal";

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
    role: "user"
  });

  const savedUser = await newUser.save();

  if (savedUser.verified) {
    return res.status(201).json({ message: "User created and verified successfully.", verified: true });
  }

  // RESPALDO: Enviar correo de verificación si la API no lo verificó automáticamente
  const token = jwt.sign(
    { id: savedUser._id },
    SECRET,
    { expiresIn: "1h" }
  );

  try {
    const info = await sendVerificationEmail(savedUser.email, savedUser.id, token);
    console.log("Message sent: %s", info.messageId);
    return res.status(201).json({ message: "User created, please verify your email.", verified: false });
  } catch (err) {
    console.error("Error while sending mail:", err);
    return res.status(201).json({ message: "User created, but failed to send verification email. Please contact support.", verified: false });
  }
});

// --- ENDPOINT PARA CONFIRMAR EL CORREO (GET desde navegador o PATCH desde API) ---
const handleEmailVerification = async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, SECRET);
    const id = decodedToken.id;

    await User.findByIdAndUpdate(id, { verified: true });
    return res.status(200).send(`
      <html>
        <head><title>Email Verified</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h2 style="color: #10B981;">Email verified successfully!</h2>
          <p>You can now log in to your Style4U account.</p>
          <a href="/login" style="display: inline-block; padding: 10px 20px; background: black; color: white; border-radius: 8px; text-decoration: none; font-weight: bold;">Go to Login</a>
        </body>
      </html>
    `);
  } catch (error) {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      if (user) {
        const token = jwt.sign({ id: id }, SECRET, { expiresIn: "1h" });
        await sendVerificationEmail(user.email, id, token);
      }
    } catch (err) {
      console.error("Error sending replacement verification email:", err);
    }

    return res.status(400).json({ error: "Invalid or expired token. A new verification email has been sent if the user exists." });
  }
};

usersRouter.get("/verify/:id/:token", handleEmailVerification);
usersRouter.patch("/:id/:token", async (req, res) => {
  try {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, SECRET);
    const id = decodedToken.id;

    await User.findByIdAndUpdate(id, { verified: true });
    return res.status(200).json({ message: "Successfully verified email" });
  } catch (error) {
    const id = req.params.id;
    try {
      const user = await User.findById(id);
      if (user) {
        const token = jwt.sign({ id: id }, SECRET, { expiresIn: "1h" });
        await sendVerificationEmail(user.email, id, token);
      }
    } catch (err) {
      console.error("Error sending replacement email:", err);
    }
    return res.status(400).json({ error: "Invalid or expired token. A new verification email has been sent." });
  }
});

// Ruta /api/users/me para validar la cookie activa
usersRouter.get('/me', async (req, res) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ error: 'No token provided.' });
    }

    const decodedToken = jwt.verify(token, SECRET);

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'user'
    });

  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

module.exports = usersRouter;