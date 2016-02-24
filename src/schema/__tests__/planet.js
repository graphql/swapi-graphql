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

  it('Gets an object by global ID', async () => {
    var query = `{ planet(planetID: 1) { id, name } }`;
    var result = await swapi(query);
    var nextQuery = `{ planet(id: "${result.data.planet.id}") { id, name } }`;
    var nextResult = await swapi(nextQuery);
    expect(result.data.planet.name).to.equal('Tatooine');
    expect(nextResult.data.planet.name).to.equal('Tatooine');
    expect(result.data.planet.id).to.equal(nextResult.data.planet.id);
  });

  it('Gets an object by global ID with node', async () => {
    var query = `{ planet(planetID: 1) { id, name } }`;
    var result = await swapi(query);
    var nextQuery = `{
      node(id: "${result.data.planet.id}") {
        ... on Planet {
          id
          name
        }
      }
    }`;
    var nextResult = await swapi(nextQuery);
    expect(result.data.planet.name).to.equal('Tatooine');
    expect(nextResult.data.node.name).to.equal('Tatooine');
    expect(result.data.planet.id).to.equal(nextResult.data.node.id);
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
    residentConnection(first:1) { edges { node { name } } }
    filmConnection(first:1) { edges { node { title } } }
  }
}`;
    var result = await swapi(query);
    var expected = {
      climates: [ 'arid' ],
      diameter: 10465,
      filmConnection: { edges: [ { node: { title: 'A New Hope' } } ] },
      gravity: '1 standard',
      name: 'Tatooine',
      orbitalPeriod: 304,
      population: 200000,
      residentConnection: { edges: [ { node: { name: 'Luke Skywalker' } } ] },
      rotationPeriod: 23,
      surfaceWater: 1,
      terrains: [ 'desert' ]
    };
    expect(result.data.planet).to.deep.equal(expected);
  });

  it('All objects query', async() => {
    var query = `{ allPlanets { edges { cursor, node { name } } } }`;
    var result = await swapi(query);
    expect(result.data.allPlanets.edges.length).to.equal(60);
  });

  it('Pagination query', async() => {
    var query = `{
      allPlanets(first: 2) { edges { cursor, node { name } } }
    }`;
    var result = await swapi(query);
    expect(result.data.allPlanets.edges.map(e => e.node.name))
      .to.deep.equal([
        'Tatooine',
        'Alderaan',
      ]);
    var nextCursor = result.data.allPlanets.edges[1].cursor;

    var nextQuery = `{ allPlanets(first: 2, after:"${nextCursor}") {
      edges { cursor, node { name } } }
    }`;
    var nextResult = await swapi(nextQuery);
    expect(nextResult.data.allPlanets.edges.map(e => e.node.name))
      .to.deep.equal([
        'Yavin IV',
        'Hoth',
      ]);
  });
});
