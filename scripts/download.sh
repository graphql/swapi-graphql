#!/bin/bash

if [ ! -f src/api/cachedData/cache.js ]; then echo 'Downloading cache...' && node src/api/cachedData/downloadCache.js > src/api/cachedData/cache.js && echo 'Cached!'; fi;
