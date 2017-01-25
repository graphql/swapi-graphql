#!/bin/bash

set -e

if [ ! -s src/api/cachedData/cache.js ]; then
  echo 'Downloading cache...'
  node src/api/cachedData/downloadCache.js > src/api/cachedData/cache.js
  echo 'Cached!'
fi
