/**
 * Copyright (c) 2020, GraphQL Contributors
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 */

import swapiSchema from '../src/schema';
import { printSchema } from 'graphql/utilities';
import { writeFileSync } from 'fs';

try {
  var output = printSchema(swapiSchema);
  writeFileSync('schema.graphql', output, 'utf8');
} catch (error) {
  console.error(error);
  console.error(error.stack);
}
