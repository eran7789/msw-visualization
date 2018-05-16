import 'babel-polyfill';
import 'app-module-path/register';
import Hapi from 'hapi';
import Inert from 'inert';

import Routes from 'routes';

const plugins = [Inert];
const server = Hapi.Server({
  routes: {
    cors: {
      origin: ['*'],
      credentials: true
    }
  },
  host: '0.0.0.0',
  port: process.env.NODE_ENV === 'production' ? +process.env.PORT || 80 : 8080
});

(async () => {
  await server.register(plugins);
  
  await server.register(Routes);

  await server.start();

  console.log(`Server is listening at ${server.info.uri}`);
})();

process.on('SIGINT', () => {
  console.log('stopping hapi server');

  server.stop({ timeout: 10000 }).then(err => {
    console.log('hapi server stopped');
    process.exit(err ? 1 : 0);
  });
});
