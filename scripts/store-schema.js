/**
 *  Copyright (c) 2015-present, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

import swapiSchema from '../src/schema';
import { printSchema } from 'graphql/utilities';
import { writeFileSync } from 'fs'

try {
  var output = printSchema(swapiSchema);
  writeFileSync('schema.graphql', output, 'utf8')
} catch (error) {
  console.error(error);
  console.error(error.stack);
}
