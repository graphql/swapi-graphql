/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

/*eslint-env browser */

import React from 'react';
import { GraphiQL } from 'graphiql';
import 'isomorphic-fetch'; /* global fetch */

function graphQLFetcher(graphQLParams) {
  return fetch(window.location.origin + '/graphql', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then(response => response.json());
}

React.render(<GraphiQL fetcher={graphQLFetcher} />, document.body);
