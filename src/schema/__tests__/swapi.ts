/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */
import { execute, parse } from 'graphql';
import swapiSchema from '../index';

export async function swapi(query: string, throwErrors: boolean = true) {
  const result = await execute({
    schema: swapiSchema,
    document: parse(query),
  });
  if (result.errors !== undefined && throwErrors) {
    throw new Error(JSON.stringify(result.errors, null, 2));
  }
  return result!;
}
