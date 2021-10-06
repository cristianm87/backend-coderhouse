"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelMensajes = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var mensajesSchema = new mongoose_1.default.Schema({
    author: {
        type: String,
        require: true,
        max: 100,
    },
    text: {
        type: String,
        require: true,
        max: 100,
    },
});
exports.modelMensajes = mongoose_1.default.model('mensajes', mensajesSchema);
