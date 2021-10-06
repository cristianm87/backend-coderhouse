import mongoose from 'mongoose';

const productosSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    max: 100,
  },
  description: {
    type: String,
    require: true,
    max: 100,
  },
  code: {
    type: String,
    require: true,
    max: 100,
  },
  thumbnail: {
    type: String,
    require: true,
    max: 100,
  },
  price: {
    type: Number,
    require: true,
  },
  stock: {
    type: Number,
    require: true,
  },
  id: {
    type: Number,
    require: true,
    max: 100,
  },
  timestamp: {
    type: String,
    require: true,
    max: 100,
  },
});

export const modelProductos = mongoose.model('productos', productosSchema);
