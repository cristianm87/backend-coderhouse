// IMPORTS
import express from 'express';
import { IDao } from './interfaces/daos/IDao';
import path from 'path';
import * as SocketIO from 'socket.io';
import http from 'http';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();
import { DaoFactory } from './daoFactory';
import passport from 'passport';
import MongoStore from 'connect-mongo';
import compression from 'compression';
import cluster from 'cluster';
import { cpus } from 'os';
import {
  consoleLogger,
  errorLogger,
  warnLogger,
} from './controllers/loggerWinstonController';
import socketIoInit from './controllers/socketIoController';
import carritoRouter from './router/carritoRouter';
import productosRouter from './router/productosRouter';
import mensajesRouter from './router/mensajesRouter';
import viewMiscellaneousRouter from './router/viewsMiscellaneousRouter';
import mainRouter from './router/mainRouter';

const PORT = process.env.PORT || +process.argv[2] || 8080;
const app = express();
const __dirname = path.resolve();
const server = http.createServer(app); // antes estaba como Server(app)
const ioServer = new SocketIO.Server(server);
const daoFactory = new DaoFactory();
export { ioServer };
export const numCPUs = cpus().length;

// ADMIN INFORMATION
export const adminData: any = {
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
// AUTHORIZATION
export const isAdmin: boolean = true;
// DAO OPTIONS

const options = {
  MEMORY: 0,
  MONGODB: 1,
  MONGODBDBAAS: 2,
  MYSQL: 3,
  MYSQLSQLITE3: 4,
  FILESYSTEM: 5,
  FIREBASE: 6,
};
//////////////
export let option = options.MONGODBDBAAS;
//////////////
export const dao: IDao = daoFactory.getDao(option);

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
    dao.closeConnection();
    consoleLogger.info('adios!');
  });
});

process.on('exit', code => {
  consoleLogger.info('Process on exit', code);
});

// CLUSTER

if (process.argv[3] == 'CLUSTER') {
  if (cluster.isPrimary) {
    consoleLogger.info(`Primary ${process.pid} is running`);

    for (let index = 0; index < numCPUs; index++) {
      cluster.fork();
    }
    cluster.on('exit', worker => {
      consoleLogger.info(`Primary PID: ${process.pid}`);
      consoleLogger.info(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    ServerInit();
  }
} else {
  ServerInit();
}

// MIDDLEWARES

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Esto es para que el request lea el body
app.use(compression());
// Session
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

// SOCKET IO
socketIoInit();

// EJS SETUP

app.set('views', __dirname + '/views/layouts');
app.set('view engine', 'ejs');

// ENDPOINT MAIN

app.use('/', mainRouter);

// ENDPOINT PRODUCTOS

app.use('/productos', productosRouter);

// ENDPOINT CARRITO

app.use('/carrito', carritoRouter);

// ENDPOINT CHAT

app.use('/mensajes', mensajesRouter);

// ENDPOINT VISTA MISCELLANEOUS

app.use('/vista', viewMiscellaneousRouter);
