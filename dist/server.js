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
var daoFactory_1 = require("./daoFactory");
var faker_1 = __importDefault(require("faker"));
faker_1.default.locale = 'es';
var PORT = 8080 || process.env.PORT;
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
var pathVistaProductos = '/vista'; // Vista UI
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
////////
server.listen(PORT, function () {
    console.log("Server listen on port " + PORT);
});
server.on('error', function (error) {
    console.log(error);
});
////////
app.use(express_1.default.static(__dirname + "/public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);
app.use('/mensajes', routerMensajes);
//////// config Handlebars
// app.set('views', './views');
// app.set('view engine', 'hbs');
// app.engine(
//   'hbs',
//   handlebars({
//     extname: '.hbs',
//     defaultLayout: 'index.hbs',
//     layoutsDir: __dirname + '/views/layouts',
//     // partialDir: __dirname + '/views/partials',
//   })
// );
//////// DAO OPTIONS ////////
var MEMORY = 0;
var MONGODB = 1;
var MONGODBDBAAS = 2;
var MYSQL = 3;
var MYSQLSQLITE3 = 4;
var FILESYSTEM = 5;
var FIREBASE = 6;
///---////
var option = MONGODB;
///---////
var daoFactory = new daoFactory_1.DaoFactory();
var dao = daoFactory.getDao(option);
// Ejemplo de producto
// {
//   name: 'Producto 1',
//   price: 5000,
//   thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Computer-512.png',
// };
//////// ENDPOINTS PRODUCTOS
// VISTA TEST (Faker)
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
    console.log(cantidad);
    if (cantidad == '0') {
        res.send('No hay productos');
    }
    else {
        res.render('layouts/vista-test.ejs', {
            productos: datos,
        });
    }
});
// FILTRAR PRODUCTOS
var MongoDbDao_1 = require("./daos/MongoDbDao");
var mongoDb = new MongoDbDao_1.MongoDbDao();
// POR NOMBRE
routerProductos.post(pathBuscarNombre, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filtrar, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                filtrar = req.body.buscar;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, mongoDb.filterByName(filtrar)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 5];
            case 4:
                res.redirect('/productos/vista');
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
// POR PRECIO
routerProductos.post(pathBuscarPrecio, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var precioMin, precioMax, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                precioMin = req.body.min;
                precioMax = req.body.max;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, mongoDb.filterByPrice(precioMin, precioMax)];
            case 2:
                _a.sent();
                return [3 /*break*/, 5];
            case 3:
                error_2 = _a.sent();
                console.log(error_2);
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
            case 0: return [4 /*yield*/, mongoDb.getProductsFiltered()];
            case 1:
                productsFiltered = _e.sent();
                if (!(productsFiltered.length < 1)) return [3 /*break*/, 3];
                _b = (_a = res).render;
                _c = ['layouts/index.ejs'];
                _d = {};
                return [4 /*yield*/, dao.getProducts()];
            case 2:
                _b.apply(_a, _c.concat([(_d.productos = _e.sent(),
                        _d)]));
                return [3 /*break*/, 4];
            case 3:
                res.render('layouts/index.ejs', {
                    productos: mongoDb.getProductsFiltered(),
                });
                _e.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
routerProductos.get(pathListar, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var productos, error_3;
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
                error_3 = _a.sent();
                console.log(error_3);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
routerProductos.get(pathListarPorId, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, productById, error_4;
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
                error_4 = _a.sent();
                console.log(error_4);
                return [3 /*break*/, 6];
            case 6:
                console.log('ProductById_Server', productById);
                return [2 /*return*/];
        }
    });
}); });
routerProductos.post(pathAgregar, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var product, error_5;
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
                error_5 = _a.sent();
                console.log(error_5);
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, initializeProducts()];
            case 5:
                _a.sent();
                res.redirect('/');
                return [7 /*endfinally*/];
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(400).send({ error: 'Información incompleta' });
                _a.label = 8;
            case 8: return [3 /*break*/, 10];
            case 9:
                res.status(403).send({
                    error: -1,
                    descripcion: "ruta '" + pathAgregar + "' m\u00E9todo 'Guardar' no autorizada",
                });
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); });
routerProductos.put(pathUpdate, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, newValues, productToUpdate, error_6;
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
                error_6 = _a.sent();
                console.log(error_6);
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
                    descripcion: "ruta '" + pathUpdate + "' m\u00E9todo 'Guardar' no autorizada",
                });
                _a.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); });
routerProductos.delete(pathDelete, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, productToDelete, error_7;
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
                error_7 = _a.sent();
                console.log(error_7);
                return [3 /*break*/, 11];
            case 9: return [4 /*yield*/, initializeProducts()];
            case 10:
                _a.sent();
                return [7 /*endfinally*/];
            case 11: return [3 /*break*/, 13];
            case 12:
                res.status(403).send({
                    error: -1,
                    descripcion: "ruta '" + pathDelete + "' m\u00E9todo 'Guardar' no autorizada",
                });
                _a.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); });
//////// ENDPOINTS CARRITO
routerCarrito.get(pathListar, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cartProducts, error_8;
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
                error_8 = _a.sent();
                console.log(error_8);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
routerCarrito.post(pathAgregarPorId, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paramId, productToAdd, error_9;
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
                error_9 = _a.sent();
                console.log(error_9);
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
var messages = [];
routerMensajes.post(pathGuardarMensajes, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date, mensaje;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                date = new Date().toLocaleString('es-AR');
                mensaje = {
                    author: {
                        id: req.body.email,
                        fecha: date,
                        nombre: req.body.firstname,
                        apellido: req.body.lastname,
                        edad: req.body.age,
                        alias: req.body.nickname,
                        avatar: req.body.avatar,
                    },
                    text: req.body.text,
                };
                return [4 /*yield*/, messages.push(mensaje)];
            case 1:
                _a.sent();
                res.redirect('/');
                return [2 /*return*/];
        }
    });
}); });
//
ioServer.on('connection', function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                console.log('Un cliente se ha conectado');
                return [4 /*yield*/, initializeProducts()];
            case 1:
                _d.sent();
                console.log('messsages from ioseerver', messages);
                _b = (_a = ioServer.sockets).emit;
                _c = ['message-from-server'];
                return [4 /*yield*/, messages];
            case 2: return [4 /*yield*/, _b.apply(_a, _c.concat([_d.sent()]))];
            case 3:
                _d.sent();
                return [2 /*return*/];
        }
    });
}); });
///// SOCKETiO PRODUCTOS
var initializeProducts = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (!(option === 0)) return [3 /*break*/, 1];
                ioServer.sockets.emit('products-from-server', dao.getProductsSync());
                return [3 /*break*/, 3];
            case 1:
                _b = (_a = ioServer.sockets).emit;
                _c = ['products-from-server'];
                return [4 /*yield*/, dao.getProducts()];
            case 2:
                _b.apply(_a, _c.concat([_d.sent()]));
                _d.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
