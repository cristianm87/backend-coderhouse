"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mensaje = void 0;
var Mensaje = /** @class */ (function () {
    function Mensaje(id, author, nombre, apellido, edad, alias, avatar, fecha, text) {
        this.id = id;
        this.author = author;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.alias = alias;
        this.avatar = avatar;
        this.fecha = fecha;
        this.text = text;
    }
    return Mensaje;
}());
exports.Mensaje = Mensaje;
