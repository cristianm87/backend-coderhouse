"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOutController = exports.logInErrorController = exports.logInController = exports.signUpError = exports.signUpController = void 0;
var emailingAndMessagingController_1 = require("./emailingAndMessagingController");
var pathMain = '/';
var signUpController = function (request, response) {
    if (request.user == undefined) {
        response.render('signup');
    }
    else {
        response.redirect(pathMain);
    }
};
exports.signUpController = signUpController;
var signUpError = function (request, response) {
    response.render('user-error-signup');
};
exports.signUpError = signUpError;
var logInController = function (request, response) {
    if (request.user == undefined) {
        response.render('login');
    }
    else {
        response.redirect(pathMain);
    }
};
exports.logInController = logInController;
var logInErrorController = function (request, response) {
    response.render('user-error-login');
};
exports.logInErrorController = logInErrorController;
var logOutController = function (request, response) {
    var userData = request.user;
    request.session.destroy(function (err) {
        (0, emailingAndMessagingController_1.etherealTransporterInit)('logout', userData.email);
        response.render('logout', { nombre: userData.nombre });
    });
};
exports.logOutController = logOutController;
exports.default = {
    signUpController: exports.signUpController,
    logInController: exports.logInController,
    logInErrorController: exports.logInErrorController,
    logOutController: exports.logOutController,
};
