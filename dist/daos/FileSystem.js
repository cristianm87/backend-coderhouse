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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = void 0;
var fs_1 = __importDefault(require("fs"));
var FileSystem = /** @class */ (function () {
    function FileSystem() {
        this.pathProductos = './fileSystemDb/productos.txt';
        this.pathCarrito = './fileSystemDb/carrito.txt';
        this.productos = new Array();
        this.carrito = new Array();
        this.cartId = FileSystem.cartCount;
        FileSystem.cartCount++;
        this.cartTimestamp = Date.now();
    }
    FileSystem.prototype.getNewId = function () {
        var maxId = Math.max.apply(Math, __spreadArray(__spreadArray([], this.productos.map(function (product) { return Number(product.id); }), false), [0], false));
        var newId = maxId + 1;
        return newId;
    };
    FileSystem.prototype.insertProduct = function (product) {
        return __awaiter(this, void 0, void 0, function () {
            var productsFromTxt, parsProductsFromTxt, productsNew;
            return __generator(this, function (_a) {
                product.id = this.getNewId();
                this.productos.push(product);
                try {
                    productsFromTxt = fs_1.default.readFileSync(this.pathProductos, 'utf-8');
                    parsProductsFromTxt = JSON.parse(productsFromTxt);
                    productsNew = __spreadArray(__spreadArray([], parsProductsFromTxt, true), [product], false);
                    console.log(productsNew);
                    fs_1.default.writeFileSync(this.pathProductos, JSON.stringify(productsNew, null, '\t'));
                }
                catch (error) {
                    fs_1.default.writeFileSync(this.pathProductos, JSON.stringify(this.productos, null, '\t'));
                }
                return [2 /*return*/];
            });
        });
    };
    FileSystem.prototype.getProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                fs_1.default.readFile(this.pathProductos, 'utf-8', function (error, content) {
                    if (error) {
                        console.log('Hubo un error con el readFile de getProducts');
                    }
                    else {
                        _this.productos = [];
                        var savedProducts = JSON.parse(content);
                        savedProducts.forEach(function (producto) {
                            _this.productos.push(producto);
                        });
                    }
                });
                return [2 /*return*/, this.productos];
            });
        });
    };
    FileSystem.prototype.updateProduct = function (newProduct, id) {
        var index = this.productos.findIndex(function (element) { return element.id == id; });
        var productToBeUpdated = this.productos[index];
        var productUpdated = Object.assign(productToBeUpdated, newProduct);
        this.productos[index] = productUpdated;
        fs_1.default.writeFileSync(this.pathProductos, JSON.stringify(this.productos, null, '\t'));
    };
    FileSystem.prototype.deleteProduct = function (id) {
        var index = this.productos.findIndex(function (element) { return element.id == id; });
        if (index != -1) {
            this.productos.splice(index, 1);
        }
        fs_1.default.writeFileSync(this.pathProductos, JSON.stringify(this.productos, null, '\t'));
    };
    FileSystem.prototype.getProductByIdSync = function (id) {
        var product = this.productos.find(function (producto) { return producto.id == id; });
        return product;
    };
    FileSystem.prototype.addToCart = function (product) {
        this.carrito.push(product);
        try {
            var productsFromTxt = fs_1.default.readFileSync(this.pathCarrito, 'utf-8');
            var parsProductsFromTxt = JSON.parse(productsFromTxt);
            var productsNew = __spreadArray(__spreadArray([], parsProductsFromTxt, true), [product], false);
            console.log(productsNew);
            fs_1.default.writeFileSync(this.pathCarrito, JSON.stringify(productsNew, null, '\t'));
        }
        catch (error) {
            fs_1.default.writeFileSync(this.pathCarrito, JSON.stringify(this.productos, null, '\t'));
        }
    };
    FileSystem.prototype.getCartProducts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                fs_1.default.readFile(this.pathCarrito, 'utf-8', function (error, content) {
                    if (error) {
                        console.log('Hubo un error con el readFile de getProducts');
                    }
                    else {
                        _this.carrito = [];
                        var savedProducts = JSON.parse(content);
                        savedProducts.forEach(function (producto) {
                            _this.carrito.push(producto);
                        });
                    }
                });
                return [2 /*return*/, this.carrito];
            });
        });
    };
    FileSystem.prototype.getCartId = function () {
        return this.cartId;
    };
    FileSystem.prototype.getCartTimestamp = function () {
        return this.cartTimestamp;
    };
    FileSystem.prototype.getCartProductByIdSync = function (id) {
        var product = this.carrito.find(function (element) { return element.id == id; });
        return product;
    };
    FileSystem.prototype.deleteProductCart = function (id) {
        var index = this.carrito.findIndex(function (element) { return element.id == id; });
        if (index != -1) {
            this.carrito.splice(index, 1);
        }
        fs_1.default.writeFileSync(this.pathCarrito, JSON.stringify(this.carrito, null, '\t'));
    };
    FileSystem.prototype.getCartProductById = function (id) {
        throw new Error('Method not implemented.');
    };
    FileSystem.prototype.getProductById = function (id) {
        throw new Error('Method not implemented.');
    };
    FileSystem.prototype.getProductsSync = function () {
        throw new Error('Method not implemented.');
    };
    FileSystem.prototype.getCartProductsAsync = function () {
        throw new Error('Method not implemented.');
    };
    FileSystem.prototype.insertChat = function (message) {
        throw new Error('Method not implemented.');
    };
    FileSystem.cartCount = 1;
    return FileSystem;
}());
exports.FileSystem = FileSystem;
