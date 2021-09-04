/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { swapi } from './swapi';

function getDocument(query: string): string {
  return `${query}
    fragment AllStarshipProperties on Starship {
      MGLT
      cargoCapacity
      consumables
      costInCredits
      crew
      hyperdriveRating
      length
      manufacturers
      maxAtmospheringSpeed
      model
      name
      passengers
      starshipClass
      filmConnection(first:1) { edges { node { title } } }
      pilotConnection(first:1) { edges { node { name } } }
    }
  `;
}

describe('Starship type', () => {
  it('Gets an object by SWAPI ID', async () => {
    const query = '{ starship(starshipID: 5) { name } }';
    const result = await swapi(query);
    expect(result.data?.starship.name).toBe('Sentinel-class landing craft');
  });

  it('Gets a different object by SWAPI ID', async () => {
    const query = '{ starship(starshipID: 9) { name } }';
    const result = await swapi(query);
    expect(result.data?.starship.name).toBe('Death Star');
  });

  it('Gets an object by global ID', async () => {
    const query = '{ starship(starshipID: 5) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `
      { starship(id: "${result.data?.starship.id}") { id, name } }
    `;
    const nextResult = await swapi(nextQuery);
    expect(result.data?.starship.name).toBe('Sentinel-class landing craft');
    expect(nextResult.data?.starship.name).toBe('Sentinel-class landing craft');
    expect(result.data?.starship.id).toBe(nextResult.data?.starship.id);
  });

  it('Gets an object by global ID with node', async () => {
    const query = '{ starship(starshipID: 5) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `{
      node(id: "${result.data?.starship.id}") {
        ... on Starship {
          id
          name
        }
      }
    }`;
    const nextResult = await swapi(nextQuery);
    expect(result.data?.starship.name).toBe('Sentinel-class landing craft');
    expect(nextResult.data?.node.name).toBe('Sentinel-class landing craft');
    expect(result.data?.starship.id).toBe(nextResult.data?.node.id);
  });

  it('Gets all properties', async () => {
    const query = getDocument(
      `{
      starship(starshipID: 9) {
        ...AllStarshipProperties
      }
    }`,
    );
    const result = await swapi(query);
    const expected = {
      MGLT: 10,
      cargoCapacity: 1000000000000,
      consumables: '3 years',
      costInCredits: 1000000000000,
      crew: '342,953',
      filmConnection: { edges: [{ node: { title: 'A New Hope' } }] },
      hyperdriveRating: 4,
      length: 120000,
      manufacturers: [
        'Imperial Department of Military Research',
        'Sienar Fleet Systems',
      ],
      maxAtmospheringSpeed: null,
      model: 'DS-1 Orbital Battle Station',
      name: 'Death Star',
      passengers: '843,342',
      pilotConnection: { edges: [] },
      starshipClass: 'Deep Space Mobile Battlestation',
    };
    expect(result.data?.starship).toMatchObject(expected);
  });

  it('All objects query', async () => {
    const query = getDocument(
      '{ allStarships { edges { cursor, node { ...AllStarshipProperties } } } }',
    );
    const result = await swapi(query);
    expect(result.data?.allStarships.edges.length).toBe(36);
  });

  it('Pagination query', async () => {
    const query = `{
      allStarships(first: 2) { edges { cursor, node { name } } }
    }`;
    const result = await swapi(query);
    expect(
      result.data?.allStarships.edges.map((e: any) => e.node.name),
    ).toMatchObject(['CR90 corvette', 'Star Destroyer']);
    const nextCursor = result.data?.allStarships.edges[1].cursor;
    const nextQuery = `{ allStarships(first: 2, after:"${nextCursor}") {
      edges { cursor, node { name } } }
    }`;
    const nextResult = await swapi(nextQuery);
    expect(
      nextResult.data?.allStarships.edges.map((e: any) => e.node.name),

    ).toMatchObject(['Sentinel-class landing craft', 'Death Star']);
  });

  describe('Edge cases', () => {
    it('Returns real speed when set to not n/a', async () => {
      const query =
        '{ starship(starshipID: 5) { name, maxAtmospheringSpeed } }';
      const result = await swapi(query);
      expect(result.data?.starship.name).toBe('Sentinel-class landing craft');
      expect(result.data?.starship.maxAtmospheringSpeed).toBe(1000);
    });
  });
});
