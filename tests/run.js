"use strict";
var pep = require('../index');
var assert = require('assert');

describe('run', function () {
    it('Should combine result to string', function () {
        var p = pep.seq(pep.str(4), pep.str('abc'), pep.str('3'));
        assert.strictEqual('4abc3', pep.run(p));
    });
});

