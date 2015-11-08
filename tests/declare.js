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

});