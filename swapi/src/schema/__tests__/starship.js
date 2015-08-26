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

describe('Starship type', async () => {
  it('Gets an object by SWAPI ID', async () => {
    var query = `{ starship(starshipID: 5) { name } }`;
    var result = await swapi(query);
    expect(result.data.starship.name).to.equal('Sentinel-class landing craft');
  });

  it('Gets a different object by SWAPI ID', async () => {
    var query = `{ starship(starshipID: 9) { name } }`;
    var result = await swapi(query);
    expect(result.data.starship.name).to.equal('Death Star');
  });

  it('Gets an object by global ID', async () => {
    var query = `{ starship(starshipID: 5) { id, name } }`;
    var result = await swapi(query);
    var nextQuery = `{ starship(id: "${result.data.starship.id}") { id, name } }`;
    var nextResult = await swapi(nextQuery);
    expect(result.data.starship.name).to.equal('Sentinel-class landing craft');
    expect(nextResult.data.starship.name).to.equal('Sentinel-class landing craft');
    expect(result.data.starship.id).to.equal(nextResult.data.starship.id);
  });

  it('Gets an object by global ID with node', async () => {
    var query = `{ starship(starshipID: 5) { id, name } }`;
    var result = await swapi(query);
    var nextQuery = `{
      node(id: "${result.data.starship.id}") {
        ... on Starship {
          id
          name
        }
      }
    }`;
    var nextResult = await swapi(nextQuery);
    expect(result.data.starship.name).to.equal('Sentinel-class landing craft');
    expect(nextResult.data.node.name).to.equal('Sentinel-class landing craft');
    expect(result.data.starship.id).to.equal(nextResult.data.node.id);
  });

  it('Gets all properties', async () => {
    var query = `
{
  starship(starshipID: 9) {
    name
    model
    starshipClass
    manufacturers
    costInCredits
    length
    crew
    passengers
    maxAtmospheringSpeed
    hyperdriveRating
    MGLT
    cargoCapacity
    consumables
    filmConnection(first:1) { edges { node { title } } }
    pilotConnection(first:1) { edges { node { name } } }
  }
}`;
    var result = await swapi(query);
    var expected = {
      MGLT: 10,
      cargoCapacity: 1000000000000,
      consumables: '3 years',
      costInCredits: 1000000000000,
      crew: '342,953',
      filmConnection: { edges: [ { node: { title: 'A New Hope' } } ] },
      hyperdriveRating: 4,
      length: 120000,
      manufacturers: [ 'Imperial Department of Military Research', 'Sienar Fleet Systems' ],
      maxAtmospheringSpeed: null,
      model: 'DS-1 Orbital Battle Station',
      name: 'Death Star',
      passengers: '843,342',
      pilotConnection: { edges: [] },
      starshipClass: 'Deep Space Mobile Battlestation'
    };
    expect(result.data.starship).to.deep.equal(expected);
  });

  it('All objects query', async() => {
    var query = `{ allStarships { edges { cursor, node { name } } } }`;
    var result = await swapi(query);
    expect(result.data.allStarships.edges.length).to.equal(36);
  });

  it('Pagination query', async() => {
    var query = `{
      allStarships(first: 2) { edges { cursor, node { name } } }
    }`;
    var result = await swapi(query);
    expect(result.data.allStarships.edges.map(e => e.node.name))
      .to.deep.equal([
        'CR90 corvette',
        'Star Destroyer',
      ]);
    var nextCursor = result.data.allStarships.edges[1].cursor;

    var nextQuery = `{ allStarships(first: 2, after:"${nextCursor}") {
      edges { cursor, node { name } } }
    }`;
    var nextResult = await swapi(nextQuery);
    expect(nextResult.data.allStarships.edges.map(e => e.node.name))
      .to.deep.equal([
        'Sentinel-class landing craft',
        'Death Star',
      ]);
  });

  describe('Edge cases', () => {
    it('Returns real speed when set to not n/a', async () => {
      var query = `{ starship(starshipID: 5) { name, maxAtmospheringSpeed } }`;
      var result = await swapi(query);
      expect(result.data.starship.name)
        .to.equal('Sentinel-class landing craft');
      expect(result.data.starship.maxAtmospheringSpeed).to.equal(1000);
    });
  });
});
