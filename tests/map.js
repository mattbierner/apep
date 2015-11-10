"use strict";
const pep = require('../index');
const assert = require('assert');

describe('map', () => {

    it('Should output same value with identity function', () => {
        const p = pep.str(4).map(x =>  x);
        assert.deepStrictEqual(['4'], Array.from(p.begin()));
    });
    
    it('Should wrap non generators', () => {
        const p = pep.map('abc', x => x + x);
        assert.deepStrictEqual(['abcabc'], Array.from(p.begin()));
    });

    it('Should map over every element in a sequence', () => {
        const p = pep.map(
            pep.seq(pep.lit(1), pep.lit(2), pep.lit(3)),
            (x) => x * x);
        assert.deepStrictEqual([1, 4, 9], Array.from(p.begin()));
    });
    
     it('Should not map over empty', () => {
        assert.strictEqual('', pep.empty.map(x => { throw {}; }).run());
        
        const p = pep.map(
            pep.seq(pep.lit(1), pep.empty, pep.lit(3)),
            (x) => x * x);
        assert.deepStrictEqual([1, 9], Array.from(p.begin()));
    });
    
    it('Should map over every element in a sequence without leaking', () => {
        const p = pep.seq(
            pep.lit(5),
            pep.map(
                pep.seq(pep.lit(1), pep.lit(2), pep.lit(3)),
                (x) => x * x),
            pep.lit(4));
        const n = Array.from(p.begin());
        assert.deepStrictEqual([5, 1, 4, 9, 4], n);
    });
});
