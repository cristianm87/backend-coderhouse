"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpStrategyName = exports.loginStrategyName = void 0;
var bcrypt_1 = __importDefault(require("bcrypt"));
var passport_local_1 = __importDefault(require("passport-local"));
var passport_1 = __importDefault(require("passport"));
var modelLogin_1 = require("../models/modelLogin");
var emailingAndMessagingController_1 = require("./emailingAndMessagingController");
////////// PASSPORT DBAAS ////////////
var createHash = function (password) {
    return bcrypt_1.default.hashSync(password, bcrypt_1.default.genSaltSync(10));
};
var isValidPassword = function (user, password) { return bcrypt_1.default.compareSync(password, user.password); };
exports.loginStrategyName = 'login';
exports.signUpStrategyName = 'signup';
passport_1.default.use(exports.loginStrategyName, new passport_local_1.default.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, function (_request, username, password, done) {
    modelLogin_1.modelLogin.findOne({
        email: username,
    }, function (error, user) {
        if (error) {
            return done(error);
        }
        if (!user) {
            console.log("User Not Found with username ".concat(username));
            return done(null, false);
        }
        if (!isValidPassword(user, password)) {
            console.log('Invalid Password');
            return done(null, false);
        }
        return done(null, user);
    });
}));
passport_1.default.use(exports.signUpStrategyName, new passport_local_1.default.Strategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, function (request, username, password, done) {
    modelLogin_1.modelLogin.findOne({
        email: username,
    }, function (error, user) {
        if (error) {
            console.log("Error in SignUp: ".concat(error));
            return done(error);
        }
        if (user) {
            console.log('User already exists');
            return done(null, false);
        }
        var newUser = new modelLogin_1.modelLogin();
        newUser.email = username;
        newUser.password = createHash(password);
        newUser.nombre = request.body.nombre;
        newUser.direccion = request.body.direccion;
        newUser.edad = request.body.edad;
        newUser.telefono = request.body.telefono;
        newUser.avatar = request.body.avatar;
        return newUser.save(function (error) {
            if (error) {
                console.log("Error in Saving user: ".concat(error));
                throw error;
            }
            (0, emailingAndMessagingController_1.etherealTransporterInit)('New Signup', newUser);
            console.log('User Registration succesful');
            return done(null, newUser);
        });
    });
}));
passport_1.default.serializeUser(function (user, done) {
    done(null, user._id);
});
passport_1.default.deserializeUser(function (id, done) {
    modelLogin_1.modelLogin.findById(id, function (error, user) {
        return done(error, user);
    });
});
exports.default = { loginStrategyName: exports.loginStrategyName, signUpStrategyName: exports.signUpStrategyName };
