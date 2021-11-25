import express, { Request, Response } from 'express';
import { IDao } from './interfaces/daos/IDao';

import path from 'path';
import * as SocketIO from 'socket.io';
import http, { request } from 'http';
import session from 'express-session';
import { DaoFactory } from './daoFactory';
import passportFacebook from 'passport-facebook';
import passport from 'passport';
import faker from 'faker';
faker.locale = 'es';
// import normalizr from 'normalizr';
const normalizr = require('normalizr');

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
const pathVistaProductos = '/vista';
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
const pathLogin = '/login';
const pathLogout = '/logout';
const pathMain = '/';

// Server listen

server.listen(PORT, () => {
  console.log(`Server listen on port ${PORT}`);
});

server.on('error', error => {
  console.error('Server Error:', error);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('adios!');
    dao.closeConnection();
  });
});

// Middlewares

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Esto es para que el request lea el body
app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);
app.use('/mensajes', routerMensajes);

// Ejs Config

app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'ejs');

/// DAO OPTIONS ///

const MEMORY = 0;
const MONGODB = 1;
const MONGODBDBAAS = 2;
const MYSQL = 3;
const MYSQLSQLITE3 = 4;
const FILESYSTEM = 5;
const FIREBASE = 6;
//
let option = MONGODB;
//
const daoFactory = new DaoFactory();
const dao: IDao = daoFactory.getDao(option);

//////// ENDPOINTS PRODUCTOS

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
        res.redirect(pathMain);
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

// Socker IO

ioServer.on('connection', async _socket => {
  console.log('Un cliente se ha conectado');
  await initializeProducts();
  await initializeNormalizedMessages();
});

// Socket IO Productos

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

// Socket IO Messages

routerMensajes.post(
  pathGuardarMensajes,
  async (req: Request, res: Response) => {
    const body = req.body;
    const date = new Date().toLocaleString('es-AR');
    const mensaje: any = {
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
    await dao.insertMessage(mensaje);
    res.redirect(pathMain);
  }
);

// Socket IO Messages Normalizr

const initializeNormalizedMessages = async () => {
  const authorSchema = new normalizr.schema.Entity('author', undefined, {
    idAttribute: 'email',
  });

  const messageSchema = new normalizr.schema.Entity('message', {
    author: authorSchema,
  });

  const messagesSchema = new normalizr.schema.Entity('messages', {
    messages: [messageSchema],
  });
  let messagesFromDb: any = [];
  const messages: any = [];

  if (option === 0) {
    messagesFromDb = await dao.getMessagesSync();
  } else {
    messagesFromDb = await dao.getMessages();
  }

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
      fecha: e.fecha,
      text: e.text,
    });
  });

  const messagesData = {
    id: 1,
    messages: [],
  };

  messagesData.messages = messages;

  const normalizedData = normalizr.normalize(messagesData, messagesSchema);

  try {
    ioServer.sockets.emit('message-from-server', await normalizedData);
  } catch (error) {
    console.error('initializeMessages()', error);
  }
};

// VISTA PRODUCTOS

// Filtro por nombre
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

// Filtro por precio
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
    if (option === 0) {
      res.render('vista-productos', {
        productos: dao.getProductsSync(),
      });
    } else {
      res.render('vista-productos', {
        productos: await dao.getProducts(),
      });
    }
  } else {
    res.render('vista-productos', {
      productos: dao.getProductsFiltered(),
    });
  }
});

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
  if (cantidad == '0') {
    res.send('No hay productos');
  } else {
    res.render('vista-test', {
      productos: datos,
    });
  }
});

////////// PASSPORT FACEBOOK ////////////

const FACEBOOK_CLIENT_ID = '5013697905325423';
const FACEBOOK_CLIENT_SECRET = '62dbd3c28deb41afa48a712662520dd2';

passport.use(
  new passportFacebook.Strategy(
    {
      clientID: FACEBOOK_CLIENT_ID,
      clientSecret: FACEBOOK_CLIENT_SECRET,
      callbackURL: '/oklogin',
      profileFields: ['id', 'displayName', 'photos', 'emails'],
    },
    (_accessToken, _refreshToken, profile, done) => {
      // console.log(profile);

      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

const sessionHandler = session({
  secret: 'secreto',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3_000,
  },
  rolling: true,
});

app.use(sessionHandler);
app.use(passport.initialize());
app.use(passport.session());

app.get(pathMain, (request, response) => {
  if (request.isAuthenticated()) {
    return response.render('vista-main', { userData: request.user });
  }

  return response.render('vista-login'); // 1
});

app.post('/login', passport.authenticate('facebook')); // 2

app.get(
  // 3
  '/oklogin',
  passport.authenticate('facebook', {
    successRedirect: pathMain,
    failureRedirect: '/faillogin',
  })
);

app.get('/faillogin', (_request, response) =>
  response.render('vista-user-error-login')
);

app.get(pathLogout, (request, response) => {
  const userData = request.user;
  request.logout();
  return response.render('vista-logout', { userData });
});
