import express, { Request, Response } from 'express';
import { Memoria } from './memoria';
import { Carrito } from './carrito';
import { Producto } from './producto';
import path from 'path';
import handlebars from 'express-handlebars';
import * as SocketIO from 'socket.io';
import http from 'http';
// import knex
import knex from 'knex';
/////////////////
// SQLite3 (borrar)
import { options_sqlite3 } from './options/SQLite3';
const knex_msj = knex(options_sqlite3);
/////////////////
// mariaDB
import { options_mariaDB } from './options/mariaDB';

// Mongoose
import mongoose from 'mongoose';
import { modelMensajes } from './models/mensajes';
import { modelProductos } from './models/productos';
const knex_products = knex(options_mariaDB);

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
const pathAgregar = '/agregar';
const pathAgregarPorId = '/agregar/:id_producto';
const pathUpdate = '/actualizar/:id';
const pathDelete = '/borrar/:id_producto';

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
    knex_listar();
  } else {
    res.status(404).send({ error: 'No hay productos cargados' });
  }
});

routerProductos.get(pathListarPorId, (req: Request, res: Response) => {
  const paramId = req.params.id;
  const result = memoria.getElementById(paramId);
  if (result == null) {
    res.status(404).send('Producto no encontrado');
  }
  res.status(200).send(JSON.stringify(result));
});

routerProductos.post(pathAgregar, (req: Request, res: Response) => {
  if (isAdmin) {
    const product = req.body;
    if (product.name && product.description && product.code) {
      mongooseLocalProductosAdd(product);
      // memoria.addElement(product);
      ioServer.sockets.emit('cargarProductos', memoria.getArray());
      // knex_productsRecord();
      res.redirect('/');
    } else {
      res.status(400).send({ error: 'Información incompleta' });
    }
  } else {
    res.send({
      error: -1,
      descripcion: `ruta '${pathAgregar}' método 'Guardar' no autorizada`,
    });
  }
});

routerProductos.put(pathUpdate, (req: Request, res: Response) => {
  if (isAdmin) {
    const paramId = req.params.id;
    const newProduct = req.body;
    console.log('new product', newProduct);
    memoria.updateObject(newProduct, paramId);
    console.log('get array:', memoria.getArray());
    mongooseLocalProductosUpdate(newProduct, paramId);
    // knex_update(newProduct, paramId);

    res.send(newProduct);
  } else {
    res.send({
      error: -1,
      descripcion: `ruta '${pathUpdate}' método 'Guardar' no autorizada`,
    });
  }
});

routerProductos.delete(pathDelete, (req: Request, res: Response) => {
  if (isAdmin) {
    const paramId = req.params.id_producto;
    console.log('paramID', paramId);
    const deletedObject = memoria.getElementById(paramId);
    memoria.deleteObject(paramId);
    mongooseLocalProductosDelete(paramId);
    // knex_delete(paramId);
    res.status(200).send(deletedObject);
  } else {
    res.send({
      error: -1,
      descripcion: `ruta '${pathDelete}' método 'Guardar' no autorizada`,
    });
  }
});

//////// EndPoints Carrito

routerCarrito.get(pathListar, (req: Request, res: Response) => {
  const productos = carrito.getProductos();
  res.send({
    idCarrito: carrito.getId(),
    timestampCarrito: carrito.getTimestamp(),
    ProductosEnCarrito: productos,
  });
});

routerCarrito.post(pathAgregarPorId, (req: Request, res: Response) => {
  const paramId = req.params.id_producto;
  console.log('agregar al carrito param id', paramId);
  const producto: any = memoria.getElementById(paramId);
  carrito.addProducto(producto);
  res.send(producto);
  // res.redirect('/');
});

routerCarrito.delete(pathDelete, (req: Request, res: Response) => {
  const paramId = req.params.id_producto;
  const deletedObject = carrito.getProductoById(paramId);
  console.log('deleted object', deletedObject);
  carrito.deleteProducto(paramId);
  res.status(200).send(deletedObject);
});

/////////////// ioServer

// esto esta en mongoose Local

ioServer.on('connection', socket => {
  socket.emit('cargarProductos', memoria.getArray());
  console.log('Se conecto en el back');
});

////////////// ioServer WebChat
interface Message {
  author: string;
  text: string;
}

const messages: Array<Message> = [];

ioServer.on('connection', socket => {
  console.log('Un cliente se ha conectado');
  socket.emit('messages', messages);

  socket.on('new-message', data => {
    chatMongoose(data); //mongoose
    messages.push(data);
    // chatRecord(); 'sqLite3'
    ioServer.sockets.emit('messages', messages);
  });
});

//////////////

// Mensajes con SQLite3 y KNEX

const tableName_msj = 'chatTable';

