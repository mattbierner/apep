'use strict';

require("babel-polyfill");
var gen = require('../index');
var assert = require('assert');

describe('lit', function () {

    it('should yield input value', function () {
        var p = gen.exec(gen.lit(5));
        var n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual(5, n[0]);
    });
});
//# sourceMappingURL=lit.js.map
