/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { getObjectFromTypeAndId } from './apiHelper';

import type {
  GraphQLObjectType
} from 'graphql';

import {
  nodeDefinitions,
  fromGlobalId,
} from 'graphql-relay';

/**
 * Given a "type" in SWAPI, returns the corresponding GraphQL type.
 */
export function swapiTypeToGraphQLType(swapiType: string): GraphQLObjectType {
  var FilmType = require('./types/film');
  var PersonType = require('./types/person');
  var PlanetType = require('./types/planet');
  var SpeciesType = require('./types/species');
  var StarshipType = require('./types/starship');
  var VehicleType = require('./types/vehicle');

  switch (swapiType) {
    case 'films':
      return FilmType;
    case 'people':
      return PersonType;
    case 'planets':
      return PlanetType;
    case 'starships':
      return StarshipType;
    case 'vehicles':
      return VehicleType;
    case 'species':
      return SpeciesType;
  }
}

var { nodeInterface, nodeField } = nodeDefinitions(
  (globalId) => {
    var {type, id} = fromGlobalId(globalId);
    return getObjectFromTypeAndId(type, id);
  },
  (obj) => {
    var parts = obj.url.split('/');
    return swapiTypeToGraphQLType(parts[parts.length - 3]);
  }
);

export { nodeInterface, nodeField };
