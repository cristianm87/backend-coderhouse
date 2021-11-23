// SOCKETiO MESSAGES

// NORMALIZER
const authorSchema = new normalizr.schema.Entity('author', undefined, {
  idAttribute: 'email',
});

const messageSchema = new normalizr.schema.Entity('message', {
  author: authorSchema,
});

const messagesSchema = new normalizr.schema.Entity('messages', {
  messages: [messageSchema],
});

const socketMensajes = io();
socketMensajes.on('message-from-server', data => {
  const denormalizedData = normalizr.denormalize(
    data.result,
    messagesSchema,
    data.entities
  );

  const denormalizedDataLength = JSON.stringify(denormalizedData).length;
  const normalizedDataLength = JSON.stringify(data).length;

  if (denormalizedData.messages.length < 1) {
    document.getElementById('compresion').innerHTML =
      '(Sin mensajes para comprimir)';
  } else {
    document.getElementById('compresion').innerHTML = `(Compresión: ${(
      (normalizedDataLength / denormalizedDataLength) *
      100
    ).toFixed(2)}%)`;
  }
  document.getElementById('messages').innerHTML = denormalizedData.messages
    .map(
      entry =>
        `<div>
          <strong id="chatAuthor"">${entry.author.email}</strong> <span id="chatDate">[${entry.fecha}]</span>
          <em id="chatText">${entry.text}</em> <img id="chatAvatar" src="${entry.author.avatar}"></img>
        </div>`
    )
    .join(' ');
});

// SOCKETiO PRODUCTS

// pre compiled template?

const socketProductos = io();
socketProductos.on('products-from-server', data => {
  const html = ejs.render(
    `<section>
            <h1>Lista de productos</h1>
            <% if(productos.length === 0) {%>
            <h2>No hay productos</h2>
            <%} else {%>
            <table class="table table-dark">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Timestamp</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Descripcion</th>
                  <th scope="col">Codigo</th>
                  <th scope="col">Foto Url</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Stock</th>
                </tr>
              </thead>
              <tbody>
                <% productos.forEach(function(producto) { %>
                <tr>
                  <td><%= producto._id %></td>
                  <td><%= producto.timestamp %></td>
                  <td><%= producto.name %></td>
                  <td><%= producto.description %></td>
                  <td><%= producto.code %></td>
                  <td><img src="<%= producto.thumbnail %>" width="50px"</td>
                  <td>$<%= producto.price %></td>
                  <td><%= producto.stock %></td>
                </tr>
                <%})%>
              </tbody>
            </table>
            <% } %>
          </section>`,
    {
      productos: data,
    }
  );
  document.getElementById('tablaProductos').innerHTML = html;
});
