import fs from 'fs';
import path from 'path';
import cheerio from 'cheerio';
import { pick } from 'lodash';

import { getRenderProps, fetchRequiredData, renderApp } from 'utils/ssr';

import { APP, ASSETS, APP_ASSETS } from 'constants/assets.constants';

const index = fs.readFileSync(path.join(APP_ASSETS, 'index.html'));

export default [
  {
    method: 'GET',
    path: '/favicon.ico',
    handler: {
      file: path.join(ASSETS, 'favicon.ico')
    }
  },
  {
    method: 'GET',
    path: '/robots.txt',
    handler: {
      file: path.join(ASSETS, 'robots.txt')
    }
  },
  {
    method: 'GET',
    path: '/sitemap.xml',
    handler: (req, h) =>
      'build your sitemap'
  },
  {
    method: 'GET',
    path: `/${APP}/{file*}`,
    handler: {
      directory: {
        path: APP_ASSETS
      }
    }
  },
  {
    method: 'GET',
    path: '/{appPath*}',
    handler: req =>
      getRenderProps(pick(req.url, ['pathname', 'query']))
        .then(fetchRequiredData(req.headers['user-agent']))
        .then(renderApp)
        .then(({ title, meta, html, scripts }) => {
          const $ = cheerio.load(index);

          $('head')
            .prepend(title)
            .prepend(meta);

          $('#root')
            .html(html)
            .after(scripts);

          return $.html();
        })
  }
];
