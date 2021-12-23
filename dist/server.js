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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var SocketIO = __importStar(require("socket.io"));
var http_1 = __importDefault(require("http"));
var express_session_1 = __importDefault(require("express-session"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var daoFactory_1 = require("./daoFactory");
var passport_facebook_1 = __importDefault(require("passport-facebook"));
var passport_1 = __importDefault(require("passport"));
var compression_1 = __importDefault(require("compression"));
var winston_1 = __importDefault(require("winston"));
var faker_1 = __importDefault(require("faker"));
faker_1.default.locale = 'es';
// IMPORT CLUSTER //
var cluster_1 = __importDefault(require("cluster"));
var os_1 = require("os");
var numCPUs = (0, os_1.cpus)().length;
// import normalizr from 'normalizr';
var normalizr = require('normalizr');
var PORT = process.env.PORT || +process.argv[2] || 8080;
var app = (0, express_1.default)();
var routerProductos = express_1.default.Router();
var routerCarrito = express_1.default.Router();
var routerMensajes = express_1.default.Router();
var __dirname = path_1.default.resolve();
var server = http_1.default.createServer(app); // antes estaba como Server(app)
var ioServer = new SocketIO.Server(server);
// AUTHORIZATION
var isAdmin = true;
// Rutas (URL) Productos
var pathVistaProductos = '/vista';
var pathListar = '/listar';
var pathListarPorId = '/listar/:id';
var pathAgregar = '/agregar';
var pathAgregarPorId = '/agregar/:id';
var pathUpdate = '/actualizar/:id';
var pathDelete = '/borrar/:id';
var pathVistaTest = '/vista-test';
var pathBuscarNombre = '/filtrar-nombre';
var pathBuscarPrecio = '/filtrar-precio';
var pathGuardarMensajes = '/guardar';
var pathLogin = '/login';
var pathLogout = '/logout';
var pathMain = '/';
//////////// WINSTON LOGGER ////////////
var consoleLogger = winston_1.default.createLogger({
    level: 'info',
    transports: [new winston_1.default.transports.Console({})],
});
var errorLogger = winston_1.default.createLogger({
    level: 'error',
    transports: [
        new winston_1.default.transports.File({
            filename: 'error.log',
        }),
    ],
});
var warnLogger = winston_1.default.createLogger({
    level: 'warn',
    transports: [
        new winston_1.default.transports.File({
            filename: 'warn.log',
        }),
    ],
});
warnLogger.warn('Prueba warnLogger');
// Server listen
var ServerInit = function () {
    server.listen(PORT, function () {
        consoleLogger.info("Server listen on port ".concat(PORT));
        consoleLogger.info("PID ".concat(process.pid));
    });
    server.on('error', function (error) {
        errorLogger.error('Server Error:', error);
    });
};
process.on('SIGTERM', function () {
    server.close(function () {
        console.log('adios!');
        dao.closeConnection();
    });
});
process.on('exit', function (code) {
    console.log(code);
});
//////////// CLUSTER ////////////
if (process.argv[3] == 'CLUSTER') {
    if (cluster_1.default.isPrimary) {
        console.log("Primary ".concat(process.pid, " is running"));
        for (var index = 0; index < numCPUs; index++) {
            cluster_1.default.fork();
        }
        cluster_1.default.on('exit', function (worker) {
            console.log("Primary PID: ".concat(process.pid));
            console.log("Worker ".concat(worker.process.pid, " died"));
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
app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);
app.use('/mensajes', routerMensajes);
app.use((0, compression_1.default)());
// Ejs Config
app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'ejs');
//////////// DAO OPTIONS ////////////
var MEMORY = 0;
var MONGODB = 1;
var MONGODBDBAAS = 2;
var MYSQL = 3;
var MYSQLSQLITE3 = 4;
var FILESYSTEM = 5;
var FIREBASE = 6;
//
var option = MONGODBDBAAS;
//
var daoFactory = new daoFactory_1.DaoFactory();
var dao = daoFactory.getDao(option);
//////////// ENDPOINTS PRODUCTOS ////////////
routerProductos.get(pathListar, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productos, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                productos = [];
                if (!(option === 0)) return [3 /*break*/, 1];
                productos = dao.getProductsSync();
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, dao.getProducts()];
            case 2:
                productos = _a.sent();
                _a.label = 3;
            case 3:
                if (productos.length < 1) {
                    res.status(404).send('No hay productos para mostrar');
                }
                else {
                    res.status(200).send(JSON.stringify(productos));
                }
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
routerProductos.get(pathListarPorId, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, productById, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paramId = req.params.id;
                productById = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (!(option === 0 || option === 5)) return [3 /*break*/, 2];
                productById = dao.getProductByIdSync(paramId);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, dao.getProductById(paramId)];
            case 3:
                productById = _a.sent();
                _a.label = 4;
            case 4:
                if (productById === undefined || Object.keys(productById).length === 0) {
                    res.status(404).send('Producto no encontrado');
                }
                else {
                    res.status(200).send(JSON.stringify(productById));
                }
                return [3 /*break*/, 6];
            case 5:
                error_2 = _a.sent();
                console.log(error_2);
                return [3 /*break*/, 6];
            case 6:
                console.log('ProductById_Server', productById);
                return [2 /*return*/];
        }
    });
}); });
routerProductos.post(pathAgregar, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isAdmin) return [3 /*break*/, 9];
                product = req.body;
                if (!(product.name && product.description && product.code)) return [3 /*break*/, 7];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 6]);
                return [4 /*yield*/, dao.insertProduct(product)];
            case 2:
                _a.sent();
                return [3 /*break*/, 6];
            case 3:
                error_3 = _a.sent();
                console.log(error_3);
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, initializeProducts()];
            case 5:
                _a.sent();
                res.redirect(pathMain);
                return [7 /*endfinally*/];
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(400).send({ error: 'Información incompleta' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(403).send({
                    error: -1,
                    descripcion: "ruta '".concat(pathAgregar, "' m\u00E9todo 'Guardar' no autorizada"),
                });
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); });
routerProductos.put(pathUpdate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, newValues, productToUpdate, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isAdmin) return [3 /*break*/, 12];
                paramId = req.params.id;
                newValues = req.body;
                productToUpdate = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, 9, 11]);
                if (!(option === 0 || option === 5)) return [3 /*break*/, 2];
                productToUpdate = dao.getProductByIdSync(paramId);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, dao.getProductById(paramId)];
            case 3:
                productToUpdate = _a.sent();
                _a.label = 4;
            case 4:
                if (!(productToUpdate === undefined ||
                    Object.keys(productToUpdate).length === 0)) return [3 /*break*/, 5];
                res.status(404).send('Producto no encontrado');
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, dao.updateProduct(newValues, paramId)];
            case 6:
                _a.sent();
                res.status(200).send(JSON.stringify({
                    productoAactualizar: productToUpdate,
                    valoresActualizados: newValues,
                }));
                _a.label = 7;
            case 7: return [3 /*break*/, 11];
            case 8:
                error_4 = _a.sent();
                console.log(error_4);
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, initializeProducts()];
            case 10:
                _a.sent();
                return [7 /*endfinally*/];
            case 11:
                console.log('productToUpdate', productToUpdate);
                return [3 /*break*/, 13];
            case 12:
                res.status(403).send({
                    error: -1,
                    descripcion: "ruta '".concat(pathUpdate, "' m\u00E9todo 'Guardar' no autorizada"),
                });
                _a.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); });
