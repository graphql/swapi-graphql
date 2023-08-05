/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 */

import { getObjectFromTypeAndId } from './apiHelper.js';


import { nodeDefinitions, fromGlobalId } from 'graphql-relay';

import FilmType from './types/film.js';
import PersonType from './types/person.js';
import PlanetType from './types/planet.js';
import SpeciesType from './types/species.js';
import StarshipType from './types/starship.js';
import VehicleType from './types/vehicle.js';
import { endPoints } from '../types.js';

// export function swapiTypeToGraphQLType(swapiType: 'films'): typeof FilmType;
// export function swapiTypeToGraphQLType(swapiType: 'people'): typeof PersonType;
// export function swapiTypeToGraphQLType(swapiType: 'planets'): typeof PlanetType;
// export function swapiTypeToGraphQLType(swapiType: 'species'): typeof SpeciesType;
// export function swapiTypeToGraphQLType(swapiType: 'starships'): typeof StarshipType;
// export function swapiTypeToGraphQLType(swapiType: 'vehicles'): typeof VehicleType;
/**
 * Given a "type" in SWAPI, returns the corresponding GraphQL type.
 */
export function swapiTypeToGraphQLType(swapiType: endPoints) {


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
    default:
      throw new Error('Unrecognized type `' + swapiType + '`.');
  }
}

const { nodeInterface, nodeField } = nodeDefinitions<unknown>(
  globalId => {
    const { type, id } = fromGlobalId(globalId);
    return getObjectFromTypeAndId(type as endPoints, id);
  },
  // @ts-expect-error not sure what to do here
 (obj) => {
    const parts = obj.url.split('/');
    return swapiTypeToGraphQLType(parts[parts.length - 3]);
  },
);

export { nodeInterface, nodeField };
