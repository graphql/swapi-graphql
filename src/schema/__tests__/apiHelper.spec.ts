/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import {
  getObjectFromUrl,
  getObjectsByType,
  getObjectFromTypeAndId,
} from '../apiHelper';

describe('API Helper', () => {
  it('Gets a person', async () => {
    const luke = await getObjectFromUrl('https://swapi.dev/api/people/1/');
    expect(luke.name).toBe('Luke Skywalker');
    const threePO = await getObjectFromUrl('https://swapi.dev/api/people/2/');
    expect(threePO.name).toBe('C-3PO');
  });

  it('Gets all pages at once', async () => {
    const { objects, totalCount } = await getObjectsByType('people');
    expect(objects.length).toBe(82);
    expect(totalCount).toBe(82);
    expect(objects[0].name).toBe('Luke Skywalker');
  });

  it('Gets a person by ID', async () => {
    const luke = await getObjectFromTypeAndId('people', 1);
    expect(luke.name).toBe('Luke Skywalker');
    const threePO = await getObjectFromTypeAndId('people', 2);
    expect(threePO.name).toBe('C-3PO');
  });
});
