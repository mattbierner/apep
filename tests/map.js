"use strict";
const pep = require('../index');
const assert = require('assert');

describe('map', () => {

    it('Should output same value with identity function', () => {
        const p = pep.begin(
            pep.map(pep.str(4), (x) =>  x));
        const n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('4', n[0]);
    });


    it('Should map over every element in a sequence', () => {
        const p = pep.begin(
            pep.map(pep.seq(pep.lit(1), pep.lit(2), pep.lit(3)),
            (x) => x * x));
        const n = Array.from(p);
        assert.deepEqual([1, 4, 9], n);
    });
    
    it('Should map over every element in a sequence without leaking', () => {
        const p = pep.begin(
            pep.seq(
                pep.lit(5),
                pep.map(
                    pep.seq(pep.lit(1), pep.lit(2), pep.lit(3)),
                    (x) => x * x),
                pep.lit(4)));
        const n = Array.from(p);
        assert.deepEqual([5, 1, 4, 9, 4], n);
    });
});