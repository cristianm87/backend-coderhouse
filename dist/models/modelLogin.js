"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelLogin = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var loginSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        require: true,
        max: 100,
    },
    password: {
        type: String,
        require: true,
        max: 100,
    },
    nombre: {
        type: String,
        require: true,
        max: 100,
    },
    direccion: {
        type: String,
        require: true,
        max: 100,
    },
    edad: {
        type: Number,
        require: true,
        max: 100,
    },
    telefono: {
        type: String,
        require: true,
    },
    avatar: {
        type: String,
        require: true,
        max: 100,
    },
});
exports.modelLogin = mongoose_1.default.model('login', loginSchema);
