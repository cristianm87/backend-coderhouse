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
var viewMiscellaneousRouter = express_1.default.Router();
// PATHS
var pathVistaInfo = '/info';
var pathVistaRandom = '/random';
var pathVistaTest = '/test';
// ENDPOINT VISTA TEST (Faker)
viewMiscellaneousRouter.get(pathVistaTest, vistaTestController_1.default);
// ENDPOINT VISTA INFO
viewMiscellaneousRouter.get(pathVistaInfo, vistaInfoController_1.default);
// ENDPOINT NUMEROS RANDOM
viewMiscellaneousRouter.get(pathVistaRandom, vistaNumerosRandomController_1.default);
exports.default = viewMiscellaneousRouter;
