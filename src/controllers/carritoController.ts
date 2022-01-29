import { option } from '../server';
import {
  etherealTransporterInit,
  sendSms,
  sendWhatapp,
} from './emailingAndMessagingController';
import { dao } from '../server';
import { userDataGlobal } from './vistaMainController';

export const getCartProductsController = async (
  request: any,
  response: any
) => {
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
};

export const cartAddByIdController = async (request: any, response: any) => {
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
      response
        .status(200)
        .send(JSON.stringify({ productoAgregado: productToAdd }));
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteProductCartController = async (
  request: any,
  response: any
) => {
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
};

export const getCartProductsPage = async (_request: any, response: any) => {
  const userData: any = userDataGlobal;
  const detalleDeCompra: any = {
    userInfo: userDataGlobal,
    cartProducts: await dao.getCartProducts(),
  };

  response.status(200).render('cart', { userData, detalleDeCompra });
};

export const getPurchaseDetailsController = async (
  _request: any,
  response: any
) => {
  const userData: any = userDataGlobal;
  const detalleDeCompra: any = {
    userInfo: userDataGlobal,
    cartProducts: await dao.getCartProducts(),
  };

  etherealTransporterInit('Nueva compra!', detalleDeCompra);
  sendSms(
    detalleDeCompra.cartProducts,
    'Detalle de la compra',
    userDataGlobal.telefono
  );
  sendWhatapp(detalleDeCompra);
  response
    .status(200)
    .render('check-out', { nombre: userData.nombre, detalleDeCompra });
};

export default {
  getCartProductsController,
  cartAddByIdController,
  getCartProductsPage,
  getPurchaseDetailsController,
  deleteProductCartController,
};
