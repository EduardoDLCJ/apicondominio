const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Ajusta el path según tu modelo
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { telefono, contrasena } = req.body;
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

    // Generar token JWT
    const token = jwt.sign(
      { id: user._id, telefono: user.telefono, tipoUsuario: user.tipoUsuario,
        torre: user.torre, departamento: user.departamento
      }, // Datos en el token
      process.env.JWT_SECRET, // Clave secreta desde .env
      { expiresIn: '2h' } // Expira en 2 horas
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token, user });
  } catch (err) {
    console.error('Error en /login:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;
