/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { graphql } from 'graphql';
import schema from '../schema';

function execute(query, variables, operationName) {
  return graphql(schema, query, null, null, variables, operationName);
}

export { execute, schema };
