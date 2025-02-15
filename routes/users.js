const express = require('express');
const User = require('../models/user');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

// Obtener todos los usuarios (PROTEGIDO)
router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Actualizar usuario (PROTEGIDO)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findById(req.params.id);
  
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
  
        // Actualizar solo los campos proporcionados
        if (username) user.username = username;
        if (password) user.password = password; // Se activará el hash en el esquema
  
        await user.save();
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (err) {
        res.status(400).json({ error: 'Error al actualizar usuario' });
    }
});

// Eliminar usuario (PROTEGIDO)
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;
