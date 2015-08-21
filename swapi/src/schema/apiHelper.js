/* @flow */
/**
 *  Copyright (c) 2015, Facebook Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import {
  getFromLocalUrl
} from '../api';

/**
 * A method to get data from the URL provided, memoizing the result.
 */
var memo = {};
async function memoizeFromUrl(url: string): Promise<string> {
  if (memo[url]) {
    return memo[url];
  }
  memo[url] = await getFromLocalUrl(url);
  return memo[url];
}

/**
 * Objects returned from SWAPI don't have an ID field, so add one.
 */
function objectWithId(obj: Object): Object {
  obj.id = obj.url.split('/')[5];
  return obj;
}

/**
 * Given an object URL, fetch it, append the ID to it, and return it.
 */
export async function getObjectFromUrl(url: string): Promise<Object> {
  var dataString = await memoizeFromUrl(url);
  var data = JSON.parse(dataString);
  return objectWithId(data);
}

/**
 * Given a type and ID, get the object with the ID.
 */
export async function getObjectFromTypeAndId(
  type: string,
  id: string
): Promise<Object> {
  return await getObjectFromUrl(`http://swapi.co/api/${type}/${id}/`);
}

/**
 * Quick helper method, if the user just passes `first`, we can stop
 * fetching once we have that many items.
 */
function doneFetching(objects: Array<Object>, args?: ?Object): boolean {
  if (!args || args.after || args.before || args.last || !args.first) {
    return false;
  }
  return objects.length >= args.first;
}

/**
 * Given a type, fetch all of the pages, and join the objects together
 */
export async function getObjectsByType(
  type: string,
  args?: ?Object
): Promise<Array<Object>> {
  var objects = [];
  var nextUrl = `http://swapi.co/api/${type}/`;
  while (nextUrl && !doneFetching(objects, args)) {
    var pageData = await memoizeFromUrl(nextUrl);
    var parsedPageData = JSON.parse(pageData);
    objects = objects.concat(parsedPageData.results.map(objectWithId));
    nextUrl = parsedPageData.next;
  }
  return objects;
}
