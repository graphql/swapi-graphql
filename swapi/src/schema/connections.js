/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import {
  connectionFromPromisedArray,
  connectionArgs,
  connectionDefinitions,
} from 'graphql-relay';

import {
  getObjectFromUrl
} from './apiHelper';

import type {
  GraphQLOutputType,
  GraphQLFieldConfig
} from 'graphql';

/**
 * Constructs a GraphQL connection field config; it is assumed
 * that the object has a property named `prop`, and that property
 * contains a list of URLs.
 */
export function connectionFromUrls(
  name: string,
  prop: string,
  type: GraphQLOutputType
): GraphQLFieldConfig {
  var {connectionType} = connectionDefinitions({name: name, nodeType: type});
  return {
    type: connectionType,
    args: connectionArgs,
    resolve: (obj, args) => {
      return connectionFromPromisedArray(
        Promise.all(obj[prop].map(getObjectFromUrl)),
        args
      );
    },
  };
}
