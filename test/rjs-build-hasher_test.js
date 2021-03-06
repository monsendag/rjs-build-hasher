'use strict';

var hasher = require('../lib/rjs-build-hasher.js');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['rjs-build-hasher'] = {
  setUp: function(done) {
    done();
  },
  'no build path': function(test) {
    test.throws(function() {
        hasher();
    }, Error, "Build path not found.");

    test.done();
  }
};