routerProductos.delete(pathDelete, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, productToDelete, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isAdmin) return [3 /*break*/, 12];
                paramId = req.params.id;
                productToDelete = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 8, 9, 11]);
                if (!(option === 0 || option === 5)) return [3 /*break*/, 2];
                productToDelete = dao.getProductByIdSync(paramId);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, dao.getProductById(paramId)];
            case 3:
                productToDelete = _a.sent();
                _a.label = 4;
            case 4:
                if (!(productToDelete === undefined ||
                    Object.keys(productToDelete).length === 0)) return [3 /*break*/, 5];
                res.status(404).send('Producto no encontrado');
                return [3 /*break*/, 7];
            case 5: return [4 /*yield*/, dao.deleteProduct(paramId)];
            case 6:
                _a.sent();
                res
                    .status(200)
                    .send(JSON.stringify({ productoEliminado: productToDelete }));
                _a.label = 7;
            case 7:
                console.log('productToDelete Server', productToDelete);
                return [3 /*break*/, 11];
            case 8:
                error_5 = _a.sent();
                console.log(error_5);
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, initializeProducts()];
            case 10:
                _a.sent();
                return [7 /*endfinally*/];
            case 11: return [3 /*break*/, 13];
            case 12:
                res.status(403).send({
                    error: -1,
                    descripcion: "ruta '".concat(pathDelete, "' m\u00E9todo 'Guardar' no autorizada"),
                });
                _a.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); });
