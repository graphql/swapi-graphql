/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

/*global Parse:false*/

/**
 * Given a URL of an object in the SWAPI, return the data
 * from the server.
 *
 * This switches what abstraction it uses to fetch between isomorphic-fetch
 * and the Parse HTTP library so it can be used either locally or in cloud code.
 */
export async function getFromRemoteUrl(url) {
  try {
    var text = null;
    if (Parse.Cloud.httpRequest !== undefined) {
      text = await getTextFromParse(url);
    } else {
      text = await getTextFromFetch(url);
    }
    console.log(`Hit the SWAPI for ${url}.`);
    return text;
  } catch (err) {
    console.error(`Error: Hit the SWAPI for ${url} and got ${err}`);
    throw err;
  }
}

async function getTextFromParse(url) {
  var response = await Parse.Cloud.httpRequest({url});
  return response.text;
}

async function getTextFromFetch(url) {
  var fetch = require('isomorphic-fetch');
  var response = await fetch(url);
  var text = await response.text();
  return text;
}
