import express from 'express';
import { IDao } from './interfaces/daos/IDao';
import path from 'path';
import * as SocketIO from 'socket.io';
import http from 'http';
import session from 'express-session';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
import { DaoFactory } from './daoFactory';
import twilio from 'twilio';
// import passportFacebook from 'passport-facebook';
import passportLocal from 'passport-local';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import { modelLogin } from './models/modelLogin';
import compression from 'compression';
import winston from 'winston';
import faker from 'faker';
faker.locale = 'es';
// IMPORT CLUSTER //
import cluster from 'cluster';
import { cpus } from 'os';

// EMAILING

import nodemailer from 'nodemailer';
import { AnyArray } from 'mongoose';

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
let userDataGlobal: any = {};
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

//////////// ADMIN INFORMATION ////////////

const adminData: any = {
  whatsappNumber: '+5491156561359',
  smsNumber: '+541156561359',
  emailEthereal: {
    address: 'sydni.lang85@ethereal.email',
    password: process.env.ETHEREAL_EMAIL_PASSWORD,
  },
  emailGmail: {
    address: 'email2cristian@gmail.com',
    password: process.env.GMAIL_APP_PASSWORD,
  },
};

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
  let productToAddUpdated: any = {};
  // let cantidad: number = 8;
  try {
    if (option === 0 || option === 5) {
      productToAdd = dao.getProductByIdSync(paramId);
      console.log('ProductToAdd', productToAdd);
    } else {
      productToAdd = await dao.getProductById(paramId);
      productToAddUpdated = {
        _id: productToAdd._id,
        name: productToAdd.name,
        description: productToAdd.description,
        code: productToAdd.code,
        thumbnail: productToAdd.thumbnail,
        price: productToAdd.price,
        // cantidad: cantidad,
      };
      console.log('ProductToAdd', productToAdd);
    }
    if (productToAdd === undefined || Object.keys(productToAdd).length === 0) {
      response.status(404).send('Producto no encontrado');
    } else {
      dao.addToCart(productToAddUpdated);
      // dao.addToCart(productToAdd);
      // response.redirect(pathMain);
      response
        .status(200)
        .send(JSON.stringify({ productoAgregado: productToAdd }));
    }
  } catch (error) {
    console.log(error);
  }
});

routerCarrito.get('/cart', async (request, response) => {
  const userData: any = userDataGlobal;
  const detalleDeCompra: any = {
    userInfo: userDataGlobal,
    cartProducts: await dao.getCartProducts(),
  };

  response.status(200).render('cart', { userData, detalleDeCompra });
});

