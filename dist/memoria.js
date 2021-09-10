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
exports.Memoria = void 0;
var Memoria = /** @class */ (function () {
    function Memoria() {
        this.array = [];
        this.count = 0;
    }
    Memoria.prototype.getArray = function () {
        return this.array;
    };
    Memoria.prototype.getElementById = function (id) {
        var result = this.array.find(function (element) { return element.id === Number(id); });
        return result;
    };
    Memoria.prototype.addElement = function (objeto) {
        this.array.push(__assign(__assign({}, objeto), { id: this.count + 1 }));
        this.count++;
        return objeto;
    };
    Memoria.prototype.updateObject = function (newProduct, id) {
        var index = this.array.findIndex(function (element) { return element.id === Number(id); });
        this.array[index] = newProduct;
    };
    Memoria.prototype.deleteObject = function (id) {
        var index = this.array.findIndex(function (element) { return element.id === Number(id); });
        this.array.splice(index, 1);
    };
    return Memoria;
}());
exports.Memoria = Memoria;
