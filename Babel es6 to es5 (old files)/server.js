"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _express = _interopRequireDefault(require("express"));

var _memoria = require("./memoria.js");

var _path = _interopRequireDefault(require("path"));

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var SocketIO = _interopRequireWildcard(require("socket.io"));

var _http = _interopRequireDefault(require("http"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// cambiar ruta en caso de requerirlo
var PORT = 8080;
var app = (0, _express["default"])();

var router = _express["default"].Router();

var _dirname = _path["default"].resolve();

var memoria = new _memoria.Memoria();

var server = _http["default"].Server(app);

var ioServer = new SocketIO.Server(server); // Rutas URL

var pathVistaProductos = '/productos/vista';
var pathListar = '/productos/listar';
var pathListarPorId = '/productos/listar/:id';
var pathGuardar = '/productos/guardar';
var pathUpdate = '/productos/actualizar/:id';
var parhDelete = '/productos/borrar/:id'; ////////

app.use(_express["default"]["static"]("".concat(_dirname, "/public")));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use('/api', router); //////// config Handlebars

app.set('views', './views');
app.set('view engine', 'hbs'); ////////

app.engine('hbs', (0, _expressHandlebars["default"])({
  extname: '.hbs',
  defaultLayout: 'index.hbs',
  layoutsDir: _dirname + '/views/layouts',
  partialDir: _dirname + '/views/partials/'
})); ////////

server.listen(PORT, function () {
  console.log("Server listen on port ".concat(PORT));
});
server.on('error', function (error) {
  console.log(error);
}); ////////
// Ejemplo de producto
// {
//   title: 'Producto 1',
//   precio: 5000,
//   thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Computer-512.png',
// };
////////

router.get(pathVistaProductos, function (request, response) {
  response.render('layouts/index.ejs', {
    productos: memoria.getArray()
  });
});
router.get(pathListar, function (request, response) {
  var result = memoria.getArray();

  if (result.length > 0) {
    response.status(200).send(JSON.stringify(result));
  } else {
    response.status(404).send({
      error: 'No hay productos cargados'
    });
  }
});
router.get(pathListarPorId, function (request, response) {
  var id = request.params.id;
  var result = memoria.getElementById(id);

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
  } else {
    response.status(400).send({
      error: 'Información incompleta'
    });
  }
});
router.put(pathUpdate, function (request, response) {
  var id = request.params.id;
  var newProduct = request.body;
  memoria.updateObject(newProduct, id);
  response.send(newProduct);
});
router["delete"](parhDelete, function (request, response) {
  var deletedObject = memoria.getElementById(request.params.id);
  memoria.deleteObject(request.params.id);
  response.status(200).send(deletedObject);
}); ///////////////

ioServer.on('connection', function (socket) {
  socket.emit('cargarProductos', memoria.getArray());
  console.log('Se conecto en el back');
}); //////////////

var messages = [];
ioServer.on('connection', function (socket) {
  console.log('Un cliente se ha conectado');
  socket.emit('messages', messages);
  socket.on('new-message', function (data) {
    messages.push(data);
    ioServer.sockets.emit('messages', messages);
  });
});
