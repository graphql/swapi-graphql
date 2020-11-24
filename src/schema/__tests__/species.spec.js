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
    fragment AllSpeciesProperties on Species {
      averageHeight
      averageLifespan
      classification
      designation
      eyeColors
      hairColors
      homeworld { name }
      language
      name
      skinColors
      filmConnection(first:1) { edges { node { title } } }
      personConnection(first:1) { edges { node { name } } }
    }
  `;
}

describe('Species type', () => {
  it('Gets an object by SWAPI ID', async () => {
    const query = '{ species(speciesID: 4) { name } }';
    const result = await swapi(query);
    expect(result.data.species.name).toBe('Rodian');
  });

  it('Gets a different object by SWAPI ID', async () => {
    const query = '{ species(speciesID: 6) { name } }';
    const result = await swapi(query);
    expect(result.data.species.name).toBe("Yoda's species");
  });

  it('Gets an object by global ID', async () => {
    const query = '{ species(speciesID: 4) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `
      { species(id: "${result.data.species.id}") { id, name } }
    `;
    const nextResult = await swapi(nextQuery);
    expect(result.data.species.name).toBe('Rodian');
    expect(nextResult.data.species.name).toBe('Rodian');
    expect(result.data.species.id).toBe(nextResult.data.species.id);
  });

  it('Gets an object by global ID with node', async () => {
    const query = '{ species(speciesID: 4) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `{
      node(id: "${result.data.species.id}") {
        ... on Species {
          id
          name
        }
      }
    }`;
    const nextResult = await swapi(nextQuery);
    expect(result.data.species.name).toBe('Rodian');
    expect(nextResult.data.node.name).toBe('Rodian');
    expect(result.data.species.id).toBe(nextResult.data.node.id);
  });

  it('Gets all properties', async () => {
    const query = getDocument(
      `{
      species(speciesID: 4) {
        ...AllSpeciesProperties
      }
    }`,
    );
    const result = await swapi(query);
    const expected = {
      averageHeight: 170,
      averageLifespan: null,
      classification: 'sentient',
      designation: 'reptilian',
      eyeColors: ['black'],
      hairColors: ['n/a'],
      homeworld: { name: 'Rodia' },
      language: 'Galatic Basic',
      name: 'Rodian',
      personConnection: { edges: [{ node: { name: 'Greedo' } }] },
      filmConnection: { edges: [{ node: { title: 'A New Hope' } }] },
      skinColors: ['green', 'blue'],
    };
    expect(result.data.species).toMatchObject(expected);
  });

  it('All objects query', async () => {
    const query = getDocument(
      '{ allSpecies { edges { cursor, node { ...AllSpeciesProperties } } } }',
    );
    const result = await swapi(query);
    expect(result.data.allSpecies.edges.length).toBe(37);
  });

  it('Pagination query', async () => {
    const query = `{
      allSpecies(first: 2) { edges { cursor, node { name } } }
    }`;
    const result = await swapi(query);
    expect(result.data.allSpecies.edges.map(e => e.node.name)).toMatchObject([
      'Human',
      'Droid',
    ]);
    const nextCursor = result.data.allSpecies.edges[1].cursor;

    const nextQuery = `{ allSpecies(first: 2, after:"${nextCursor}") {
      edges { cursor, node { name } } }
    }`;
    const nextResult = await swapi(nextQuery);
    expect(
      nextResult.data.allSpecies.edges.map(e => e.node.name),
    ).toMatchObject(['Wookie', 'Rodian']);
  });

  describe('Edge cases', () => {
    it('Returns empty array for hair colors listed as none', async () => {
      const query = `
      {
        species(speciesID: 34) {
          name
          hairColors
        }
      }`;
      const result = await swapi(query);
      expect(result.data.species.name).toBe('Muun');
      expect(result.data.species.hairColors).toMatchObject([]);
    });
  });
});
