/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 */

import cors from 'cors';
import fs from 'fs';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import swapiSchema from './schema/index';

const app = express();

app.use(cors());

// Requests to /graphql redirect to /
app.all('/graphql', (req, res) => res.redirect('/'));

// Load our own GraphiQL (since express-graphql has an older graphiql version)
app.use('/graphiql', express.static('./public'));

// Provide the static schema for reference in a few formats
app.get('/schema', (req, res) => {
  res.set('Content-Type', 'text');
  fs.readFile('./schema.graphql', 'utf-8', (err, file) => {
    res.write(Buffer.from(file));
    res.end();
  });
});
// octet-stream
app.use('/schema.graphql', express.static('./schema.graphql'));

// Finally, serve up the GraphQL Schema itself
app.use(
  '/',
  graphqlHTTP(() => ({ schema: swapiSchema })),
);

module.exports = app;
