/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import GraphQLFilteredUnionType from '../graphQLFilteredUnionType';

import { getSwapiTypeFromUrl } from '../apiHelper';

import VehicleType from './vehicle';
import StarshipType from './starship';
import PersonType from './person';

/**
 * GraphQL equivalent of every "machine" in the SW univers (from SWAPI)
 */
const MachineType = new GraphQLFilteredUnionType({
  name: 'Machine',
  types: [VehicleType, StarshipType, PersonType],
  resolveType: value => {
    const swapiType = getSwapiTypeFromUrl(value.url);

    switch (swapiType) {
      case 'vehicles':
        return VehicleType;
      case 'starships':
        return StarshipType;
      case 'people':
        return PersonType;
      default:
        throw new Error('Type `' + swapiType + '` not in Machine type.');
    }
  },
  filter: (type, objects) => {
    if (type.name === PersonType.name) {
      // filter Person to return only droid (species ID : 2)
      return objects.filter(person =>
        person.species.includes('https://swapi.co/api/species/2/'),
      );
    }
    return objects;
  },
  description: 'Union of Vehicle, Starship and Droid : every available machine',
});

export default MachineType;
