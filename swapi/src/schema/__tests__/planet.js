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

describe('Planet type', async () => {
  it('Gets an object by SWAPI ID', async () => {
    var query = `{ planet(planetID: 1) { name } }`;
    var result = await swapi(query);
    expect(result.data.planet.name).to.equal('Tatooine');
  });

  it('Gets a different object by SWAPI ID', async () => {
    var query = `{ planet(planetID: 2) { name } }`;
    var result = await swapi(query);
    expect(result.data.planet.name).to.equal('Alderaan');
  });

  it('Gets all properties', async () => {
    var query = `
{
  planet(planetID: 1) {
    name
    diameter
    rotationPeriod
    orbitalPeriod
    gravity
    population
    climates
    terrains
    surfaceWater
    residents(first:1) { edges { node { name } } }
    films(first:1) { edges { node { title } } }
  }
}`;
    var result = await swapi(query);
    var expected = {
      climates: [ 'arid' ],
      diameter: 10465,
      films: { edges: [ { node: { title: 'A New Hope' } } ] },
      gravity: '1 standard',
      name: 'Tatooine',
      orbitalPeriod: 304,
      population: 200000,
      residents: { edges: [ { node: { name: 'Luke Skywalker' } } ] },
      rotationPeriod: 23,
      surfaceWater: 1,
      terrains: [ 'dessert' ] // [sic]
    };
    expect(result.data.planet).to.deep.equal(expected);
  });

  it('All objects query', async() => {
    var query = `{ allPlanets { name } }`;
    var result = await swapi(query);
    expect(result.data.allPlanets.length).to.equal(60);
  });

  it('first query', async() => {
    var query = `{ allPlanets(first: 2) { name } }`;
    var result = await swapi(query);
    expect(result.data.allPlanets.map(e => e.name)).to.deep.equal([
      'Tatooine',
      'Alderaan',
    ]);
  });
});
