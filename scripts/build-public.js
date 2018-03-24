/**
#!/bin/sh
#
# Copyright (c) 2015, Facebook, Inc.
# All rights reserved.
#
# This source code is licensed under the BSD-style license found in the
# LICENSE file in the root directory of this source tree. An additional grant
# of patent rights can be found in the PATENTS file in the same directory.
*/
import { existsSync, writeFileSync, mkdirSync } from 'fs';
import copyFileSync from 'fs-copy-file-sync';
const exec = require('child_process').exec;
const { sep } = require('path');

if (!existsSync('lib')) {
  mkdirSync(('lib'))
}
if (!existsSync('lib/public')) {
  mkdirSync(('lib/public'))
}
copyFileSync('src/public/favicon.ico', 'lib/public/favicon.ico');
copyFileSync('src/public/index.html', 'lib/public/index.html');
const browserifyAccessParts = ['node_modules', '.bin', 'browserify'];
const binaryPath = browserifyAccessParts.join(sep);
exec(
  `${binaryPath} -t babelify --outfile lib/public/swapi.js src/public/swapi.js`,
  error => {
    if (error) {
      console.warn(error.toString());
    } else {
      exec(
        `${binaryPath} --standalone Schema -t babelify --outfile lib/public/schema.js src/public/schema-proxy.js`,
        error => {
          if (error) {
            console.warn(error.toString());
          } else {
            console.log('Succesfully built!');
          }
        },
      );
    }
  },
);