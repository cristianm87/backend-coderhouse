import express from 'express';
const app = express();
const mensajesRouter = express.Router();

import saveMessages from '../controllers/chatController';
//PATH
const pathGuardarMensajes = '/guardar';
// ENDPOINTS
mensajesRouter.post(pathGuardarMensajes, saveMessages);

export default mensajesRouter;
