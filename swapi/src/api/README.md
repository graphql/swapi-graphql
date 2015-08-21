SWAPI Wrapper
=============

This module allows the accessing of the SWAPI API in one of two ways:

 - The module contains a scrape of the SWAPI API, and exposes `getFromLocalUrl`,
a method that takes a SWAPI URL and returns our local copy of the result.
 - The module exposes `getFromRemoteUrl`, which will hit SWAPI to get the data.
This will use `fetch` when run locally, and will use `Parse.Cloud.httpRequest`
when run in cloud code.
