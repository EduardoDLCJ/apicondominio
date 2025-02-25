const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true }, // Nombre completo
  apellido: { type: String, required: true }, // Apellido
  //email: { type: String, required: true, unique: true },
  telefono: { type: String, required: true }, // Telefono
  departamento: { type: String, required: false }, // Departamento
  torre : { type: String, required: false }, // Torre
  tipoUsuario: { type: String, required: true }, // Tipo de usuario
  //username: { type: String, required: true, unique: true }, // Nombre de usuario único
  contrasena: { type: String, required: true }, // Contraseña
  token: { type: String, default: null }, // Token de refresco
}, { timestamps: true }); // Agrega timestamps para `createdAt` y `updatedAt`

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('contrasena')) return next(); 
  const salt = await bcrypt.genSalt(10);
  this.contrasena = await bcrypt.hash(this.contrasena, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
