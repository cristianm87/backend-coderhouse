import mongoose from 'mongoose';

const mensajesSchema = new mongoose.Schema({
  author: {
    type: String,
    require: true,
    max: 100,
  },
  text: {
    type: String,
    require: true,
    max: 100,
  },
});

export const modelMensajes = mongoose.model('mensajes', mensajesSchema);