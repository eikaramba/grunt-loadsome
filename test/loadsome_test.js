'use strict';

var grunt = require('grunt');

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

exports.loadsome = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },
  simple_replace: function (test) {
    var actual = grunt.file.read('test/output/testing.html');
    var expected = grunt.file.read('test/expected/testing.html');
    test.equal(actual, expected, 'simple script tags should be downloaded and replaced with the correct references.');

    var actual = grunt.file.read('test/output/testing2.html');
    var expected = grunt.file.read('test/expected/testing2.html');
    test.equal(actual, expected, 'simple script tags should be downloaded and replaced with the correct references.');

    test.done();
  }
};
