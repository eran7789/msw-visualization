import React from 'react';
import ReactDomServer from 'react-dom/server';
import { StaticRouter, RouterContext, Router } from 'react-router';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import { get, flow, map, compact, flatten, pick } from 'lodash/fp';

import { getStore } from 'store';
import routes from 'routes';

export const getRenderProps = location => new Promise(resolve => {
  const matchedRoutes = matchRoutes(routes, location.path);
  const renderProps = {
    matchedRoutes,
    location
  }

  return resolve(renderProps);
});

// Api actions to happen before ssr
// Actions can go on the static class property of component or
// the wrapper component or the route itself
const getSsrApiActions = route =>
  get('route.component.ssrApiActions', route) ||
  get('route.component.WrappedComponent.ssrApiActions', route) ||
  get('route.ssrApiAction', route);

export const getInitializedStore = (locale, userAgent) => {
  const store = getStore();

  return store;
};

const withCustomUserAgent = (action, userAgent) => ({
  ...action,
  payload: {
    ...action.payload,
    userAgent
  }
});

export const fetchRequiredData = userAgent => renderProps => {
  const store = getInitializedStore(userAgent);
  const requiredDataPromises = flow(
    map(getSsrApiActions),
    compact,
    flatten,
    map(apiAction => store.dispatch(withCustomUserAgent(apiAction(renderProps), userAgent)))
  )(renderProps.matchedRoutes);

  return Promise.all(requiredDataPromises)
    .then(() => Promise.resolve({ renderProps, store }))
    .catch(() => Promise.resolve({ renderProps, store }));
};

export const renderToString = (renderProps, store) => {
  const context = {};
  const html = ReactDomServer.renderToString(
    <Provider store={store}>
      <StaticRouter context={context} location={renderProps.location}>
        {renderRoutes(routes)}
      </StaticRouter>
    </Provider>
  );

  return html;
}

export const renderApp = ({ renderProps, store }) => {
  const reducers = [
    'network'
  ];

  const state = pick(reducers, store.getState());
  const html = renderToString(renderProps, store);
  const scripts = `<script>window.__REDUX__STATE__ = '${escape(
    JSON.stringify(state)
  )}';</script>`;
  const { title = '', meta = '' } = Helmet.renderStatic();

  return {
    title: title.toString(),
    meta: meta.toString(),
    html,
    scripts
  };
};
