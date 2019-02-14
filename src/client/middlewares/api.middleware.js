// @flow
import { get } from 'lodash/fp';
import apiUtils from 'utils/api.utils';
import { startNetwork, endNetwork } from 'actions/network.actions';

import { Middleware } from 'types/redux.types';
// import { Middleware } from 'redux'; doesn't work?

const apiMiddleware: Middleware = ({ dispatch }) => next => action => {
  if (!get('meta.api', action)) {
    return next(action);
  }

  const {
    url,
    method = 'GET',
    data,
    onSuccess,
    onError,
    label
  } = action.payload;
  const headers = {};

  // TODO: if using token authentication
  // if (getState().user.token) {
  //   headers['auth'] = getState().user.token;
  // }

  dispatch(startNetwork(label));

  const request = apiUtils.request({ method, url, data, headers });

  request
    .then(({ body, ...rest }) => {
      dispatch(endNetwork(label));

      if (onSuccess) onSuccess(body, dispatch);
    })
    .catch(error => {
      console.error('API error', error, action);

      dispatch(endNetwork(label));

      if (get('response.status', error) === 401) {
        // TODO: handle 401
      }

      if (onError) onError(error, dispatch);
    });

  next(action);

  return request;
};

export default apiMiddleware;
