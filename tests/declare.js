"use strict";
const pep = require('../index');
const assert = require('assert');

describe('declare', () => {

    it('Forward reference resolve late', () => {
        const ms = pep.declare(() => m);
        const m = pep.str('abc');
    
        const p = pep.begin(ms);
        const n = Array.from(p);
        assert.strictEqual(1, n.length);
        assert.strictEqual('abc', n[0]);
    });

    it('Self reference resolve to self', () => {
        const manyAs = pep.declare((self) => 
            pep.seq(pep.lit(1), pep.map(self, (x) => x + 1)));
    
        const p = pep.begin(manyAs);
        assert.strictEqual(1, p.next().value);
        assert.strictEqual(2, p.next().value);
    });

    it('Local var', () => {
        const counter = pep.declare(() => {
            // declare some variables local to this block.
            let sum = 0;

            return pep.seq(
                pep.noop(pep.seq(pep.lit(1), pep.lit(2), pep.lit(3))
                    .map(x => {
                        // Update the state in an expression.
                        sum += x;
                        return x;
                    })),
                // and use the state sometime later.
                // Declare is used to make sure the current value of `i` is
                // always returned.
                pep.declare(() => pep.lit(sum)));
        });
        assert.strictEqual('6', counter.run());
    });
});