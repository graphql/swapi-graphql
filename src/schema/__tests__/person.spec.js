/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { swapi } from './swapi';

function getDocument(query) {
  return `${query}
    fragment AllPersonProperties on Person {
      birthYear
      eyeColor
      gender
      hairColor
      height
      homeworld { name }
      mass
      name
      skinColor
      species { name }
      filmConnection(first:1) { edges { node { title } } }
      starshipConnection(first:1) { edges { node { name } } }
      vehicleConnection(first:1) { edges { node { name } } }
    }
  `;
}

describe('Person type', () => {
  it('Gets an object by SWAPI ID', async () => {
    const query = '{ person(personID: 1) { name } }';
    const result = await swapi(query);
    expect(result.data.person.name).toBe('Luke Skywalker');
  });

  it('Gets a different object by SWAPI ID', async () => {
    const query = '{ person(personID: 2) { name } }';
    const result = await swapi(query);
    expect(result.data.person.name).toBe('C-3PO');
  });

  it('Gets an object by global ID', async () => {
    const query = '{ person(personID: 1) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `{ person(id: "${result.data.person.id}") { id, name } }`;
    const nextResult = await swapi(nextQuery);
    expect(result.data.person.name).toBe('Luke Skywalker');
    expect(nextResult.data.person.name).toBe('Luke Skywalker');
    expect(result.data.person.id).toBe(nextResult.data.person.id);
  });

  it('Gets an object by global ID with node', async () => {
    const query = '{ person(personID: 1) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `{
      node(id: "${result.data.person.id}") {
        ... on Person {
          id
          name
        }
      }
    }`;
    const nextResult = await swapi(nextQuery);
    expect(result.data.person.name).toBe('Luke Skywalker');
    expect(nextResult.data.node.name).toBe('Luke Skywalker');
    expect(result.data.person.id).toBe(nextResult.data.node.id);
  });

  it('Gets all properties', async () => {
    const query = getDocument(
      `{
      person(personID: 1) {
        ...AllPersonProperties
      }
    }`,
    );
    const result = await swapi(query);
    const expected = {
      name: 'Luke Skywalker',
      birthYear: '19BBY',
      eyeColor: 'blue',
      gender: 'male',
      hairColor: 'blond',
      height: 172,
      mass: 77,
      skinColor: 'fair',
      homeworld: { name: 'Tatooine' },
      filmConnection: { edges: [{ node: { title: 'A New Hope' } }] },
      species: null,
      starshipConnection: { edges: [{ node: { name: 'X-wing' } }] },
      vehicleConnection: { edges: [{ node: { name: 'Snowspeeder' } }] },
    };
    expect(result.data.person).toMatchObject(expected);
  });

  it('All objects query', async () => {
    const query = getDocument(
      '{ allPeople { edges { cursor, node { ...AllPersonProperties } } } }',
    );
    const result = await swapi(query);
    expect(result.data.allPeople.edges.length).toBe(82);
  });

  it('Pagination query', async () => {
    const query = `{
      allPeople(first: 2) { edges { cursor, node { name } } }
    }`;
    const result = await swapi(query);
    expect(result.data.allPeople.edges.map(e => e.node.name)).toMatchObject([
      'Luke Skywalker',
      'C-3PO',
    ]);
    const nextCursor = result.data.allPeople.edges[1].cursor;

    const nextQuery = `{ allPeople(first: 2, after:"${nextCursor}") {
      edges { cursor, node { name } } }
    }`;
    const nextResult = await swapi(nextQuery);
    expect(
      nextResult.data.allPeople.edges.map(e => e.node.name),
    ).toMatchObject(['R2-D2', 'Darth Vader']);
  });

  describe('Edge cases', () => {
    it('Returns null if no species is set', async () => {
      const query = '{ person(personID: 42) { name, species { name } } }';
      const result = await swapi(query);
      expect(result.data.person.name).toBe('Quarsh Panaka');
      expect(result.data.person.species).toBe(null);
    });

    it('Returns correctly if a species is set', async () => {
      const query = '{ person(personID: 67) { name, species { name } } }';
      const result = await swapi(query);
      expect(result.data.person.name).toBe('Dooku');
      expect(result.data.person.species.name).toBe('Human');
    });
  });
});
