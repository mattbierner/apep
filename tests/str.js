"use strict";
const pep = require('../index');
const assert = require('assert');

describe('str', () => {

    it('Should output empty string with no parameters', () => {
        const p = pep.begin(pep.str());
        const n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('', n[0]);
    });

    it('Should convert input to string', () => {
        const p = pep.begin(pep.str(5));
        assert.deepEqual(['5'], Array.from(p));
    });

    it('Should convert custom object to string', () => {
        const o = { toString: () => 'abc' }

        const p = pep.run(pep.str(o));
        assert.strictEqual('abc', p);
    });

});