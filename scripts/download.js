const exec = require('child_process').exec;
const fs = require('fs');

fs.stat('./src/api/cachedData/cache.js', err => {
  if (err !== null && err.code === 'ENOENT') {
    const cachePath = 'src/api/cachedData/cache.js';
    console.log('Downloading cache...');
    exec(`babel-node src/api/cachedData/downloadCache.js > ${cachePath}`, error => {
      if (error) {
        // delete any invalid cache file that may have been created
        fs.unlink(cachePath, () => { });
        console.warn(error.toString());
      } else {
        console.log('Cached!');
      }
    });
  }
});
