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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductController = exports.updateProductController = exports.insertProductController = exports.getProductByIdController = exports.getProductsController = void 0;
var pathMain = '/';
var pathAgregar = '/agregar';
var pathUpdate = '/actualizar/:id';
var pathDelete = '/borrar/:id';
var server_1 = require("../server");
var server_2 = require("../server");
var server_3 = require("../server");
var productsSocketIoEmitController_1 = __importDefault(require("./productsSocketIoEmitController"));
var getProductsController = function (_request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var productos, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                productos = [];
                if (!(server_1.option === 0)) return [3 /*break*/, 1];
                productos = server_3.dao.getProductsSync();
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, server_3.dao.getProducts()];
            case 2:
                productos = _a.sent();
                _a.label = 3;
            case 3:
                if (productos.length < 1) {
                    response.status(404).send('No hay productos para mostrar');
                }
                else {
                    response.status(200).send(JSON.stringify(productos));
                }
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getProductsController = getProductsController;
var getProductByIdController = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, productById, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paramId = request.params.id;
                productById = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (!(server_1.option === 0 || server_1.option === 5)) return [3 /*break*/, 2];
                productById = server_3.dao.getProductByIdSync(paramId);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, server_3.dao.getProductById(paramId)];
            case 3:
                productById = _a.sent();
                _a.label = 4;
            case 4:
                if (productById === undefined || Object.keys(productById).length === 0) {
                    response.status(404).send('Producto no encontrado');
                }
                else {
                    response.status(200).send(JSON.stringify(productById));
                }
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.log(error_2);
                return [3 /*break*/, 6];
            case 6:
                console.log('ProductById_Server', productById);
                return [2 /*return*/];
        }
    });
}); };
exports.getProductByIdController = getProductByIdController;
var insertProductController = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var product, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!server_2.isAdmin) return [3 /*break*/, 9];
                product = request.body;
                if (!(product.name && product.description && product.code)) return [3 /*break*/, 7];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 6]);
                return [4 /*yield*/, server_3.dao.insertProduct(product)];
            case 2:
                _a.sent();
                return [3 /*break*/, 6];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, (0, productsSocketIoEmitController_1.default)()];
            case 5:
                _a.sent();
                response.redirect(pathMain);
                return [7 /*endfinally*/];
            case 6: return [3 /*break*/, 8];
            case 7:
                response.status(400).send({ error: 'Información incompleta' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                response.status(403).send({
                    error: -1,
                    descripcion: "ruta '".concat(pathAgregar, "' m\u00E9todo 'Guardar' no autorizada"),
                });
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.insertProductController = insertProductController;
var updateProductController = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, newValues, productToUpdate, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!server_2.isAdmin) return [3 /*break*/, 12];
                paramId = request.params.id;
                newValues = request.body;
                productToUpdate = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, 9, 11]);
                if (!(server_1.option === 0 || server_1.option === 5)) return [3 /*break*/, 2];
                productToUpdate = server_3.dao.getProductByIdSync(paramId);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, server_3.dao.getProductById(paramId)];
            case 3:
                productToUpdate = _a.sent();
                _a.label = 4;
            case 4:
                if (!(productToUpdate === undefined ||
                    Object.keys(productToUpdate).length === 0)) return [3 /*break*/, 5];
                response.status(404).send('Producto no encontrado');
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, server_3.dao.updateProduct(newValues, paramId)];
            case 6:
                _a.sent();
                response.status(200).send(JSON.stringify({
                    productoAactualizar: productToUpdate,
                    valoresActualizados: newValues,
                }));
                _a.label = 7;
            case 7: return [3 /*break*/, 11];
            case 8:
                error_4 = _a.sent();
                console.log(error_4);
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, (0, productsSocketIoEmitController_1.default)()];
            case 10:
                _a.sent();
                return [7 /*endfinally*/];
            case 11:
                console.log('productToUpdate', productToUpdate);
                return [3 /*break*/, 13];
            case 12:
                response.status(403).send({
                    error: -1,
                    descripcion: "ruta '".concat(pathUpdate, "' m\u00E9todo 'Guardar' no autorizada"),
                });
                _a.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.updateProductController = updateProductController;
var deleteProductController = function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, productToDelete, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!server_2.isAdmin) return [3 /*break*/, 12];
                paramId = request.params.id;
                productToDelete = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, 9, 11]);
                if (!(server_1.option === 0 || server_1.option === 5)) return [3 /*break*/, 2];
                productToDelete = server_3.dao.getProductByIdSync(paramId);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, server_3.dao.getProductById(paramId)];
            case 3:
                productToDelete = _a.sent();
                _a.label = 4;
            case 4:
                if (!(productToDelete === undefined ||
                    Object.keys(productToDelete).length === 0)) return [3 /*break*/, 5];
                response.status(404).send('Producto no encontrado');
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, server_3.dao.deleteProduct(paramId)];
            case 6:
                _a.sent();
                response
                    .status(200)
                    .send(JSON.stringify({ productoEliminado: productToDelete }));
                _a.label = 7;
            case 7:
                console.log('productToDelete Server', productToDelete);
                return [3 /*break*/, 11];
            case 8:
                error_5 = _a.sent();
                console.log(error_5);
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, (0, productsSocketIoEmitController_1.default)()];
            case 10:
                _a.sent();
                return [7 /*endfinally*/];
            case 11: return [3 /*break*/, 13];
            case 12:
                response.status(403).send({
                    error: -1,
                    descripcion: "ruta '".concat(pathDelete, "' m\u00E9todo 'Guardar' no autorizada"),
                });
                _a.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.deleteProductController = deleteProductController;
exports.default = {
    insertProductController: exports.insertProductController,
    getProductByIdController: exports.getProductByIdController,
    getProductsController: exports.getProductsController,
    updateProductController: exports.updateProductController,
    deleteProductController: exports.deleteProductController,
};