//////////// ENDPOINTS CARRITO ////////////
routerCarrito.get(pathListar, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cartProducts, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cartProducts = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (!(option === 0)) return [3 /*break*/, 2];
                cartProducts = dao.getCartProductsSync();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, dao.getCartProducts()];
            case 3:
                cartProducts = _a.sent();
                _a.label = 4;
            case 4:
                if (cartProducts.length < 1) {
                    res.status(404).send('El carrito esta vacio');
                }
                else {
                    res.status(200).send(JSON.stringify({
                        idCarrito: dao.getCartId(),
                        timestampCarrito: dao.getCartTimestamp(),
                        ProductosEnElCarrito: cartProducts,
                    }));
                }
                return [3 /*break*/, 6];
            case 5:
                error_6 = _a.sent();
                console.log(error_6);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
routerCarrito.post(pathAgregarPorId, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, productToAdd, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paramId = req.params.id;
                productToAdd = {};
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                if (!(option === 0 || option === 5)) return [3 /*break*/, 2];
                productToAdd = dao.getProductByIdSync(paramId);
                console.log('ProductToAdd', productToAdd);
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, dao.getProductById(paramId)];
            case 3:
                productToAdd = _a.sent();
                _a.label = 4;
            case 4:
                if (productToAdd === undefined || Object.keys(productToAdd).length === 0) {
                    res.status(404).send('Producto no encontrado');
                }
                else {
                    dao.addToCart(productToAdd);
                    res.status(200).send(JSON.stringify({ productoAgregado: productToAdd }));
                }
                return [3 /*break*/, 6];
            case 5:
                error_7 = _a.sent();
                console.log(error_7);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
