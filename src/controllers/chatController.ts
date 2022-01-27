import { dao } from '../server';
import { sendSms } from './emailingAndMessagingController';
import { adminData } from '../server';

const pathMain = '/';

export const saveMessages = async (request: any, response: any) => {
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
};

export default saveMessages;
