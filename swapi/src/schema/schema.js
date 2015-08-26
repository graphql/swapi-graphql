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
  GraphQLInt,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLList,
} from 'graphql';

import {
  getObjectsByType,
  getObjectFromTypeAndId
} from './apiHelper';

import {
  swapiTypeToGraphQLType,
} from './relayNode';


function rootField(idName, swapiType) {
  var getter = (id) => getObjectFromTypeAndId(swapiType, id);
  var argDefs = {};
  argDefs[idName] = { type: GraphQLID };
  return {
    type: swapiTypeToGraphQLType(swapiType),
    args: argDefs,
    resolve: (_, args) => {
      if (!args[idName]) {
        throw new Error('must provide ' + idName);
      }
      return getter(args[idName]);
    }
  };
}

function rootList(swapiType) {
  return {
    type: new GraphQLList(swapiTypeToGraphQLType(swapiType)),
    args: {
      first: { type: GraphQLInt },
      skip: { type: GraphQLInt },
    },
    resolve: async (_, args) => {
      var objects = await getObjectsByType(swapiType, args);
      if (args.first && args.skip) {
        return objects.slice(args.skip, args.first + args.skip);
      } else if (args.first) {
        return objects.slice(0, args.first);
      } else if (args.skip) {
        return objects.slice(args.skip);
      } else {
        return objects;
      }
    },
  };
}

/**
 * The GraphQL type equivalent of the Root resource
 */
var rootType = new GraphQLObjectType({
  name: 'Root',
  fields: () => ({
    allFilms: rootList('films'),
    film: rootField('filmID', 'films'),
    allPeople: rootList('people'),
    person: rootField('personID', 'people'),
    allPlanets: rootList('planets'),
    planet: rootField('planetID', 'planets'),
    allSpecies: rootList('species'),
    species: rootField('speciesID', 'species'),
    allStarships: rootList('starships'),
    starship: rootField('starshipID', 'starships'),
    allVehicles: rootList('vehicles'),
    vehicle: rootField('vehicleID', 'vehicles'),
  }),
});

var swapiSchema = new GraphQLSchema({query: rootType});
export default swapiSchema;
