"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// IMPORTS
var express_1 = __importDefault(require("express"));
var vistaInfoController_1 = __importDefault(require("../controllers/vistaInfoController"));
var vistaNumerosRandomController_1 = __importDefault(require("../controllers/vistaNumerosRandomController"));
var vistaTestController_1 = __importDefault(require("../controllers/vistaTestController"));
var viewMiscellaneous = express_1.default.Router();
// PATHS
var pathVistaInfo = '/info';
var pathVistaRandom = '/random';
var pathVistaTest = '/test';
// ENDPOINT VISTA TEST (Faker)
viewMiscellaneous.get(pathVistaTest, vistaTestController_1.default);
// ENDPOINT VISTA INFO
viewMiscellaneous.get(pathVistaInfo, vistaInfoController_1.default);
// ENDPOINT NUMEROS RANDOM
viewMiscellaneous.get(pathVistaRandom, vistaNumerosRandomController_1.default);
exports.default = viewMiscellaneous;
