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
  'films',
  'planets',
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
    console.log(`Caching resource: "${name}"`);
    let url = `${swapiPath}/${name}`;

    while (url != null) {
      try {
        const response = await fetch(url, { agent });
        const text = await response.text();

        let data = {};
        try {
          data = JSON.parse(replaceHttp(text));
        } catch (e) {
          console.error(`Error parsing JSON from ${url}:`, e);
          break;
        }

        const properResults = await Promise.allSettled(
          (data.result || data.results || []).map(async obj => {
            const itemUrl = obj.url || obj.properties.url;
            try {
              const response = await fetch(itemUrl, { agent });
              const itemText = await response.text();

              let itemData = {};
              try {
                itemData = JSON.parse(replaceHttp(itemText));
              } catch (e) {
                console.error(`Error parsing JSON from ${itemUrl}:`, e);
              }

              const fullObjectData = {
                ...obj,
                ...((itemData.result || itemData.results || {}).properties ||
                  {}),
              };

              cache[normalizeUrl(itemUrl)] = fullObjectData;

              return fullObjectData;
            } catch (e) {
              console.error(`Error fetching item from ${itemUrl}:`, e);
              return obj; // Return the original object if fetching fails
            }
          }),
        );

        data.results = properResults.map(r => r.value || {});
        cache[normalizeUrl(url)] = data;

        url = data.next ? data.next.replace('http:', 'https:') : null;
      } catch (e) {
        console.error(`Error fetching resource from ${url}:`, e);
        break;
      }
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
    .catch(function(err) {
      console.error(err);
      process.exit(1);
    });
}
