import { createStore, compose, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';

import rootReducer from 'reducers/root.reducer';
import apiMiddleware from 'middlewares/api.middleware';

import { isWebEnv } from 'shared-utils/web.utils';

const middlewares = [apiMiddleware];

if (process.env.NODE_ENV !== 'production' && typeof window === 'object') {
  middlewares.unshift(
    createLogger({
      collapsed: true,
      colors: {
        title: () => 'white',
        prevState: () => 'white',
        action: () => 'white',
        nextState: () => 'white',
        error: () => 'white'
      }
    })
  );
}

export const getStore = () => {
  const initialState = isWebEnv()
    ? JSON.parse(unescape(window.__REDUX__STATE__))
    : undefined;
  const composeEnhancers = isWebEnv() ? (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) : compose;
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  if (isWebEnv() && process.env.NODE_ENV !== 'production') {
    window.store = store;
  }

  return store;
};
