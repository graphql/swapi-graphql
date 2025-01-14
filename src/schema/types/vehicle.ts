/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *

 */

import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../relayNode.js';
import { createdField, editedField } from '../commonFields.js';
import { connectionFromUrls } from '../connections.js';
import { convertToNumber } from '../apiHelper.js';

import FilmType from './film.js';
import PersonType from './person.js';

export type Vehicle = {
  name: string,
  model: string,
  vehicle_class: string,
  manufacturer: string,
  cost_in_credits: string,
  length: string,
  crew: string,
  passengers: string,
  max_atmosphering_speed: string,
  cargo_capacity: string,
  consumables: string,
  pilots: Array<string>,
  films: Array<string>,
  url: string,
  created: string,
  edited: string,
  id: string,

}
/**
 * The GraphQL type equivalent of the Vehicle resource
 */
const VehicleType: GraphQLObjectType<Vehicle> = new GraphQLObjectType<Vehicle>({
  name: 'Vehicle',
  description:
    'A single transport craft that does not have hyperdrive capability',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: `The name of this vehicle. The common name, such as "Sand Crawler" or "Speeder
bike".`,
    },
    model: {
      type: GraphQLString,
      description: `The model or official name of this vehicle. Such as "All-Terrain Attack
Transport".`,
    },
    vehicleClass: {
      type: GraphQLString,
      resolve: vehicle => vehicle.vehicle_class,
      description:
        'The class of this vehicle, such as "Wheeled" or "Repulsorcraft".',
    },
    manufacturers: {
      type: new GraphQLList(GraphQLString),
      resolve: vehicle => {
        return vehicle.manufacturer.split(',').map(s => s.trim());
      },
      description: 'The manufacturers of this vehicle.',
    },
    costInCredits: {
      type: GraphQLFloat,
      resolve: vehicle => convertToNumber(vehicle.cost_in_credits),
      description: 'The cost of this vehicle new, in Galactic Credits.',
    },
    length: {
      type: GraphQLFloat,
      resolve: vehicle => convertToNumber(vehicle.length),
      description: 'The length of this vehicle in meters.',
    },
    crew: {
      type: GraphQLString,
      description:
        'The number of personnel needed to run or pilot this vehicle.',
    },
    passengers: {
      type: GraphQLString,
      description:
        'The number of non-essential people this vehicle can transport.',
    },
    maxAtmospheringSpeed: {
      type: GraphQLInt,
      resolve: vehicle => convertToNumber(vehicle.max_atmosphering_speed),
      description: 'The maximum speed of this vehicle in atmosphere.',
    },
    cargoCapacity: {
      type: GraphQLFloat,
      resolve: ship => convertToNumber(ship.cargo_capacity),
      description:
        'The maximum number of kilograms that this vehicle can transport.',
    },
    consumables: {
      type: GraphQLString,
      description: `The maximum length of time that this vehicle can provide consumables for its
entire crew without having to resupply.`,
    },
    pilotConnection: connectionFromUrls('VehiclePilots', 'pilots', PersonType),
    filmConnection: connectionFromUrls('VehicleFilms', 'films', FilmType),
    created: createdField(),
    edited: editedField(),
    id: globalIdField('vehicles'),
  }),
  interfaces: () => [nodeInterface],
});

export default VehicleType;
