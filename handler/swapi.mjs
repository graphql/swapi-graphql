/**
 * 301 permanently redirect /swapi requests to /graphql
 */
export const handler = async function(event) {
  if (req.httpMethod === 'OPTIONS') {
    return { statusCode: 200 };
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
