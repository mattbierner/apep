'use strict';

require("babel-polyfill");

var gen = require('../index');
var assert = require('assert');

describe('declare', function () {

    it('Forward reference resolve late', function () {
        var ms = gen.declare(function () {
            return m;
        });
        var m = gen.str('abc');

        var p = gen.run(ms);
        var n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('abc', n[0]);
    });

    it('Self reference resolve to self', function () {
        var manyAs = gen.declare(function (self) {
            return gen.seq(gen.lit('abc'), self);
        });

        var p = gen.run(manyAs);
        assert.strictEqual('abc', p.next().value);
        assert.strictEqual('abc', p.next().value);
    });
});
//# sourceMappingURL=declare.js.map
