"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelMensaje = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var personaSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        require: true,
        max: 50,
    },
    nombre: {
        type: String,
        require: true,
        max: 50,
    },
    apellido: {
        type: String,
        require: true,
        max: 50,
    },
    edad: {
        type: Number,
        require: true,
        max: 2,
    },
    fecha: {
        type: String,
        require: true,
        max: 50,
    },
    avatar: {
        type: String,
        require: true,
        max: 50,
    },
});
var authorSchema = new mongoose_1.default.Schema({
    author: personaSchema,
    text: String,
});
exports.modelMensaje = mongoose_1.default.model('mensajes', authorSchema);
