import express from 'express';
import { IDao } from './interfaces/daos/IDao';
import path from 'path';
import * as SocketIO from 'socket.io';
import http from 'http';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
import { DaoFactory } from './daoFactory';
import twilio from 'twilio';
import passportFacebook from 'passport-facebook';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import compression from 'compression';
import winston from 'winston';
import faker from 'faker';
faker.locale = 'es';
// IMPORT CLUSTER //
import cluster from 'cluster';
import { cpus } from 'os';

// EMAILING

import nodemailer from 'nodemailer';

const numCPUs = cpus().length;

// import normalizr from 'normalizr';
const normalizr = require('normalizr');

const PORT = process.env.PORT || +process.argv[2] || 8080;
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

//////////// WINSTON LOGGER ////////////

const consoleLogger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console({})],
});

const errorLogger = winston.createLogger({
  level: 'error',
  transports: [
    new winston.transports.File({
      filename: 'error.log',
    }),
  ],
});

const warnLogger = winston.createLogger({
  level: 'warn',
  transports: [
    new winston.transports.File({
      filename: 'warn.log',
    }),
  ],
});

warnLogger.warn('Prueba warnLogger');

// Server listen

const ServerInit = () => {
  server.listen(PORT, () => {
    consoleLogger.info(`Server listen on port ${PORT}`);
    consoleLogger.info(`PID ${process.pid}`);
  });

  server.on('error', error => {
    errorLogger.error('Server Error:', error);
  });
};

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('adios!');
    dao.closeConnection();
  });
});

process.on('exit', code => {
  console.log(code);
});

//////////// CLUSTER ////////////

if (process.argv[3] == 'CLUSTER') {
  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let index = 0; index < numCPUs; index++) {
      cluster.fork();
    }
    cluster.on('exit', worker => {
      console.log(`Primary PID: ${process.pid}`);
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    ServerInit();
  }
} else {
  ServerInit();
}

// Middlewares

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Esto es para que el request lea el body
app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);
app.use('/mensajes', routerMensajes);
app.use(compression());

// Ejs Config

app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'ejs');

//////////// DAO OPTIONS ////////////

const MEMORY = 0;
const MONGODB = 1;
const MONGODBDBAAS = 2;
const MYSQL = 3;
const MYSQLSQLITE3 = 4;
const FILESYSTEM = 5;
const FIREBASE = 6;
//
let option = MONGODBDBAAS;
//
const daoFactory = new DaoFactory();
const dao: IDao = daoFactory.getDao(option);

//////////// ENDPOINTS PRODUCTOS ////////////

routerProductos.get(pathListar, async (request, response) => {
  try {
    let productos = [];
    if (option === 0) {
      productos = dao.getProductsSync();
    } else {
      productos = await dao.getProducts();
    }
    if (productos.length < 1) {
      response.status(404).send('No hay productos para mostrar');
    } else {
      response.status(200).send(JSON.stringify(productos));
    }
  } catch (error) {
    console.log(error);
  }
});

routerProductos.get(pathListarPorId, async (request, response) => {
  const paramId = request.params.id;
  let productById: any = {};
  try {
    if (option === 0 || option === 5) {
      productById = dao.getProductByIdSync(paramId);
    } else {
      productById = await dao.getProductById(paramId);
    }
    if (productById === undefined || Object.keys(productById).length === 0) {
      response.status(404).send('Producto no encontrado');
    } else {
      response.status(200).send(JSON.stringify(productById));
    }
  } catch (error) {
    console.log(error);
  }
  console.log('ProductById_Server', productById);
});

routerProductos.post(pathAgregar, async (request, response) => {
  if (isAdmin) {
    const product = request.body;
    if (product.name && product.description && product.code) {
      try {
        await dao.insertProduct(product);
      } catch (error) {
        console.log(error);
      } finally {
        await initializeProducts();
        response.redirect(pathMain);
      }
    } else {
      response.status(400).send({ error: 'Información incompleta' });
    }
  } else {
    response.status(403).send({
      error: -1,
      descripcion: `ruta '${pathAgregar}' método 'Guardar' no autorizada`,
    });
  }
});

