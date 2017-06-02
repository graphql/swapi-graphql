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
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { globalIdField } from 'graphql-relay';

import { nodeInterface } from '../relayNode';
import { createdField, editedField } from '../commonFields';
import { connectionFromUrls } from '../connections';
import { getObjectFromUrl, convertToNumber } from '../apiHelper';

import FilmType from './film';
import PlanetType from './planet';
import SpeciesType from './species';
import StarshipType from './starship';
import VehicleType from './vehicle';

/**
 * The GraphQL type equivalent of the People resource
 */
const PersonType = new GraphQLObjectType({
  name: 'Person',
  description:
    'An individual person or character within the Star Wars universe.',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'The name of this person.',
    },
    birthYear: {
      type: GraphQLString,
      resolve: person => person.birth_year,
      description: `The birth year of the person, using the in-universe standard of BBY or ABY -
Before the Battle of Yavin or After the Battle of Yavin. The Battle of Yavin is
a battle that occurs at the end of Star Wars episode IV: A New Hope.`,
    },
    eyeColor: {
      type: GraphQLString,
      resolve: person => person.eye_color,
      description: `The eye color of this person. Will be "unknown" if not known or "n/a" if the
person does not have an eye.`,
    },
    gender: {
      type: GraphQLString,
      description: `The gender of this person. Either "Male", "Female" or "unknown",
"n/a" if the person does not have a gender.`,
    },
    hairColor: {
      type: GraphQLString,
      resolve: person => person.hair_color,
      description: `The hair color of this person. Will be "unknown" if not known or "n/a" if the
person does not have hair.`,
    },
    height: {
      type: GraphQLInt,
      resolve: person => convertToNumber(person.height),
      description: 'The height of the person in centimeters.',
    },
    mass: {
      type: GraphQLFloat,
      resolve: person => convertToNumber(person.mass),
      description: 'The mass of the person in kilograms.',
    },
    skinColor: {
      type: GraphQLString,
      resolve: person => person.skin_color,
      description: 'The skin color of this person.',
    },
    homeworld: {
      type: PlanetType,
      resolve: person =>
        person.homeworld ? getObjectFromUrl(person.homeworld) : null,
      description: 'A planet that this person was born on or inhabits.',
    },
    filmConnection: connectionFromUrls('PersonFilms', 'films', FilmType),
    species: {
      type: SpeciesType,
      resolve: person => {
        if (!person.species || person.species.length === 0) {
          return null;
        }
        return getObjectFromUrl(person.species[0]);
      },
      description:
        'The species that this person belongs to, or null if unknown.',
    },
    starshipConnection: connectionFromUrls(
      'PersonStarships',
      'starships',
      StarshipType,
    ),
    vehicleConnection: connectionFromUrls(
      'PersonVehicles',
      'vehicles',
      VehicleType,
    ),
    created: createdField(),
    edited: editedField(),
    id: globalIdField('people'),
  }),
  interfaces: () => [nodeInterface],
});

export default PersonType;
