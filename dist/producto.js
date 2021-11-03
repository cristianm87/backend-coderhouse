"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto = void 0;
var Producto = /** @class */ (function () {
    function Producto(_id, timestamp, name, description, code, thumbnail, price, stock) {
        this._id = _id;
        this.timestamp = timestamp;
        this.name = name;
        this.description = description;
        this.code = code;
        this.thumbnail = thumbnail;
        this.price = price;
        this.stock = stock;
    }
    return Producto;
}());
exports.Producto = Producto;