routerProductos.put(pathUpdate, async (request, response) => {
  if (isAdmin) {
    const paramId = request.params.id;
    const newValues = request.body;
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
        response.status(404).send('Producto no encontrado');
      } else {
        await dao.updateProduct(newValues, paramId);
        response.status(200).send(
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
    response.status(403).send({
      error: -1,
      descripcion: `ruta '${pathUpdate}' método 'Guardar' no autorizada`,
    });
  }
});

routerProductos.delete(pathDelete, async (request, response) => {
  if (isAdmin) {
    const paramId = request.params.id;
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
        response.status(404).send('Producto no encontrado');
      } else {
        await dao.deleteProduct(paramId);
        response
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
    response.status(403).send({
      error: -1,
      descripcion: `ruta '${pathDelete}' método 'Guardar' no autorizada`,
    });
  }
});

//////////// ENDPOINTS CARRITO ////////////

routerCarrito.get(pathListar, async (request, response) => {
  let cartProducts: any = [];
  try {
    if (option === 0) {
      cartProducts = dao.getCartProductsSync();
    } else {
      cartProducts = await dao.getCartProducts();
    }
    if (cartProducts.length < 1) {
      response.status(404).send('El carrito esta vacio');
    } else {
      response.status(200).send(
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

routerCarrito.post(pathAgregarPorId, async (request, response) => {
  const paramId = request.params.id;
  let productToAdd: any = {};
  try {
    if (option === 0 || option === 5) {
      productToAdd = dao.getProductByIdSync(paramId);
      console.log('ProductToAdd', productToAdd);
    } else {
      productToAdd = await dao.getProductById(paramId);
    }
    if (productToAdd === undefined || Object.keys(productToAdd).length === 0) {
      response.status(404).send('Producto no encontrado');
    } else {
      dao.addToCart(productToAdd);
      response
        .status(200)
        .send(JSON.stringify({ productoAgregado: productToAdd }));
    }
  } catch (error) {
    console.log(error);
  }
});

routerCarrito.delete(pathDelete, async (request, response) => {
  const paramId = request.params.id;
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
    response.status(404).send('Producto no encontrado');
  } else {
    dao.deleteProductCart(paramId);
    response
      .status(200)
      .send(JSON.stringify({ productoEliminado: productToDelete }));
  }
  console.log('cartProductById_FromDelete', productToDelete);
});

//////////// SOCKET IO ////////////

ioServer.on('connection', async _socket => {
  // console.log('Un cliente se ha conectado');
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

routerMensajes.post(pathGuardarMensajes, async (request, response) => {
  const body = request.body;
  if (body.text.includes('administrador')) {
    sendSms(body.email, body.text);
  }

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
  response.redirect(pathMain);
});

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
  } else if (option === 1 || option === 2) {
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

//////////// VISTA PRODUCTOS ////////////

// Filtro por nombre

routerProductos.post(pathBuscarNombre, async (request, response) => {
  const filtrar = request.body.buscar;
  try {
    await dao.filterByName(filtrar);
  } catch (error) {
    console.log(error);
  } finally {
    response.redirect('/productos/vista');
  }
});

// Filtro por precio

routerProductos.post(pathBuscarPrecio, async (request, response) => {
  const precioMin = request.body.min;
  const precioMax = request.body.max;
  try {
    await dao.filterByPrice(precioMin, precioMax);
  } catch (error) {
    console.log(error);
  } finally {
    response.redirect('/productos/vista');
  }
});

routerProductos.get(pathVistaProductos, async (request, response) => {
  let productsFiltered: any = await dao.getProductsFiltered();
  if (productsFiltered.length < 1) {
    if (option === 0) {
      response.render('productos', {
        productos: dao.getProductsSync(),
      });
    } else {
      response.render('productos', {
        productos: await dao.getProducts(),
      });
    }
  } else {
    response.render('productos', {
      productos: dao.getProductsFiltered(),
    });
  }
});

//////////// VISTA TEST (Faker) ////////////

routerProductos.get(pathVistaTest, (request, response) => {
  const datos = [];

  const cantidad = request.query.cant || 10;
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
    response.send('No hay productos');
  } else {
    response.render('test', {
      productos: datos,
    });
  }
});

//////////// VISTA INFO ////////////

app.get('/info', (request, response) => {
  const info = {
    argumentosDeEntrada: process.argv,
    nombreDeLaPlataforma: process.platform,
    pathDeEjecución: process.argv[0],
    processId: process.pid,
    versionDeNodeJs: process.version,
    usoDeMemoria: process.memoryUsage(),
    carpetaCorriente: process.cwd(),
    nucleosCpu: numCPUs,
  };
  response.render('info', { info });
});

//////////// NUMEROS RANDOMS ////////////

app.get('/randoms', (request, response) => {
  const cantidad = Number(request.query.cant) || 100000000;
  const { fork } = require('child_process');
  const child = fork('./dist/child.js');
  child.send(cantidad);
  child.on('message', (message: any) =>
    response.status(200).send(JSON.stringify(message))
  );
});

//////////// PASSPORT FACEBOOK ////////////

const FACEBOOK_CLIENT_ID: any = +process.argv[3] || process.env.FACEBOOK_ID;
const FACEBOOK_CLIENT_SECRET: any =
  +process.argv[4] || process.env.FACEBOOK_CLIENT;

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
  store: MongoStore.create({
    mongoUrl:
      'mongodb+srv://cristian:DhzAVteV3X-C.VC@cluster0.a5nrm.mongodb.net/ecommerce?retryWrites=true&w=majority',
  }),
  cookie: {
    // maxAge: 15_000,
  },
  rolling: true,
});

app.use(sessionHandler);
app.use(passport.initialize());
app.use(passport.session());

app.get(pathMain, (request, response) => {
  if (request.isAuthenticated()) {
    const userData: any = request.user;
    etherealTransporterInit('login', userData.displayName);
    gmailTransporterInit(userData);
    return response.render('index', { userData });
  }

  return response.render('login');
});

app.post(pathLogin, passport.authenticate('facebook'));

app.get(
  '/oklogin',
  passport.authenticate('facebook', {
    successRedirect: pathMain,
    failureRedirect: '/faillogin',
  })
);

app.get('/faillogin', (_request, response) =>
  response.render('user-error-login')
);

app.get(pathLogout, (request, response) => {
  const userData: any = request.user;
  if (!userData) {
    request.logout();
    return response.render('logout');
  } else {
    etherealTransporterInit('logout', userData.displayName);
    request.logout();
    return response.render('logout', { userData });
  }
});

//////////// EMAILING ////////////

// ETHEREAL
const etherealTransporterInit = (status: string, user: any) => {
  const etherealTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'laney.yundt19@ethereal.email',
      pass: 'fdsp2r1uzn82wRrR1k',
    },
  });

  const date = new Date().toLocaleString('es-AR');
  const message = `${user} ${date}`;

  const mailOptions = {
    from: 'Prueba',
    to: 'laney.yundt19@ethereal.email',
    subject: status,
    html: message,
  };

  etherealTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);

      return error;
    }

    return;
  });
};

// GMAIL

const gmailTransporterInit = (userData: any) => {
  const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email2cristian@gmail.com',
      pass: 'qykrdnypxeokzqck',
    },
  });

  const mailOptions: any = {
    to: 'email2cristian@gmail.com',
    subject: 'login',
    html: `<h1>El usuario ${userData.displayName} se ah logueado</h1>`,
  };
  const attachmentPath = userData.photos[0].value;
  if (attachmentPath) {
    mailOptions.attachments = [
      {
        path: attachmentPath,
      },
    ];
  }

  gmailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);

      return error;
    }

    return;
  });
};

// TWILIO (SMS)

const sendSms = (user: any, text: any) => {
  const client = twilio(
    'ACe46c0dc12c92f68d26bbba771f464800',
    '3a870fa626c46ca52904f774a12d0ca0'
  );

  (async () => {
    try {
      const message = await client.messages.create({
        body: `El usuario ${user} envió: "${text}"`,
        from: '+12183282116',
        to: '+541156561359',
      });
      console.log(message.sid);
    } catch (error) {
      console.log(error);
    }
  })();
};
