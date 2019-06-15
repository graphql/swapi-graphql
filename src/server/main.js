/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 * @flow strict
 */

import cors from 'cors';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import swapiSchema from '../schema';

const app = express();

app.use(cors());

// Requests to /graphql redirect to /
app.all('/graphql', (req, res) => res.redirect('/'));

app.use(
  '/',
  graphqlHTTP(() => ({
    schema: swapiSchema,
    // disable until we can get a new release of express-graphql with latest graphiql
    // graphiql: true,
  })),
);

// Listen for incoming HTTP requests
const listener = app.listen(process.env.PORT || undefined, () => {
  let host = listener.address().address;
  if (host === '::') {
    host = 'localhost';
  }
  const port = listener.address().port;
  // eslint-disable-next-line no-console
  console.log('Listening at http://%s%s', host, port === 80 ? '' : ':' + port);
});

// Handle SIGTERM from docker
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing swapi-graphql server.');
  listener.close(() => {
    console.log('Swapi-graphql server closed.');
  });
});
