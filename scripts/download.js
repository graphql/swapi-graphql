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

const resources = [
  'people',
  'starships',
  'vehicles',
  'species',
  'planets',
  'films',
];

function replaceHttp(url) {
  return url.replace(/"http:\/\//i, 'https://');
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
    let url = `https://swapi.dev/api/${name}/`;

    while (url != null) {
      const response = await fetch(replaceHttp(url), { agent });
      const data = await response.text();

      const result = replaceHttp(data);

      console.log(result.match('https:'));

      cache[normalizeUrl(url)] = JSON.parse(data);
      for (const obj of data.results || []) {
        cache[normalizeUrl(obj.url)] = { ...obj, url: replaceHttp(obj.url) };
      }

      url = data.next ? replaceHttp(data.next) : null;
    }
  }

  return cache;
}

const outfile = process.argv[2];
if (!outfile) {
  console.error('Missing ouput file!');
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
    .catch(function(err) {
      console.error(err);
      process.exit(1);
    });
}
