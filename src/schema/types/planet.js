/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../relayNode';
import { createdField, editedField } from '../commonFields';
import { connectionFromUrls } from '../connections';
import { convertToNumber } from '../apiHelper';

import FilmType from './film';
import PersonType from './person';

/**
 * The GraphQL type equivalent of the Planet resource
 */
const PlanetType = new GraphQLObjectType({
  name: 'Planet',
  description: `A large mass, planet or planetoid in the Star Wars Universe, at the time of
0 ABY.`,
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'The name of this planet.',
    },
    diameter: {
      type: GraphQLInt,
      resolve: planet => convertToNumber(planet.diameter),
      description: 'The diameter of this planet in kilometers.',
    },
    rotationPeriod: {
      type: GraphQLInt,
      resolve: planet => convertToNumber(planet.rotation_period),
      description: `The number of standard hours it takes for this planet to complete a single
rotation on its axis.`,
    },
    orbitalPeriod: {
      type: GraphQLInt,
      resolve: planet => convertToNumber(planet.orbital_period),
      description: `The number of standard days it takes for this planet to complete a single orbit
of its local star.`,
    },
    gravity: {
      type: GraphQLString,
      description: `A number denoting the gravity of this planet, where "1" is normal or 1 standard
G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.`,
    },
    population: {
      type: GraphQLFloat,
      resolve: planet => convertToNumber(planet.population),
      description:
        'The average population of sentient beings inhabiting this planet.',
    },
    climates: {
      type: new GraphQLList(GraphQLString),
      resolve: planet => {
        return planet.climate.split(',').map(s => s.trim());
      },
      description: 'The climates of this planet.',
    },
    terrains: {
      type: new GraphQLList(GraphQLString),
      resolve: planet => {
        return planet.terrain.split(',').map(s => s.trim());
      },
      description: 'The terrains of this planet.',
    },
    surfaceWater: {
      type: GraphQLFloat,
      resolve: planet => convertToNumber(planet.surface_water),
      description: `The percentage of the planet surface that is naturally occuring water or bodies
of water.`,
    },
    residentConnection: connectionFromUrls(
      'PlanetResidents',
      'residents',
      PersonType,
    ),
    filmConnection: connectionFromUrls('PlanetFilms', 'films', FilmType),
    created: createdField(),
    edited: editedField(),
    id: globalIdField('planets'),
  }),
  interfaces: () => [nodeInterface],
});
export default PlanetType;
