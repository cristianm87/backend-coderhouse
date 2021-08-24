import express, { response } from 'express';
import { Memoria } from './productos.mjs';
import path from 'path';

const port = 8080;
const app = express();
const router = express.Router();
const __dirname = path.resolve();
const memoria = new Memoria();

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', router);

////

const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

server.on('error', error => {
  console.log(error);
});

////

// Rutas URL
const pathListar = '/productos/listar';
const pathListarPorId = '/productos/listar/:id';
const pathGuardar = '/productos/guardar';
const pathUpdate = '/productos/actualizar/:id';
const parhDelete = '/productos/borrar/:id';

// Ejemplo de producto

// {
//   title: 'Producto 1',
//   precio: 5000,
//   thumbnail: 'imagen.jpg',
// };

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
    response.status(200).send(product);
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
