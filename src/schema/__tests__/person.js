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

describe('Person type', async () => {
  it('Gets an object by SWAPI ID', async () => {
    const query = '{ person(personID: 1) { name } }';
    const result = await swapi(query);
    expect(result.data.person.name).to.equal('Luke Skywalker');
  });

  it('Gets a different object by SWAPI ID', async () => {
    const query = '{ person(personID: 2) { name } }';
    const result = await swapi(query);
    expect(result.data.person.name).to.equal('C-3PO');
  });

  it('Gets an object by global ID', async () => {
    const query = '{ person(personID: 1) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `{ person(id: "${result.data.person.id}") { id, name } }`;
    const nextResult = await swapi(nextQuery);
    expect(result.data.person.name).to.equal('Luke Skywalker');
    expect(nextResult.data.person.name).to.equal('Luke Skywalker');
    expect(result.data.person.id).to.equal(nextResult.data.person.id);
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
    expect(result.data.person.name).to.equal('Luke Skywalker');
    expect(nextResult.data.node.name).to.equal('Luke Skywalker');
    expect(result.data.person.id).to.equal(nextResult.data.node.id);
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
    expect(result.data.person).to.deep.equal(expected);
  });

  it('All objects query', async () => {
    const query = getDocument(
      '{ allPeople { edges { cursor, node { ...AllPersonProperties } } } }',
    );
    const result = await swapi(query);
    expect(result.data.allPeople.edges.length).to.equal(82);
  });

  it('Pagination query', async () => {
    const query = `{
      allPeople(first: 2) { edges { cursor, node { name } } }
    }`;
    const result = await swapi(query);
    expect(result.data.allPeople.edges.map(e => e.node.name)).to.deep.equal([
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
    ).to.deep.equal(['R2-D2', 'Darth Vader']);
  });

  describe('Edge cases', () => {
    it('Returns null if no species is set', async () => {
      const query = '{ person(personID: 42) { name, species { name } } }';
      const result = await swapi(query);
      expect(result.data.person.name).to.equal('Quarsh Panaka');
      expect(result.data.person.species).to.equal(null);
    });

    it('Returns correctly if a species is set', async () => {
      const query = '{ person(personID: 67) { name, species { name } } }';
      const result = await swapi(query);
      expect(result.data.person.name).to.equal('Dooku');
      expect(result.data.person.species.name).to.equal('Human');
    });
  });
});
