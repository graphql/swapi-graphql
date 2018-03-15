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
    fragment AllStarshipProperties on Starship {
      MGLT
      starshipCargoCapacity: cargoCapacity
      consumables
      starshipCostInCredits: costInCredits
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
    
    fragment AllVehicleProperties on Vehicle {
      vehicleCargoCapacity: cargoCapacity
      consumables
      vehicleCostInCredits: costInCredits
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

describe('Machine type', async () => {

  it('Gets an object by global ID', async () => {
    const query = '{ starship(starshipID: 5) { id, name } }';
    const result = await swapi(query);
    const nextQuery = `
      { machine(id: "${result.data.starship.id}") { ... on Vehicle { id, name }, ... on Starship { id, name } } }
    `;
    const nextResult = await swapi(nextQuery);
    expect(result.data.starship.name).to.equal('Sentinel-class landing craft');
    expect(nextResult.data.machine.name).to.equal(
      'Sentinel-class landing craft',
    );
    expect(result.data.starship.id).to.equal(nextResult.data.machine.id);
  });

  it('Gets all properties', async () => {

    const query = '{ starship(starshipID: 5) { id, name } }';
    const idResult = await swapi(query);

    const nextQuery = getDocument(
      `{
      machine(id: "${idResult.data.starship.id}") {
        ... on Starship {
          ...AllStarshipProperties
        }
        ... on Vehicle {
          ...AllVehicleProperties
        }
      }
    }`,
    );
    const result = await swapi(nextQuery);
    const expected = {
      MGLT: 70,
      starshipCargoCapacity: 180000,
      consumables: '1 month',
      starshipCostInCredits: 240000,
      crew: '5',
      filmConnection: { edges: [{ node: { title: 'A New Hope' } }] },
      hyperdriveRating: 1,
      length: 38,
      manufacturers: [
        'Sienar Fleet Systems',
        'Cyngus Spaceworks'
      ],
      maxAtmospheringSpeed: 1000,
      model: 'Sentinel-class landing craft',
      name: 'Sentinel-class landing craft',
      passengers: '75',
      pilotConnection: { edges: [] },
      starshipClass: 'landing craft',
    };
    expect(result.data.machine).to.deep.equal(expected);
  });

  it('All objects query', async () => {
    const query = getDocument(
      '{ allMachines { edges { cursor, node { ... on Starship { ...AllStarshipProperties }, ... on Vehicle { ...AllVehicleProperties } } } } }',
    );
    const result = await swapi(query);
    expect(result.data.allMachines.edges.length).to.equal(76);
  });

  it('Pagination query', async () => {
    const query = `{
      allMachines(first: 2) { edges { cursor, node { ... on Vehicle { name }, ... on Starship { name } } } }
    }`;
    const result = await swapi(query);
    expect(result.data.allMachines.edges.map(e => e.node.name)).to.deep.equal([
      'Sand Crawler',
      'T-16 skyhopper',
    ]);
    const nextCursor = result.data.allMachines.edges[1].cursor;

    const nextQuery = `{ allMachines(first: 2, after:"${nextCursor}") {
      edges { cursor, node { ... on Vehicle { name }, ... on Starship { name } } } }
    }`;
    const nextResult = await swapi(nextQuery);
    expect(
      nextResult.data.allMachines.edges.map(e => e.node.name),
    ).to.deep.equal(['X-34 landspeeder', 'TIE/LN starfighter']);
  });
});
