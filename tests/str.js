'use strict';

require("babel-polyfill");
var gen = require('../index');
var assert = require('assert');

describe('str', function () {

    it('Should output empty string with no parameters', function () {
        var p = gen.exec(gen.str());
        var n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('', n[0]);
    });

    it('Should convert input to string', function () {
        var p = gen.exec(gen.str(5));
        var n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('5', n[0]);
    });

    it('Should convert custom object to string', function () {
        var o = { toString: function toString() {
                return 'abc';
            } };

        var p = gen.run(gen.str(o));
        assert.strictEqual('abc', p);
    });
});
//# sourceMappingURL=str.js.map
