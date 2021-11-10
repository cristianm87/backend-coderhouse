import express, { Request, Response } from 'express';
import { IDao } from './interfaces/daos/IDao';

import path from 'path';
import * as SocketIO from 'socket.io';
import http, { request } from 'http';

import { DaoFactory } from './daoFactory';
import faker from 'faker';
faker.locale = 'es';
// import normalizr from 'normalizr';
const normalizr = require('normalizr');
const util = require('util');

const PORT = 8080 || process.env.PORT;
const app = express();
const routerProductos = express.Router();
const routerCarrito = express.Router();
const routerMensajes = express.Router();
const __dirname = path.resolve();
const server = http.createServer(app); // antes estaba como Server(app)
const ioServer = new SocketIO.Server(server);
// AUTHORIZATION
const isAdmin: boolean = true;

// Rutas (URL) Productos
const pathVistaProductos = '/vista'; // Vista UI
const pathListar = '/listar';
const pathListarPorId = '/listar/:id';
const pathAgregar = '/agregar';
const pathAgregarPorId = '/agregar/:id';
const pathUpdate = '/actualizar/:id';
const pathDelete = '/borrar/:id';
const pathVistaTest = '/vista-test';
const pathBuscarNombre = '/filtrar-nombre';
const pathBuscarPrecio = '/filtrar-precio';
const pathGuardarMensajes = '/guardar';
////////
server.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});

server.on('error', error => {
  console.log(error);
});
////////

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);
app.use('/mensajes', routerMensajes);

//////// config EJS

app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'ejs');

//////// DAO OPTIONS ////////
const MEMORY = 0;
const MONGODB = 1;
const MONGODBDBAAS = 2;
const MYSQL = 3;
const MYSQLSQLITE3 = 4;
const FILESYSTEM = 5;
const FIREBASE = 6;
///---////
let option = MONGODB;
///---////
const daoFactory = new DaoFactory();
const dao: IDao = daoFactory.getDao(option);

// Ejemplo de producto
// {
//   name: 'Producto 1',
//   price: 5000,
//   thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-and-school-8/48/Computer-512.png',
// };

//////// ENDPOINTS PRODUCTOS

// VISTA TEST (Faker)
routerProductos.get(pathVistaTest, (req, res) => {
  const datos = [];

  const cantidad = req.query.cant || 10;
  let id = 1;
  for (let index = 0; index < cantidad; index++) {
    datos.push({
      id: id++,
      nombre: faker.commerce.productName(),
      precio: faker.commerce.price(),
      foto: faker.image.image(),
    });
  }
  console.log(cantidad);
  if (cantidad == '0') {
    res.send('No hay productos');
  } else {
    res.render('vista-test', {
      productos: datos,
    });
  }
});

// FILTRAR PRODUCTOS

// POR NOMBRE
routerProductos.post(pathBuscarNombre, async (req: Request, res: Response) => {
  const filtrar = req.body.buscar;
  try {
    await dao.filterByName(filtrar);
  } catch (error) {
    console.log(error);
  } finally {
    res.redirect('/productos/vista');
  }
});

// POR PRECIO
routerProductos.post(pathBuscarPrecio, async (req: Request, res: Response) => {
  const precioMin = req.body.min;
  const precioMax = req.body.max;
  try {
    await dao.filterByPrice(precioMin, precioMax);
  } catch (error) {
    console.log(error);
  } finally {
    res.redirect('/productos/vista');
  }
});

routerProductos.get(pathVistaProductos, async (req: Request, res: Response) => {
  let productsFiltered: any = await dao.getProductsFiltered();
  if (productsFiltered.length < 1) {
    res.render('vista-productos', {
      productos: await dao.getProducts(),
    });
  } else {
    res.render('vista-productos', {
      productos: dao.getProductsFiltered(),
    });
  }

  // if (option === 0) {
  //   res.render('layouts/index.ejs', {
  //     productos: dao.getProductsSync(),
  //   });
  // } else {
  //   res.render('layouts/index.ejs', {
  //     productos: await dao.getProducts(),
  //   });
  // }
});

