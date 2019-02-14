import React from 'react';
import { Route, IndexRoute } from 'react-router';

import Root from 'components/root/root';
import Home from 'components/pages/home';

const MainRoutes = [{
  path: '/',
  exact: true,
  component: Home
}];

const routes = [{
  component: Root,
  routes: MainRoutes
}];

export default routes;
