import { dao } from '../server';
const pathLogin = '/login';
export let userDataGlobal: any = {};
import {
  etherealTransporterInit,
  gmailTransporterInit,
} from './emailingAndMessagingController';
export const mainFilterByNameController = async (
  request: any,
  response: any
) => {
  const filtrar = request.body.buscar;
  try {
    await dao.filterByName(filtrar);
  } catch (error) {
    console.log(error);
  } finally {
    response.redirect('/');
  }
};

export const mainFilterByPriceController = async (
  request: any,
  response: any
) => {
  const precioMin = request.body.min;
  const precioMax = request.body.max;
  try {
    await dao.filterByPrice(precioMin, precioMax);
  } catch (error) {
    console.log(error);
  } finally {
    response.redirect('/');
  }
};

export const vistaMain = async (request: any, response: any) => {
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
};

export default {
  mainFilterByNameController,
  mainFilterByPriceController,
  vistaMain,
  userDataGlobal,
};
