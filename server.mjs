import express from 'express';
import { Memoria } from './productos.mjs';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = 8080;

const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

server.on('error', error => {
  console.log(error);
});

// Rutas URL
const pathListar = '/api/productos/listar';
const pathListarPorId = '/api/productos/listar/:id';
const pathGuardar = '/api/productos/guardar';

const memoria = new Memoria();

// Ejemplo de producto

// memoria.addElement({
//   title: 'Producto 1',
//   precio: 5000,
//   thumbnail: 'imagen.jpg',
// });

app.get(pathListar, (request, response) => {
  const result = memoria.getArray();
  if (result.length > 0) {
    response.status(200).send(JSON.stringify(result));
  } else {
    response.status(404).send({ error: 'No hay productos cargados' });
  }
});

app.get(pathListarPorId, (request, response) => {
  const { id } = request.params;
  const result = memoria.getElementById(id);
  if (result == null) {
    response.status(404).send('Producto no encontrado');
  }
  response.status(200).send(JSON.stringify(result));
});

app.post(pathGuardar, (request, response) => {
  const producto = request.body;
  if (producto.precio && producto.title && producto.thumbnail) {
    memoria.addElement(producto);
    response.status(200).send(producto);
  } else {
    response.status(400).send({ error: 'Información imcompleta' });
  }
});
