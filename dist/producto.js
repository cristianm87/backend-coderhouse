"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto = void 0;
var Producto = /** @class */ (function () {
    function Producto(_id, timestamp, nombre, descripcion, codigo, thumbnail, price, stock) {
        this._id = _id;
        this.timestamp = timestamp;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.thumbnail = thumbnail;
        this.price = price;
        this.stock = stock;
    }
    return Producto;
}());
exports.Producto = Producto;
