import express from 'express';
import { Memoria } from './memoria.es6.js'; // cambiar ruta en caso de requerirlo
import path from 'path';
import handlebars from 'express-handlebars';
import * as SocketIO from 'socket.io';
import http from 'http';

const PORT = 8080;
const app = express();
const router = express.Router();
const __dirname = path.resolve();
const memoria = new Memoria();
const server = http.Server(app);
const ioServer = new SocketIO.Server(server);

// Rutas URL
const pathVistaProductos = '/productos/vista';
const pathListar = '/productos/listar';
const pathListarPorId = '/productos/listar/:id';
const pathGuardar = '/productos/guardar';
const pathUpdate = '/productos/actualizar/:id';
const parhDelete = '/productos/borrar/:id';

////////

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

//////// config Handlebars

app.set('views', './views');
app.set('view engine', 'hbs');

////////

app.engine(
  'hbs',
  handlebars({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialDir: __dirname + '/views/partials/',
  })
);

////////

server.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});

server.on('error', error => {
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

router.get(pathVistaProductos, (request, response) => {
  response.render('layouts/index.ejs', { productos: memoria.getArray() });
});

router.get(pathListar, (request, response) => {
  const result = memoria.getArray();
  if (result.length > 0) {
    response.status(200).send(JSON.stringify(result));
  } else {
    response.status(404).send({ error: 'No hay productos cargados' });
  }
});

router.get(pathListarPorId, (request, response) => {
  const { id } = request.params;
  const result = memoria.getElementById(id);
  if (result == null) {
    response.status(404).send('Producto no encontrado');
  }
  response.status(200).send(JSON.stringify(result));
});

router.post(pathGuardar, (request, response) => {
  const product = request.body;
  if (product.price && product.title && product.thumbnail) {
    memoria.addElement(product);
    ioServer.sockets.emit('cargarProductos', memoria.getArray());
    response.redirect('/');
  } else {
    response.status(400).send({ error: 'Información incompleta' });
  }
});

router.put(pathUpdate, (request, response) => {
  let id = request.params.id;
  const newProduct = request.body;
  memoria.updateObject(newProduct, id);
  response.send(newProduct);
});

router.delete(parhDelete, (request, response) => {
  const deletedObject = memoria.getElementById(request.params.id);
  memoria.deleteObject(request.params.id);
  response.status(200).send(deletedObject);
});

///////////////

ioServer.on('connection', socket => {
  socket.emit('cargarProductos', memoria.getArray());
  console.log('Se conecto en el back');
});

//////////////

const messages = [];

ioServer.on('connection', socket => {
  console.log('Un cliente se ha conectado');
  socket.emit('messages', messages);

  socket.on('new-message', data => {
    messages.push(data);
    ioServer.sockets.emit('messages', messages);
  });
});
