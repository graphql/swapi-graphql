SWAPI GraphQL Wrapper
=====================

A wrapper around [SWAPI](http://swapi.co) built using GraphQL.

Uses:

* [graphql-js](https://github.com/graphql/graphql-js) - a JavaScript GraphQL runtime.
* [DataLoader](https://github.com/facebook/dataloader) - for coalescing and caching fetches.
* [express-graphql](https://github.com/graphql/express-graphql) - to provide HTTP access to GraphQL.
* [GraphiQL](https://github.com/graphql/graphiql) - for easy exploration of this GraphQL server.

Try it out at http://graphql-swapi.parseapp.com/.

## Getting Started

Install dependencies with

```sh
npm install
```

## SWAPI Wrapper

The SWAPI wrapper is in `./swapi`. It can be tested with:

```sh
npm test
```

## Local Server

A local express server is in `./server`. It can be run with:

```sh
npm start
```

A GraphiQL instance will be opened at http://localhost:8080/ to
explore the API.

## Parse Server

A parse server is in `./parse`. After adding a `parse/src/config/global.json`
file, it can be deployed with:

```sh
npm run deploy
```

A sample deploy is at http://graphql-swapi.parseapp.com/
