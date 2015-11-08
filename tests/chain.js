"use strict";
const pep = require('../index');
const assert = require('assert');

describe('chain', () => {

    it('Should pass single result value to function', () => {
        const p = pep.run(
            pep.chain(pep.lit(4), x => pep.str(x * 2)));
        assert.strictEqual('8', p);
    });

    it('Should map over every element in a sequence', () => {
        const p = pep.exec(
            pep.map(pep.seq(pep.lit(1), pep.lit(2), pep.lit(3)),
            (x) => x * x));
        const n = Array.from(p);
        assert.deepEqual([1, 4, 9], n);
    });
    
    it('Should map over every element in a sequence without leaking', () => {
        const p = pep.exec(
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