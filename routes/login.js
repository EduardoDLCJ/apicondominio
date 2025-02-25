const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();

const router = express.Router();

// Función para generar un token JWT
const generarToken = (user, expiresIn) => {
  return jwt.sign(
    { id: user._id, telefono: user.telefono, tipoUsuario: user.tipoUsuario, torre: user.torre, departamento: user.departamento },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

router.post('/', async (req, res) => {
  const { telefono, contrasena, recordar } = req.body; // "recordar" viene del checkbox en frontend
  console.log('telefono:', telefono);

  try {
    const user = await User.findOne({ telefono });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!isMatch) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar tokens
    let token;
    if (recordar) {
      token = generarToken(user, '7d'); // Token de 1 semana si el usuario marcó "Recordar usuario"
    } else {
      token = generarToken(user, '1h'); // Token de 1 hora si el usuario no marcó "Recordar usuario"
    }

    // Asignar el token al usuario si no existe
    if (!user.token) {
      user.token = token;
      await user.save();
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso', token, user });
  } catch (err) {
    console.error('Error en /login:', err);
    res.status(500).json({ error: 'Error en el servidor', err });
  }
});

router.post('/verificar-token', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json({ valido: true, usuario: decoded });
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
});

router.post('/comparar-token', async (req, res) => {
  const { token, userId } = req.body;
  console.log(req.body);

  if (!token || !userId) {
    return res.status(400).json({ error: 'Token y userId son requeridos' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    if (user.token !== token) {
      return res.status(401).json({ error: 'Token inválido o no coincide' });
    }

    res.status(200).json({ message: 'Token válido y coincide' });
  } catch (error) {
    console.error('Error en /comparar-token:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


module.exports = router;
