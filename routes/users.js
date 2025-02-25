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
router.post('/cambiarpass', verifyToken, async (req, res) => {
    try {
        const { newPassword, logoutAllDevices } = req.body;
        const user = await User.findById(req.user.id);
  
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
  
        user.contrasena = newPassword; // Se activará el hash en el esquema
  
        await user.save();

        if (logoutAllDevices) {
            user.token = ""; // Eliminar todos los tokens del usuario
            await user.save();
            return res.status(204).json({ message: 'Contraseña cambiada y tokens eliminados exitosamente' });
        }

        res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
    } catch (err) {
        res.status(400).json({ error: 'Error al cambiar la contraseña' });
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
