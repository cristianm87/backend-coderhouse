import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    max: 100,
  },
  password: {
    type: String,
    require: true,
    max: 100,
  },
  nombre: {
    type: String,
    require: true,
    max: 100,
  },
  direccion: {
    type: String,
    require: true,
    max: 100,
  },
  edad: {
    type: Number,
    require: true,
    max: 100,
  },
  telefono: {
    type: String,
    require: true,
  },
  avatar: {
    type: String,
    require: true,
    max: 100,
  },
});

export const modelLogin = mongoose.model('login', loginSchema);
