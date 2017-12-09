/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import express from 'express';
import graphqlHTTP from 'express-graphql';
import swapiSchema from '../schema';

const app = express();

app.use(
  '/',
  graphqlHTTP(() => ({
    schema: swapiSchema,
    graphiql: true,
  })),
);

app.use(
  '/',
  graphqlHTTP(() => ({
    schema: swapiSchema,
    graphiql: false,
  })),
);

// Listen for incoming HTTP requests
const listener = app.listen(() => {
  let host = listener.address().address;
  if (host === '::') {
    host = 'localhost';
  }
  const port = listener.address().port;
  /* eslint-disable no-console */
  console.log('Listening at http://%s%s', host, port === 80 ? '' : ':' + port);
  /* eslint-enable no-console */
});
