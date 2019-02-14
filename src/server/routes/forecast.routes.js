import superagent from 'superagent';
import Boom from 'boom';
import { get } from 'lodash/fp';

export default [
  {
    method: 'GET',
    path: '/api/forecast',
    handler: async (request, h) => {
      const { query } = request;
      const spotId = get('spotId', query);

      if (!spotId) {
        return new Boom.badData('No spot id available in the request');
      }

      try {
        const forecast = 
          await superagent
            .get('http://magicseaweed.com/api/5ca66c8667e818a073411029a83af380/forecast')
            .query({ spot_id: spotId })
            .then(response => {
              return response.body;
            });

        return forecast;
      } catch(error) {
        return newBoom.badImplementation('Something went wrong');
      }
    }
  }
];
