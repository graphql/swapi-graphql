/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { GraphQLString } from 'graphql';

// These two fields appear on all types, so let's only write them once.
export function createdField(): any {
  return {
    type: GraphQLString,
    description:
      'The ISO 8601 date format of the time that this resource was created.',
  };
}

export function editedField(): any {
  return {
    type: GraphQLString,
    description:
      'The ISO 8601 date format of the time that this resource was edited.',
  };
}
