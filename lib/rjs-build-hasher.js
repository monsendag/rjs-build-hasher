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
var parser = require('pegjs').buildParser(
  require('fs').readFileSync(__dirname+'/../rjs.peg', 'utf8')
);

function getAST(textOrAST) {
  var tree = textOrAST;

  if (_.isString(textOrAST)) {
    tree = exports.parse(textOrAST);
  }
  return tree;
}

module.exports = function(output, options) {

	_.defaults(options, {
		buildPath: null,
		removeOld: true
	});

	if(!fs.existsSync(options.buildPath)) {
		console.error('rjs-build-hasher: Build path is not defined.');
	}

    // parse the output text from require.js
    var product = parser.parse(output);

    // iterate over each generated bundle
    product.bundles.forEach(function(bundle) {
      var fileName = bundle.parent;
      var ext = path.extname(fileName);
      var baseName = path.basename(ext);

      var filePath = path.join(options.buildPath, fileName);

      // calculate hash of bundled file
      var shasum = crypto.createHash('sha1');
      shasum.update(fs.readFileSync(filePath, 'UTF-8'));
      var hash = shasum.digest('hex').substring(0,8);

      var newName = baseName+'.'+hash+ext;
      var newPath = path.join(options.buildPath, newName);

      // make sure we haven't generated the file before
      if(!fs.existsSync(newPath)) {
        // look for old generated files matching regex and delete them
        var regex = new RegExp(bundle.name+'\\.[0-9a-f]{8}\\.js',"g");
        var files = fs.readdirSync(options.buildPath);
        files.filter(function (fileName) {
          return regex.test(fileName);
        }).foreach(fs.unlink);

        // append new hash to generated file
        fs.rename(filePath, newPath);
      }
    });
};

exports.parse = parser.parse;

exports.bundles = function(tree) {
  return _.map(getAST(tree).bundles, function(bundle) {
    return bundle.parent;
  });
};
