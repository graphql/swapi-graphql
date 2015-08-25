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
    films(first:1) { edges { node { title } } }
    pilots(first:1) { edges { node { name } } }
  }
}`;
    var result = await swapi(query);
    var expected = {
      MGLT: 10,
      cargoCapacity: 1000000000000,
      consumables: '3 years',
      costInCredits: 1000000000000,
      crew: '342,953',
      films: { edges: [ { node: { title: 'A New Hope' } } ] },
      hyperdriveRating: 4,
      length: 120000,
      manufacturers: [ 'Imperial Department of Military Research', 'Sienar Fleet Systems' ],
      maxAtmospheringSpeed: null,
      model: 'DS-1 Orbital Battle Station',
      name: 'Death Star',
      passengers: '843,342',
      pilots: { edges: [] },
      starshipClass: 'Deep Space Mobile Battlestation'
    };
    expect(result.data.starship).to.deep.equal(expected);
  });

  it('All objects query', async() => {
    var query = `{ allStarships { name } }`;
    var result = await swapi(query);
    expect(result.data.allStarships.length).to.equal(36);
  });

  it('Pagination query', async() => {
    var query = `{ allStarships(first: 2) { name } }`;
    var result = await swapi(query);
    expect(result.data.allStarships.map(e => e.name)).to.deep.equal([
      'CR90 corvette',
      'Star Destroyer',
    ]);
  });

  describe('Edge cases', () => {
    it('Returns real speed when set to not n/a', async () => {
      var query = `{ starship(starshipID: 5) { name, maxAtmospheringSpeed } }`;
      var result = await swapi(query);
      expect(result.data.starship.name).to.equal('Sentinel-class landing craft');
      expect(result.data.starship.maxAtmospheringSpeed).to.equal(1000);
    });
  });
});
