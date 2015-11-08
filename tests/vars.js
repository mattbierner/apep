"use strict";
var pep = require('../index');
var assert = require('assert');

describe('Vars', function () {
    it('Should yield empty for undefined var.', function () {
        const p = pep.get('a');
        assert.strictEqual('', pep.run(p));
    });
    
    it('Should allow a custom default value to be used.', function () {
        const p = pep.get('a', 'NotFound');
        assert.strictEqual('NotFound', pep.run(p));
    });
    
    it('Should not yield anything for set.', function () {
        const p = pep.seq('a', pep.set('a', 3), 'b');
        assert.strictEqual('ab', pep.run(p));
    });
    
    it('Should allow lookups of vars.', function () {
        const p = pep.seq(
            pep.get('x', ''), 'a', pep.set('x', 3), 'b', pep.get('x'), 'c');
        assert.strictEqual('ab3c', pep.run(p));
    });
});

