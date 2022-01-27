"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.warnLogger = exports.errorLogger = exports.consoleLogger = void 0;
var winston_1 = __importDefault(require("winston"));
//////////// WINSTON LOGGER ////////////
exports.consoleLogger = winston_1.default.createLogger({
    level: 'info',
    transports: [new winston_1.default.transports.Console({})],
});
exports.errorLogger = winston_1.default.createLogger({
    level: 'error',
    transports: [
        new winston_1.default.transports.File({
            filename: 'error.log',
        }),
    ],
});
exports.warnLogger = winston_1.default.createLogger({
    level: 'warn',
    transports: [
        new winston_1.default.transports.File({
            filename: 'warn.log',
        }),
    ],
});
exports.default = { consoleLogger: exports.consoleLogger, errorLogger: exports.errorLogger, warnLogger: exports.warnLogger };
