"use strict";
const pep = require('../index');
const assert = require('assert');

describe('join', () => {
    it('should return empty stringwhen empty', () => {
        const p = pep.join(pep.empty);
        const n = Array.from(p.begin());
        assert.deepStrictEqual([''], n);
    });
    
    it('should convert single value to string', () => {
        const p = pep.join(pep.lit(5));
        const n = Array.from(p.begin());
        assert.deepStrictEqual(['5'], n);
    });
    
    it('should combine left to right', () => {
        const p = pep.join(pep.seq('a', pep.seq('b', 'c'), 'd'));
        const n = Array.from(p.begin());
        assert.deepStrictEqual(['abcd'], n);
    });
});
