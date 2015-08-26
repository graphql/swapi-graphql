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

describe('Film type', async () => {
  it('Gets an object by SWAPI ID', async () => {
    var query = `{ film(filmID: 1) { title } }`;
    var result = await swapi(query);
    expect(result.data.film.title).to.equal('A New Hope');
  });

  it('Gets a different object by SWAPI ID', async () => {
    var query = `{ film(filmID: 2) { title } }`;
    var result = await swapi(query);
    expect(result.data.film.title).to.equal('The Empire Strikes Back');
  });

  it('Gets all properties', async () => {
    var query = `
{
  film(filmID: 1) {
    title
    episodeID
    openingCrawl
    director
    producers
    releaseDate
    species(first:1) { edges { node { name } } }
    starships(first:1) { edges { node { name } } }
    vehicles(first:1) { edges { node { name } } }
    characters(first:1) { edges { node { name } } }
    planets(first:1) { edges { node { name } } }
  }
}`;
    var result = await swapi(query);
    var expected = {
      title: 'A New Hope',
      episodeID: 4,
      openingCrawl: `It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....`,
      director: 'George Lucas',
      producers: [ 'Gary Kurtz', 'Rick McCallum' ],
      releaseDate: '1977-05-25',
      species: { edges: [ { node: { name: 'Human' } } ] },
      starships: { edges: [ { node: { name: 'CR90 corvette' } } ] },
      vehicles: { edges: [ { node: { name: 'Sand Crawler' } } ] },
      characters: { edges: [ { node: { name: 'Luke Skywalker' } } ] },
      planets: { edges: [ { node: { name: 'Tatooine' } } ] }
    };
    expect(result.data.film).to.deep.equal(expected);
  });

  it('All objects query', async() => {
    var query = `{ allFilms {  title } }`;
    var result = await swapi(query);
    expect(result.data.allFilms.length).to.equal(6);
  });

  it('first query', async() => {
    var query = `{ allFilms(first: 2) { title } }`;
    var result = await swapi(query);
    expect(result.data.allFilms.map(e => e.title)).to.deep.equal([
      'A New Hope',
      'The Empire Strikes Back'
    ]);
  });

  it('skip query', async() => {
    var query = `{ allFilms(skip: 3) { title } }`;
    var result = await swapi(query);
    expect(result.data.allFilms.map(e => e.title)).to.deep.equal([
      'The Phantom Menace',
      'Attack of the Clones',
      'Revenge of the Sith'
    ]);
  });

  it('first/skip query', async() => {
    var query = `{ allFilms(skip: 3, first: 1) { title } }`;
    var result = await swapi(query);
    expect(result.data.allFilms.map(e => e.title)).to.deep.equal([
      'The Phantom Menace'
    ]);
    var queryTwo = `{ allFilms(skip: 4, first: 2) { title } }`;
    var resultTwo = await swapi(queryTwo);
    expect(resultTwo.data.allFilms.map(e => e.title)).to.deep.equal([
      'Attack of the Clones',
      'Revenge of the Sith'
    ]);
  });


    // TODO implement with skip
    // var nextCursor = result.data.allFilms.edges[1].cursor;

    // var nextQuery = `{ allFilms(first: 2, after:"${nextCursor}") {
    //   edges { cursor, node { title } } }
    // }`;
    // var nextResult = await swapi(nextQuery);
    // expect(nextResult.data.allFilms.edges.map(e => e.node.title)).to.deep.equal(
    // [
    //   'Return of the Jedi',
    //   'The Phantom Menace',
    // ]);
});
