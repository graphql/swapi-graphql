/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { GraphQLUnionType } from 'graphql';

import { getSwapiTypeFromUrl } from '../apiHelper';

import VehicleType from './vehicle';
import StarshipType from './starship';

/**
 * GraphQL equivalent of every "machine" in the SW univers (from SWAPI)
 */
const MachineType = new GraphQLUnionType({
  name: 'Machine',
  types: [VehicleType, StarshipType],
  resolveType: value => {
    const swapiType = getSwapiTypeFromUrl(value.url);

    switch (swapiType) {
      case 'vehicles':
        return VehicleType;
      case 'starships':
        return StarshipType;
      default:
        throw new Error('Type `' + swapiType + '` not in Machine type.');
    }
  },
  description: 'Union of Vehicle and Starship : every available machine',
});

export default MachineType;
