"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vistaTest = void 0;
var faker_1 = __importDefault(require("faker"));
faker_1.default.locale = 'es';
var vistaTest = function (request, response) {
    var datos = [];
    var cantidad = request.query.cant || 10;
    var id = 1;
    for (var index = 0; index < cantidad; index++) {
        datos.push({
            id: id++,
            nombre: faker_1.default.commerce.productName(),
            precio: faker_1.default.commerce.price(),
            foto: faker_1.default.image.image(),
        });
    }
    if (cantidad == '0') {
        response.send('No hay productos');
    }
    else {
        response.render('test', {
            productos: datos,
        });
    }
};
exports.vistaTest = vistaTest;
exports.default = exports.vistaTest;