routerCarrito.delete(pathDelete, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, productToDelete;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                paramId = req.params.id;
                productToDelete = {};
                if (!(option === 0 || option === 5)) return [3 /*break*/, 1];
                productToDelete = dao.getCartProductByIdSync(paramId);
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, dao.getCartProductById(paramId)];
            case 2:
                productToDelete = _a.sent();
                _a.label = 3;
            case 3:
                if (productToDelete === undefined ||
                    Object.keys(productToDelete).length === 0) {
                    res.status(404).send('Producto no encontrado');
                }
                else {
                    dao.deleteProductCart(paramId);
                    res
                        .status(200)
                        .send(JSON.stringify({ productoEliminado: productToDelete }));
                }
                console.log('cartProductById_FromDelete', productToDelete);
                return [2 /*return*/];
        }
    });
}); });
//////////// SOCKET IO ////////////
ioServer.on('connection', function (_socket) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // console.log('Un cliente se ha conectado');
            return [4 /*yield*/, initializeProducts()];
            case 1:
                // console.log('Un cliente se ha conectado');
                _a.sent();
                return [4 /*yield*/, initializeNormalizedMessages()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
// Socket IO Productos
var initializeProducts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c, error_8;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!(option === 0)) return [3 /*break*/, 1];
                ioServer.sockets.emit('products-from-server', dao.getProductsSync());
                return [3 /*break*/, 5];
            case 1:
                _d.trys.push([1, 4, , 5]);
                _b = (_a = ioServer.sockets).emit;
                _c = ['products-from-server'];
                return [4 /*yield*/, dao.getProducts()];
            case 2: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3:
                _d.sent();
                return [3 /*break*/, 5];
            case 4:
                error_8 = _d.sent();
                console.error('initializeProducts()', error_8);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
// Socket IO Messages
routerMensajes.post(pathGuardarMensajes, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, date, mensaje;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                body = req.body;
                date = new Date().toLocaleString('es-AR');
                mensaje = {
                    author: {
                        email: body.email,
                        nombre: body.firstname,
                        apellido: body.lastname,
                        edad: body.age,
                        alias: body.nickname,
                        avatar: body.avatar,
                    },
                    fecha: date,
                    text: body.text,
                };
                return [4 /*yield*/, dao.insertMessage(mensaje)];
            case 1:
                _a.sent();
                res.redirect(pathMain);
                return [2 /*return*/];
        }
    });
}); });
// Socket IO Messages Normalizr
var initializeNormalizedMessages = function () { return __awaiter(void 0, void 0, void 0, function () {
    var authorSchema, messageSchema, messagesSchema, messagesFromDb, messages, messagesData, normalizedData, _a, _b, _c, error_9;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                authorSchema = new normalizr.schema.Entity('author', undefined, {
                    idAttribute: 'email',
                });
                messageSchema = new normalizr.schema.Entity('message', {
                    author: authorSchema,
                });
                messagesSchema = new normalizr.schema.Entity('messages', {
                    messages: [messageSchema],
                });
                messagesFromDb = [];
                messages = [];
                if (!(option === 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, dao.getMessagesSync()];
            case 1:
                messagesFromDb = _d.sent();
                return [3 /*break*/, 4];
            case 2:
                if (!(option === 1 || option === 2)) return [3 /*break*/, 4];
                return [4 /*yield*/, dao.getMessages()];
            case 3:
                messagesFromDb = _d.sent();
                _d.label = 4;
            case 4:
                messagesFromDb.forEach(function (e, i) {
                    messages.push({
                        id: i + 1,
                        author: {
                            email: e.author.email,
                            nombre: e.author.nombre,
                            apellido: e.author.apellido,
                            edad: e.author.edad,
                            alias: e.author.alias,
                            avatar: e.author.avatar,
                        },
                        fecha: e.fecha,
                        text: e.text,
                    });
                });
                messagesData = {
                    id: 1,
                    messages: [],
                };
                messagesData.messages = messages;
                normalizedData = normalizr.normalize(messagesData, messagesSchema);
                _d.label = 5;
            case 5:
                _d.trys.push([5, 7, , 8]);
                _b = (_a = ioServer.sockets).emit;
                _c = ['message-from-server'];
                return [4 /*yield*/, normalizedData];
            case 6:
                _b.apply(_a, _c.concat([_d.sent()]));
                return [3 /*break*/, 8];
            case 7:
                error_9 = _d.sent();
                console.error('initializeMessages()', error_9);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
//////////// VISTA PRODUCTOS ////////////
// Filtro por nombre
routerProductos.post(pathBuscarNombre, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filtrar, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filtrar = req.body.buscar;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, dao.filterByName(filtrar)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                error_10 = _a.sent();
                console.log(error_10);
                return [3 /*break*/, 5];
            case 4:
                res.redirect('/productos/vista');
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Filtro por precio
routerProductos.post(pathBuscarPrecio, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var precioMin, precioMax, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                precioMin = req.body.min;
                precioMax = req.body.max;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, dao.filterByPrice(precioMin, precioMax)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                error_11 = _a.sent();
                console.log(error_11);
                return [3 /*break*/, 5];
            case 4:
                res.redirect('/productos/vista');
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
routerProductos.get(pathVistaProductos, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productsFiltered, _a, _b, _c;
    var _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0: return [4 /*yield*/, dao.getProductsFiltered()];
            case 1:
                productsFiltered = _e.sent();
                if (!(productsFiltered.length < 1)) return [3 /*break*/, 5];
                if (!(option === 0)) return [3 /*break*/, 2];
                res.render('productos', {
                    productos: dao.getProductsSync(),
                });
                return [3 /*break*/, 4];
            case 2:
                _b = (_a = res).render;
                _c = ['productos'];
                _d = {};
                return [4 /*yield*/, dao.getProducts()];
            case 3:
                _b.apply(_a, _c.concat([(_d.productos = _e.sent(),
                        _d)]));
                _e.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                res.render('productos', {
                    productos: dao.getProductsFiltered(),
                });
                _e.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); });
//////////// VISTA TEST (Faker) ////////////
routerProductos.get(pathVistaTest, function (req, res) {
    var datos = [];
    var cantidad = req.query.cant || 10;
    var id = 1;
    for (var index = 0; index < cantidad; index++) {
        datos.push({
            id: id++,
            nombre: faker_1.default.commerce.productName(),
            precio: faker_1.default.commerce.price(),
            foto: faker_1.default.image.image(),
        });
    }
    if (cantidad == '0') {
        res.send('No hay productos');
    }
    else {
        res.render('test', {
            productos: datos,
        });
    }
});
//////////// VISTA INFO ////////////
app.get('/info', function (req, res) {
    var info = {
        argumentosDeEntrada: process.argv,
        nombreDeLaPlataforma: process.platform,
        pathDeEjecución: process.argv[0],
        processId: process.pid,
        versionDeNodeJs: process.version,
        usoDeMemoria: process.memoryUsage(),
        carpetaCorriente: process.cwd(),
        nucleosCpu: numCPUs,
    };
    res.render('info', { info: info });
});
//////////// NUMEROS RANDOMS ////////////
app.get('/randoms', function (req, res) {
    var cantidad = Number(req.query.cant) || 100000000;
    var fork = require('child_process').fork;
    var child = fork('./dist/child.js');
    child.send(cantidad);
    child.on('message', function (message) {
        return res.status(200).send(JSON.stringify(message));
    });
});
//////////// PASSPORT FACEBOOK ////////////
var FACEBOOK_CLIENT_ID = +process.argv[3] || process.env.FACEBOOK_ID;
var FACEBOOK_CLIENT_SECRET = +process.argv[4] || process.env.FACEBOOK_CLIENT;
passport_1.default.use(new passport_facebook_1.default.Strategy({
    clientID: FACEBOOK_CLIENT_ID,
    clientSecret: FACEBOOK_CLIENT_SECRET,
    callbackURL: '/oklogin',
    profileFields: ['id', 'displayName', 'photos', 'emails'],
}, function (_accessToken, _refreshToken, profile, done) {
    // console.log(profile);
    return done(null, profile);
}));
passport_1.default.serializeUser(function (user, done) { return done(null, user); });
passport_1.default.deserializeUser(function (user, done) { return done(null, user); });
var sessionHandler = (0, express_session_1.default)({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true,
    // store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/ecommerce' }),
    // cookie: {
    //   maxAge: 5_000,
    // },
    rolling: true,
});
app.use(sessionHandler);
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.get(pathMain, function (request, response) {
    if (request.isAuthenticated()) {
        return response.render('index', { userData: request.user });
    }
    return response.render('login');
});
app.post(pathLogin, passport_1.default.authenticate('facebook'));
app.get('/oklogin', passport_1.default.authenticate('facebook', {
    successRedirect: pathMain,
    failureRedirect: '/faillogin',
}));
app.get('/faillogin', function (_request, response) {
    return response.render('user-error-login');
});
app.get(pathLogout, function (request, response) {
    var userData = request.user;
    request.logout();
    return response.render('logout', { userData: userData });
});
