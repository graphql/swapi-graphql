/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
  getObjectFromUrl,
  getObjectsByType,
  getObjectFromTypeAndId,
} from '../apiHelper';

describe('API Helper', () => {
  it('Gets a person', async () => {
    const luke = await getObjectFromUrl('http://swapi.co/api/people/1/');
    expect(luke.name).to.equal('Luke Skywalker');
    const threePO = await getObjectFromUrl('http://swapi.co/api/people/2/');
    expect(threePO.name).to.equal('C-3PO');
  });

  it('Gets all pages at once', async () => {
    const { objects, totalCount } = await getObjectsByType('people');
    expect(objects.length).to.equal(82);
    expect(totalCount).to.equal(82);
    expect(objects[0].name).to.equal('Luke Skywalker');
  });

  it('Gets first page and correct count', async () => {
    const { objects, totalCount } = await getObjectsByType('people', {
      first: 5,
    });
    // Should only fetch the first page which has 10 items
    expect(objects.length).to.equal(10);
    // Count should still be accurate, though
    expect(totalCount).to.equal(82);
    expect(objects[0].name).to.equal('Luke Skywalker');
  });

  it('Gets a person by ID', async () => {
    const luke = await getObjectFromTypeAndId('people', 1);
    expect(luke.name).to.equal('Luke Skywalker');
    const threePO = await getObjectFromTypeAndId('people', 2);
    expect(threePO.name).to.equal('C-3PO');
  });
});
