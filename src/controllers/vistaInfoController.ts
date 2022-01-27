import { numCPUs } from '../server';

export const vistaInfo = (request: any, response: any) => {
  const info = {
    argumentosDeEntrada: process.argv,
    nombreDeLaPlataforma: process.platform,
    pathDeEjecución: process.argv[0],
    processId: process.pid,
    versionDeNodeJs: process.version,
    usoDeMemoria: process.memoryUsage(),
    carpetaCorriente: process.cwd(),
    nucleosCpu: numCPUs,
  };
  response.render('info', { info });
};

export default vistaInfo;
