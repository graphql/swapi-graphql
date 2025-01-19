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

const graphqlHandler = createHandler({ schema: schema.default })

// Create the GraphQL over HTTP native fetch handler
export const handler = async (req, ctx) => {
    if (req.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Max-Age': '86400',
            }
          };
    }
    const result = await graphqlHandler(req, ctx)
    return {
        ...result,
        headers: {
            ...result.headers,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '86400',
        }
    }
};
