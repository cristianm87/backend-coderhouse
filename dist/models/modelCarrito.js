"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelCarrito = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var carritoSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        require: true,
        max: 100,
    },
    description: {
        type: String,
        require: true,
        max: 100,
    },
    code: {
        type: String,
        require: true,
        max: 100,
    },
    thumbnail: {
        type: String,
        require: true,
        max: 100,
    },
    price: {
        type: Number,
        require: true,
    },
    stock: {
        type: Number,
        require: true,
    },
    id: {
        type: Number,
        require: true,
        max: 100,
    },
    timestamp: {
        type: String,
        require: true,
        max: 100,
    },
});
exports.modelCarrito = mongoose_1.default.model('carrito', carritoSchema);
