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

describe('Vehicle type', async () => {
  it('Gets an object by SWAPI ID', async () => {
    var query = `{ vehicle(vehicleID: 4) { name } }`;
    var result = await swapi(query);
    expect(result.data.vehicle.name).to.equal('Sand Crawler');
  });

  it('Gets a different object by SWAPI ID', async () => {
    var query = `{ vehicle(vehicleID: 6) { name } }`;
    var result = await swapi(query);
    expect(result.data.vehicle.name).to.equal('T-16 skyhopper');
  });

  it('Gets an object by global ID', async () => {
    var query = `{ vehicle(vehicleID: 4) { id, name } }`;
    var result = await swapi(query);
    var nextQuery = `{ vehicle(id: "${result.data.vehicle.id}") { id, name } }`;
    var nextResult = await swapi(nextQuery);
    expect(result.data.vehicle.name).to.equal('Sand Crawler');
    expect(nextResult.data.vehicle.name).to.equal('Sand Crawler');
    expect(result.data.vehicle.id).to.equal(nextResult.data.vehicle.id);
  });

  it('Gets an object by global ID with node', async () => {
    var query = `{ vehicle(vehicleID: 4) { id, name } }`;
    var result = await swapi(query);
    var nextQuery = `{
      node(id: "${result.data.vehicle.id}") {
        ... on Vehicle {
          id
          name
        }
      }
    }`;
    var nextResult = await swapi(nextQuery);
    expect(result.data.vehicle.name).to.equal('Sand Crawler');
    expect(nextResult.data.node.name).to.equal('Sand Crawler');
    expect(result.data.vehicle.id).to.equal(nextResult.data.node.id);
  });

  it('Gets all properties', async () => {
    var query = `
{
  vehicle(vehicleID: 4) {
    name
    model
    vehicleClass
    manufacturers
    costInCredits
    length
    crew
    passengers
    maxAtmospheringSpeed
    cargoCapacity
    consumables
    filmConnection(first:1) { edges { node { title } } }
    pilotConnection(first:1) { edges { node { name } } }
  }
}`;
    var result = await swapi(query);
    var expected = {
      cargoCapacity: 50000,
      consumables: '2 months',
      costInCredits: 150000,
      crew: '46',
      length: 36.8,
      manufacturers: [ 'Corellia Mining Corporation' ],
      maxAtmospheringSpeed: 30,
      model: 'Digger Crawler',
      name: 'Sand Crawler',
      passengers: '30',
      pilotConnection: { edges: [] },
      filmConnection: { edges: [ { node: { title: 'A New Hope' } } ] },
      vehicleClass: 'wheeled'
    };
    expect(result.data.vehicle).to.deep.equal(expected);
  });

  it('All objects query', async() => {
    var query = `{ allVehicles { edges { cursor, node { name } } } }`;
    var result = await swapi(query);
    expect(result.data.allVehicles.edges.length).to.equal(39);
  });

  it('Pagination query', async() => {
    var query = `{
      allVehicles(first: 2) { edges { cursor, node { name } } }
    }`;
    var result = await swapi(query);
    expect(result.data.allVehicles.edges.map(e => e.node.name))
      .to.deep.equal([
        'Sand Crawler',
        'T-16 skyhopper',
      ]);
    var nextCursor = result.data.allVehicles.edges[1].cursor;

    var nextQuery = `{ allVehicles(first: 2, after:"${nextCursor}") {
      edges { cursor, node { name } } }
    }`;
    var nextResult = await swapi(nextQuery);
    expect(nextResult.data.allVehicles.edges.map(e => e.node.name))
      .to.deep.equal([
        'X-34 landspeeder',
        'TIE/LN starfighter',
      ]);
  });
});
