'use strict';

require("babel-polyfill");
var gen = require('../index');
var assert = require('assert');

describe('map', function () {

    it('Should output same value with identity function', function () {
        var p = gen.exec(gen.map(gen.str(4), function (x) {
            return x;
        }));
        var n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('4', n[0]);
    });
});
//# sourceMappingURL=map.js.map
