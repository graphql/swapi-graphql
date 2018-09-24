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
import path from 'path';

const app = express();

const PUBLIC_DIR = path.resolve(__dirname, '../../', 'public');

app.use(cors());
app.use(express.static(PUBLIC_DIR));

// Requests to /graphql redirect to /
app.all('/graphql', (req, res) => res.redirect('/'));

app.use(
  '/',
  graphqlHTTP(() => ({
    schema: swapiSchema,
    graphiql: true,
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
