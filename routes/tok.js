const express = require('express');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const Token = require('../models/token');
require('dotenv').config();

router.post('/', async (req, res) => {
    const { token } = req.body;
    
    try {
        const newToken = new Token({ token });
        await newToken.save();
        res.status(201).json({ message: 'Token registrado exitosamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar token' });
    }
}
);

module.exports = router;