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
exports.MySqlSQLite3 = void 0;
var knex_1 = __importDefault(require("knex"));
var options_sqlite3 = {
    client: 'sqlite3',
    connection: {
        filename: './DB/ecommerce.sqlite',
    },
    useNullAsDefault: true,
};
var MySqlSQLite3 = /** @class */ (function () {
    function MySqlSQLite3() {
        var _this = this;
        this.productById = Array();
        this.cartProductById = Array();
        this.createTableProductos = function () { return __awaiter(_this, void 0, void 0, function () {
            var knexEcommerce, tableName, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        knexEcommerce = (0, knex_1.default)(options_sqlite3);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 9]);
                        tableName = 'productos';
                        return [4 /*yield*/, knexEcommerce.schema.hasTable(tableName)];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        console.log("La tabla " + tableName + " ya existe!");
                        return [2 /*return*/];
                    case 3: return [4 /*yield*/, knexEcommerce.schema.createTable(tableName, function (table) {
                            table.increments('id').primary();
                            table.bigInteger('timestamp').notNullable();
                            table.string('name', 25).notNullable();
                            table.string('description', 50).notNullable();
                            table.string('code', 12).notNullable();
                            table.string('thumbnail', 50).defaultTo('pending');
                            table.float('price').defaultTo(0);
                            table.integer('stock').defaultTo(0);
                        })];
                    case 4:
                        _a.sent();
                        console.log("La tabla " + tableName + " fue creada!");
                        _a.label = 5;
                    case 5: return [3 /*break*/, 9];
                    case 6:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, knexEcommerce.destroy()];
                    case 8:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        this.createTableCarrito = function () { return __awaiter(_this, void 0, void 0, function () {
            var knexEcommerce, tableName, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        knexEcommerce = (0, knex_1.default)(options_sqlite3);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 9]);
                        tableName = 'carrito';
                        return [4 /*yield*/, knexEcommerce.schema.hasTable(tableName)];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        console.log("La tabla " + tableName + " ya existe!");
                        return [2 /*return*/];
                    case 3: return [4 /*yield*/, knexEcommerce.schema.createTable(tableName, function (table) {
                            table.increments('id').primary();
                            table.bigInteger('timestamp').notNullable();
                            table.string('name', 25).notNullable();
                            table.string('description', 50).notNullable();
                            table.string('code', 12).notNullable();
                            table.string('thumbnail', 50).notNullable();
                            table.float('price').notNullable();
                            table.integer('stock').notNullable();
                        })];
                    case 4:
                        _a.sent();
                        console.log("La tabla " + tableName + " fue creada!");
                        _a.label = 5;
                    case 5: return [3 /*break*/, 9];
                    case 6:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [3 /*break*/, 9];
                    case 7: return [4 /*yield*/, knexEcommerce.destroy()];
                    case 8:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
        this.createTableProductos();
        this.carrito = new Array();
        this.productos = new Array();
        this.productById = new Array();
        this.cartProductById = Array();
        this.cartId = MySqlSQLite3.cartCount;
        MySqlSQLite3.cartCount++;
        this.cartTimestamp = Date.now();
    }
    MySqlSQLite3.prototype.insertProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var knexEcommerce, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        knexEcommerce = (0, knex_1.default)(options_sqlite3);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 6]);
                        return [4 /*yield*/, knexEcommerce('productos').insert([
                                {
                                    timestamp: Date.now(),
                                    name: product.name,
                                    description: product.description,
                                    code: product.code,
                                    thumbnail: product.thumbnail,
                                    price: product.price,
                                    stock: product.stock,
                                },
                            ])];
                    case 2:
                        _a.sent();
                        console.log('Producto agregado!');
                        return [3 /*break*/, 6];
                    case 3:
                        error_3 = _a.sent();
                        console.log(error_3);
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, knexEcommerce.destroy()];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MySqlSQLite3.prototype.getProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var knexEcommerce, productsFromDb, _i, productsFromDb_1, product, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        knexEcommerce = (0, knex_1.default)(options_sqlite3);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 6]);
                        return [4 /*yield*/, knexEcommerce.from('productos').select('*')];
                    case 2:
                        productsFromDb = _a.sent();
                        this.productos = [];
                        for (_i = 0, productsFromDb_1 = productsFromDb; _i < productsFromDb_1.length; _i++) {
                            product = productsFromDb_1[_i];
                            this.productos.push(product);
                        }
                        return [3 /*break*/, 6];
                    case 3:
                        error_4 = _a.sent();
                        console.log(error_4);
                        throw error_4;
                    case 4: return [4 /*yield*/, knexEcommerce.destroy()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, this.productos];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MySqlSQLite3.prototype.updateProduct = function (newProduct, id) {
        return __awaiter(this, void 0, void 0, function () {
            var knexEcommerce, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        knexEcommerce = (0, knex_1.default)(options_sqlite3);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 6]);
                        return [4 /*yield*/, knexEcommerce
                                .from('productos')
                                .where('id', id)
                                .update('name', newProduct.name)
                                .update('description', newProduct.description)
                                .update('code', newProduct.code)
                                .update('thumbnail', newProduct.thumbnail)
                                .update('price', newProduct.price)
                                .update('stock', newProduct.stock)];
                    case 2:
                        _a.sent();
                        console.log('Producto actualizado!');
                        return [3 /*break*/, 6];
                    case 3:
                        error_5 = _a.sent();
                        console.log(error_5);
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, knexEcommerce.destroy()];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MySqlSQLite3.prototype.getProductById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var knexEcommerce, _a, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        knexEcommerce = (0, knex_1.default)(options_sqlite3);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 6]);
                        _a = this;
                        return [4 /*yield*/, knexEcommerce
                                .from('productos')
                                .select('*')
                                .where('id', id)];
                    case 2:
                        _a.productById = _b.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        error_6 = _b.sent();
                        console.log(error_6);
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, knexEcommerce.destroy()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, this.productById];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MySqlSQLite3.prototype.deleteProduct = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var knexEcommerce, error_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        knexEcommerce = (0, knex_1.default)(options_sqlite3);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 6]);
                        return [4 /*yield*/, knexEcommerce.from('productos').where('id', id).del()];
                    case 2:
                        _a.sent();
                        console.log('Producto eliminado!');
                        return [3 /*break*/, 6];
                    case 3:
                        error_7 = _a.sent();
                        console.log(error_7);
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, knexEcommerce.destroy()];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MySqlSQLite3.prototype.addToCart = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var knexEcommerce, error_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.createTableCarrito()];
                    case 1:
                        _a.sent();
                        knexEcommerce = (0, knex_1.default)(options_sqlite3);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, 5, 7]);
                        return [4 /*yield*/, knexEcommerce('carrito').insert([
                                {
                                    timestamp: Date.now(),
                                    name: product.name,
                                    description: product.description,
                                    code: product.code,
                                    thumbnail: product.thumbnail,
                                    price: product.price,
                                    stock: product.stock,
                                },
                            ])];
                    case 3:
                        _a.sent();
                        console.log('Producto agregado al carrito!');
                        return [3 /*break*/, 7];
                    case 4:
                        error_8 = _a.sent();
                        console.log(error_8);
                        return [3 /*break*/, 7];
                    case 5: return [4 /*yield*/, knexEcommerce.destroy()];
                    case 6:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    MySqlSQLite3.prototype.getCartProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var knexEcommerce, carritoFromDb, _i, carritoFromDb_1, product, error_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        knexEcommerce = (0, knex_1.default)(options_sqlite3);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 9]);
                        return [4 /*yield*/, knexEcommerce.schema.hasTable('carrito')];
                    case 2:
                        if (!_a.sent()) return [3 /*break*/, 4];
                        return [4 /*yield*/, knexEcommerce.from('carrito').select('*')];
                    case 3:
                        carritoFromDb = _a.sent();
                        this.carrito = [];
                        for (_i = 0, carritoFromDb_1 = carritoFromDb; _i < carritoFromDb_1.length; _i++) {
                            product = carritoFromDb_1[_i];
                            this.carrito.push(product);
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        ('');
                        _a.label = 5;
                    case 5: return [3 /*break*/, 9];
                    case 6:
                        error_9 = _a.sent();
                        console.log(error_9);
                        throw error_9;
                    case 7: return [4 /*yield*/, knexEcommerce.destroy()];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, this.carrito];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    MySqlSQLite3.prototype.getCartProductById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var knexEcommerce, _a, error_10;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        knexEcommerce = (0, knex_1.default)(options_sqlite3);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, 4, 6]);
                        _a = this;
                        return [4 /*yield*/, knexEcommerce
                                .from('carrito')
                                .select('*')
                                .where('id', id)];
                    case 2:
                        _a.cartProductById = _b.sent();
                        return [3 /*break*/, 6];
                    case 3:
                        error_10 = _b.sent();
                        console.log(error_10);
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, knexEcommerce.destroy()];
                    case 5:
                        _b.sent();
                        return [2 /*return*/, this.cartProductById];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MySqlSQLite3.prototype.deleteProductCart = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var knexEcommerce, error_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        knexEcommerce = (0, knex_1.default)(options_sqlite3);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, 4, 6]);
                        return [4 /*yield*/, knexEcommerce.from('carrito').where('id', id).del()];
                    case 2:
                        _a.sent();
                        console.log('Producto eliminado del carrito!');
                        return [3 /*break*/, 6];
                    case 3:
                        error_11 = _a.sent();
                        console.log(error_11);
                        return [3 /*break*/, 6];
                    case 4: return [4 /*yield*/, knexEcommerce.destroy()];
                    case 5:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MySqlSQLite3.prototype.getCartId = function () {
        return this.cartId;
    };
    MySqlSQLite3.prototype.getCartTimestamp = function () {
        return this.cartTimestamp;
    };
    MySqlSQLite3.prototype.getProductsSync = function () {
        throw new Error('Method not implemented.');
    };
    MySqlSQLite3.prototype.getProductByIdSync = function (id) {
        throw new Error('Method not implemented.');
    };
    MySqlSQLite3.prototype.getCartProductByIdSync = function (id) {
        throw new Error('Method not implemented.');
    };
    MySqlSQLite3.prototype.getCartProductsAsync = function () {
        throw new Error('Method not implemented.');
    };
    MySqlSQLite3.cartCount = 1;
    return MySqlSQLite3;
}());
exports.MySqlSQLite3 = MySqlSQLite3;