routerCarrito.get('/check-out', async (request, response) => {
  const userData: any = userDataGlobal;
  const detalleDeCompra: any = {
    userInfo: userDataGlobal,
    cartProducts: await dao.getCartProducts(),
  };

  // etherealTransporterInit('Nueva compra!', detalleDeCompra);
  // sendSms(
  //   detalleDeCompra.cartProducts,
  //   'Detalle de la compra',
  //   userDataGlobal.telefono
  // );
  // sendWhatapp(detalleDeCompra);
  response
    .status(200)
    .render('check-out', { nombre: userData.nombre, detalleDeCompra });
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
    sendSms(body.email, body.text, adminData.smsNumber);
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
  return response.render('productos', {
    products: await dao.getProductsFiltered(),
  });
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

////////// PASSPORT DBAAS ////////////

const createHash = (password: string) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const isValidPassword = (
  user: { password: string },
  password: string | Buffer
) => bcrypt.compareSync(password, user.password);

const loginStrategyName = 'login';
const signUpStrategyName = 'signup';

passport.use(
  loginStrategyName,
  new passportLocal.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (_request, username, password, done) => {
      modelLogin.findOne(
        {
          email: username,
        },
        (error: any, user: { password: string }) => {
          if (error) {
            return done(error);
          }

          if (!user) {
            console.log(`User Not Found with username ${username}`);

            return done(null, false);
          }

          if (!isValidPassword(user, password)) {
            console.log('Invalid Password');

            return done(null, false);
          }
          return done(null, user);
        }
      );
    }
  )
);

passport.use(
  signUpStrategyName,
  new passportLocal.Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    (request, username, password, done) => {
      modelLogin.findOne(
        {
          email: username,
        },
        (error: any, user: any) => {
          if (error) {
            console.log(`Error in SignUp: ${error}`);

            return done(error);
          }

          if (user) {
            console.log('User already exists');

            return done(null, false);
          }

          const newUser: any = new modelLogin();
          newUser.email = username;
          newUser.password = createHash(password);
          newUser.nombre = request.body.nombre;
          newUser.direccion = request.body.direccion;
          newUser.edad = request.body.edad;
          newUser.telefono = request.body.telefono;
          newUser.avatar = request.body.avatar;

          return newUser.save((error: any) => {
            if (error) {
              console.log(`Error in Saving user: ${error}`);

              throw error;
            }
            //etherealTransporterInit('New Signup', newUser);
            console.log('User Registration succesful');

            return done(null, newUser);
          });
        }
      );
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  modelLogin.findById(
    id,
    (error: any, user: boolean | Express.User | null | undefined) =>
      done(error, user)
  );
});

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      //mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    }),
    secret: 'keyboard cat',
    cookie: {
      httpOnly: false,
      secure: false,
      // maxAge: 5_000,
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Endpoints Passport

//main

// Filtro por nombre

app.post(pathBuscarNombre, async (request, response) => {
  const filtrar = request.body.buscar;
  try {
    await dao.filterByName(filtrar);
  } catch (error) {
    console.log(error);
  } finally {
    response.redirect('/');
  }
});

// Filtrar por Precio

app.post(pathBuscarPrecio, async (request, response) => {
  const precioMin = request.body.min;
  const precioMax = request.body.max;
  try {
    await dao.filterByPrice(precioMin, precioMax);
  } catch (error) {
    console.log(error);
  } finally {
    response.redirect('/');
  }
});

app.get(pathMain, async (request, response) => {
  let productsFiltered: any = await dao.getProductsFiltered();
  userDataGlobal = request.user;
  const userData: any = request.user;
  const carrito: any = await dao.getCartProducts();
  if (userData == undefined) {
    return response.redirect(pathLogin);
  } else {
    // etherealTransporterInit('login', userData.email);
    // gmailTransporterInit(userData);
    response.render('index', {
      userData,
      carrito,
      products: productsFiltered,
    });
  }
});

//signup

app.post(
  '/signup',
  passport.authenticate(signUpStrategyName, { failureRedirect: '/failsignup' }),
  (_request, response) => {
    response.redirect(pathMain);
  }
);

app.get('/signup', (request, response) => {
  if (request.user == undefined) {
    response.render('signup');
  } else {
    response.redirect(pathMain);
  }
});

app.get('/failsignup', (request, response) => {
  response.render('user-error-signup');
});

//login

app.get(pathLogin, (request, response) => {
  if (request.user == undefined) {
    response.render('login');
  } else {
    response.redirect(pathMain);
  }
});

app.post(
  pathLogin,
  passport.authenticate(loginStrategyName, { failureRedirect: '/faillogin' }),
  (_request, response) => {
    return response.redirect(pathMain);
  }
);

app.get('/faillogin', (request, response) => {
  response.render('user-error-login');
});

app.get(pathLogout, (request, response) => {
  const userData: any = request.user;
  request.session.destroy(function (err) {
    //etherealTransporterInit('logout', userData.email);
    response.render('logout', { nombre: userData.nombre });
  });
});

//////////// EMAILING ////////////

// ETHEREAL
const etherealTransporterInit = (status: string, userInfo: any) => {
  const userData: any = JSON.stringify(userInfo);
  const etherealTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: adminData.emailEthereal.address,
      pass: adminData.emailEthereal.password,
    },
  });

  const date = new Date().toLocaleString('es-AR');
  const message = `${userData} hizo ${status} el: ${date}`;

  const mailOptions = {
    from: 'Prueba',
    to: adminData.emailEthereal.address,
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
      user: adminData.emailGmail.address,
      pass: adminData.emailGmail.password,
    },
  });

  const mailOptions: any = {
    to: 'email2cristian@gmail.com',
    subject: 'login',
    html: `<h1>El usuario ${userData.email} se ah logueado</h1>`,
  };
  const attachmentPath = userData.avatar;
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

const sendSms = (info: any, text: any, phoneNumber: any) => {
  const userDatail: any = JSON.stringify(info);
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  (async () => {
    try {
      const message = await client.messages.create({
        body: `Detalle: ${userDatail} asunto: "${text}"`,
        from: '+12183282116',
        to: phoneNumber,
      });
      console.log(message.sid);
    } catch (error) {
      console.log(error);
    }
  })();
};

// TWILIO (WHATSAPP)

const sendWhatapp = (detalleDeCompra: any) => {
  const detalle: any = JSON.stringify(detalleDeCompra);

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  (async () => {
    try {
      const message = await client.messages.create({
        body: detalle,
        from: 'whatsapp:+14155238886',
        to: `whatsapp:${adminData.whatsappNumber}`,
      });
      console.log(message.sid);
    } catch (error) {
      console.log(error);
    }
  })();
};
