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
const fs = require('fs')
const exec = require('child_process').exec
const { sep } = require('path')

fs.mkdir('lib', function (err) {
  if (err === null || err.code === 'EEXIST') {
    fs.mkdir('lib/public', function (err) {
      if (err === null || err.code === 'EEXIST') {
        fs.stat('./lib/public', err => {
          if (err !== null && err.code === 'ENOENT') {
            console.error(err)
          }
          fs.copyFile('src/public/favicon.ico', 'lib/public/favicon.ico', function (error) {
            if (error) { console.error(error) }
          })
          fs.copyFile('src/public/index.html', 'lib/public/index.html', function (error) {
            if (error) { console.error(error) }
          })
          const browserifyAccessParts = ['node_modules', '.bin', 'browserify']
          const binaryPath = browserifyAccessParts.join(sep)
          exec(`${binaryPath} -t babelify --outfile lib/public/swapi.js src/public/swapi.js`,
            error => {
              if (error) {
                console.warn(error.toString());
              } else {
                exec(`${binaryPath} --standalone Schema -t babelify --outfile lib/public/schema.js src/public/schema-proxy.js`,
                  error => {
                    if (error) {
                      console.warn(error.toString());
                    } else {
                      console.log('Succesfully built!');
                    }
                  }
                );
              }
            }
          );
        })
      }
    })
  } else {
    console.error(err)
  }
})
