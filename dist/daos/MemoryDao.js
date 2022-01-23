"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryDao = void 0;
var MemoryDao = /** @class */ (function () {
    function MemoryDao() {
        this.productos = new Array();
        this.productosFiltrados = new Array();
        this.carrito = new Array();
        this.mensajes = new Array();
        this.count = 0;
        this.cartId = MemoryDao.cartCount;
        MemoryDao.cartCount++;
        this.cartTimestamp = Date.now();
    }
    MemoryDao.prototype.closeConnection = function () {
        throw new Error('Method not implemented.');
    };
    // PRODUCTOS
    MemoryDao.prototype.getProductsSync = function () {
        return this.productos;
    };
    MemoryDao.prototype.insertProduct = function (product) {
        this.productos.push({
            name: product.name,
            description: product.description,
            code: product.code,
            thumbnail: product.thumbnail,
            price: Number(product.price),
            stock: Number(product.stock),
            _id: String(this.count + 1),
            timestamp: new Date(),
        });
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
    MemoryDao.prototype.filterByName = function (filtro) {
        this.productosFiltrados = this.productos.filter(function (producto) { return producto.name == filtro; });
    };
    MemoryDao.prototype.filterByPrice = function (min, max) {
        this.productosFiltrados = this.productos.filter(function (producto) { return producto.price >= min && producto.price <= max; });
    };
    MemoryDao.prototype.getProductsFiltered = function () {
        var productos = this.productosFiltrados;
        if (productos.length < 1) {
            return this.productos;
        }
        else {
            return this.productosFiltrados;
        }
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
