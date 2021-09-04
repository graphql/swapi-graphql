/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 * @flow strict
 */

import swapiData from '../../cache/data.json';

/**
 * Given a URL of an object in the SWAPI, return the data
 * from our local cache.
 */
// casting json file to a Record with Index. 
const typedSwapiData = swapiData as typeof swapiData & { [key: string]: any }
export async function getFromLocalUrl(
  url: unknown,
): Promise<Record<string, any>> {

  if (!(typeof url === 'string')) {
    throw new Error('Url provided is not a string');
  }

  const text = typedSwapiData[url];
  if (!text) {
    throw new Error(`No entry in local cache for ${url}`);
  }
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log(`Hit the local cache for ${url}.`);
  }
  return text;
}
