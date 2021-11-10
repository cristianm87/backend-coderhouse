// SOCKETiO PRODUCTOS

// pre compiled template?

const socketProductos = io();
socketProductos.on('products-from-server', data => {
  const html = ejs.render(
    `<section>
            <h1>Tabla</h1>
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
