/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

var stream = require('stream');

function streamString(str) {
  var didStream;
  var readStream = new stream.Readable();
  readStream._read = function() {
    this.push(didStream ? null : str);
    didStream = true;
  }
  return readStream;
}

function endsWith(str, needle) {
  return str.slice(-needle.length) === needle;
}

module.exports = function(bundle, options) {
  bundle._options.insertGlobalVars = {
    process: function(file) {
      if (!endsWith(file, 'process/browser.js')) {
        return 'require("process")';
      }
    },
    setImmediate: function() {
      return 'process.nextTick';
    },
    setTimeout: function() {
      return 'process.nextTick';
    }
  };

  return bundle
    .external('buffer')
    .external('crypto')
    .external('events')
    .external('express')
    .external('stream')
    .external('moment')
    .external('querystring')
    .external('parse-express-https-redirect')
    .external('parse-express-cookie-session')
    .require(
      streamString(
        'process.env = {}; process.version = "v0.10.0"; module.exports = process'
      ),
      { file: 'process', expose: 'process' })
    .require(
      streamString('module.exports = { Parse: Parse };'),
      { file: 'parse', expose: 'parse' });
};