routerProductos.get(pathListar, async (req: Request, res: Response) => {
  try {
    let productos = [];
    if (option === 0) {
      productos = dao.getProductsSync();
    } else {
      productos = await dao.getProducts();
    }
    if (productos.length < 1) {
      res.status(404).send('No hay productos para mostrar');
    } else {
      res.status(200).send(JSON.stringify(productos));
    }
  } catch (error) {
    console.log(error);
  }
});

routerProductos.get(pathListarPorId, async (req: Request, res: Response) => {
  const paramId = req.params.id;
  let productById: any = {};
  try {
    if (option === 0 || option === 5) {
      productById = dao.getProductByIdSync(paramId);
    } else {
      productById = await dao.getProductById(paramId);
    }
    if (productById === undefined || Object.keys(productById).length === 0) {
      res.status(404).send('Producto no encontrado');
    } else {
      res.status(200).send(JSON.stringify(productById));
    }
  } catch (error) {
    console.log(error);
  }
  console.log('ProductById_Server', productById);
});

routerProductos.post(pathAgregar, async (req: Request, res: Response) => {
  if (isAdmin) {
    const product = req.body;
    if (product.name && product.description && product.code) {
      try {
        await dao.insertProduct(product);
      } catch (error) {
        console.log(error);
      } finally {
        await initializeProducts();
        res.redirect('/');
      }
    } else {
      res.status(400).send({ error: 'Información incompleta' });
    }
  } else {
    res.status(403).send({
      error: -1,
      descripcion: `ruta '${pathAgregar}' método 'Guardar' no autorizada`,
    });
  }
});

