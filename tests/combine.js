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
    
     it('Should preserve state properly.', function () {
        const p = pep.seq(
            pep.set('a', 3),
            pep.combine((p, c) => [p, c], 'x', 'a', pep.set('a', 4), 'b',  pep.set('a', 5)),
            pep.get('a'));
        assert.deepStrictEqual([[['x', 'a'], 'b'], 5], Array.from(p));
    });
});
