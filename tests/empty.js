"use strict";
const pep = require('../index');
const assert = require('assert');

describe('empty', () => {

    it('should yield no values', () => {
        const p = pep.empty;
        const i = p.begin().next();
        assert.strictEqual(true, i.done);
        assert.strictEqual(undefined, i.value);
    });
    
    it('should be ignored in sequences', () => {
        const p = pep.seq('a', pep.empty, 'c');
        assert.deepEqual(['a', 'c'], Array.from(p.begin()));
    });
});