routerProductos.put(pathUpdate, async (req: Request, res: Response) => {
  if (isAdmin) {
    const paramId = req.params.id;
    const newValues = req.body;
    let productToUpdate: any = {};
    try {
      if (option === 0 || option === 5) {
        productToUpdate = dao.getProductByIdSync(paramId);
      } else {
        productToUpdate = await dao.getProductById(paramId);
      }
      if (
        productToUpdate === undefined ||
        Object.keys(productToUpdate).length === 0
      ) {
        res.status(404).send('Producto no encontrado');
      } else {
        await dao.updateProduct(newValues, paramId);
        res.status(200).send(
          JSON.stringify({
            productoAactualizar: productToUpdate,
            valoresActualizados: newValues,
          })
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      await initializeProducts();
    }
    console.log('productToUpdate', productToUpdate);
  } else {
    res.status(403).send({
      error: -1,
      descripcion: `ruta '${pathUpdate}' método 'Guardar' no autorizada`,
    });
  }
});

routerProductos.delete(pathDelete, async (req: Request, res: Response) => {
  if (isAdmin) {
    const paramId = req.params.id;
    let productToDelete: any = {};
    try {
      if (option === 0 || option === 5) {
        productToDelete = dao.getProductByIdSync(paramId);
      } else {
        productToDelete = await dao.getProductById(paramId);
      }
      if (
        productToDelete === undefined ||
        Object.keys(productToDelete).length === 0
      ) {
        res.status(404).send('Producto no encontrado');
      } else {
        await dao.deleteProduct(paramId);
        res
          .status(200)
          .send(JSON.stringify({ productoEliminado: productToDelete }));
      }
      console.log('productToDelete Server', productToDelete);
    } catch (error) {
      console.log(error);
    } finally {
      await initializeProducts();
    }
  } else {
    res.status(403).send({
      error: -1,
      descripcion: `ruta '${pathDelete}' método 'Guardar' no autorizada`,
    });
  }
});

//////// ENDPOINTS CARRITO

routerCarrito.get(pathListar, async (req: Request, res: Response) => {
  let cartProducts: any = [];
  try {
    if (option === 0) {
      cartProducts = dao.getCartProductsSync();
    } else {
      cartProducts = await dao.getCartProducts();
    }
    if (cartProducts.length < 1) {
      res.status(404).send('El carrito esta vacio');
    } else {
      res.status(200).send(
        JSON.stringify({
          idCarrito: dao.getCartId(),
          timestampCarrito: dao.getCartTimestamp(),
          ProductosEnElCarrito: cartProducts,
        })
      );
    }
  } catch (error) {
    console.log(error);
  }
});

routerCarrito.post(pathAgregarPorId, async (req: Request, res: Response) => {
  const paramId = req.params.id;
  let productToAdd: any = {};
  try {
    if (option === 0 || option === 5) {
      productToAdd = dao.getProductByIdSync(paramId);
      console.log('ProductToAdd', productToAdd);
    } else {
      productToAdd = await dao.getProductById(paramId);
    }
    if (productToAdd === undefined || Object.keys(productToAdd).length === 0) {
      res.status(404).send('Producto no encontrado');
    } else {
      dao.addToCart(productToAdd);
      res.status(200).send(JSON.stringify({ productoAgregado: productToAdd }));
    }
  } catch (error) {
    console.log(error);
  }
});

routerCarrito.delete(pathDelete, async (req: Request, res: Response) => {
  const paramId = req.params.id;
  let productToDelete: any = {};
  if (option === 0 || option === 5) {
    productToDelete = dao.getCartProductByIdSync(paramId);
  } else {
    productToDelete = await dao.getCartProductById(paramId);
  }
  if (
    productToDelete === undefined ||
    Object.keys(productToDelete).length === 0
  ) {
    res.status(404).send('Producto no encontrado');
  } else {
    dao.deleteProductCart(paramId);
    res
      .status(200)
      .send(JSON.stringify({ productoEliminado: productToDelete }));
  }
  console.log('cartProductById_FromDelete', productToDelete);
});

///// SOCKETiO WEBCHAT

routerMensajes.post(
  pathGuardarMensajes,
  async (req: Request, res: Response) => {
    const body = req.body;
    // const date = new Date().toLocaleString('es-AR');
    const mensaje: any = {
      author: {
        email: body.email,
        nombre: body.firstname,
        apellido: body.lastname,
        edad: body.age,
        alias: body.nickname,
        avatar: body.avatar,
      },
      text: body.text,
    };
    await dao.insertMessage(mensaje);
    res.redirect('/');
  }
);

//

ioServer.on('connection', async socket => {
  console.log('Un cliente se ha conectado');
  await initializeProducts();
  await initializeMessages();
  // socket.on('message-from-client', async data => {
  //   await ioServer.sockets.emit('message-from-server', await messages);
  // });
});

const initializeMessages = async () => {
  // console.log('dao.getMessages', await dao.getMessages());
  try {
    let mensajes = await dao.getMessages();
    ioServer.sockets.emit('message-from-server', mensajes);
  } catch (error) {
    console.error('initializeMessages()', error);
  }
};

///// SOCKETiO PRODUCTOS

const initializeProducts = async () => {
  if (option === 0) {
    ioServer.sockets.emit('products-from-server', dao.getProductsSync());
  } else {
    try {
      await ioServer.sockets.emit(
        'products-from-server',
        await dao.getProducts()
      );
    } catch (error) {
      console.error('initializeProducts()', error);
    }
  }
};

// NORMALIZR

const authorSchema = new normalizr.schema.Entity('author', undefined, {
  idAttribute: 'email',
});

const messageSchema = new normalizr.schema.Entity('message', {
  author: authorSchema,
});

const messagesSchema = new normalizr.schema.Entity('messages', {
  messages: [messageSchema],
});

const getNormalizedMessages = async () => {
  const messagesFromDb: any = await dao.getMessages();
  const messages: any = [];

  messagesFromDb.forEach(function (e: any, i: any) {
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
      text: e.text,
    });
  });

  const messagesData = {
    id: 1,
    messages: [],
  };

  messagesData.messages = messages;

  const normalizedData = normalizr.normalize(messagesData, messagesSchema);

  console.log('dataNormalizada', util.inspect(normalizedData, false, 12, true));

  routerMensajes.get('/vista', (req: Request, res: Response) => {
    res.status(200).send(normalizedData);
  });
};

getNormalizedMessages();
