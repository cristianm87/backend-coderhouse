import { json } from 'body-parser';

export const vistaRandoms = (request: any, response: any) => {
  const cantidad = Number(request.query.cant) || 100000000;
  const { fork } = require('child_process');
  const child = fork('./dist/child.js');
  child.send(cantidad);
  child.on(
    'message',
    (message: any) =>
      response
        .status(200)
        .render('random', { numbers: JSON.stringify(message) })
    //response.status(200).send(JSON.stringify(message))
  );
};

export default vistaRandoms;
