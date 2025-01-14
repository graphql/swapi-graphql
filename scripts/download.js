/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import { URL } from 'url';
import { Agent } from 'https';
import { existsSync, writeFileSync } from 'fs';
import fetch from 'isomorphic-fetch';
import { swapiPath } from '../src/schema/constants';

const resources = [
  'people',
  'starships',
  'vehicles',
  'species',
  'planets',
  'films',
];

function replaceHttp(url) {
  let resultUrl = url;
  if (url.endsWith('/')) {
    resultUrl = url.slice(0, -1);
  }
  return (
    resultUrl
      .replaceAll(/http:\/\//g, 'https://')
      // normalize irregularities in the swapi.tech API
      .replaceAll('https://swapi.tech', 'https://www.swapi.tech')
  );
}

function normalizeUrl(url) {
  return replaceHttp(new URL(url).toString());
}

/**
 * Iterate through the resources, fetch from the URL, convert the results into
 * objects, then generate and print the cache.
 */
async function cacheResources() {
  const agent = new Agent({ keepAlive: true });
  const cache = {};

  for (const name of resources) {
    let url = `${swapiPath}/${name}`;

    while (url != null) {
      const response = await fetch(url, { agent });
      const text = await response.text();

      const data = JSON.parse(replaceHttp(text));

      cache[normalizeUrl(url)] = data;
      for (const obj of data.result || data.results || []) {
        const itemUrl = obj.url || obj.properties.url;
        cache[normalizeUrl(itemUrl)] = obj;
      }

      url = data.next ? data.next.replace('http:', 'https:') : null;
    }
  }

  return cache;
}

const outfile = process.argv[2];
if (!outfile) {
  console.error('Missing output file!');
  process.exit(1);
}

if (!existsSync(outfile)) {
  console.log('Downloading cache...');

  cacheResources()
    .then(cache => {
      const data = JSON.stringify(cache, null, 2);
      writeFileSync(outfile, data, 'utf-8');
      console.log('Cached!');
    })
    .catch(function (err) {
      console.error(err);
      process.exit(1);
    });
}
