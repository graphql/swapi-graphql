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

  it('Gets an object by global ID', async () => {
    var query = `{ person(personID: 1) { id, name } }`;
    var result = await swapi(query);
    var nextQuery = `{ person(id: "${result.data.person.id}") { id, name } }`;
    var nextResult = await swapi(nextQuery);
    expect(result.data.person.name).to.equal('Luke Skywalker');
    expect(nextResult.data.person.name).to.equal('Luke Skywalker');
    expect(result.data.person.id).to.equal(nextResult.data.person.id);
  });

  it('Gets an object by global ID with node', async () => {
    var query = `{ person(personID: 1) { id, name } }`;
    var result = await swapi(query);
    var nextQuery = `{
      node(id: "${result.data.person.id}") {
        ... on Person {
          id
          name
        }
      }
    }`;
    var nextResult = await swapi(nextQuery);
    expect(result.data.person.name).to.equal('Luke Skywalker');
    expect(nextResult.data.node.name).to.equal('Luke Skywalker');
    expect(result.data.person.id).to.equal(nextResult.data.node.id);
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
    filmConnection(first:1) { edges { node { title } } }
    species { name }
    starshipConnection(first:1) { edges { node { name } } }
    vehicleConnection(first:1) { edges { node { name } } }
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
      filmConnection: { edges: [{ node: { title: 'A New Hope' } }] },
      species: null,
      starshipConnection: { edges: [{ node: { name: 'X-wing' } }] },
      vehicleConnection: { edges: [{ node: { name: 'Snowspeeder' } }] },
    };
    expect(result.data.person).to.deep.equal(expected);
  });

  it('All objects query', async() => {
    var query = `{ allPeople { edges { cursor, node { name } } } }`;
    var result = await swapi(query);
    expect(result.data.allPeople.edges.length).to.equal(82);
  });

  it('Pagination query', async() => {
    var query = `{
      allPeople(first: 2) { edges { cursor, node { name } } }
    }`;
    var result = await swapi(query);
    expect(result.data.allPeople.edges.map(e => e.node.name))
      .to.deep.equal([
        'Luke Skywalker',
        'C-3PO',
      ]);
    var nextCursor = result.data.allPeople.edges[1].cursor;

    var nextQuery = `{ allPeople(first: 2, after:"${nextCursor}") {
      edges { cursor, node { name } } }
    }`;
    var nextResult = await swapi(nextQuery);
    expect(nextResult.data.allPeople.edges.map(e => e.node.name))
      .to.deep.equal([
        'R2-D2',
        'Darth Vader',
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
