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
var express_1 = __importDefault(require("express"));
var memoria_1 = require("./memoria");
var path_1 = __importDefault(require("path"));
var express_handlebars_1 = __importDefault(require("express-handlebars"));
var SocketIO = __importStar(require("socket.io"));
var http_1 = __importDefault(require("http"));
var PORT = 8080;
var app = (0, express_1.default)();
var router = express_1.default.Router();
var __dirname = path_1.default.resolve();
var memoria = new memoria_1.Memoria();
var server = http_1.default.createServer(app); // antes estaba como Server(app)
var ioServer = new SocketIO.Server(server);
// Rutas URL
var pathVistaProductos = '/productos/vista';
var pathListar = '/productos/listar';
var pathListarPorId = '/productos/listar/:id';
var pathGuardar = '/productos/guardar';
var pathUpdate = '/productos/actualizar/:id';
var parhDelete = '/productos/borrar/:id';
////////
app.use(express_1.default.static(__dirname + "/../public"));
console.log(__dirname + "/../public");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', router);
//////// config Handlebars
app.set('views', './views');
app.set('view engine', 'hbs');
////////
app.engine('hbs', (0, express_handlebars_1.default)({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    // partialDir: __dirname + '/views/partials/',
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
router.get(pathVistaProductos, function (request, response) {
    response.render('layouts/index.ejs', { productos: memoria.getArray() });
});
router.get(pathListar, function (request, response) {
    var result = memoria.getArray();
    if (result.length > 0) {
        response.status(200).send(JSON.stringify(result));
    }
    else {
        response.status(404).send({ error: 'No hay productos cargados' });
    }
});
router.get(pathListarPorId, function (request, response) {
    var paramId = parseInt(request.params.id);
    var result = memoria.getElementById(paramId);
    if (result == null) {
        response.status(404).send('Producto no encontrado');
    }
    response.status(200).send(JSON.stringify(result));
});
router.post(pathGuardar, function (request, response) {
    var product = request.body;
    if (product.price && product.title && product.thumbnail) {
        memoria.addElement(product);
        ioServer.sockets.emit('cargarProductos', memoria.getArray());
        response.redirect('/');
    }
    else {
        response.status(400).send({ error: 'Información incompleta' });
    }
});
router.put(pathUpdate, function (request, response) {
    var paramId = parseInt(request.params.id);
    var newProduct = request.body;
    memoria.updateObject(newProduct, paramId);
    response.send(newProduct);
});
router.delete(parhDelete, function (request, response) {
    var paramId = parseInt(request.params.id);
    var deletedObject = memoria.getElementById(paramId);
    memoria.deleteObject(paramId);
    response.status(200).send(deletedObject);
});
///////////////
ioServer.on('connection', function (socket) {
    socket.emit('cargarProductos', memoria.getArray());
    console.log('Se conecto en el back');
});
var messages = [];
ioServer.on('connection', function (socket) {
    console.log('Un cliente se ha conectado');
    socket.emit('messages', messages);
    socket.on('new-message', function (data) {
        messages.push(data);
        ioServer.sockets.emit('messages', messages);
    });
});
