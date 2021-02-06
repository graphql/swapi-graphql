/**
 * Copyright (c) 2015-present, Facebook Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 * @flow strict
 */

import DataLoader from 'dataloader';

import { getFromLocalUrl } from '../api';

type ObjectWithId = Record<string, any> & { id: number };
const localUrlLoader = new DataLoader<string, Record<string, any>>(urls =>
  Promise.all(urls.map((url) => getFromLocalUrl(url))),
);

/**
 * Objects returned from SWAPI don't have an ID field, so add one.
 */
function objectWithId(obj: Record<string, any>): ObjectWithId {
  const id = parseInt(obj.url.split('/')[5], 10);
  return { ...obj, id };
}

/**
 * Given an object URL, fetch it, append the ID to it, and return it.
 */
export async function getObjectFromUrl(url: string): Promise<ObjectWithId> {
  const data = await localUrlLoader.load(url);
  return objectWithId(data);
}

/**
 * Given a type and ID, get the object with the ID.
 */
export async function getObjectFromTypeAndId(
  type: string,
  id: number,
): Promise<ObjectWithId> {
  return await getObjectFromUrl(`https://swapi.dev/api/${type}/${id}/`);
}

type ObjectsByType = {
  objects: Array<ObjectWithId>,
  totalCount: number,
};

/**
 * Given a type, fetch all of the pages, and join the objects together
 */
export async function getObjectsByType(type: string): Promise<ObjectsByType> {
  let objects = [] as ObjectWithId[];
  let nextUrl = `https://swapi.dev/api/${type}/`;
  while (nextUrl) {
    // eslint-disable-next-line no-await-in-loop
    const pageData = await localUrlLoader.load(nextUrl);
    objects = objects.concat(pageData.results.map(objectWithId));
    nextUrl = pageData.next;
  }
  objects = sortObjectsById(objects);
  return { objects, totalCount: objects.length };
}

export async function getObjectsFromUrls(urls: string[]): Promise<ObjectWithId[]> {
  const array = await Promise.all(urls.map(getObjectFromUrl));
  return sortObjectsById(array);
}

function sortObjectsById(array: { id: number }[]): ObjectWithId[] {
  return array.sort((a, b) => a.id - b.id);
}

/**
 * Given a string, convert it to a number
 */
export function convertToNumber(value: string): number | null {
  if (['unknown', 'n/a'].indexOf(value) !== -1) {
    return null;
  }
  // remove digit grouping
  const numberString = value.replace(/,/, '');
  return Number(numberString);
}
