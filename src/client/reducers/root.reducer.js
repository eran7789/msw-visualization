// @flow
import { combineReducers } from 'redux';

import network from 'reducers/network.reducer';
import forecast from 'reducers/forecast.reducer';

export const reducersMap = {
  network,
  forecast
};

export default combineReducers(reducersMap);
