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
var memoria_1 = require("./memoria");
var carrito_1 = require("./carrito");
var path_1 = __importDefault(require("path"));
var express_handlebars_1 = __importDefault(require("express-handlebars"));
var SocketIO = __importStar(require("socket.io"));
var http_1 = __importDefault(require("http"));
// import knex
var knex_1 = __importDefault(require("knex"));
/////////////////
// SQLite3 (borrar)
var SQLite3_1 = require("./options/SQLite3");
var knex_msj = (0, knex_1.default)(SQLite3_1.options_sqlite3);
/////////////////
// mariaDB
var mariaDB_1 = require("./options/mariaDB");
// Mongoose
var mongoose_1 = __importDefault(require("mongoose"));
var mensajes_1 = require("./models/mensajes");
var productos_1 = require("./models/productos");
var knex_products = (0, knex_1.default)(mariaDB_1.options_mariaDB);
var PORT = 8080 || process.env.PORT;
var app = (0, express_1.default)();
var routerProductos = express_1.default.Router();
var routerCarrito = express_1.default.Router();
var __dirname = path_1.default.resolve();
var memoria = new memoria_1.Memoria();
var carrito = new carrito_1.Carrito();
var server = http_1.default.createServer(app); // antes estaba como Server(app)
var ioServer = new SocketIO.Server(server);
var isAdmin = true;
// Rutas (URL) Productos
var pathVistaProductos = '/vista'; // Vista UI
var pathListar = '/listar';
var pathListarPorId = '/listar/:id';
var pathAgregar = '/agregar';
var pathAgregarPorId = '/agregar/:id_producto';
var pathUpdate = '/actualizar/:id';
var pathDelete = '/borrar/:id_producto';
////////
app.use(express_1.default.static(__dirname + "/public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);
//////// config Handlebars
app.set('views', './views');
app.set('view engine', 'hbs');
////////
app.engine('hbs', (0, express_handlebars_1.default)({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    // partialDir: __dirname + '/views/partials',
}));
////////
server.listen(PORT, function () {
    console.log("Server listen on port " + PORT);
});
server.on('error', function (error) {
    console.log(error);
});
////////
// Ejemplo de producto
// {
//   title: 'Producto 1',
//   precio: 5000,
//   thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Computer-512.png',
// };
////////
//////// EndPoints Prodcutos
routerProductos.get(pathVistaProductos, function (req, res) {
    res.render('layouts/index.ejs', {
        productos: memoria.getArray(),
    });
});
routerProductos.get(pathListar, function (req, res) {
    var result = memoria.getArray();
    if (result.length > 0) {
        res.status(200).send(JSON.stringify(result));
        knex_listar();
    }
    else {
        res.status(404).send({ error: 'No hay productos cargados' });
    }
});
routerProductos.get(pathListarPorId, function (req, res) {
    var paramId = req.params.id;
    var result = memoria.getElementById(paramId);
    if (result == null) {
        res.status(404).send('Producto no encontrado');
    }
    res.status(200).send(JSON.stringify(result));
});
routerProductos.post(pathAgregar, function (req, res) {
    if (isAdmin) {
        var product = req.body;
        if (product.name && product.description && product.code) {
            mongooseLocalProductosAdd(product);
            // memoria.addElement(product);
            ioServer.sockets.emit('cargarProductos', memoria.getArray());
            // knex_productsRecord();
            res.redirect('/');
        }
        else {
            res.status(400).send({ error: 'Información incompleta' });
        }
    }
    else {
        res.send({
            error: -1,
            descripcion: "ruta '" + pathAgregar + "' m\u00E9todo 'Guardar' no autorizada",
        });
    }
});
routerProductos.put(pathUpdate, function (req, res) {
    if (isAdmin) {
        var paramId = req.params.id;
        var newProduct = req.body;
        console.log('new product', newProduct);
        memoria.updateObject(newProduct, paramId);
        console.log('get array:', memoria.getArray());
        mongooseLocalProductosUpdate(newProduct, paramId);
        // knex_update(newProduct, paramId);
        res.send(newProduct);
    }
    else {
        res.send({
            error: -1,
            descripcion: "ruta '" + pathUpdate + "' m\u00E9todo 'Guardar' no autorizada",
        });
    }
});
routerProductos.delete(pathDelete, function (req, res) {
    if (isAdmin) {
        var paramId = req.params.id_producto;
        console.log('paramID', paramId);
        var deletedObject = memoria.getElementById(paramId);
        memoria.deleteObject(paramId);
        mongooseLocalProductosDelete(paramId);
        // knex_delete(paramId);
        res.status(200).send(deletedObject);
    }
    else {
        res.send({
            error: -1,
            descripcion: "ruta '" + pathDelete + "' m\u00E9todo 'Guardar' no autorizada",
        });
    }
});
//////// EndPoints Carrito
routerCarrito.get(pathListar, function (req, res) {
    var productos = carrito.getProductos();
    res.send({
        idCarrito: carrito.getId(),
        timestampCarrito: carrito.getTimestamp(),
        ProductosEnCarrito: productos,
    });
});
routerCarrito.post(pathAgregarPorId, function (req, res) {
    var paramId = req.params.id_producto;
    console.log('agregar al carrito param id', paramId);
    var producto = memoria.getElementById(paramId);
    carrito.addProducto(producto);
    res.send(producto);
    // res.redirect('/');
});
routerCarrito.delete(pathDelete, function (req, res) {
    var paramId = req.params.id_producto;
    var deletedObject = carrito.getProductoById(paramId);
    console.log('deleted object', deletedObject);
    carrito.deleteProducto(paramId);
    res.status(200).send(deletedObject);
});
/////////////// ioServer
// esto esta en mongoose Local
ioServer.on('connection', function (socket) {
    socket.emit('cargarProductos', memoria.getArray());
    console.log('Se conecto en el back');
});
var messages = [];
ioServer.on('connection', function (socket) {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', messages);
    socket.on('new-message', function (data) {
        chatMongoose(data); //mongoose
        messages.push(data);
        // chatRecord(); 'sqLite3'
        ioServer.sockets.emit('messages', messages);
    });
});
//////////////
// Mensajes con SQLite3 y KNEX
var tableName_msj = 'chatTable';
var chatRecord = function () {
    knex_msj.schema.hasTable(tableName_msj).then(function (exist) {
        if (exist) {
            knex_msj.schema.dropTable(tableName_msj).then(runChatRecord);
            return;
        }
        runChatRecord();
    });
};
var runChatRecord = function () {
    knex_msj.schema
        .createTable(tableName_msj, function (table) {
        table.string('author');
        table.string('text');
    })
        .then(function () {
        knex_msj(tableName_msj)
            .insert(messages) //insertar datos 'messages' en la tabla
            .then(function () {
            console.log('chat guardado en SQLite3');
        })
            .catch(function (error) {
            console.log(error);
            throw error;
        })
            .finally(function () { });
    });
};
////////////////////////////// Productos con mariaDB y KNEX
var tableName_products = 'productsTable';
var knex_productsRecord = function () {
    // SI TABLA EXISTE O NO
    knex_products.schema.hasTable(tableName_products).then(function (exist) {
        if (exist) {
            knex_products.schema.dropTable(tableName_products).then(productsPersist);
            return;
        }
        productsPersist();
    });
};
var productsPersist = function () {
    // CREAR TABLA
    knex_products.schema
        .createTable(tableName_products, function (table) {
        table.string('name', 25);
        table.string('description', 50);
        table.string('code', 12);
        table.string('thumbnail', 50);
        table.float('price');
        table.integer('stock');
        table.string('_id');
        table.integer('__v');
    })
        .then(function () {
        console.log('tabla creada');
        knex_products(tableName_products)
            .insert(memoria.getArray())
            .then(function () {
            console.log('datos insertados');
        })
            .catch(function (error) {
            console.log(error);
        });
    });
};
var knex_listar = function () {
    knex_products // mostrar datos de la tabla 'tableName'
        .from(tableName_products)
        .select('*')
        .then(function (rows) {
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            console.log(row['__v'] + " " + row['_id'] + " " + row['name'] + " " + row['description'] + " " + row['code'] + " " + row['thumbnail'] + " " + row['price'] + "  " + row['stock'] + " ");
        }
    });
};
// UPDATE
var knex_update = function (newProduct, paramId) {
    knex_products
        .from(tableName_products)
        .where('id', paramId)
        .update('name', newProduct.name)
        .update('description', newProduct.description)
        .update('code', newProduct.code)
        .update('thumbnail', newProduct.thumbnail)
        .update('price', newProduct.price)
        .update('stock', newProduct.stock)
        .then(function () {
        console.log("Prodcuto con id " + paramId + " fue actualizado");
    });
};
// DELETE
var knex_delete = function (paramId) {
    knex_products
        .from(tableName_products)
        .where('id', paramId)
        .del()
        .then(function () {
        console.log("Producto con id " + paramId + " eliminado");
    });
};
////// MENSAJES CON MONGOOSE (MONGODB)
var chatMongoose = function (messages) {
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, _b, _c, _d, error_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 4, 5, 6]);
                    return [4 /*yield*/, mongoose_1.default.connect('mongodb://localhost:27017/ecommerce')];
                case 1:
                    _e.sent();
                    console.log('Base de datos conectada');
                    _b = (_a = console).log;
                    return [4 /*yield*/, mensajes_1.modelMensajes.insertMany(messages)];
                case 2:
                    _b.apply(_a, [_e.sent()]);
                    _d = (_c = console).log;
                    return [4 /*yield*/, mensajes_1.modelMensajes.find()];
                case 3:
                    _d.apply(_c, [_e.sent()]);
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _e.sent();
                    console.log(error_1);
                    return [3 /*break*/, 6];
                case 5:
                    mongoose_1.default.disconnect(function () {
                        console.log('Base de datos desconectada');
                    });
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); })();
};
//////////////// PRODUCTOS CON MONGOOSE
var mongooseLocalProductosAdd = function (producto) {
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    return [4 /*yield*/, mongoose_1.default.connect('mongodb://localhost:27017/ecommerce')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, productos_1.modelProductos.insertMany(producto)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    console.log(error_2);
                    return [3 /*break*/, 5];
                case 4:
                    mongoose_1.default.disconnect(function () {
                        console.log('Base de datos desconectada');
                        mongooseLocalProductosRead();
                    });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); })();
};
// lee la base de datos y la guarda en el array productos
var mongooseLocalProductosRead = function () {
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var productos, _i, productos_2, producto, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    return [4 /*yield*/, mongoose_1.default.connect('mongodb://localhost:27017/ecommerce')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, productos_1.modelProductos.find()];
                case 2:
                    productos = _a.sent();
                    memoria.emptyArray();
                    for (_i = 0, productos_2 = productos; _i < productos_2.length; _i++) {
                        producto = productos_2[_i];
                        memoria.addElement(producto);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    console.log(error_3);
                    return [3 /*break*/, 5];
                case 4:
                    mongoose_1.default.disconnect(function () {
                        console.log('Base de datos desconectada');
                    });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); })();
};
mongooseLocalProductosRead();
var mongooseLocalProductosDelete = function (id) {
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    return [4 /*yield*/, mongoose_1.default.connect('mongodb://localhost:27017/ecommerce')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, productos_1.modelProductos.deleteOne({ _id: id })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_4 = _a.sent();
                    console.log(error_4);
                    return [3 /*break*/, 5];
                case 4:
                    mongoose_1.default.disconnect(function () {
                        console.log('Base de datos desconectada');
                    });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); })();
};
var mongooseLocalProductosUpdate = function (newProduct, id) {
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, 4, 5]);
                    return [4 /*yield*/, mongoose_1.default.connect('mongodb://localhost:27017/ecommerce')];
                case 1:
                    _a.sent();
                    console.log(newProduct);
                    return [4 /*yield*/, productos_1.modelProductos.updateOne({ _id: id }, {
                            $set: {
                                name: newProduct.name,
                                description: newProduct.description,
                                code: newProduct.code,
                                thumbnail: newProduct.thumbnail,
                                price: newProduct.price,
                                stock: newProduct.stock,
                            },
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_5 = _a.sent();
                    console.log(error_5);
                    return [3 /*break*/, 5];
                case 4:
                    mongoose_1.default.disconnect(function () {
                        console.log('Base de datos desconectada');
                        mongooseLocalProductosRead();
                    });
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); })();
};
