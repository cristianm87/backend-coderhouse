import mongoose from 'mongoose';

const loginSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    max: 100,
  },
  password: {
    type: String,
    require: true,
    max: 100,
  },
});

export const modelLogin = mongoose.model('login', loginSchema);
