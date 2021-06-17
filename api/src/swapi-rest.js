/**
 * Copyright (c) 2020, GraphQL Contributors
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 */

const Express = require('express');

const data = require('../cache/data.json');

const resources = [
  'people',
  'starships',
  'vehicles',
  'species',
  'planets',
  'films',
];

const app = new Express();

resources.forEach(r => {
  app.get(`/api/${r}/`, (req, res, next) => {
    if (!data || !data[r]) {
      res.status(500);
      res.error(`bad data, missing file or invalid swapi resource '${r}'`);
    }
    res.status(200);
    res.json({ results: data[r] });
    next();
  });
});

module.exports = app;
