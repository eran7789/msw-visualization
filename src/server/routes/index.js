import app from 'routes/app.routes';

const routesPlugin = {
  name: 'routes',
  register: server => server.route([
    ...app
  ])
};

export default routesPlugin;
