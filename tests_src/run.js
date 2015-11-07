require("babel-polyfill");

var gen = require('../index');
var assert = require('assert');

describe('run', function () {
    it('Should combine result to string. ', function () {
        var p = gen.run(gen.seq(gen.str(4), gen.str('abc'), gen.str('3')));
        assert.strictEqual('4abc3', p);
    });
});

