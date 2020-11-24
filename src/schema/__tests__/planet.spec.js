/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { swapi } from './swapi';

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

describe('Planet type', () => {
  it('Gets an object by SWAPI ID', async () => {
    const query = '{ planet(planetID: 1) { name } }';
    const result = await swapi(query);
    expect(result.data.planet.name).toBe('Tatooine');
  });

  it('Gets a different object by SWAPI ID', async () => {
    const query = '{ planet(planetID: 2) { name } }';
    const result = await swapi(query);
    expect(result.data.planet.name).toBe('Alderaan');
  });

  it('Gets an object by global ID', async () => {
    const query = '{ planet(planetID: 1) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `{ planet(id: "${result.data.planet.id}") { id, name } }`;
    const nextResult = await swapi(nextQuery);
    expect(result.data.planet.name).toBe('Tatooine');
    expect(nextResult.data.planet.name).toBe('Tatooine');
    expect(result.data.planet.id).toBe(nextResult.data.planet.id);
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
    expect(result.data.planet.name).toBe('Tatooine');
    expect(nextResult.data.node.name).toBe('Tatooine');
    expect(result.data.planet.id).toBe(nextResult.data.node.id);
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
    expect(result.data.planet).toMatchObject(expected);
  });

  it('All objects query', async () => {
    const query = getDocument(
      '{ allPlanets { edges { cursor, node { ...AllPlanetProperties } } } }',
    );
    const result = await swapi(query);
    expect(result.data.allPlanets.edges.length).toBe(60);
  });

  it('Pagination query', async () => {
    const query = `{
      allPlanets(first: 2) { edges { cursor, node { name } } }
    }`;
    const result = await swapi(query);
    expect(result.data.allPlanets.edges.map(e => e.node.name)).toMatchObject([
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
    ).toMatchObject(['Yavin IV', 'Hoth']);
  });
});
