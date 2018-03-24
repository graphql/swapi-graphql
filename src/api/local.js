/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 * @flow strict
 */

import swapiData from '../../cache/data';

/**
 * Given a URL of an object in the SWAPI, return the data
 * from our local cache.
 */
export async function getFromLocalUrl(
  url: string,
): Promise<{ [key: string]: any }> {
  const text = swapiData[url];
  if (!text) {
    throw new Error(`No entry in local cache for ${url}`);
  }
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log(`Hit the local cache for ${url}.`);
  }
  return text;
}
