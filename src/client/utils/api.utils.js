import superagent from 'superagent';  

export type Request = {
  method: string,
  url: string,
  data: any,
  headers: {
    [key: string]: string
  },
  userAgent: string
};

const apiUtils = {
  request({ method, url, data = null, headers = {}, userAgent }: Request) {
    const request = superagent(method, url)
      .withCredentials()
      .set(headers)
      .set('Accept', 'application/json');

    if (userAgent) {
      request.set('user-agent', userAgent);
    }

    if (data) {
      if (method.toUpperCase() === 'GET') {
        request.query(data);
      } else {
        request.set('Content-type', 'application/json').send(data);
      }
    }

    return request.then(data => data); // force request to be sent
  }
};

export default apiUtils;
