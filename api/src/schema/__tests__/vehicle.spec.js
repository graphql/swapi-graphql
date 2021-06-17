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
    fragment AllVehicleProperties on Vehicle {
      cargoCapacity
      consumables
      costInCredits
      crew
      length
      manufacturers
      maxAtmospheringSpeed
      model
      name
      passengers
      vehicleClass
      filmConnection(first:1) { edges { node { title } } }
      pilotConnection(first:1) { edges { node { name } } }
    }
  `;
}

describe('Vehicle type', () => {
  it('Gets an object by SWAPI ID', async () => {
    const query = '{ vehicle(vehicleID: 4) { name } }';
    const result = await swapi(query);
    expect(result.data.vehicle.name).toBe('Sand Crawler');
  });

  it('Gets a different object by SWAPI ID', async () => {
    const query = '{ vehicle(vehicleID: 6) { name } }';
    const result = await swapi(query);
    expect(result.data.vehicle.name).toBe('T-16 skyhopper');
  });

  it('Gets an object by global ID', async () => {
    const query = '{ vehicle(vehicleID: 4) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `
      { vehicle(id: "${result.data.vehicle.id}") { id, name } }
    `;
    const nextResult = await swapi(nextQuery);
    expect(result.data.vehicle.name).toBe('Sand Crawler');
    expect(nextResult.data.vehicle.name).toBe('Sand Crawler');
    expect(result.data.vehicle.id).toBe(nextResult.data.vehicle.id);
  });

  it('Gets an object by global ID with node', async () => {
    const query = '{ vehicle(vehicleID: 4) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `{
      node(id: "${result.data.vehicle.id}") {
        ... on Vehicle {
          id
          name
        }
      }
    }`;
    const nextResult = await swapi(nextQuery);
    expect(result.data.vehicle.name).toBe('Sand Crawler');
    expect(nextResult.data.node.name).toBe('Sand Crawler');
    expect(result.data.vehicle.id).toBe(nextResult.data.node.id);
  });

  it('Gets all properties', async () => {
    const query = getDocument(
      `{
      vehicle(vehicleID: 4) {
        ...AllVehicleProperties
      }
    }`,
    );
    const result = await swapi(query);
    const expected = {
      cargoCapacity: 50000,
      consumables: '2 months',
      costInCredits: 150000,
      crew: '46',
      length: 36.8,
      manufacturers: ['Corellia Mining Corporation'],
      maxAtmospheringSpeed: 30,
      model: 'Digger Crawler',
      name: 'Sand Crawler',
      passengers: '30',
      pilotConnection: { edges: [] },
      filmConnection: { edges: [{ node: { title: 'A New Hope' } }] },
      vehicleClass: 'wheeled',
    };
    expect(result.data.vehicle).toMatchObject(expected);
  });

  it('All objects query', async () => {
    const query = getDocument(
      '{ allVehicles { edges { cursor, node { ...AllVehicleProperties } } } }',
    );
    const result = await swapi(query);
    expect(result.data.allVehicles.edges.length).toBe(39);
  });

  it('Pagination query', async () => {
    const query = `{
      allVehicles(first: 2) { edges { cursor, node { name } } }
    }`;
    const result = await swapi(query);
    expect(result.data.allVehicles.edges.map(e => e.node.name)).toMatchObject([
      'Sand Crawler',
      'T-16 skyhopper',
    ]);
    const nextCursor = result.data.allVehicles.edges[1].cursor;

    const nextQuery = `{ allVehicles(first: 2, after:"${nextCursor}") {
      edges { cursor, node { name } } }
    }`;
    const nextResult = await swapi(nextQuery);
    expect(
      nextResult.data.allVehicles.edges.map(e => e.node.name),
    ).toMatchObject(['X-34 landspeeder', 'TIE/LN starfighter']);
  });
});
