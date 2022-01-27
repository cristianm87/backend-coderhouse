"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var carritoRouter = express_1.default.Router();
var carritoController_1 = require("../controllers/carritoController");
// PATHS
var pathListar = '/listar';
var pathAgregarPorId = '/agregar/:id';
var pathShoppingCart = '/cart';
var pathCheckOut = '/check-out';
var pathDelete = '/borrar/:id';
// ENDPOINTS
carritoRouter.get(pathListar, carritoController_1.getCartProductsController);
carritoRouter.post(pathAgregarPorId, carritoController_1.cartAddByIdController);
carritoRouter.get(pathShoppingCart, carritoController_1.getCartProductsPage);
carritoRouter.get(pathCheckOut, carritoController_1.getPurchaseDetailsController);
carritoRouter.delete(pathDelete, carritoController_1.deleteProductCartController);
exports.default = carritoRouter;
