"use strict";
const gen = require('../index');
const assert = require('assert');

describe('declare', () => {

it('Forward reference resolve late', () => {
    const ms = gen.declare(() => m);
    const m = gen.str('abc');
    
    const p = gen.exec(ms);
    const n = Array.from(p);
    assert.strictEqual(1, n.length);
    assert.strictEqual('abc', n[0]);
});

it('Self reference resolve to self', () => {
    const manyAs = gen.declare((self) => 
        gen.seq(gen.lit(1), gen.map(self, (x) => x + 1)));
    
    const p = gen.exec(manyAs);
    assert.strictEqual(1, p.next().value);
    assert.strictEqual(2, p.next().value);
});



});