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

describe('Person type', async () => {
  it('Gets an object by SWAPI ID', async () => {
    var query = `{ person(personID: 1) { name } }`;
    var result = await swapi(query);
    expect(result.data.person.name).to.equal('Luke Skywalker');
  });

  it('Gets a different object by SWAPI ID', async () => {
    var query = `{ person(personID: 2) { name } }`;
    var result = await swapi(query);
    expect(result.data.person.name).to.equal('C-3PO');
  });

  it('Gets all properties', async () => {
    var query = `
{
  person(personID: 1) {
    name
    birthYear
    eyeColor
    gender
    hairColor
    height
    mass
    skinColor
    homeworld { name }
    films(first:1) { edges { node { title } } }
    species { name }
    starships(first:1) { edges { node { name } } }
    vehicles(first:1) { edges { node { name } } }
  }
}`;
    var result = await swapi(query);
    var expected = {
      name: 'Luke Skywalker',
      birthYear: '19BBY',
      eyeColor: 'blue',
      gender: 'male',
      hairColor: 'blond',
      height: 172,
      mass: 77,
      skinColor: 'fair',
      homeworld: { name: 'Tatooine' },
      films: { edges: [{ node: { title: 'A New Hope' } }] },
      species: null,
      starships: { edges: [{ node: { name: 'X-wing' } }] },
      vehicles: { edges: [{ node: { name: 'Snowspeeder' } }] },
    };
    expect(result.data.person).to.deep.equal(expected);
  });

  it('All objects query', async() => {
    var query = `{ allPeople { name } }`;
    var result = await swapi(query);
    expect(result.data.allPeople.length).to.equal(82);
  });

  it('Pagination query', async() => {
    var query = `{ allPeople(first: 2) { name } }`;
    var result = await swapi(query);
    expect(result.data.allPeople.map(e => e.name)).to.deep.equal([
      'Luke Skywalker',
      'C-3PO',
    ]);
  });

  describe('Edge cases', () => {
    it('Returns null if no species is set', async () => {
      var query = `{ person(personID: 42) { name, species { name } } }`;
      var result = await swapi(query);
      expect(result.data.person.name).to.equal('Quarsh Panaka');
      expect(result.data.person.species).to.equal(null);
    });

    it('Returns correctly if a species is set', async () => {
      var query = `{ person(personID: 67) { name, species { name } } }`;
      var result = await swapi(query);
      expect(result.data.person.name).to.equal('Dooku');
      expect(result.data.person.species.name).to.equal('Human');
    });
  });
});
