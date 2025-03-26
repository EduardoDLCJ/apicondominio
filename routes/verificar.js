const express = require("express");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require('../models/user');

const app = express();
app.use(express.json());

const SECRET_KEY = "tu_clave_secreta"; // Usa una clave segura y almacénala en variables de entorno

// Configuración del transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ojjkd27@gmail.com", // Reemplázalo con tu correo
    pass: "ntck hnmd vqgb rapv" // Reemplázalo con tu contraseña o app password
  }
});

router.post("/", async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ error: "Correo electrónico requerido" });
    }

    // Generar token válido por 5 minutos
    const token = jwt.sign({ email: correo }, SECRET_KEY, { expiresIn: "5m" });

    // Link de recuperación de contraseña
    const resetLink = `https://condominioapp.vercel.app/Recuperar?token=${token}`;

    // Configuración del correo con HTML y botón
    const mailOptions = {
      from: "ojjkd27@gmail.com",
      to: correo,
      subject: "Recuperación de contraseña",
      html: `
        <div style="text-align: center; font-family: Arial, sans-serif;">
          <h2>Recuperación de contraseña</h2>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <p>Haz clic en el botón de abajo para continuar:</p>
          <a href="${resetLink}" 
             style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">
            Restablecer contraseña
          </a>
          <p>Este enlace expirará en 5 minutos.</p>
        </div>
      `
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Correo enviado", info });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { token, nuevaContrasena } = req.body;
    console.log("Datos del reset =", req.body);

    if (!token || !nuevaContrasena) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar y decodificar el token
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return res.status(400).json({ error: "Token inválido o expirado" });
    }

    const correo = decoded.email;

    // Buscar el usuario por correo
    const usuario = await User.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Actualizar la contraseña (se hashea automáticamente con el middleware del esquema)
    usuario.contrasena = nuevaContrasena;
    await usuario.save();

    res.json({ success: true, message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});



module.exports = router;
