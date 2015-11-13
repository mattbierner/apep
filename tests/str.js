"use strict";
const pep = require('../index');
const assert = require('assert');

describe('str', () => {
    it('Should convert input to string', () => {
        assert.deepStrictEqual(['5'], Array.from(pep.str(5)));
        assert.deepStrictEqual(['null'], Array.from(pep.str(null)));
        assert.deepStrictEqual(['false'], Array.from(pep.str(false)));
    });
    
    it('Should convert undefined to string', () => {
        assert.deepStrictEqual(['undefined'], Array.from(pep.str(undefined)));
        assert.deepStrictEqual(['undefined'], Array.from(pep.str()));
    });

    it('Should convert custom object to string', () => {
        const o = { toString: () => 'abc' }

        const p = pep.run(pep.str(o));
        assert.strictEqual('abc', p);
    });
});