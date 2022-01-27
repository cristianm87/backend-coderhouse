import { option } from '../server';
import { ioServer } from '../server';
import { dao } from '../server';

export const initializeProducts = async () => {
  if (option === 0) {
    ioServer.sockets.emit('products-from-server', dao.getProductsSync());
  } else {
    try {
      await ioServer.sockets.emit(
        'products-from-server',
        await dao.getProducts()
      );
    } catch (error) {
      console.error('initializeProducts()', error);
    }
  }
};

export default initializeProducts;
