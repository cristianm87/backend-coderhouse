"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vistaInfo = void 0;
var server_1 = require("../server");
var vistaInfo = function (request, response) {
    var info = {
        argumentosDeEntrada: process.argv,
        nombreDeLaPlataforma: process.platform,
        pathDeEjecución: process.argv[0],
        processId: process.pid,
        versionDeNodeJs: process.version,
        usoDeMemoria: process.memoryUsage(),
        carpetaCorriente: process.cwd(),
        nucleosCpu: server_1.numCPUs,
    };
    response.render('info', { info: info });
};
exports.vistaInfo = vistaInfo;
exports.default = exports.vistaInfo;
