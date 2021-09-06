const sockett = io.connect(); // como ya habia declarado un socket en el index, y daba error, le cambie el nombre a "sockett"

const date = () => {
  const dt = new Date();
  const date = `${(dt.getMonth() + 1).toString().padStart(2, '0')}/${dt
    .getDate()
    .toString()
    .padStart(2, '0')}/${dt.getFullYear().toString().padStart(4, '0')} ${dt
    .getHours()
    .toString()
    .padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;
  return date;
};

sockett.on('messages', data => {
  document.getElementById('messages').innerHTML = data
    .map(
      entry =>
        `<div>
            <strong style="color: blue">${entry.author} </strong>
            <em style="color: green">${entry.text}</em>
        </div>`
    )
    .join(' ');
});

function addMessage() {
  const inputEmail = document.getElementById('email');
  const inputTexto = document.getElementById('texto');

  const message = {
    author: `${
      inputEmail.value
    } <span style="color: brown">[${date()}]:<span/>`,
    text: inputTexto.value,
  };

  inputTexto.value = '';
  sockett.emit('new-message', message);
  return false; // esto es para que no se actualice la pagina en cada submit
}