const chatRecord = () => {
  knex_msj.schema.hasTable(tableName_msj).then(exist => {
    if (exist) {
      knex_msj.schema.dropTable(tableName_msj).then(runChatRecord);
      return;
    }
    runChatRecord();
  });
};

const runChatRecord = () => {
  knex_msj.schema
    .createTable(tableName_msj, table => {
      table.string('author');
      table.string('text');
    })
    .then(() => {
      knex_msj(tableName_msj)
        .insert(messages) //insertar datos 'messages' en la tabla
        .then(() => {
          console.log('chat guardado en SQLite3');
        })
        .catch(error => {
          console.log(error);
          throw error;
        })
        .finally(() => {});
    });
};

////////////////////////////// Productos con mariaDB y KNEX

const tableName_products = 'productsTable';

const knex_productsRecord = () => {
  // SI TABLA EXISTE O NO
  knex_products.schema.hasTable(tableName_products).then(exist => {
    if (exist) {
      knex_products.schema.dropTable(tableName_products).then(productsPersist);
      return;
    }
    productsPersist();
  });
};

const productsPersist = () => {
  // CREAR TABLA
  knex_products.schema
    .createTable(tableName_products, table => {
      table.string('name', 25);
      table.string('description', 50);
      table.string('code', 12);
      table.string('thumbnail', 50);
      table.float('price');
      table.integer('stock');
      table.string('_id');
      table.integer('__v');
    })
    .then(() => {
      console.log('tabla creada');
      knex_products(tableName_products)
        .insert(memoria.getArray())
        .then(() => {
          console.log('datos insertados');
        })
        .catch(error => {
          console.log(error);
        });
    });
};

const knex_listar = () => {
  knex_products // mostrar datos de la tabla 'tableName'
    .from(tableName_products)
    .select('*')
    .then(rows => {
      for (const row of rows) {
        console.log(
          `${row['__v']} ${row['_id']} ${row['name']} ${row['description']} ${row['code']} ${row['thumbnail']} ${row['price']}  ${row['stock']} `
        );
      }
    });
};

// UPDATE

const knex_update = (newProduct: any, paramId: string) => {
  knex_products
    .from(tableName_products)
    .where('id', paramId)
    .update('name', newProduct.name)
    .update('description', newProduct.description)
    .update('code', newProduct.code)
    .update('thumbnail', newProduct.thumbnail)
    .update('price', newProduct.price)
    .update('stock', newProduct.stock)
    .then(() => {
      console.log(`Prodcuto con id ${paramId} fue actualizado`);
    });
};

// DELETE

const knex_delete = (paramId: string) => {
  knex_products
    .from(tableName_products)
    .where('id', paramId)
    .del()
    .then(() => {
      console.log(`Producto con id ${paramId} eliminado`);
    });
};

////// MENSAJES CON MONGOOSE (MONGODB)

const chatMongoose = (messages: any) => {
  (async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      console.log('Base de datos conectada');
      console.log(await modelMensajes.insertMany(messages));
      console.log(await modelMensajes.find());
    } catch (error) {
      console.log(error);
    } finally {
      mongoose.disconnect(() => {
        console.log('Base de datos desconectada');
      });
    }
  })();
};

//////////////// PRODUCTOS CON MONGOOSE

const mongooseLocalProductosAdd = (producto: Producto) => {
  (async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      await modelProductos.insertMany(producto);
    } catch (error) {
      console.log(error);
    } finally {
      mongoose.disconnect(() => {
        console.log('Base de datos desconectada');
        mongooseLocalProductosRead();
      });
    }
  })();
};

// lee la base de datos y la guarda en el array productos
const mongooseLocalProductosRead = () => {
  (async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      const productos: Array<any> = await modelProductos.find();
      memoria.emptyArray();
      for (const producto of productos) {
        memoria.addElement(producto);
      }
    } catch (error) {
      console.log(error);
    } finally {
      mongoose.disconnect(() => {
        console.log('Base de datos desconectada');
      });
    }
  })();
};

mongooseLocalProductosRead();

const mongooseLocalProductosDelete = (id: string) => {
  (async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      await modelProductos.deleteOne({ _id: id });
    } catch (error) {
      console.log(error);
    } finally {
      mongoose.disconnect(() => {
        console.log('Base de datos desconectada');
      });
    }
  })();
};

const mongooseLocalProductosUpdate = (newProduct: any, id: string) => {
  (async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/ecommerce');
      console.log(newProduct);
      await modelProductos.updateOne(
        { _id: id },
        {
          $set: {
            name: newProduct.name,
            description: newProduct.description,
            code: newProduct.code,
            thumbnail: newProduct.thumbnail,
            price: newProduct.price,
            stock: newProduct.stock,
          },
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      mongoose.disconnect(() => {
        console.log('Base de datos desconectada');
        mongooseLocalProductosRead();
      });
    }
  })();
};
