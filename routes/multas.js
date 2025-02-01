const express = require('express');
const router = express.Router();
const Multa = require('../models/multas');
const Notificacion = require('../models/notificacionesxd'); // Asegúrate de requerir el modelo de Notificacion

router.use(express.json());

router.post('/', async (req, res) => {
    const { cantidad, departamento, torre, motivo } = req.body;

    console.log('Datos recibidos:', req.body);

    if (!cantidad || !departamento || !torre || !motivo) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (typeof cantidad !== 'number') {
        return res.status(400).json({ message: 'El monto debe ser un número' });
    }

    try {
        const nuevaMulta = new Multa({
            cantidad,
            departamento,
            torre,
            motivo
        });

        const nuevaNotificacion = new Notificacion({
            cantidad,
            departamento,
            torre,
            motivo
        });

        await nuevaMulta.save();
        await nuevaNotificacion.save();

        res.status(201).json({ message: 'Multa y notificación registradas exitosamente', multa: nuevaMulta, notificacion: nuevaNotificacion });
    } catch (error) {
        console.error('Error al registrar la multa y notificación:', error);
        res.status(500).json({ message: 'Error al registrar la multa y notificación', error: error.message });
    }
});

router.get('/getmultas', async (req, res) => {
    try {
        const multas = await Multa.find();
        res.status(200).json(multas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las multas', error });
    }
});

router.get('/m/:departamento/:torre/', async (req, res) => {
    const { departamento, torre } = req.params;
    console.log('departamento:', departamento);
    console.log('torre:', torre);
    try {
        // Busca todas las multas que coincidan con torre y apartamento
        const multas = await Multa.find({ departamento, torre });
        
        if (multas.length > 0) {
            res.status(200).json(multas);
        } else {
            res.status(404).json({ message: 'No se encontraron multas para los parámetros especificados' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las multas', error });
    }
});




module.exports = router;
