/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *

 */

import {
  GraphQLFieldConfig,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import {
  fromGlobalId,
  connectionFromArray,
  connectionArgs,
  connectionDefinitions,
  Connection,
  Edge
} from 'graphql-relay';

import { getObjectsByType, getObjectFromTypeAndId } from './apiHelper.js';

import { swapiTypeToGraphQLType, nodeField } from './relayNode.js';
import { endPoints } from '../types.js';

/**
 * Creates a root field to get an object of a given type.
 * Accepts either `id`, the globally unique ID used in GraphQL,
 * or `idName`, the per-type ID used in SWAPI.
 */
function rootFieldByID(
  idName: string,
  swapiType: endPoints,
): GraphQLFieldConfig<unknown, unknown> {
  const getter = (id: string) => getObjectFromTypeAndId(swapiType, id);
  return {
    type: swapiTypeToGraphQLType(swapiType),
    args: {
      id: { type: GraphQLID },
      [idName]: { type: GraphQLID },
    },
    resolve: (_, args) => {
      if (args[idName] !== undefined && args[idName] !== null) {
        return getter(args[idName]);
      }

      if (args.id !== undefined && args.id !== null) {
        const globalId = fromGlobalId(args.id);
        if (
          globalId.id === null ||
          globalId.id === undefined ||
          globalId.id === ''
        ) {
          throw new Error('No valid ID extracted from ' + args.id);
        }
        return getter(globalId.id);
      }
      throw new Error('must provide id or ' + idName);
    },
  };
}

/**
 * Creates a connection that will return all objects of the given
 * `swapiType`; the connection will be named using `name`.
 */
function rootConnection(
  name: string,
  swapiType: endPoints,
): GraphQLFieldConfig<Connection<{ id: string }>, unknown> {
  const graphqlType = swapiTypeToGraphQLType(swapiType);
  const { connectionType } = connectionDefinitions({
    name,
    nodeType: graphqlType,
    connectionFields: () => ({
      totalCount: {
        type: GraphQLInt,
        resolve: conn => conn.totalCount,
        description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`,
      },
      [swapiType]: {
        type: new GraphQLList(graphqlType),
        resolve: conn => conn.edges.map((edge: Edge<{ id: string }>) => edge.node),
        description: `A list of all of the objects returned in the connection. This is a convenience
field provided for quickly exploring the API; rather than querying for
"{ edges { node } }" when no edge data is needed, this field can be be used
instead. Note that when clients like Relay need to fetch the "cursor" field on
the edge to enable efficient pagunknownination, this shortcut cannot be used, and the
full "{ edges { node } }" version should be used instead.`,
      },
    }),
  });
  return {
    type: connectionType,
    args: connectionArgs,
    resolve: async (_, args) => {
      const { objects, totalCount } = await getObjectsByType(swapiType);
      return {
        ...connectionFromArray(objects, args),
        totalCount,
      };
    },
  };
}

/**
 * The GraphQL type equivalent of the Root resource
 */
const rootType = new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    allFilms: rootConnection('Films', 'films'),
    film: rootFieldByID('filmID', 'films'),
    allPeople: rootConnection('People', 'people'),
    person: rootFieldByID('personID', 'people'),
    allPlanets: rootConnection('Planets', 'planets'),
    planet: rootFieldByID('planetID', 'planets'),
    allSpecies: rootConnection('Species', 'species'),
    species: rootFieldByID('speciesID', 'species'),
    allStarships: rootConnection('Starships', 'starships'),
    starship: rootFieldByID('starshipID', 'starships'),
    allVehicles: rootConnection('Vehicles', 'vehicles'),
    vehicle: rootFieldByID('vehicleID', 'vehicles'),
    node: nodeField,
  }),
});

export { parse, execute } from 'graphql';

export default new GraphQLSchema({ query: rootType });

