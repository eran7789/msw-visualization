import { API_BASE_URL } from 'constants/api.constants';

export const LABEL = 'FORECAST';
export const FETCH_FORECAST = 'FETCH_FORECAST';
export const SET_FORECAST = 'SET_FORECAST';

export const fetchForecast = ({ spotId }) => ({
  type: FETCH_FORECAST,
  payload: {
    label: LABEL,
    method: 'GET',
    url: `${API_BASE_URL}/forecast`,
    data: {
      spotId
    },
    onSuccess: (forecast, dispatch) => dispatch(setForecast({ forecast })),
  },
  meta: {
    api: true
  }
});

export const setForecast = ({ forecast }) => ({
  type: SET_FORECAST,
  payload: { forecast }
});
