messageId = 0

createMessage(datos) {
  const messageWithId = {
    id: this.messageId++,
    ...datos
  };

  this.mensajes.push(messageWithId)
  fsDao.escribirArchivo(this.filename,this.mensaje)
}

leerMensages() {
  console.log('-------------- NORMALIZADO --------------')
  const authorSchema = new normalizr.schema.Entity(
    'author',
    undefined,
    {
      idAttribute: 'email'
    }
  );
  
  const messageSchema = new normalizr.schema.Entity(
    'message',
    {
      author: authorSchema,
    }
  );

  const messagesSchema = new normalizr.schema.Entity(
    'messages',
    {
      messages: [messageSchema],
    }
  );

  const originalData = {
    id: '1',
    messages: this.mensajes
  }

  const normalizedMessage = normalizr.normalize(originalData, messagesSchema);

  console.log(util.inspect(normalizedMessage, false, 12, true));
}