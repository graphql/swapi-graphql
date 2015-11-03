/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

require('babel/register')({
  optional: ['runtime', 'es7.asyncFunctions']
});

var swapiSchema = require('../src/schema');
var printSchema = require('graphql/utilities').printSchema;

try {
  var output = printSchema(swapiSchema);
  console.log(output);
} catch (error) {
  console.error(error);
  console.error(error.stack);
};
