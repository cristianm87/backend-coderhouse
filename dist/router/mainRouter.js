"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
var express_1 = __importDefault(require("express"));
exports.mainRouter = express_1.default.Router();
var passport_1 = __importDefault(require("passport"));
var passportController_1 = require("../controllers/passportController");
var userAuthenticationController_1 = require("../controllers/userAuthenticationController");
var vistaMainController_1 = require("../controllers/vistaMainController");
var pathLogin = '/login';
var pathLogout = '/logout';
var pathSignUp = '/signup';
var pathSignUpError = '/failsignup';
var pathLoginError = '/faillogin';
var pathBuscarNombre = '/filtrar-nombre';
var pathBuscarPrecio = '/filtrar-precio';
var pathMain = '/';
// ENDPOINTS USER AUTHENTICATION
//signup
exports.mainRouter.get(pathSignUp, userAuthenticationController_1.signUpController);
exports.mainRouter.post(pathSignUp, passport_1.default.authenticate(passportController_1.signUpStrategyName, {
    failureRedirect: '/failsignup',
}), function (_request, response) {
    return response.redirect(pathMain);
});
exports.mainRouter.get(pathSignUpError, userAuthenticationController_1.signUpError);
//login
exports.mainRouter.get(pathLogin, userAuthenticationController_1.logInController);
exports.mainRouter.post(pathLogin, passport_1.default.authenticate(passportController_1.loginStrategyName, {
    failureRedirect: '/faillogin',
}), function (_request, response) {
    return response.redirect(pathMain);
});
exports.mainRouter.get(pathLoginError, userAuthenticationController_1.logInErrorController);
exports.mainRouter.get(pathLogout, userAuthenticationController_1.logOutController);
// ENDPOINTS MAIN
exports.mainRouter.post(pathBuscarNombre, vistaMainController_1.mainFilterByNameController);
exports.mainRouter.post(pathBuscarPrecio, vistaMainController_1.mainFilterByPriceController);
exports.mainRouter.get(pathMain, vistaMainController_1.vistaMain);
exports.default = exports.mainRouter;
