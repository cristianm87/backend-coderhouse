import { ioServer } from '../server';
import initializeProducts from './productsSocketIoEmitController';
import { initializeNormalizedMessages } from './chatNormalizeController';

//////////// SOCKET IO ////////////

export const socketIoInit = () => {
  ioServer.on('connection', async _socket => {
    //console.log('Un cliente se ha conectado');
    await initializeProducts();
    await initializeNormalizedMessages();
  });
};

export default socketIoInit;
