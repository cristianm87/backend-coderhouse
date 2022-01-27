import express from 'express';
const app = express();
const productosRouter = express.Router();
import {
  getProductsController,
  getProductByIdController,
  insertProductController,
  updateProductController,
  deleteProductController,
} from '../controllers/productosController';
import {
  filterByNameController,
  filterByPriceController,
  getProductsFilteredController,
} from '../controllers/vistaProductosController';

//PATHS
const pathListar = '/listar';
const pathListarPorId = '/listar/:id';
const pathAgregar = '/agregar';
const pathUpdate = '/actualizar/:id';
const pathDelete = '/borrar/:id';
const pathBuscarNombre = '/filtrar-nombre';
const pathBuscarPrecio = '/filtrar-precio';
const pathVistaProductos = '/vista';
// ENDPOINTS
productosRouter.get(pathListar, getProductsController);

productosRouter.get(pathListarPorId, getProductByIdController);

productosRouter.post(pathAgregar, insertProductController);

productosRouter.put(pathUpdate, updateProductController);

productosRouter.delete(pathDelete, deleteProductController);

productosRouter.post(pathBuscarNombre, filterByNameController);

productosRouter.post(pathBuscarPrecio, filterByPriceController);

productosRouter.get(pathVistaProductos, getProductsFilteredController);

export default productosRouter;
