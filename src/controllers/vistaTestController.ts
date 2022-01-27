import faker from 'faker';
faker.locale = 'es';

export const vistaTest = (request: any, response: any) => {
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
};

export default vistaTest;
