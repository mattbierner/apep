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

        var p = gen.exec(ms);
        var n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('abc', n[0]);
    });

    it('Self reference resolve to self', function () {
        var manyAs = gen.declare(function (self) {
            return gen.seq(gen.lit(1), gen.map(self, function (x) {
                return x + 1;
            }));
        });

        var p = gen.exec(manyAs);
        assert.strictEqual(1, p.next().value);
        assert.strictEqual(2, p.next().value);
    });
});
//# sourceMappingURL=declare.js.map
