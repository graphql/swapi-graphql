/**
 * 301 permanently redirect /index requests to /graphql
 */
export const handler = async function(event) {
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
