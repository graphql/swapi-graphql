/**
 * 301 permanently redirect /swapi requests to /graphql
 */
export const handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
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
  let location = '/graphql';
  if (event.queryStringParameters) {
    location += '?' + new URLSearchParams(event.queryStringParameters);
  }
  return {
    statusCode: 301,
    headers: {
      Location: location,
    },
  };
};
