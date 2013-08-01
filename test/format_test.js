'use strict';

var format = require('../lib/format.js');

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

exports['format'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'format': function(test) {
    // tests here
    test.equal(format("{base}.{hash}.{ext}", 'format','js', 'abcde'), 'format.abcde.js', 'all params exist');
    test.done();
  }

};
