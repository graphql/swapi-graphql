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
/*eslint-disable max-len */

describe('Species type', async () => {
  it('Gets an object by SWAPI ID', async () => {
    var query = `{ species(speciesID: 4) { name } }`;
    var result = await swapi(query);
    expect(result.data.species.name).to.equal('Rodian');
  });

  it('Gets a different object by SWAPI ID', async () => {
    var query = `{ species(speciesID: 6) { name } }`;
    var result = await swapi(query);
    expect(result.data.species.name).to.equal('Yoda\'s species');
  });

  it('Gets all properties', async () => {
    var query = `
{
  species(speciesID: 4) {
    name
    classification
    designation
    averageHeight
    averageLifespan
    eyeColors
    hairColors
    skinColors
    language
    homeworld { name }
    people(first:1) { edges { node { name } } }
    films(first:1) { edges { node { title } } }
  }
}`;
    var result = await swapi(query);
    var expected = {
      averageHeight: 170,
      averageLifespan: null,
      classification: 'sentient',
      designation: 'reptilian',
      eyeColors: ['black'],
      hairColors: ['n/a'],
      homeworld: { name: 'Rodia' },
      language: 'Galatic Basic', // [sic]
      name: 'Rodian',
      people: { edges: [ { node: { name: 'Greedo' } } ] },
      films: { edges: [ { node: { title: 'A New Hope' } } ] },
      skinColors: ['green', 'blue']
    };
    expect(result.data.species).to.deep.equal(expected);
  });

  it('All objects query', async() => {
    var query = `{ allSpecies { name } }`;
    var result = await swapi(query);
    expect(result.data.allSpecies.length).to.equal(37);
  });

  it('Pagination query', async() => {
    var query = `{ allSpecies(first: 2) { name } }`;
    var result = await swapi(query);
    expect(result.data.allSpecies.map(e => e.name)).to.deep.equal([
      'Human',
      'Droid',
    ]);
  });

  describe('Edge cases', () => {
    it('Returns empty array for hair colors listed as none', async () => {
      var query = `
      {
        species(speciesID: 34) {
          name
          hairColors
        }
      }`;
      var result = await swapi(query);
      expect(result.data.species.name).to.equal('Muun');
      expect(result.data.species.hairColors).to.deep.equal([]);
    });
  });
});
