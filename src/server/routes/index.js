import app from 'routes/app.routes';
import forecast from 'routes/forecast.routes';

const routesPlugin = {
  name: 'routes',
  register: server => server.route([
    ...forecast,
    ...app
  ])
};

export default routesPlugin;
