/**
 * Copyright (c) 2020, GraphQL Contributors
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 */

import express from 'express';

const app = express();
app.use(express.static('./public'));

// Listen for incoming HTTP requests
const listener = app.listen(() => {
  let host = listener.address().address;
  if (host === '::') {
    host = 'localhost';
  }
  const port = listener.address().port;
  // eslint-disable-next-line no-console
  console.log('Listening at http://%s%s', host, port === 80 ? '' : ':' + port);
});
