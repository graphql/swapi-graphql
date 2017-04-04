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
    fragment AllPlanetProperties on Planet {
      climates
      diameter
      gravity
      name
      orbitalPeriod
      population
      rotationPeriod
      surfaceWater
      terrains
      filmConnection(first:1) { edges { node { title } } }
      residentConnection(first:1) { edges { node { name } } }
    }
  `;
}

describe('Planet type', async () => {
  it('Gets an object by SWAPI ID', async () => {
    const query = '{ planet(planetID: 1) { name } }';
    const result = await swapi(query);
    expect(result.data.planet.name).to.equal('Tatooine');
  });

  it('Gets a different object by SWAPI ID', async () => {
    const query = '{ planet(planetID: 2) { name } }';
    const result = await swapi(query);
    expect(result.data.planet.name).to.equal('Alderaan');
  });

  it('Gets an object by global ID', async () => {
    const query = '{ planet(planetID: 1) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `{ planet(id: "${result.data.planet.id}") { id, name } }`;
    const nextResult = await swapi(nextQuery);
    expect(result.data.planet.name).to.equal('Tatooine');
    expect(nextResult.data.planet.name).to.equal('Tatooine');
    expect(result.data.planet.id).to.equal(nextResult.data.planet.id);
  });

  it('Gets an object by global ID with node', async () => {
    const query = '{ planet(planetID: 1) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `{
      node(id: "${result.data.planet.id}") {
        ... on Planet {
          id
          name
        }
      }
    }`;
    const nextResult = await swapi(nextQuery);
    expect(result.data.planet.name).to.equal('Tatooine');
    expect(nextResult.data.node.name).to.equal('Tatooine');
    expect(result.data.planet.id).to.equal(nextResult.data.node.id);
  });

  it('Gets all properties', async () => {
    const query = getDocument(
      `{
      planet(planetID: 1) {
        ...AllPlanetProperties
      }
    }`,
    );
    const result = await swapi(query);
    const expected = {
      climates: ['arid'],
      diameter: 10465,
      filmConnection: { edges: [{ node: { title: 'A New Hope' } }] },
      gravity: '1 standard',
      name: 'Tatooine',
      orbitalPeriod: 304,
      population: 200000,
      residentConnection: { edges: [{ node: { name: 'Luke Skywalker' } }] },
      rotationPeriod: 23,
      surfaceWater: 1,
      terrains: ['desert'],
    };
    expect(result.data.planet).to.deep.equal(expected);
  });

  it('All objects query', async () => {
    const query = getDocument(
      '{ allPlanets { edges { cursor, node { ...AllPlanetProperties } } } }',
    );
    const result = await swapi(query);
    expect(result.data.allPlanets.edges.length).to.equal(60);
  });

  it('Pagination query', async () => {
    const query = `{
      allPlanets(first: 2) { edges { cursor, node { name } } }
    }`;
    const result = await swapi(query);
    expect(result.data.allPlanets.edges.map(e => e.node.name)).to.deep.equal([
      'Tatooine',
      'Alderaan',
    ]);
    const nextCursor = result.data.allPlanets.edges[1].cursor;

    const nextQuery = `{ allPlanets(first: 2, after:"${nextCursor}") {
      edges { cursor, node { name } } }
    }`;
    const nextResult = await swapi(nextQuery);
    expect(
      nextResult.data.allPlanets.edges.map(e => e.node.name),
    ).to.deep.equal(['Yavin IV', 'Hoth']);
  });
});
