"use strict";
const pep = require('../index');
const assert = require('assert');

describe('combine', () => {
    it('should return initial value when empty', () => {
        const p = pep.combine((p, c) => [p, c], 'x', pep.empty);
        const n = Array.from(p.begin());
        assert.deepStrictEqual(['x'], n);
    });
    
    it('should fold once over single value', () => {
        const p = pep.combine((p, c) => [p, c], 'x', pep.str('a'));
        const n = Array.from(p.begin());
        assert.deepStrictEqual([['x', 'a']], n);
    });
    
    it('should fold left to right', () => {
        const p = pep.combine((p, c) => [p, c], 'x', pep.seq('a', pep.seq('b', 'c'), 'd'));
        const n = Array.from(p);
        assert.deepStrictEqual([[[[['x', 'a'], 'b'], 'c'], 'd']], n);
    });
    
     it('should wrap generators', () => {
        const p = pep.combine((p, c) => [p, c], 'x', 'a', 'b', 'c', 'd');
        const n = Array.from(p);
        assert.deepStrictEqual([[[[['x', 'a'], 'b'], 'c'], 'd']], n);
    });
});
