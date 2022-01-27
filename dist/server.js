"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.numCPUs = exports.dao = exports.ioServer = exports.option = exports.isAdmin = exports.adminData = void 0;
// ADMIN INFORMATION
exports.adminData = {
    whatsappNumber: '+5491156561359',
    smsNumber: '+541156561359',
    emailEthereal: {
        address: 'sydni.lang85@ethereal.email',
        password: process.env.ETHEREAL_EMAIL_PASSWORD,
    },
    emailGmail: {
        address: 'email2cristian@gmail.com',
        password: process.env.GMAIL_APP_PASSWORD,
    },
};
// AUTHORIZATION
exports.isAdmin = true;
// DAO OPTIONS
var options = {
    MEMORY: 0,
    MONGODB: 1,
    MONGODBDBAAS: 2,
    MYSQL: 3,
    MYSQLSQLITE3: 4,
    FILESYSTEM: 5,
    FIREBASE: 6,
};
//////////////
exports.option = options.MONGODBDBAAS;
//////////////
// IMPORTS
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var SocketIO = __importStar(require("socket.io"));
var http_1 = __importDefault(require("http"));
var express_session_1 = __importDefault(require("express-session"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var daoFactory_1 = require("./daoFactory");
var passport_1 = __importDefault(require("passport"));
var connect_mongo_1 = __importDefault(require("connect-mongo"));
var compression_1 = __importDefault(require("compression"));
var cluster_1 = __importDefault(require("cluster"));
var os_1 = require("os");
// IMPORT CONTROLLERS
var vistaTestController_1 = __importDefault(require("./controllers/vistaTestController"));
var vistaInfoController_1 = __importDefault(require("./controllers/vistaInfoController"));
var vistaRandomsController_1 = __importDefault(require("./controllers/vistaRandomsController"));
var vistaMainController_1 = require("./controllers/vistaMainController");
var userAuthenticationController_1 = require("./controllers/userAuthenticationController");
var loggerWinstonController_1 = require("./controllers/loggerWinstonController");
var socketIoController_1 = __importDefault(require("./controllers/socketIoController"));
var passportController_1 = require("./controllers/passportController");
var carritoRouter_1 = __importDefault(require("./router/carritoRouter"));
var productosRouter_1 = __importDefault(require("./router/productosRouter"));
var mensajesRouter_1 = __importDefault(require("./router/mensajesRouter"));
var PORT = process.env.PORT || +process.argv[2] || 8080;
var app = (0, express_1.default)();
var __dirname = path_1.default.resolve();
var server = http_1.default.createServer(app); // antes estaba como Server(app)
var ioServer = new SocketIO.Server(server);
exports.ioServer = ioServer;
var daoFactory = new daoFactory_1.DaoFactory();
exports.dao = daoFactory.getDao(exports.option);
exports.numCPUs = (0, os_1.cpus)().length;
// Paths
var pathVistaTest = '/vista-test';
var pathBuscarNombre = '/filtrar-nombre';
var pathBuscarPrecio = '/filtrar-precio';
var pathLogin = '/login';
var pathLogout = '/logout';
var pathSignUp = '/signup';
var pathSignUpError = '/failsignup';
var pathLoginError = '/faillogin';
var pathVistaInfo = '/info';
var pathVistaRandom = '/randoms';
var pathMain = '/';
// Server listening
var ServerInit = function () {
    server.listen(PORT, function () {
        loggerWinstonController_1.consoleLogger.info("Server listen on port ".concat(PORT));
        loggerWinstonController_1.consoleLogger.info("PID ".concat(process.pid));
    });
    server.on('error', function (error) {
        loggerWinstonController_1.errorLogger.error('Server Error:', error);
    });
};
process.on('SIGTERM', function () {
    server.close(function () {
        exports.dao.closeConnection();
        loggerWinstonController_1.consoleLogger.info('adios!');
    });
});
process.on('exit', function (code) {
    loggerWinstonController_1.consoleLogger.info('Process on exit', code);
});
// CLUSTER
if (process.argv[3] == 'CLUSTER') {
    if (cluster_1.default.isPrimary) {
        loggerWinstonController_1.consoleLogger.info("Primary ".concat(process.pid, " is running"));
        for (var index = 0; index < exports.numCPUs; index++) {
            cluster_1.default.fork();
        }
        cluster_1.default.on('exit', function (worker) {
            loggerWinstonController_1.consoleLogger.info("Primary PID: ".concat(process.pid));
            loggerWinstonController_1.consoleLogger.info("Worker ".concat(worker.process.pid, " died"));
            cluster_1.default.fork();
        });
    }
    else {
        ServerInit();
    }
}
else {
    ServerInit();
}
// Middlewares
app.use(express_1.default.static("".concat(__dirname, "/public")));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // Esto es para que el request lea el body
app.use((0, compression_1.default)());
// Session
app.use((0, express_session_1.default)({
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGODB_URI,
        //mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: 'keyboard cat',
    cookie: {
        httpOnly: false,
        secure: false,
        // maxAge: 5_000,
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// SOCKET IO
(0, socketIoController_1.default)();
// EJS SETUP
app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'ejs');
// ENDPOINTS USER AUTHENTICATION
//signup
app.get(pathSignUp, userAuthenticationController_1.signUpController);
app.post(pathSignUp, passport_1.default.authenticate(passportController_1.signUpStrategyName, {
    failureRedirect: '/failsignup',
}), function (_request, response) {
    return response.redirect(pathMain);
});
app.get(pathSignUpError, userAuthenticationController_1.signUpError);
//login
app.get(pathLogin, userAuthenticationController_1.logInController);
app.post(pathLogin, passport_1.default.authenticate(passportController_1.loginStrategyName, {
    failureRedirect: '/faillogin',
}), function (_request, response) {
    return response.redirect(pathMain);
});
app.get(pathLoginError, userAuthenticationController_1.logInErrorController);
app.get(pathLogout, userAuthenticationController_1.logOutController);
// ENDPOINTS MAIN
app.post(pathBuscarNombre, vistaMainController_1.mainFilterByNameController);
app.post(pathBuscarPrecio, vistaMainController_1.mainFilterByPriceController);
app.get(pathMain, vistaMainController_1.vistaMain);
// ENDPOINT PRODUCTOS
app.use('/productos', productosRouter_1.default);
// ENDPOINT CARRITO
app.use('/carrito', carritoRouter_1.default);
// ENDPOINT CHAT
app.use('/mensajes', mensajesRouter_1.default);
// ENDPOINT VISTA TEST (Faker)
app.get(pathVistaTest, vistaTestController_1.default);
// ENDPOINT VISTA INFO
app.get(pathVistaInfo, vistaInfoController_1.default);
// ENDPOINT NUMEROS RANDOM
app.get(pathVistaRandom, vistaRandomsController_1.default);
