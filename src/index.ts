import * as debug from 'debug';
import * as http from 'http';

import Server from './server';
import { PORT } from './utils/constants';

debug('ts-express:server');

Server.set('port', PORT);

console.log(`Server listening on port ${PORT}`);

const server = http.createServer(Server);
server.listen(PORT);
server.on('error', onError);
server.on('listening', onListening);

function onError(error: NodeJS.ErrnoException): void {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(): void {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}
