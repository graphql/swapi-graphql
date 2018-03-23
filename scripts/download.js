/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { URL } from 'url';
import { existsSync, writeFileSync } from 'fs';
import fetch from 'isomorphic-fetch';

/**
 * Fetches and parses JSON from a URL
 */
async function fetchFromUrl(url) {
  const fetched = await fetch(url);
  return fetched.json();
}

/**
 * Iterate through the resources, fetch from the URL, convert the results into
 * objects, then generate and print the cache.
 */
const resources = [
  'people',
  'starships',
  'vehicles',
  'species',
  'planets',
  'films',
];

const cache = {};
function addToCache(url, result) {
  const normalizeUrl = new URL(url).toString();
  cache[normalizeUrl] = result;
}

async function cacheResource(resourseName) {
  let url = `https://swapi.co/api/${resourseName}/`;
  do {
    console.error(url);
    const response = await fetchFromUrl(url);
    addToCache(url, response);
    for (const obj of response.results || []) {
      addToCache(obj.url, obj);
    }
    url = response.next;
  } while (url !== null);
}

const outfile = process.argv[2];
if (!outfile) {
  console.error('Missing ouput file!');
  process.exit(1);
}

if (!existsSync(outfile)) {
  console.log('Downloading cache...');

  Promise.all(resources.map(cacheResource))
    .then(() => {
      const data = JSON.stringify(cache, null, 2);
      writeFileSync(outfile, data, 'utf-8');
      console.log('Cached!');
    })
    .catch(function(err) {
      console.error(err);
      process.exit(1);
    });
}
