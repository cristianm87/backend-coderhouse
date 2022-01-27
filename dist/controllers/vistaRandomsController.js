"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vistaRandoms = void 0;
var vistaRandoms = function (request, response) {
    var cantidad = Number(request.query.cant) || 100000000;
    var fork = require('child_process').fork;
    var child = fork('./dist/child.js');
    child.send(cantidad);
    child.on('message', function (message) {
        return response.status(200).send(JSON.stringify(message));
    });
};
exports.vistaRandoms = vistaRandoms;
exports.default = exports.vistaRandoms;
