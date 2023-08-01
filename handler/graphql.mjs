/**
 * Copyright (c) 2020, GraphQL Contributors
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 *
 */

import { createHandler } from 'graphql-http/lib/use/@netlify/functions';
import schema from '../lib/schema';

// Create the GraphQL over HTTP native fetch handler
export const handler = createHandler({ schema: schema.default });
