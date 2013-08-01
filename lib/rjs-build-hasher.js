/*
 * rjs-build-hasher
 * https://github.com/monsendag/rjs-build-hasher
 *
 * Copyright (c) 2013 Dag Einar Monsen
 * Licensed under the MIT license.
 */

'use strict';

var crypto = require('crypto');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var format = require('./format');

var parser = require('pegjs').buildParser(
  require('fs').readFileSync(__dirname + '/../rjs.peg', 'utf8')
);

function getAST(textOrAST) {
  var tree = textOrAST;
  if (_.isString(textOrAST)) {
    tree = exports.parse(textOrAST);
  }
  return tree;
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports = function (output, options) {

  options = options || {};

  _.defaults(options, {
    buildPath: '.',
    format: '{base}.{hash}.{ext}',
    removeOld: true,
    hashSize: 8
  });

  if (!fs.existsSync(options.buildPath)) {
    throw 'Build path not found.';
  }

  if (!output || output.length <= 0) {
    return;
  }

  // parse the output text from require.js
  var product = parser.parse(output);

  // iterate over each generated bundle
  product.bundles.forEach(function (bundle) {
    // filename
    var fileName = bundle.parent;
    // extension
    var ext = path.extname(fileName);
    // basename
    var baseName = path.basename(fileName, ext);
    // path to file
    var filePath = path.join(options.buildPath, fileName);

    // calculate hash of file
    var shasum = crypto.createHash('sha1');
    shasum.update(fs.readFileSync(filePath, 'UTF-8'));
    var hash = shasum.digest('hex').substring(0, options.hashSize);

    // get new name from format
    var newName = format(options.format, baseName, ext, hash);
    var newPath = path.join(options.buildPath, newName);

    // make sure we haven't generated the file before
    if(fs.existsSync(newPath)) {
      return;
    }

    if(options.removeOld) {
      // look for old generated files delete them

      // create regular expression to match old files
      var hashRegex = '[0-9a-f]{' + options.hashSize + '}';
      var regex = escapeRegExp(format(options.format, baseName, ext, hashRegex));
      regex = new RegExp(regex, "g");

      // find all files in build path that matches regex
      var files = fs.readdirSync(options.buildPath);
      var filtered = files.filter(function (fileName) {
        return regex.test(fileName);
      });

      // remove them
      filtered.foreach(fs.unlink);
    }

    // rename file
    fs.renameSync(filePath, newPath);
  });
};

exports.parse = parser.parse;

exports.bundles = function (tree) {
  return _.map(getAST(tree).bundles, function (bundle) {
    return bundle.parent;
  });
};
