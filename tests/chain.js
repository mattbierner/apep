"use strict";
const pep = require('../index');
const assert = require('assert');

describe('chain', () => {
    it('Should pass single result value to function', () => {
        const p = pep.chain(pep.lit(4), x => pep.str(x * 2));
        assert.strictEqual('8', pep.run(p));
    });
    
    it('Should wrap non generators', () => {
        const p = pep.chain('abc', x => pep.str(x + x));
        assert.deepStrictEqual(['abcabc'], Array.from(p.begin()));
    });
    
    it('Should allow returning sequence values', () => {
        const p = pep.chain(pep.lit(2), x => pep.seq(x * 2, x * 4));
        assert.strictEqual('48', pep.run(p));
    });
    
    it('Should chain over each element in sequence', () => {
        const p = pep.chain(
            pep.seq(pep.lit(1), pep.lit(2), pep.lit(3)),
            x => pep.seq(pep.lit(x), pep.lit(x)));
            
        const n = Array.from(p);
        assert.deepStrictEqual([1, 1, 2, 2, 3, 3], n);
    });
    
    it('nested chains', () => {
        const p = pep.chain(
            pep.seq(pep.lit(1), pep.lit(2)),
            x =>
                pep.seq(pep.lit(x), pep.lit(x))
                    .chain(x => pep.seq(pep.lit(x), pep.lit(x * 10), pep.lit(x * 100))));
        
        const n = Array.from(pep.begin(p));
        assert.deepStrictEqual([1, 10, 100, 1, 10, 100, 2, 20, 200, 2, 20, 200], n);
    });
});
