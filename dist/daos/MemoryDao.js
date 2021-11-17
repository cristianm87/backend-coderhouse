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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryDao = void 0;
var MemoryDao = /** @class */ (function () {
    function MemoryDao() {
        this.productos = new Array();
        this.carrito = new Array();
        this.mensajes = new Array();
        this.count = 0;
        this.cartId = MemoryDao.cartCount;
        MemoryDao.cartCount++;
        this.cartTimestamp = Date.now();
    }
    MemoryDao.prototype.filterByName = function (filtro) {
        throw new Error('Method not implemented.');
    };
    MemoryDao.prototype.filterByPrice = function (min, max) {
        throw new Error('Method not implemented.');
    };
    MemoryDao.prototype.getProductsFiltered = function () {
        throw new Error('Method not implemented.');
    };
    // PRODUCTOS
    MemoryDao.prototype.getProductsSync = function () {
        return this.productos;
    };
    MemoryDao.prototype.insertProduct = function (product) {
        this.productos.push(__assign(__assign({}, product), { _id: String(this.count + 1), timestamp: new Date() }));
        this.count++;
        console.log('Producto agregado!');
        return product;
    };
    MemoryDao.prototype.updateProduct = function (newValues, id) {
        var index = this.productos.findIndex(function (element) { return (element._id = id); });
        var productToBeUpdated = this.productos[index];
        var productUpdated = Object.assign(productToBeUpdated, newValues);
        this.productos[index] = productUpdated;
    };
    MemoryDao.prototype.deleteProduct = function (id) {
        var index = this.productos.findIndex(function (product) { return product._id == id; });
        if (index != -1) {
            this.productos.splice(index, 1);
        }
    };
    MemoryDao.prototype.getProductByIdSync = function (id) {
        var product = this.productos.find(function (element) { return element._id == id; });
        return product;
    };
    // CARRITO
    MemoryDao.prototype.addToCart = function (product) {
        this.carrito.push(product);
    };
    MemoryDao.prototype.getCartProductsSync = function () {
        return this.carrito;
    };
    MemoryDao.prototype.getCartProductByIdSync = function (id) {
        var product = this.carrito.find(function (element) { return element._id == id; });
        return product;
    };
    MemoryDao.prototype.getCartId = function () {
        return this.cartId;
    };
    MemoryDao.prototype.getCartTimestamp = function () {
        return this.cartTimestamp;
    };
    MemoryDao.prototype.deleteProductCart = function (id) {
        var index = this.carrito.findIndex(function (element) { return element._id == id; });
        if (index != -1) {
            this.carrito.splice(index, 1);
        }
    };
    // MENSAJES
    MemoryDao.prototype.insertMessage = function (message) {
        this.mensajes.push(message);
        console.log('Mensaje agregado!');
        return this.mensajes;
    };
    MemoryDao.prototype.getMessagesSync = function () {
        return this.mensajes;
    };
    MemoryDao.prototype.getMessages = function () {
        throw new Error('Method not implemented.');
    };
    MemoryDao.prototype.getCartProductById = function (id) {
        throw new Error('Method not implemented.');
    };
    MemoryDao.prototype.getProductById = function (id) {
        throw new Error('Method not implemented.');
    };
    MemoryDao.prototype.getProducts = function () {
        throw new Error('Method not implemented.');
    };
    MemoryDao.prototype.getCartProducts = function () {
        throw new Error('Method not implemented.');
    };
    MemoryDao.cartCount = 1;
    return MemoryDao;
}());
exports.MemoryDao = MemoryDao;
