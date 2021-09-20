"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto = void 0;
var Producto = /** @class */ (function () {
    function Producto(id, timestamp, nombre, descripcion, codigo, thumbnail, price) {
        this.id = id;
        this.timestamp = timestamp;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.thumbnail = thumbnail;
        this.price = price;
    }
    return Producto;
}());
exports.Producto = Producto;
