/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { getObjectFromTypeAndId } from './apiHelper';

import type { GraphQLObjectType, GraphQLUnionType } from 'graphql';

import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

/**
 * Given a "type" in SWAPI, returns the corresponding GraphQL type.
 */
export function swapiTypeToGraphQLType(
  swapiType: string,
): GraphQLObjectType | GraphQLUnionType {
  const FilmType = require('./types/film').default;
  const PersonType = require('./types/person').default;
  const PlanetType = require('./types/planet').default;
  const SpeciesType = require('./types/species').default;
  const StarshipType = require('./types/starship').default;
  const VehicleType = require('./types/vehicle').default;
  const MachineType = require('./types/machine').default;

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
    case 'machines':
      return MachineType;
    default:
      throw new Error('Unrecognized type `' + swapiType + '`.');
  }
}

/**
 * Given a GraphQL type, return the corresponding SWAPI type
 */
export function graphQLTypeToSwapiType(graphQLType: GraphQLObjectType): string {
  const typeMap = {
    Film: 'films',
    Person: 'people',
    Planet: 'planets',
    Starship: 'starships',
    Vehicle: 'vehicles',
    Species: 'species',
    Machine: 'machines',
  };

  if (graphQLType.name in typeMap) {
    return typeMap[graphQLType.name];
  }

  throw new Error('Unrecognized type `' + graphQLType.name + '`.');
}

const { nodeInterface, nodeField } = nodeDefinitions(
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    return getObjectFromTypeAndId(type, id);
  },
  obj => {
    const parts = obj.url.split('/');
    return swapiTypeToGraphQLType(parts[parts.length - 3]);
  },
);

export { nodeInterface, nodeField };
