/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';

import {
  fromGlobalId,
  connectionFromPromisedArray,
  connectionArgs,
  connectionDefinitions,
} from 'graphql-relay';

import {
  getObjectsByType,
  getObjectFromTypeAndId
} from './apiHelper';

import {
  swapiTypeToGraphQLType,
  nodeField,
} from './relayNode';


/**
 * Creates a root field to get an object of a given type.
 * Accepts either `id`, the globally unique ID used in GraphQL,
 * or `idName`, the per-type ID used in SWAPI.
 */
function rootFieldByID(idName, swapiType) {
  var getter = (id) => getObjectFromTypeAndId(swapiType, id);
  var argDefs = {};
  argDefs.id = { type: GraphQLID };
  argDefs[idName] = { type: GraphQLID };
  return {
    type: swapiTypeToGraphQLType(swapiType),
    args: argDefs,
    resolve: (_, args) => {
      if (args[idName] !== undefined && args[idName] !== null) {
        return getter(args[idName]);
      }

      if (args.id !== undefined && args.id !== null) {
        var globalId = fromGlobalId(args.id);
        if (globalId.id === null ||
            globalId.id === undefined ||
            globalId.id === '') {
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
function rootConnection(name, swapiType) {
  var {connectionType} = connectionDefinitions({
    name: name,
    nodeType: swapiTypeToGraphQLType(swapiType)
  });
  return {
    type: connectionType,
    args: connectionArgs,
    resolve: (_, args) => {
      return connectionFromPromisedArray(
        getObjectsByType(swapiType, args),
        args
      );
    }
  };
}

/**
 * The GraphQL type equivalent of the Root resource
 */
var rootType = new GraphQLObjectType({
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

var swapiSchema = new GraphQLSchema({query: rootType});
export default swapiSchema;
