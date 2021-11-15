import mongoose from 'mongoose';

const personaSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    max: 50,
  },
  nombre: {
    type: String,
    require: true,
    max: 50,
  },
  apellido: {
    type: String,
    require: true,
    max: 50,
  },
  edad: {
    type: Number,
    require: true,
    max: 2,
  },
  avatar: {
    type: String,
    require: true,
    max: 50,
  },
});

const authorSchema = new mongoose.Schema({
  author: personaSchema,
  text: String,
  fecha: String,
});

export const modelMensaje = mongoose.model('mensajes', authorSchema);
