"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.FirebaseDao = void 0;
var firebaseAdmin = require('firebase-admin');
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert('./DbFirebase/proyecto-back-ca329-firebase-adminsdk-n8ijy-e1f0e749ea.json'),
    databaseURL: 'http://proyecto-back-ca329.firebaseio.com',
});
var FirebaseDao = /** @class */ (function () {
    function FirebaseDao() {
        this.productos = new Array();
        this.carrito = new Array();
        this.cartId = FirebaseDao.cartCount;
        FirebaseDao.cartCount++;
        this.cartTimestamp = Date.now();
    }
    FirebaseDao.prototype.getMessagesSync = function () {
        throw new Error('Method not implemented.');
    };
    FirebaseDao.prototype.filterByName = function (filtro) {
        throw new Error('Method not implemented.');
    };
    FirebaseDao.prototype.filterByPrice = function (min, max) {
        throw new Error('Method not implemented.');
    };
    FirebaseDao.prototype.getProductsFiltered = function () {
        throw new Error('Method not implemented.');
    };
    FirebaseDao.prototype.insertMessage = function (message) {
        throw new Error('Method not implemented.');
    };
    FirebaseDao.prototype.getMessages = function () {
        throw new Error('Method not implemented.');
    };
    FirebaseDao.prototype.insertProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var firestoreAdmin, collection, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firestoreAdmin = firebaseAdmin.firestore();
                        collection = firestoreAdmin.collection('productos');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, collection.doc().set(__assign(__assign({}, product), { timestamp: Date.now() }))];
                    case 2:
                        _a.sent();
                        console.log('insertProduct: Producto agregado!');
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FirebaseDao.prototype.getProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var firestoreAdmin, collection, queryGet, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firestoreAdmin = firebaseAdmin.firestore();
                        collection = firestoreAdmin.collection('productos');
                        return [4 /*yield*/, collection.get()];
                    case 1:
                        queryGet = _a.sent();
                        response = queryGet.docs.map(function (doc) {
                            var data = doc.data();
                            return {
                                _id: doc.id,
                                timestamp: data.timestamp,
                                name: data.name,
                                description: data.description,
                                code: data.code,
                                thumbnail: data.thumbnail,
                                price: data.price,
                                stock: data.stock,
                            };
                        });
                        return [2 /*return*/, response];
                }
            });
        });
    };
    FirebaseDao.prototype.updateProduct = function (newProduct, id) {
        return __awaiter(this, void 0, void 0, function () {
            var firestoreAdmin, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firestoreAdmin = firebaseAdmin.firestore();
                        collection = firestoreAdmin.collection('productos');
                        return [4 /*yield*/, collection.doc(id).update({
                                timestamp: Date.now(),
                                name: newProduct.name,
                                description: newProduct.description,
                                code: newProduct.code,
                                thumbnail: newProduct.thumbnail,
                                price: newProduct.price,
                                stock: newProduct.stock,
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FirebaseDao.prototype.getProductById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var firestoreAdmin, collection, product, doc, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firestoreAdmin = firebaseAdmin.firestore();
                        collection = firestoreAdmin.collection('productos');
                        product = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, collection.doc(id).get()];
                    case 2:
                        doc = _a.sent();
                        data = doc.data();
                        product = {
                            _id: doc.id,
                            timestamp: data.timestamp,
                            name: data.name,
                            description: data.description,
                            code: data.code,
                            price: data.price,
                            thumbnail: data.thumbnail,
                            stock: data.stock,
                        };
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Producto no encontrado');
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, product];
                }
            });
        });
    };
    FirebaseDao.prototype.deleteProduct = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var firestoreAdmin, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firestoreAdmin = firebaseAdmin.firestore();
                        collection = firestoreAdmin.collection('productos');
                        return [4 /*yield*/, collection.doc(id).delete()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FirebaseDao.prototype.addToCart = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var firestoreAdmin, collection, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firestoreAdmin = firebaseAdmin.firestore();
                        collection = firestoreAdmin.collection('carrito');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log('addToCart Product', product);
                        return [4 /*yield*/, collection.doc(product._id).set({
                                timestamp: product.timestamp,
                                name: product.name,
                                description: product.description,
                                code: product.code,
                                thumbnail: product.thumbnail,
                                price: product.price,
                                stock: product.stock,
                            })];
                    case 2:
                        _a.sent();
                        console.log('addToCart: Producto agregado', product);
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    FirebaseDao.prototype.getCartProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var firestoreAdmin, collection, queryGet, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firestoreAdmin = firebaseAdmin.firestore();
                        collection = firestoreAdmin.collection('carrito');
                        return [4 /*yield*/, collection.get()];
                    case 1:
                        queryGet = _a.sent();
                        response = queryGet.docs.map(function (doc) {
                            var data = doc.data();
                            return {
                                _id: doc.id,
                                timestamp: data.timestamp,
                                name: data.name,
                                description: data.description,
                                code: data.code,
                                thumbnail: data.thumbnail,
                                price: data.price,
                                stock: data.stock,
                            };
                        });
                        return [2 /*return*/, response];
                }
            });
        });
    };
    FirebaseDao.prototype.getCartProductById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var firestoreAdmin, collection, doc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firestoreAdmin = firebaseAdmin.firestore();
                        collection = firestoreAdmin.collection('carrito');
                        return [4 /*yield*/, collection.doc(id).get()];
                    case 1:
                        doc = _a.sent();
                        return [2 /*return*/, doc.data()];
                }
            });
        });
    };
    FirebaseDao.prototype.deleteProductCart = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var firestoreAdmin, collection;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firestoreAdmin = firebaseAdmin.firestore();
                        collection = firestoreAdmin.collection('carrito');
                        return [4 /*yield*/, collection.doc(id).delete()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FirebaseDao.prototype.getCartId = function () {
        return this.cartId;
    };
    FirebaseDao.prototype.getCartTimestamp = function () {
        return this.cartTimestamp;
    };
    FirebaseDao.prototype.getProductsSync = function () {
        throw new Error('Method not implemented.');
    };
    FirebaseDao.prototype.getProductByIdSync = function (id) {
        throw new Error('Method not implemented.');
    };
    FirebaseDao.prototype.getCartProductByIdSync = function (id) {
        throw new Error('Method not implemented.');
    };
    FirebaseDao.prototype.getCartProductsSync = function () {
        throw new Error('Method not implemented.');
    };
    FirebaseDao.cartCount = 1;
    return FirebaseDao;
}());
exports.FirebaseDao = FirebaseDao;
