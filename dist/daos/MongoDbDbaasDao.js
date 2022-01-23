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
exports.MongoDbDbaasDao = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var modelProducto_1 = require("../models/modelProducto");
var modelCarrito_1 = require("../models/modelCarrito");
var modelMensaje_1 = require("../models/modelMensaje");
var MongoDbDbaasDao = /** @class */ (function () {
    function MongoDbDbaasDao() {
        var _this = this;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var MONGODB_URI;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        MONGODB_URI = process.env.MONGODB_URI;
                        return [4 /*yield*/, mongoose_1.default.connect(MONGODB_URI)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); })();
        this.products = new Array();
        this.carrito = new Array();
        this.productosFiltrados = Array();
        this.messages = Array();
        this.cartId = MongoDbDbaasDao.cartCount;
        MongoDbDbaasDao.cartCount++;
        this.cartTimestamp = Date.now();
    }
    MongoDbDbaasDao.prototype.closeConnection = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mongoose_1.default.disconnect(function () { })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.getMessagesSync = function () {
        throw new Error('Method not implemented.');
    };
    // PRODUCTO
    MongoDbDbaasDao.prototype.insertProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, modelProducto_1.modelProductos.insertMany({
                                timestamp: Date.now(),
                                name: product.name,
                                description: product.description,
                                code: product.code,
                                thumbnail: product.thumbnail,
                                price: product.price,
                                stock: product.stock,
                            })];
                    case 1:
                        _a.sent();
                        console.log('Producto guardado!');
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.getProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var productsFromDb, _i, productsFromDb_1, product, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, modelProducto_1.modelProductos.find()];
                    case 1:
                        productsFromDb = _a.sent();
                        this.products = [];
                        for (_i = 0, productsFromDb_1 = productsFromDb; _i < productsFromDb_1.length; _i++) {
                            product = productsFromDb_1[_i];
                            this.products.push(product);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, this.products];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.updateProduct = function (newProduct, id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, modelProducto_1.modelProductos.updateOne({ _id: id }, {
                                $set: {
                                    name: newProduct.name,
                                    description: newProduct.description,
                                    code: newProduct.code,
                                    thumbnail: newProduct.thumbnail,
                                    price: newProduct.price,
                                    stock: newProduct.stock,
                                },
                            })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error('updateProduct: Producto no encontrado');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.deleteProduct = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, modelProducto_1.modelProductos.deleteOne({ _id: id })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        console.error('deleteProduct: Producto no encontrado');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.getProductById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var productById, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        productById = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, modelProducto_1.modelProductos.findOne({ _id: id })];
                    case 2:
                        productById = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_5 = _a.sent();
                        console.error('getProductById: Producto no encontrado');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, productById];
                }
            });
        });
    };
    // CARRITO
    MongoDbDbaasDao.prototype.addToCart = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, modelCarrito_1.modelCarrito.insertMany(product)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Producto duplicado');
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.getCartProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var productsFromDb, _i, productsFromDb_2, product, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, modelCarrito_1.modelCarrito.find()];
                    case 1:
                        productsFromDb = _a.sent();
                        this.carrito = [];
                        for (_i = 0, productsFromDb_2 = productsFromDb; _i < productsFromDb_2.length; _i++) {
                            product = productsFromDb_2[_i];
                            this.carrito.push(product);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_7 = _a.sent();
                        console.log(error_7);
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, this.carrito];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.deleteProductCart = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, modelCarrito_1.modelCarrito.deleteOne({ _id: id })];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_8 = _a.sent();
                        console.log(error_8);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.getCartProductById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cartProductById, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cartProductById = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, modelCarrito_1.modelCarrito.findOne({ _id: id })];
                    case 2:
                        cartProductById = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_9 = _a.sent();
                        console.error('getCartProductById: Producto no encontrado');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, cartProductById];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.getCartId = function () {
        return this.cartId;
    };
    MongoDbDbaasDao.prototype.getCartTimestamp = function () {
        return this.cartTimestamp;
    };
    // FILTRAR PRODUCTOS
    MongoDbDbaasDao.prototype.filterByName = function (filtro) {
        return __awaiter(this, void 0, void 0, function () {
            var productos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProducts()];
                    case 1:
                        productos = _a.sent();
                        this.productosFiltrados = productos.filter(function (producto) { return producto.name == filtro; });
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.filterByPrice = function (min, max) {
        return __awaiter(this, void 0, void 0, function () {
            var productos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getProducts()];
                    case 1:
                        productos = _a.sent();
                        this.productosFiltrados = productos.filter(function (producto) { return producto.price >= min && producto.price <= max; });
                        return [2 /*return*/];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.getProductsFiltered = function () {
        var productos = this.productosFiltrados;
        if (productos.length < 1) {
            return this.getProducts();
        }
        else {
            return this.productosFiltrados;
        }
    };
    // MENSAJES
    MongoDbDbaasDao.prototype.insertMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var error_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, modelMensaje_1.modelMensaje.insertMany(message)];
                    case 1:
                        _a.sent();
                        console.log('Mensaje guardado!');
                        return [3 /*break*/, 3];
                    case 2:
                        error_10 = _a.sent();
                        console.error('insertMessage()', error_10);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    MongoDbDbaasDao.prototype.getMessages = function () {
        return __awaiter(this, void 0, void 0, function () {
            var messagesFromDb, _i, messagesFromDb_1, mensaje, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        return [4 /*yield*/, modelMensaje_1.modelMensaje.find()];
                    case 1:
                        messagesFromDb = _a.sent();
                        // this.messages = messagesFromDb;
                        this.messages = [];
                        for (_i = 0, messagesFromDb_1 = messagesFromDb; _i < messagesFromDb_1.length; _i++) {
                            mensaje = messagesFromDb_1[_i];
                            this.messages.push(mensaje);
                        }
                        return [3 /*break*/, 4];
                    case 2:
                        error_11 = _a.sent();
                        console.error('getMessages()', error_11);
                        return [3 /*break*/, 4];
                    case 3: return [2 /*return*/, this.messages];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    //
    MongoDbDbaasDao.prototype.getProductsCartAsync = function () {
        throw new Error('Method not implemented.');
    };
    MongoDbDbaasDao.prototype.getProductsSync = function () {
        throw new Error('Method not implemented.');
    };
    MongoDbDbaasDao.prototype.getProductByIdSync = function (id) {
        throw new Error('Method not implemented.');
    };
    MongoDbDbaasDao.prototype.getCartProductByIdSync = function (id) {
        throw new Error('Method not implemented.');
    };
    MongoDbDbaasDao.prototype.getCartProductsSync = function () {
        throw new Error('Method not implemented.');
    };
    MongoDbDbaasDao.cartCount = 1;
    return MongoDbDbaasDao;
}());
exports.MongoDbDbaasDao = MongoDbDbaasDao;
