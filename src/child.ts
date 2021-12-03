process.on('message', (message: any) => {
  const min = 1;
  const max = 1000;
  let number;
  let object: any = {};

  for (let index = 0; index < message; index++) {
    number = Math.floor(min + Math.random() * (max - min + 1));
    if (object[number] === undefined) {
      object[number] = 1;
      continue;
    }

    object[number]++;
  }

  if (typeof process.send === 'function') {
    process.send(object);
  }
});
