const pathMain = '/';
const pathAgregar = '/agregar';
const pathUpdate = '/actualizar/:id';
const pathDelete = '/borrar/:id';
import { option } from '../server';
import { isAdmin } from '../server';
import { dao } from '../server';
import initializeProducts from './productsSocketIoEmitController';

export const getProductsController = async (_request: any, response: any) => {
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
};

export const getProductByIdController = async (request: any, response: any) => {
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
};

export const insertProductController = async (request: any, response: any) => {
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
};

export const updateProductController = async (request: any, response: any) => {
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
};

export const deleteProductController = async (request: any, response: any) => {
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
};

export default {
  insertProductController,
  getProductByIdController,
  getProductsController,
  updateProductController,
  deleteProductController,
};
