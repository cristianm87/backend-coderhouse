import autocannon from 'autocannon';
import stream from 'stream';

const run = (url: string) => {
  const buffer: any[] = [];
  const outputStream = new stream.PassThrough();
  const instance: any = autocannon({
    url,
    connections: 100,
    duration: 20,
  });

  autocannon.track(instance, {
    outputStream,
  });

  outputStream.on('data', data => {
    buffer.push(data);
  });

  instance.on('done', () => process.stdout.write(Buffer.concat(buffer)));
};

console.log('Running all benchmarks in parallel...');

run('http://localhost:8080/info');
