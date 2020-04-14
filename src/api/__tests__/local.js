/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import { getFromLocalUrl } from '../local';

describe('Local API Wrapper', () => {
  it('Gets a person', async () => {
    const luke = await getFromLocalUrl('https://swapi.dev/api/people/1/');
    expect(luke.name).to.equal('Luke Skywalker');
    const threePO = await getFromLocalUrl('https://swapi.dev/api/people/2/');
    expect(threePO.name).to.equal('C-3PO');
  });

  it('Gets pages', async () => {
    const firstPeople = await getFromLocalUrl('https://swapi.dev/api/people/');
    expect(firstPeople.results.length).to.equal(10);
    expect(firstPeople.results[0].name).to.equal('Luke Skywalker');
    const secondPeople = await getFromLocalUrl(
      'https://swapi.dev/api/people/?page=2',
    );
    expect(secondPeople.results.length).to.equal(10);
    expect(secondPeople.results[0].name).to.equal('Anakin Skywalker');
  });

  it('Gets first page by default', async () => {
    const people = await getFromLocalUrl('https://swapi.dev/api/people/');
    expect(people.results.length).to.equal(10);
    expect(people.results[0].name).to.equal('Luke Skywalker');
  });
});
