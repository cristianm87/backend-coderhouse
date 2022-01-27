import { dao } from '../server';

export const filterByNameController = async (request: any, response: any) => {
  const filtrar = request.body.buscar;
  try {
    await dao.filterByName(filtrar);
  } catch (error) {
    console.log(error);
  } finally {
    response.redirect('/productos/vista');
  }
};

export const filterByPriceController = async (request: any, response: any) => {
  const precioMin = request.body.min;
  const precioMax = request.body.max;
  try {
    await dao.filterByPrice(precioMin, precioMax);
  } catch (error) {
    console.log(error);
  } finally {
    response.redirect('/productos/vista');
  }
};

export const getProductsFilteredController = async (
  request: any,
  response: any
) => {
  return response.render('productos', {
    products: await dao.getProductsFiltered(),
  });
};

export default {
  filterByNameController,
  filterByPriceController,
  getProductsFilteredController,
};
