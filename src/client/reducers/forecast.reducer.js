import { set } from 'lodash/fp';
import { handleActions } from 'redux-actions';

import * as AT from 'actions/forecast.actions';

const initialState = {
  forecast: []
};

const networkReducer = handleActions(
  {
    [AT.SET_FORECAST]: (state, { payload }) => {
      return set('forecast', payload.forecast, state);
    }
  },
  initialState
);

export default networkReducer;
