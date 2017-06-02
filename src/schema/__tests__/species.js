/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { swapi } from './swapi';

// 80+ char lines are useful in describe/it, so ignore in this file.
/* eslint-disable max-len */

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

describe('Species type', async () => {
  it('Gets an object by SWAPI ID', async () => {
    const query = '{ species(speciesID: 4) { name } }';
    const result = await swapi(query);
    expect(result.data.species.name).to.equal('Rodian');
  });

  it('Gets a different object by SWAPI ID', async () => {
    const query = '{ species(speciesID: 6) { name } }';
    const result = await swapi(query);
    expect(result.data.species.name).to.equal("Yoda's species");
  });

  it('Gets an object by global ID', async () => {
    const query = '{ species(speciesID: 4) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `
      { species(id: "${result.data.species.id}") { id, name } }
    `;
    const nextResult = await swapi(nextQuery);
    expect(result.data.species.name).to.equal('Rodian');
    expect(nextResult.data.species.name).to.equal('Rodian');
    expect(result.data.species.id).to.equal(nextResult.data.species.id);
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
    expect(result.data.species.name).to.equal('Rodian');
    expect(nextResult.data.node.name).to.equal('Rodian');
    expect(result.data.species.id).to.equal(nextResult.data.node.id);
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
      language: 'Galatic Basic', // [sic]
      name: 'Rodian',
      personConnection: { edges: [{ node: { name: 'Greedo' } }] },
      filmConnection: { edges: [{ node: { title: 'A New Hope' } }] },
      skinColors: ['green', 'blue'],
    };
    expect(result.data.species).to.deep.equal(expected);
  });

  it('All objects query', async () => {
    const query = getDocument(
      '{ allSpecies { edges { cursor, node { ...AllSpeciesProperties } } } }',
    );
    const result = await swapi(query);
    expect(result.data.allSpecies.edges.length).to.equal(37);
  });

  it('Pagination query', async () => {
    const query = `{
      allSpecies(first: 2) { edges { cursor, node { name } } }
    }`;
    const result = await swapi(query);
    expect(result.data.allSpecies.edges.map(e => e.node.name)).to.deep.equal([
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
    ).to.deep.equal([
      'Wookie', // [sic]
      'Rodian',
    ]);
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
      expect(result.data.species.name).to.equal('Muun');
      expect(result.data.species.hairColors).to.deep.equal([]);
    });
  });
});
