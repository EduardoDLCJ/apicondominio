const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 4002;

const auth = require('./routes/auth');
const registro = require('./routes/registro');
const login = require('./routes/login');
const multas = require('./routes/multas');
const users = require('./routes/users');
const notificaciones = require('./routes/notifi');
const Token = require('./models/token');
const verificar = require('./routes/verificar');
const respaldo = require('./routes/respaldo');

console.log("Mongo URI:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch((error) => console.error('Error conectando a MongoDB:', error));

app.use(cors());
app.use(express.json());

app.use('/', auth);
app.use('/registro', registro);
app.use('/login', login);
app.use('/multas', multas);
app.use('/users', users);
app.use('/notificaciones', notificaciones);
app.use('/token', Token);
app.use('/verificar', verificar);
app.use('/backup', respaldo);

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => console.log(`Servidor escuchando en puerto ${PORT}`));
