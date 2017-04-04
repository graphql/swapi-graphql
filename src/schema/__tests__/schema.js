/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { expect } from 'chai';
import { describe, it } from 'mocha';
import swapiSchema from '../';
import { graphql } from 'graphql';

// 80+ char lines are useful in describe/it, so ignore in this file.
// Some chai expects appear as unused expressions
/* eslint-disable max-len, no-unused-expressions */

describe('Schema', () => {
  it('Gets an error when ID is omitted', async () => {
    const query = '{ species { name } }';
    const result = await graphql(swapiSchema, query);
    expect(result.errors.length).to.equal(1);
    expect(result.errors[0].message).to.equal('must provide id or speciesID');
    expect(result.data).to.deep.equal({ species: null });
  });

  it('Gets an error when global ID is invalid', async () => {
    const query = '{ species(id: "notanid") { name } }';
    const result = await graphql(swapiSchema, query);
    expect(result.errors.length).to.equal(1);
    expect(result.errors[0].message).to.contain('No entry in local cache for');
    expect(result.data).to.deep.equal({ species: null });
  });
});
