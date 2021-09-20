"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carrito = void 0;
var Carrito = /** @class */ (function () {
    function Carrito() {
        this.carrito = Array();
        this.id = Carrito.contador;
        Carrito.contador++;
        this.timestamp = Date.now();
    }
    Carrito.prototype.getId = function () {
        return this.id;
    };
    Carrito.prototype.getTimestamp = function () {
        return this.timestamp;
    };
    Carrito.prototype.getProductos = function () {
        return this.carrito;
    };
    Carrito.prototype.getProductoById = function (id) {
        var producto = this.carrito.find(function (element) { return element.id === Number(id); });
        return producto;
    };
    Carrito.prototype.addProducto = function (producto) {
        this.carrito.push(producto);
    };
    Carrito.prototype.deleteProducto = function (id) {
        var index = this.carrito.findIndex(function (element) { return element.id === Number(id); });
        this.carrito.splice(index, 1);
    };
    Carrito.contador = 1;
    return Carrito;
}());
exports.Carrito = Carrito;
