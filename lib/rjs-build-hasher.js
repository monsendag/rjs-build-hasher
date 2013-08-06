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

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports = function (output, options) {

  options = options || {};


  _.defaults(options, {
    buildPath: 'js/build',
    format: '{base}.{hash}{ext}',
    rename: true,
    copy: false, // overrides rename
    removeOld: true,
    hashSize: 8
  });

  if (!fs.existsSync(options.buildPath)) {
    throw new Error('Build path not found.');
  }

  if (!output || output.length <= 0) {
    return;
  }

  // parse the output text from require.js
  var product = parser.parse(output);

  var bundles = {};

  // iterate over each generated bundle
  product.bundles.forEach(function (bundleArr) {
    // filename
    var fileName = bundleArr.parent;
    // extension
    var ext = path.extname(fileName);
    // basename
    var baseName = path.basename(fileName, ext);

    // store some data in object
    var b = bundles[baseName] = {
      fileName: fileName,
      baseName: baseName,
      ext: ext,
      filePath: path.join(options.buildPath, fileName)
    };

    // calculate hash of file
    var shasum = crypto.createHash('sha1');
    shasum.update(fs.readFileSync(b.filePath, 'UTF-8'));
    b.hash = shasum.digest('hex').substring(0, options.hashSize);

    // get new name from format
    b.newName = format(options.format, b.baseName, b.ext, b.hash);
    b.newPath = path.join(options.buildPath, b.newName);

    // allow defining a documentRoot to get link paths relative to it
    if('documentRoot' in options) {
      b.newPublicPath = path.relative(options.documentRoot, b.newPath);
      b.publicPath = path.relative(options.documentRoot, b.filePath);
    }

    // make sure we haven't generated the file before
    if(fs.existsSync(b.newPath)) {
      return;
    }

    if(options.removeOld) {
      // look for old generated files delete them

      // create regular expression to match old files
      var hashRegex = '[0-9a-f]{' + options.hashSize + '}';
      var regex = escapeRegExp(format(options.format, b.baseName, b.ext, hashRegex));
      regex = new RegExp(regex, "g");

      // find all files in build path that matches regex
      var files = fs.readdirSync(options.buildPath);
      var filtered = files.filter(function (fileName) {
        return regex.test(fileName);
      });

      // remove them
      filtered.forEach(fs.unlink);
    }

    // copy file
    if(options.copy) {
      fs.createReadStream(b.filePath).pipe(fs.createWriteStream(b.newPath));
    }

    // rename file
    if(!options.copy && options.rename) {
      fs.renameSync(b.filePath, b.newPath);
    }

  });

  return bundles;
};
