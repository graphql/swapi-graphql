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
import { getObjectFromUrl, convertToNumber } from '../apiHelper.js';

import FilmType from './film.js';
import PersonType from './person.js';
import PlanetType from './planet.js';

export type Species = {
  name: string,
  classification: string,
  designation: string,
  average_height: string,
  average_lifespan: string,
  eye_colors: string,
  hair_colors: string,
  skin_colors: string,
  language: string,
  homeworld: string,
  people: Array<string>,
  films: Array<string>,
  url: string,
  created: string,
  edited: string,
  id: string,
}
/**
 * The GraphQL type equivalent of the Species resource
 */
const SpeciesType: GraphQLObjectType<Species> = new GraphQLObjectType<Species>({
  name: 'Species',
  description: 'A type of person or character within the Star Wars Universe.',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'The name of this species.',
    },
    classification: {
      type: GraphQLString,
      description:
        'The classification of this species, such as "mammal" or "reptile".',
    },
    designation: {
      type: GraphQLString,
      description: 'The designation of this species, such as "sentient".',
    },
    averageHeight: {
      type: GraphQLFloat,
      resolve: species => convertToNumber(species.average_height),
      description: 'The average height of this species in centimeters.',
    },
    averageLifespan: {
      type: GraphQLInt,
      resolve: species => convertToNumber(species.average_lifespan),
      description:
        'The average lifespan of this species in years, null if unknown.',
    },
    eyeColors: {
      type: new GraphQLList(GraphQLString),
      resolve: species => {
        return species.eye_colors.split(',').map(s => s.trim());
      },
      description: `Common eye colors for this species, null if this species does not typically
have eyes.`,
    },
    hairColors: {
      type: new GraphQLList(GraphQLString),
      resolve: species => {
        if (species.hair_colors === 'none') {
          return [];
        }
        return species.hair_colors.split(',').map(s => s.trim());
      },
      description: `Common hair colors for this species, null if this species does not typically
have hair.`,
    },
    skinColors: {
      type: new GraphQLList(GraphQLString),
      resolve: species => {
        return species.skin_colors.split(',').map(s => s.trim());
      },
      description: `Common skin colors for this species, null if this species does not typically
have skin.`,
    },
    language: {
      type: GraphQLString,
      description: 'The language commonly spoken by this species.',
    },
    homeworld: {
      type: PlanetType,
      resolve: species =>
        species.homeworld ? getObjectFromUrl(species.homeworld) : null,
      description: 'A planet that this species originates from.',
    },
    personConnection: connectionFromUrls('SpeciesPeople', 'people', PersonType),
    filmConnection: connectionFromUrls('SpeciesFilms', 'films', FilmType),
    created: createdField(),
    edited: editedField(),
    id: globalIdField('species'),
  }),
  interfaces: () => [nodeInterface],
});

export default SpeciesType;
