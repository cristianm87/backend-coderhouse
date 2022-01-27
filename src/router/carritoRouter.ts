import express from 'express';
const app = express();
const carritoRouter = express.Router();
import {
  getCartProductsController,
  cartAddByIdController,
  getCartProductsPage,
  getPurchaseDetailsController,
  deleteProductCartController,
} from '../controllers/carritoController';

// PATHS
const pathListar = '/listar';
const pathAgregarPorId = '/agregar/:id';
const pathShoppingCart = '/cart';
const pathCheckOut = '/check-out';
const pathDelete = '/borrar/:id';
// ENDPOINTS
carritoRouter.get(pathListar, getCartProductsController);
carritoRouter.post(pathAgregarPorId, cartAddByIdController);
carritoRouter.get(pathShoppingCart, getCartProductsPage);
carritoRouter.get(pathCheckOut, getPurchaseDetailsController);
carritoRouter.delete(pathDelete, deleteProductCartController);

export default carritoRouter;
