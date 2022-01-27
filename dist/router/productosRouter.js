"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var productosRouter = express_1.default.Router();
var productosController_1 = require("../controllers/productosController");
var vistaProductosController_1 = require("../controllers/vistaProductosController");
//PATHS
var pathListar = '/listar';
var pathListarPorId = '/listar/:id';
var pathAgregar = '/agregar';
var pathUpdate = '/actualizar/:id';
var pathDelete = '/borrar/:id';
var pathBuscarNombre = '/filtrar-nombre';
var pathBuscarPrecio = '/filtrar-precio';
var pathVistaProductos = '/vista';
// ENDPOINTS
productosRouter.get(pathListar, productosController_1.getProductsController);
productosRouter.get(pathListarPorId, productosController_1.getProductByIdController);
productosRouter.post(pathAgregar, productosController_1.insertProductController);
productosRouter.put(pathUpdate, productosController_1.updateProductController);
productosRouter.delete(pathDelete, productosController_1.deleteProductController);
productosRouter.post(pathBuscarNombre, vistaProductosController_1.filterByNameController);
productosRouter.post(pathBuscarPrecio, vistaProductosController_1.filterByPriceController);
productosRouter.get(pathVistaProductos, vistaProductosController_1.getProductsFilteredController);
exports.default = productosRouter;
