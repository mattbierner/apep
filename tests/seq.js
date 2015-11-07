'use strict';

require("babel-polyfill");

var gen = require('../index');
var assert = require('assert');

describe('seq', function () {

    it('Should output single value with one parameter', function () {
        var p = gen.run(gen.seq(gen.str(4)));
        var n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('4', n[0]);
    });

    it('Should yield all values with multiple parameters', function () {
        var p = gen.run(gen.seq(gen.str(1), gen.str(2), gen.str(3)));
        var n = Array.from(p);
        assert.deepEqual(['1', '2', '3'], n);
    });

    it('Should wrap no function parameters as strings', function () {
        var p = gen.run(gen.seq(1, "abc", false));
        var n = Array.from(p);
        assert.deepEqual(['1', 'abc', 'false'], n);
    });
});
//# sourceMappingURL=seq.js.map
