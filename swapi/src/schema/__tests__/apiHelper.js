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
    var luke = await getObjectFromUrl('http://swapi.co/api/people/1/');
    expect(luke.name).to.equal('Luke Skywalker');
    var threePO = await getObjectFromUrl('http://swapi.co/api/people/2/');
    expect(threePO.name).to.equal('C-3PO');
  });

  it('Gets all pages at once', async () => {
    var people = await getObjectsByType('people');
    expect(people.length).to.equal(82);
    expect(people[0].name).to.equal('Luke Skywalker');
  });

  it('Gets a person by ID', async () => {
    var luke = await getObjectFromTypeAndId('people', 1);
    expect(luke.name).to.equal('Luke Skywalker');
    var threePO = await getObjectFromTypeAndId('people', 2);
    expect(threePO.name).to.equal('C-3PO');
  });
});

