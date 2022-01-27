import { ioServer } from '../server';
import { normalizedData } from './chatNormalizeController';

const ioSocketMessages = async () => {
  try {
    ioServer.sockets.emit('message-from-server', await normalizedData);
  } catch (error) {
    console.error('initializeMessages()', error);
  }
};

export default ioSocketMessages;
