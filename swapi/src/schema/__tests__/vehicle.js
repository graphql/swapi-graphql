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
    films(first:1) { edges { node { title } } }
    pilots(first:1) { edges { node { name } } }
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
      pilots: { edges: [] },
      films: { edges: [ { node: { title: 'A New Hope' } } ] },
      vehicleClass: 'wheeled'
    };
    expect(result.data.vehicle).to.deep.equal(expected);
  });

  it('All objects query', async() => {
    var query = `{ allVehicles { name } }`;
    var result = await swapi(query);
    expect(result.data.allVehicles.length).to.equal(39);
  });

  it('Pagination query', async() => {
    var query = `{ allVehicles(first: 2) { name } }`;
    var result = await swapi(query);
    expect(result.data.allVehicles.map(e => e.name)).to.deep.equal([
      'Sand Crawler',
      'T-16 skyhopper',
    ]);
  });
});
