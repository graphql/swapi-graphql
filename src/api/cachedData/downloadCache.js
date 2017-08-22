/* eslint-disable no-sync */

global.Promise = require('babel-runtime/core-js/promise').default;

const fetch = require('isomorphic-fetch');

/**
 * The API prefix
 */
const prefix = 'http://swapi.co/api/';

/**
 * A map from field names to the SWAPI type we should map the IDs to.
 */
const fieldTypes = {
  pilots: { type: 'people' },
  starships: { type: 'starship' },
  vehicles: { type: 'vehicle' },
  planets: { type: 'planet' },
  characters: { type: 'people' },
  species: { type: 'species' },
  people: { type: 'people' },
  homeworld: { type: 'planet', name: 'residents' },
  films: { type: 'film' },
  residents: { type: 'people' },
};

/**
 * A map from the resource type to the "type" in the URL.
 */
const urlTypes = {
  people: 'people',
  starship: 'starships',
  vehicle: 'vehicles',
  species: 'species',
  planet: 'planets',
  film: 'films',
};

/**
 * Get the object URL for a given ID and type
 */
function objectUrl(id, type) {
  return prefix + urlTypes[type] + '/' + id + '/';
}

/**
 * Get the page URL for a given type, page number, and set of objects.
 */
function pageUrl(type, objects, num) {
  if (num !== null && isInvalidPage(objects, num)) {
    return null;
  }
  let url = prefix + urlTypes[type] + '/';
  if (num !== null) {
    url += '?page=' + num;
  }
  return url;
}

/**
 * Determines if a given page exists for a set of objects
 */
function isInvalidPage(objects, num) {
  return num <= 0 || (num - 1) * 10 >= Object.keys(objects).length;
}

/**
 * Given the fields from the raw JSON, construct the REST API response.
 * Notably, things that are references in the raw JSON become URLs.
 */
function formatObject(object, type, id) {
  const formatted = {};
  const keys = Object.keys(object);
  keys.forEach(function(key) {
    if (fieldTypes[key]) {
      if (Array.isArray(object[key])) {
        formatted[key] = object[key].map(function(val) {
          return objectUrl(val, fieldTypes[key].type);
        });
      } else {
        formatted[key] = object[key]
          ? objectUrl(object[key], fieldTypes[key].type)
          : null;
      }
    } else {
      formatted[key] = object[key];
    }
  });
  formatted.url = objectUrl(id, type);
  return formatted;
}

/**
 * Given a type, a set of objects, and a page number, return the REST
 * API response for that page.
 */
function makePage(type, objects, num) {
  return {
    count: Object.keys(objects).length,
    previous: pageUrl(type, objects, num - 1),
    next: pageUrl(type, objects, num + 1),
    results: Object.keys(objects)
      .slice((num - 1) * 10, num * 10)
      .map(function(objectId) {
        return formatObject(objects[objectId], type, objectId);
      }),
  };
}

/**
 * Given a type and list of objects, add both the object URLs and the page URLs
 * to the cache.
 */
function addTypeToCache(cache, type, objects) {
  Object.keys(objects).forEach(function(objectId) {
    cache[objectUrl(objectId, type)] = JSON.stringify(
      formatObject(objects[objectId], type, objectId),
    );
  });
  for (let i = 1; !isInvalidPage(objects, i); i++) {
    const page = makePage(type, objects, i);
    cache[pageUrl(type, objects, i)] = JSON.stringify(page);
    if (i === 1) {
      cache[pageUrl(type, objects, null)] = JSON.stringify(page);
    }
  }
  return cache;
}

/**
 * Given the objects, construct the cache from URL to REST response.
 */
function getCacheFromObjects(objects) {
  const cache = {};
  Object.keys(objects).forEach(function(type) {
    addTypeToCache(cache, type, objects[type]);
  });
  return cache;
}

/**
 * Given the data so far, augment the data with the info in the fixture if it
 * is a not a transport.
 */
