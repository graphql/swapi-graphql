/* @flow */
/**
 *  Copyright (c) 2015, Facebook Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import DataLoader from 'dataloader';

import { getFromLocalUrl } from '../api';

const localUrlLoader = new DataLoader(urls =>
  Promise.all(urls.map(getFromLocalUrl)),
);

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
  const dataString = await localUrlLoader.load(url);
  const data = JSON.parse(dataString);
  return objectWithId(data);
}

/**
 * Given a type and ID, get the object with the ID.
 */
export async function getObjectFromTypeAndId(
  type: string,
  id: string,
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

type ObjectsByType = {
  objects: Array<Object>,
  totalCount: number,
};

/**
 * Given a type, fetch all of the pages, and join the objects together
 */
export async function getObjectsByType(
  type: string,
  args?: ?Object,
): Promise<ObjectsByType> {
  let objects = [];
  let totalCount = 0;
  let nextUrl = `http://swapi.co/api/${type}/`;
  while (nextUrl && !doneFetching(objects, args)) {
    /* eslint-disable no-await-in-loop */
    const pageData = await localUrlLoader.load(nextUrl);
    /* eslint-enable no-await-in-loop */
    const parsedPageData = JSON.parse(pageData);
    totalCount = parsedPageData.count;
    objects = objects.concat(parsedPageData.results.map(objectWithId));
    nextUrl = parsedPageData.next;
  }
  return { objects, totalCount };
}

/**
 * Given a string, convert it to a number
 */
export function convertToNumber(value: string): ?number {
  if (['unknown', 'n/a'].indexOf(value) !== -1) {
    return null;
  }
  // remove digit grouping
  const numberString = value.replace(/,/, '');
  return Number(numberString);
}
