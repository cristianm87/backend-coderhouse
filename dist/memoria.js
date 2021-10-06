"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Memoria = void 0;
var Memoria = /** @class */ (function () {
    function Memoria() {
        this.array = [];
    }
    Memoria.prototype.getArray = function () {
        return this.array;
    };
    Memoria.prototype.getElementById = function (id) {
        var result = this.array.find(function (element) { return element._id == id; });
        return result;
    };
    Memoria.prototype.addElement = function (objeto) {
        this.array.push(objeto);
        return objeto;
    };
    Memoria.prototype.emptyArray = function () {
        this.array = [];
    };
    Memoria.prototype.updateObject = function (newProduct, id) {
        var index = this.array.findIndex(function (element) { return element._id == id; });
        this.array[index] = newProduct;
    };
    Memoria.prototype.deleteObject = function (id) {
        var index = this.array.findIndex(function (element) { return element._id == id; });
        if (index != -1) {
            this.array.splice(index, 1);
        }
    };
    return Memoria;
}());
exports.Memoria = Memoria;