function addObjects(data, fixture) {
  if (fixture.model === 'resources.transport') {
    return data;
  }
  const type = fixture.model.substr(10);
  if (!data[type]) {
    data[type] = {};
  }
  data[type][fixture.pk] = fixture.fields;
  return data;
}

/**
 * A quick utility to merge all properties of add into base.
 */
function append(base, add) {
  Object.keys(add).forEach(function(key) {
    base[key] = add[key];
  });
}

/**
 * Given the data for the six real types, augment the data
 * with the info in the fixture if it is a transport.
 */
function augmentWithTransport(data, fixture) {
  if (fixture.model !== 'resources.transport') {
    return data;
  }
  const appendObject = fixture.fields;
  if (data['starship'][fixture.pk]) {
    append(data['starship'][fixture.pk], appendObject);
  }
  if (data['vehicle'][fixture.pk]) {
    append(data['vehicle'][fixture.pk], appendObject);
  }
  return data;
}

/**
 * Given a list of the parsed fixtures, get the REST objects
 * responses by type and ID.
 */
function getObjectsFromFixtures(fixtures) {
  const objectsByType = fixtures.reduce(addObjects, {});
  return fixtures.reduce(augmentWithTransport, objectsByType);
}

/**
 * Adds `objectId` to the `field` array on the `target` object.
 */
function addIdToField(target, objectId, field) {
  const id = parseInt(objectId, 10);
  if (target) {
    if (!target[field]) {
      target[field] = [];
    }
    if (target[field].indexOf(id) === -1) {
      target[field].push(id);
    }
  }
}

function addReverseData(objects, type, objectId, object) {
  const keys = Object.keys(object);
  keys.forEach(function(key) {
    if (fieldTypes[key]) {
      const foreignType = fieldTypes[key].type;
      const foreignFieldName = fieldTypes[key].name || urlTypes[type];
      if (Array.isArray(object[key])) {
        object[key].forEach(function(foreignId) {
          addIdToField(
            objects[foreignType][foreignId],
            objectId,
            foreignFieldName,
          );
        });
      } else {
        const foreignId = object[key];
        if (foreignId) {
          addIdToField(
            objects[foreignType][foreignId],
            objectId,
            foreignFieldName,
          );
        }
      }
    }
  });
}

/**
 * Ine fixtures only contain one directional edges in some cases; populate the
 * reverse edges.
 */
function populateReverseMaps(objects) {
  Object.keys(objects).forEach(function(type) {
    Object.keys(objects[type]).forEach(function(objectId) {
      const object = objects[type][objectId];
      addReverseData(objects, type, objectId, object);
    });
  });
}

/**
 * The URL on github for the JSON fixture of this type.
 */
function githubUrlForType(type) {
  return (
    'https://raw.githubusercontent.com/phalt/swapi/master/' +
    'resources/fixtures/' +
    type +
    '.json'
  );
}

/**
 * Fetches and parses JSON from a URL
 */
function fetchFromUrl(url) {
  return fetch(url)
    .then(function(fetched) {
      return fetched.text();
    })
    .then(function(text) {
      return JSON.parse(text);
    });
}

/**
 * Iterate through the types, fetch from the URL, convert the results into
 * objects, then generate and print the cache.
 */
const types = [
  'people',
  'films',
  'starships',
  'vehicles',
  'species',
  'planets',
  'transport',
];

/* eslint-disable no-console */
Promise.all(types.map(githubUrlForType).map(fetchFromUrl))
  .then(function(fixturesList) {
    const fixtures = [].concat.apply([], fixturesList);
    const objects = getObjectsFromFixtures(fixtures);
    populateReverseMaps(objects);
    const cache = getCacheFromObjects(objects);
    console.log(
      '/*eslint-disable */\n' +
        '/* Generated by combine.js */\n' +
        '// prettier-ignore\n' +
        'var data = ' +
        JSON.stringify(cache, null, 2) +
        ';\n' +
        'export default data;',
    );
  })
  .catch(function(err) {
    console.error(err);
  });
/* eslint-enable no-console */
