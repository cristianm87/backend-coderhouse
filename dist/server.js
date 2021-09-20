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
var carrito_1 = require("./carrito");
var path_1 = __importDefault(require("path"));
var express_handlebars_1 = __importDefault(require("express-handlebars"));
var SocketIO = __importStar(require("socket.io"));
var http_1 = __importDefault(require("http"));
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
var parthAgregar = '/agregar';
var pathAgregarPorId = '/agregar/:id_producto';
var pathUpdate = '/actualizar/:id';
var parhDelete = '/borrar/:id';
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
    }
    else {
        res.status(404).send({ error: 'No hay productos cargados' });
    }
});
routerProductos.get(pathListarPorId, function (req, res) {
    var paramId = parseInt(req.params.id);
    var result = memoria.getElementById(paramId);
    if (result == null) {
        res.status(404).send('Producto no encontrado');
    }
    res.status(200).send(JSON.stringify(result));
});
routerProductos.post(parthAgregar, function (req, res) {
    if (isAdmin) {
        var product = req.body;
        if (product.name && product.description && product.code) {
            memoria.addElement(product);
            ioServer.sockets.emit('cargarProductos', memoria.getArray());
            res.redirect('/');
        }
        else {
            res.status(400).send({ error: 'Información incompleta' });
        }
    }
    else {
        res.send({
            error: -1,
            descripcion: "ruta '" + parthAgregar + "' m\u00E9todo 'Guardar' no autorizada",
        });
    }
});
routerProductos.put(pathUpdate, function (req, res) {
    if (isAdmin) {
        var paramId = parseInt(req.params.id);
        var newProduct = req.body;
        memoria.updateObject(newProduct, paramId);
        res.send(newProduct);
    }
    else {
        res.send({
            error: -1,
            descripcion: "ruta '" + pathUpdate + "' m\u00E9todo 'Guardar' no autorizada",
        });
    }
});
routerProductos.delete(parhDelete, function (req, res) {
    if (isAdmin) {
        var paramId = parseInt(req.params.id_producto);
        var deletedObject = memoria.getElementById(paramId);
        memoria.deleteObject(paramId);
        res.status(200).send(deletedObject);
    }
    else {
        res.send({
            error: -1,
            descripcion: "ruta '" + parhDelete + "' m\u00E9todo 'Guardar' no autorizada",
        });
    }
});
//////// EndPoints Carrito
routerCarrito.get(pathListar, function (req, res) {
    var queryId = Number(req.query.id);
    if (!isNaN(queryId)) {
        var producto = carrito.getProductoById(queryId);
        res.send({ productoEnCarrito: producto });
    }
    else {
        var productos = carrito.getProductos();
        res.send({
            idCarrito: carrito.getId(),
            timestampCarrito: carrito.getTimestamp(),
            ProductosEnCarrito: productos,
        });
    }
});
routerCarrito.post(pathAgregarPorId, function (req, res) {
    var paramId = parseInt(req.params.id_producto);
    var producto = memoria.getElementById(paramId);
    carrito.addProducto(producto);
    // res.send(producto);
    res.redirect('/');
});
routerCarrito.delete(parhDelete, function (req, res) {
    var paramId = parseInt(req.params.id);
    var deletedObject = carrito.getProductoById(paramId);
    carrito.deleteProducto(paramId);
    res.status(200).send(deletedObject);
});
/////////////// ioServer
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
