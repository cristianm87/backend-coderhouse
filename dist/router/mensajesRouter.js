"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var mensajesRouter = express_1.default.Router();
var chatController_1 = __importDefault(require("../controllers/chatController"));
//PATH
var pathGuardarMensajes = '/guardar';
// ENDPOINTS
mensajesRouter.post(pathGuardarMensajes, chatController_1.default);
exports.default = mensajesRouter;
