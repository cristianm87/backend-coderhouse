import express, { Request, Response } from 'express';
import { Memoria } from './memoria';
import { Carrito } from './carrito';
import path from 'path';
import handlebars from 'express-handlebars';
import * as SocketIO from 'socket.io';
import http from 'http';

const PORT = 8080 || process.env.PORT;
const app = express();
const routerProductos = express.Router();
const routerCarrito = express.Router();
const __dirname = path.resolve();
const memoria = new Memoria();
const carrito = new Carrito();
const server = http.createServer(app); // antes estaba como Server(app)
const ioServer = new SocketIO.Server(server);
const isAdmin: boolean = true;

// Rutas (URL) Productos
const pathVistaProductos = '/vista'; // Vista UI
const pathListar = '/listar';
const pathListarPorId = '/listar/:id';
const parthAgregar = '/agregar';
const pathAgregarPorId = '/agregar/:id_producto';
const pathUpdate = '/actualizar/:id';
const parhDelete = '/borrar/:id';

////////

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);

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
    // partialDir: __dirname + '/views/partials',
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

//////// EndPoints Prodcutos

routerProductos.get(pathVistaProductos, (req: Request, res: Response) => {
  res.render('layouts/index.ejs', {
    productos: memoria.getArray(),
  });
});

routerProductos.get(pathListar, (req: Request, res: Response) => {
  const result = memoria.getArray();
  if (result.length > 0) {
    res.status(200).send(JSON.stringify(result));
  } else {
    res.status(404).send({ error: 'No hay productos cargados' });
  }
});

routerProductos.get(pathListarPorId, (req: Request, res: Response) => {
  const paramId = parseInt(req.params.id);
  const result = memoria.getElementById(paramId);
  if (result == null) {
    res.status(404).send('Producto no encontrado');
  }
  res.status(200).send(JSON.stringify(result));
});

routerProductos.post(parthAgregar, (req: Request, res: Response) => {
  if (isAdmin) {
    const product = req.body;
    if (product.name && product.description && product.code) {
      memoria.addElement(product);
      ioServer.sockets.emit('cargarProductos', memoria.getArray());
      res.redirect('/');
    } else {
      res.status(400).send({ error: 'Información incompleta' });
    }
  } else {
    res.send({
      error: -1,
      descripcion: `ruta '${parthAgregar}' método 'Guardar' no autorizada`,
    });
  }
});

routerProductos.put(pathUpdate, (req: Request, res: Response) => {
  if (isAdmin) {
    const paramId = parseInt(req.params.id);
    const newProduct = req.body;
    memoria.updateObject(newProduct, paramId);
    res.send(newProduct);
  } else {
    res.send({
      error: -1,
      descripcion: `ruta '${pathUpdate}' método 'Guardar' no autorizada`,
    });
  }
});

routerProductos.delete(parhDelete, (req: Request, res: Response) => {
  if (isAdmin) {
    const paramId = parseInt(req.params.id_producto);
    const deletedObject = memoria.getElementById(paramId);
    memoria.deleteObject(paramId);
    res.status(200).send(deletedObject);
  } else {
    res.send({
      error: -1,
      descripcion: `ruta '${parhDelete}' método 'Guardar' no autorizada`,
    });
  }
});

//////// EndPoints Carrito

routerCarrito.get(pathListar, (req: Request, res: Response) => {
  const queryId: number = Number(req.query.id);
  if (!isNaN(queryId)) {
    const producto = carrito.getProductoById(queryId);
    res.send({ productoEnCarrito: producto });
  } else {
    const productos = carrito.getProductos();
    res.send({
      idCarrito: carrito.getId(),
      timestampCarrito: carrito.getTimestamp(),
      ProductosEnCarrito: productos,
    });
  }
});

routerCarrito.post(pathAgregarPorId, (req: Request, res: Response) => {
  const paramId = parseInt(req.params.id_producto);
  const producto: any = memoria.getElementById(paramId);
  carrito.addProducto(producto);
  // res.send(producto);
  res.redirect('/');
});

routerCarrito.delete(parhDelete, (req: Request, res: Response) => {
  const paramId = parseInt(req.params.id);
  const deletedObject = carrito.getProductoById(paramId);
  carrito.deleteProducto(paramId);
  res.status(200).send(deletedObject);
});

/////////////// ioServer

ioServer.on('connection', socket => {
  socket.emit('cargarProductos', memoria.getArray());
  console.log('Se conecto en el back');
});

////////////// ioServer WebChat
interface Message {
  autor: string;
  texto: string;
}

const messages: Array<Message> = [];

ioServer.on('connection', socket => {
  console.log('Un cliente se ha conectado');
  socket.emit('messages', messages);

  socket.on('new-message', data => {
    messages.push(data);
    ioServer.sockets.emit('messages', messages);
  });
});
