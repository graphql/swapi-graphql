/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import swapiData from './cachedData/cache';

/**
 * Given a URL of an object in the SWAPI, return the data
 * from our local cache.
 */
export async function getFromLocalUrl(url: string): Promise<string> {
  const text = swapiData[url];
  if (!text) {
    throw new Error(`No entry in local cache for ${url}`);
  }
  if (process.env.NODE_ENV !== 'test') {
    /* eslint-disable no-console */
    console.log(`Hit the local cache for ${url}.`);
    /* eslint-enable no-console */
  }
  return text;
}
