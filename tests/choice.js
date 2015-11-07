'use strict';

require("babel-polyfill");

var gen = require('../index');
var assert = require('assert');

describe('choice', function () {

    it('Single input always returns that value', function () {
        var p = gen.exec(gen.choice(gen.str(4)));
        var n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('4', n[0]);
    });

    it('Multiple choice is split around 0.5', function () {
        var p = gen.choice(gen.str(1), gen.str(2));
        {
            var n = Array.from(gen.exec(p, null, function () {
                return 0.49;
            }));
            assert.strictEqual(1, n.length);
            assert.strictEqual('1', n[0]);
        }
        {
            var n = Array.from(gen.exec(p, null, function () {
                return 0.51;
            }));
            assert.strictEqual(1, n.length);
            assert.strictEqual('2', n[0]);
        }
    });

    it('Many choices have equal probability', function () {
        var p = gen.choice(gen.str(0), gen.str(1), gen.str(2), gen.str(3));

        for (var i = 0; i < 4; ++i) {
            var n = Array.from(gen.exec(p, null, function () {
                return i * 0.25;
            }));
            assert.strictEqual(1, n.length);
            assert.strictEqual('' + i, n[0]);
        }
    });
});
//# sourceMappingURL=choice.js.map
