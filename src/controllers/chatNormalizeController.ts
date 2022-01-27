import { option } from '../server';
import { dao } from '../server';
import ioSocketMessages from './chatSocketIoEmitController';
const normalizr = require('normalizr');

// Socket IO Messages Normalizr

export let normalizedData: any = {};

export const initializeNormalizedMessages = async () => {
  const authorSchema = new normalizr.schema.Entity('author', undefined, {
    idAttribute: 'email',
  });

  const messageSchema = new normalizr.schema.Entity('message', {
    author: authorSchema,
  });

  const messagesSchema = new normalizr.schema.Entity('messages', {
    messages: [messageSchema],
  });
  let messagesFromDb: any = [];
  const messages: any = [];

  if (option === 0) {
    messagesFromDb = await dao.getMessagesSync();
  } else if (option === 1 || option === 2) {
    messagesFromDb = await dao.getMessages();
  }

  messagesFromDb.forEach(function (e: any, i: any) {
    messages.push({
      id: i + 1,
      author: {
        email: e.author.email,
        nombre: e.author.nombre,
        apellido: e.author.apellido,
        edad: e.author.edad,
        alias: e.author.alias,
        avatar: e.author.avatar,
      },
      fecha: e.fecha,
      text: e.text,
    });
  });

  const messagesData = {
    id: 1,
    messages: [],
  };

  messagesData.messages = messages;

  normalizedData = normalizr.normalize(messagesData, messagesSchema);
  ioSocketMessages();
};

export default { initializeNormalizedMessages, normalizedData };
