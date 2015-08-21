/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */
import path from 'path';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import swapiSchema from '../../swapi/lib/';

var app = express();
app.use('/graphiql', express.static(path.join(__dirname, 'graphiql')));
app.use('/graphql', graphqlHTTP(() => ({
  schema: swapiSchema
})));
var server = app.listen(8080, () => {
  console.log(
    `GraphQL running on http://localhost:${server.address().port}/graphql`
  );
  console.log(
    `GraphiQL running on http://localhost:${server.address().port}/graphiql`
  );
});
