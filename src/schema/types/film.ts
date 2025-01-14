/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *

 */

import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../relayNode.js';
import { createdField, editedField } from '../commonFields.js';
import { connectionFromUrls } from '../connections.js';

import PersonType from './person.js';
import PlanetType from './planet.js';
import SpeciesType from './species.js';
import StarshipType from './starship.js';
import VehicleType from './vehicle.js';

export type Film = {
  title: string,
  episode_id: number,
  opening_crawl: string,
  director: string,
  producer: string,
  release_date: string,
  species: Array<string>,
  starships: Array<string>,
  vehicles: Array<string>,
  characters: Array<string>,
  planets: Array<string>,
  url: string,
  created: string,
  edited: string,
  id: string,
};


/**
 * The GraphQL type equivalent of the Film resource
 */
const FilmType: GraphQLObjectType<Film> = new GraphQLObjectType<Film>({
  name: 'Film',
  description: 'A single film.',
  fields: () => ({
    title: {
      type: GraphQLString,
      description: 'The title of this film.',
    },
    episodeID: {
      type: GraphQLInt,
      resolve: film => film.episode_id,
      description: 'The episode number of this film.',
    },
    openingCrawl: {
      type: GraphQLString,
      resolve: film => film.opening_crawl,
      description: 'The opening paragraphs at the beginning of this film.',
    },
    director: {
      type: GraphQLString,
      description: 'The name of the director of this film.',
    },
    producers: {
      type: new GraphQLList(GraphQLString),
      resolve: film => {
        return film.producer.split(',').map(s => s.trim());
      },
      description: 'The name(s) of the producer(s) of this film.',
    },
    releaseDate: {
      type: GraphQLString,
      resolve: film => film.release_date,
      description:
        'The ISO 8601 date format of film release at original creator country.',
    },
    speciesConnection: connectionFromUrls(
      'FilmSpecies',
      'species',
      SpeciesType,
    ),
    starshipConnection: connectionFromUrls(
      'FilmStarships',
      'starships',
      StarshipType,
    ),
    vehicleConnection: connectionFromUrls(
      'FilmVehicles',
      'vehicles',
      VehicleType,
    ),
    characterConnection: connectionFromUrls(
      'FilmCharacters',
      'characters',
      PersonType,
    ),
    planetConnection: connectionFromUrls('FilmPlanets', 'planets', PlanetType),
    created: createdField(),
    edited: editedField(),
    id: globalIdField('films'),
  }),
  interfaces: () => [nodeInterface],
});

export default FilmType;
