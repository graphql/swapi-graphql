/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *

 */

import { DataResult } from '../types.js';
import { readFile } from 'fs/promises';


/**
 * Given a URL of an object in the SWAPI, return the data
 * from our local cache.
 */
export async function getFromLocalUrl(
  url: string,
) {
  // @ts-ignore
  const swapiData = (await import('../../cache/data.json')).default
  // @ts-expect-error hey
  const text = swapiData[url] as DataResult;
  if (!text) {
    throw new Error(`No entry in local cache for ${url}`);
  }
  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.log(`Hit the local cache for ${url}.`);
  }
  return text as DataResult;
}
