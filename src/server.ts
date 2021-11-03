import express, { Request, Response } from 'express';
import { IDao } from './interfaces/daos/IDao';

import path from 'path';
import handlebars from 'express-handlebars';
import * as SocketIO from 'socket.io';
import http from 'http';

import { DaoFactory } from './daoFactory';
import faker from 'faker';
faker.locale = 'es';

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
    res.render('layouts/vista-test.ejs', {
      productos: datos,
    });
  }
});

// FILTRAR PRODUCTOS

import { MongoDbDao } from './daos/MongoDbDao';
const mongoDb = new MongoDbDao();

// POR NOMBRE
routerProductos.post(pathBuscarNombre, async (req: Request, res: Response) => {
  const filtrar = req.body.buscar;
  try {
    await mongoDb.filterByName(filtrar);
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
    await mongoDb.filterByPrice(precioMin, precioMax);
  } catch (error) {
    console.log(error);
  } finally {
    res.redirect('/productos/vista');
  }
});

routerProductos.get(pathVistaProductos, async (req: Request, res: Response) => {
  let productsFiltered = await mongoDb.getProductsFiltered();
  if (productsFiltered.length < 1) {
    res.render('layouts/index.ejs', {
      productos: await dao.getProducts(),
    });
  } else {
    res.render('layouts/index.ejs', {
      productos: mongoDb.getProductsFiltered(),
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

interface Message {
  author: {
    id: string;
    fecha: string;
    nombre: string;
    apellido: string;
    edad: number;
    alias: string;
    avatar: string;
  };
  text: string;
}

const messages: Array<Message> = [];

routerMensajes.post(
  pathGuardarMensajes,
  async (req: Request, res: Response) => {
    const date = new Date().toLocaleString('es-AR');
    const mensaje = {
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

    await messages.push(mensaje);
    res.redirect('/');
  }
);

//

ioServer.on('connection', async socket => {
  console.log('Un cliente se ha conectado');
  await initializeProducts();
  console.log('messsages from ioseerver', messages);
  await ioServer.sockets.emit('message-from-server', await messages);
  // socket.on('message-from-client', async data => {
  //   await ioServer.sockets.emit('message-from-server', await messages);
  // });
});

///// SOCKETiO PRODUCTOS

const initializeProducts = async () => {
  if (option === 0) {
    ioServer.sockets.emit('products-from-server', dao.getProductsSync());
  } else {
    ioServer.sockets.emit('products-from-server', await dao.getProducts());
  }
};
