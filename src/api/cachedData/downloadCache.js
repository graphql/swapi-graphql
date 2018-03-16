/* eslint-disable no-sync */

import { URL } from 'url';
import fetch from 'isomorphic-fetch';

/**
 * Fetches and parses JSON from a URL
 */
async function fetchFromUrl(url) {
  const fetched = await fetch(url);
  const json = await fetched.text();
  return JSON.parse(json);
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

/* eslint-disable no-console */
async function cacheResource(resourseName) {
  let url = `https://swapi.co/api/${resourseName}/`;
  do {
    console.error(url);
    // eslint-disable-next-line no-await-in-loop
    const response = await fetchFromUrl(url);
    addToCache(url, response);
    for (const obj of response.results || []) {
      addToCache(obj.url, obj);
    }
    url = response.next;
  } while (url !== null);
}

Promise.all(resources.map(cacheResource))
  .then(() => {
    console.log(JSON.stringify(cache, null, 2));
  })
  .catch(function(err) {
    console.error(err);
  });
/* eslint-enable no-console */
