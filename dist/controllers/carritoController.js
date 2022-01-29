"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPurchaseDetailsController = exports.getCartProductsPage = exports.deleteProductCartController = exports.cartAddByIdController = exports.getCartProductsController = void 0;
var server_1 = require("../server");
var emailingAndMessagingController_1 = require("./emailingAndMessagingController");
var server_2 = require("../server");
var vistaMainController_1 = require("./vistaMainController");
var getCartProductsController = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var cartProducts, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cartProducts = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (!(server_1.option === 0)) return [3 /*break*/, 2];
                cartProducts = server_2.dao.getCartProductsSync();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, server_2.dao.getCartProducts()];
            case 3:
                cartProducts = _a.sent();
                _a.label = 4;
            case 4:
                if (cartProducts.length < 1) {
                    response.status(404).send('El carrito esta vacio');
                }
                else {
                    response.status(200).send(JSON.stringify({
                        idCarrito: server_2.dao.getCartId(),
                        timestampCarrito: server_2.dao.getCartTimestamp(),
                        ProductosEnElCarrito: cartProducts,
                    }));
                }
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.getCartProductsController = getCartProductsController;
var cartAddByIdController = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, productToAdd, productToAddUpdated, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paramId = request.params.id;
                productToAdd = {};
                productToAddUpdated = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (!(server_1.option === 0 || server_1.option === 5)) return [3 /*break*/, 2];
                productToAdd = server_2.dao.getProductByIdSync(paramId);
                console.log('ProductToAdd', productToAdd);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, server_2.dao.getProductById(paramId)];
            case 3:
                productToAdd = _a.sent();
                productToAddUpdated = {
                    _id: productToAdd._id,
                    name: productToAdd.name,
                    description: productToAdd.description,
                    code: productToAdd.code,
                    thumbnail: productToAdd.thumbnail,
                    price: productToAdd.price,
                    // cantidad: cantidad,
                };
                console.log('ProductToAdd', productToAdd);
                _a.label = 4;
            case 4:
                if (productToAdd === undefined || Object.keys(productToAdd).length === 0) {
                    response.status(404).send('Producto no encontrado');
                }
                else {
                    server_2.dao.addToCart(productToAddUpdated);
                    // dao.addToCart(productToAdd);
                    response
                        .status(200)
                        .send(JSON.stringify({ productoAgregado: productToAdd }));
                }
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.log(error_2);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.cartAddByIdController = cartAddByIdController;
var deleteProductCartController = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, productToDelete;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paramId = request.params.id;
                productToDelete = {};
                if (!(server_1.option === 0 || server_1.option === 5)) return [3 /*break*/, 1];
                productToDelete = server_2.dao.getCartProductByIdSync(paramId);
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, server_2.dao.getCartProductById(paramId)];
            case 2:
                productToDelete = _a.sent();
                _a.label = 3;
            case 3:
                if (productToDelete === undefined ||
                    Object.keys(productToDelete).length === 0) {
                    response.status(404).send('Producto no encontrado');
                }
                else {
                    server_2.dao.deleteProductCart(paramId);
                    response
                        .status(200)
                        .send(JSON.stringify({ productoEliminado: productToDelete }));
                }
                console.log('cartProductById_FromDelete', productToDelete);
                return [2 /*return*/];
        }
    });
}); };
exports.deleteProductCartController = deleteProductCartController;
var getCartProductsPage = function (_request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, detalleDeCompra;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userData = vistaMainController_1.userDataGlobal;
                _a = {
                    userInfo: vistaMainController_1.userDataGlobal
                };
                return [4 /*yield*/, server_2.dao.getCartProducts()];
            case 1:
                detalleDeCompra = (_a.cartProducts = _b.sent(),
                    _a);
                response.status(200).render('cart', { userData: userData, detalleDeCompra: detalleDeCompra });
                return [2 /*return*/];
        }
    });
}); };
exports.getCartProductsPage = getCartProductsPage;
var getPurchaseDetailsController = function (_request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, detalleDeCompra;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userData = vistaMainController_1.userDataGlobal;
                _a = {
                    userInfo: vistaMainController_1.userDataGlobal
                };
                return [4 /*yield*/, server_2.dao.getCartProducts()];
            case 1:
                detalleDeCompra = (_a.cartProducts = _b.sent(),
                    _a);
                (0, emailingAndMessagingController_1.etherealTransporterInit)('Nueva compra!', detalleDeCompra);
                (0, emailingAndMessagingController_1.sendSms)(detalleDeCompra.cartProducts, 'Detalle de la compra', vistaMainController_1.userDataGlobal.telefono);
                (0, emailingAndMessagingController_1.sendWhatapp)(detalleDeCompra);
                response
                    .status(200)
                    .render('check-out', { nombre: userData.nombre, detalleDeCompra: detalleDeCompra });
                return [2 /*return*/];
        }
    });
}); };
exports.getPurchaseDetailsController = getPurchaseDetailsController;
exports.default = {
    getCartProductsController: exports.getCartProductsController,
    cartAddByIdController: exports.cartAddByIdController,
    getCartProductsPage: exports.getCartProductsPage,
    getPurchaseDetailsController: exports.getPurchaseDetailsController,
    deleteProductCartController: exports.deleteProductCartController,
};
