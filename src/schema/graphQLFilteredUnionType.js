/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { GraphQLUnionType } from 'graphql';
import { GraphQLUnionTypeConfig } from 'graphql/type/definition';

/**
 * GraphQLUnionType with a 'filter' method that allow to filter the
 * elements of the union
 */
export default class GraphQLFilteredUnionType extends GraphQLUnionType {
  constructor(config: GraphQLUnionTypeConfig<*, *>): void {
    super(config);

    if ('filter' in config) {
      this.filter = config.filter;
    } else {
      this.filter = (type, objects) => objects;
    }
  }
}
